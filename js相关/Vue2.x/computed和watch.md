# computed和watch
### computed 是状态同时也是依赖
- computed 是状态, 被组件所依赖;
- computed 同时也依赖于其他状态。
- initComputed() 时每个 computed 属性都会生成 new Watcher() 并将其缓存, new Watcher() 时传入 lazy: true;
- 通过 Object.defineProperty() getter 收集依赖;
- 组件渲染时会读取 computed 属性, 触发 getter;
- getter 中通过 computed key 读取缓存中对应的 watcher;
- 执行 watcher.evaluate() 使 computed 订阅它所依赖的状态;
- 执行 watcher.depend() 使所在组件订阅 computed;
- 通过 watcher.dirty 属性判断是否需要重新计算 computed 值。

### 1. computed 解析
- initState 中初始化 computed;
```javascript
function initState(vm) {
  ...
  if (opts.computed) initComputed(vm, opts.computed);
  ...
}
```
#### 1.1 initComputed() 做了什么
- 遍历 computed 对象, 对每个值都进行 new Watcher() 操作;
- new Watcher() 时传入 option: { lazy: true } 表示该 Watcher 是个 computed;
- new Watcher() 创建实例时会判断 lazy 属性, 如果为 true 则不会执行 this.get(), 即此时不会绑定 Dep.target;
<details>
<Summary>
  class Watcher {}
</Summary>
<br>

```javascript
class Watcher {
  constructor () {
    ...
    this.value = this.lazy ? undefined : this.get();
    ...
  }
}
```

</details>

- 执行 defineComputed();
```javascript
function initComputed (vm: Component, computed: Object) {
  const watchers = vm._computedWatchers = Object.create(null);

  for (const key in computed) {
    const userDef = computed[key];
    const getter = typeof userDef === 'function' ? userDef : userDef.get;
    ...
    watchers[key] = new Watcher(
      vm,
      getter || noop,
      noop,
      { lazy: true }
    );

    if (!(key in vm)) {
      defineComputed(vm, key, userDef)
    } else {
      throw warn ...
    }
  }
}
```
#### 1.2 defineComputed() 做了什么
- 配置 Object.defineProperty 的属性描述符 getter、setter;
- 使用 Object.defineProperty() 对 computed 属性进行变化侦测。
- 与对 object 属性变化侦测相同, 使用 Object.defineProperty() 对 computed 进行变化侦测;
- getter 中收集依赖, setter 中触发依赖。
```typescript
const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function defineComputed (
  target: any, 
  key: string, 
  userDef: Object | Function
) {
  ...
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = createComputedGetter(key);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? createComputedGetter(key)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  ...
  Object.defineProperty(target, key, sharedPropertyDefinition);
}
```
#### 1.3 createComputedGetter() 做了什么
- 返回 function computedGetter;
- computedGetter 返回 watcher.value;
- computedGetter 通过 this._computedWatchers[key] 获取 initComputed 时创建的 computedWatcher;
- 创建 watcher 时, this.dirty = this.lazy; 
- 通过 dirty 属性判断 computed 是否需要重新计算;
- 由于 computedWatcher.lazy = true, 可以执行 watcher.evaluate(); 
- evaluate 中执行 this.get() 触发一系列依赖收集操作并修改 this.dirty = false;
- 这样当 computed 中依赖的状态发生变化时, computedWatcher 执行 update(), 修改 this.dirty = true;
- 状态发生变化导致组件重新渲染, 从而读取 computed 属性, 触发 getter(即 computedGetter), 此时 dirty = true, 对 computed 值进行重新计算;
- 而 非computed 依赖的状态发生变化时, 由于此时 dirty = false, 所以不会触发 watcher.evaluate(), 即不会对 computed 进行重新计算;
- watcher.getter() 最后会执行 popTarget(), 所以此时如果还有 Dep.target, 那么该 target 就是 computed 所在组件;
- 通过 watcher.depend() 执行 dep.depend() 收集依赖, 即该组件订阅了 computed 属性。
```typescript
// src/core/instance/state.js
function createComputedGetter (key) {
  return function computedGetter () {
    const watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value;
    }
  }
}

// src/core/observer/watcher.js
class Watcher {
  constructor (
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: ?Object,
    isRenderWatcher?: boolean
  ) {
    ...
    this.dirty = this.lazy;
    ...
    this.value = this.lazy
      ? undefined
      : this.get();
    ...
  }

  get () {
    pushTarget(this);
    let value;
    const vm = this.vm;
    value = this.getter.call(vm, vm);
    ...
    popTarget();
    return value;
  }

  evaluate () {
    this.value = this.get();
    this.dirty = false;
  }

  depend () {
    let i = this.deps.length;
    while (i--) {
      this.deps[i].depend();
    }
  }

  update () {
    if (this.lazy) {
      this.dirty = true;
    } else {
      queueWatcher(this)
    }
  }
...
}
```
