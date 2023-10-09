# Hook
- 使 Function 组件可以使用 state 和其他 React 特性。
- 只能在函数最外层调用 Hook, 不能在循环、判断、其他嵌套函数中使用。

## React HOOKS
- useState
- useReducer
- useContext
- useRef
- useEffect
- useEffectEvent(实验性API)
- useLayoutEffect
- useInsertionEffect
- useSyncExternalStore
- useCallback
- useMemo
- useDeferredValue
- useTransition
- useDebugValue
- useId
- useImperativeHandle

### useState: 在组件中存储数据、触发重新渲染
```
const [state, setState] = useState(initialState);

setState(nextState);
```
- state: 组件中存储的数据, 随组件的生命周期进行读取和更新;
- setState: 状态更新函数, 更新 state 并触发组件重新渲染以反映状态的最新值;
- initialState: state 初始化的值, 可以为任意类型, 为函数时应为纯函数;
- nextState: 要 state 更新为的值, 可以为任意类型, 为函数时接收待定的 state 作为参数, 并且需要返回下一个状态。

#### State 需要保持数组、对象的不可变性(immutability)
- 不能直接修改保存在 state 中的对象、数组, 只能替换对象/数组;
- 可以借助第三方插件 Immer 的 [useImmer](https://github.com/immerjs/use-immer);
```
import { useImmer } from 'use-immer';
const [person, updatePerson] = useImmer({
  artwork: {
    title: 'Blue Nana',
  }
});

updatePerson(draft => {
  draft.artwork.title = e.target.value;
})
```

#### 状态的行为
- 设置状态并不改变已有的 state 变量, 但会触发重新渲染;
- state 像是每次渲染的快照, 且不会同步更新;
- "正在渲染"意味着 React 正调用你的组件函数, 该函数返回 JSX,   
  它的内部变量、props、事件处理函数等都是根据当前渲染时的 state 计算出来的;
- state 变量的值永远不会在一次渲染的内部发生变化, 即使事件处理的代码是异步的;
- 变量和事件处理函数不会在重新渲染中存活, 每个渲染都有自己的事件处理函数;
```
/*
* btn 点击事件处理函数通知 React 做出以下事情:
* setNumber(number + 1): number = 0, setNumber(0 + 1); // React 下次渲染时将 numer 更改为 1
* setNumber(number + 1): number = 0, setNumber(0 + 1); // React 下次渲染时将 numer 更改为 1
* setNumber(number + 1): number = 0, setNumber(0 + 1); // React 下次渲染时将 numer 更改为 1
*/

const [number, setNumber] = useState(0);

<button onClick={() => {
  setNumber(number + 1);
  setNumber(number + 1);
  setNumber(number + 1);
}}>+3</button>

<button onClick={() => {
  setNumber(number + 5);
  alert(number); // number: 0
  setTimeout(() => {
    alert(number); // number 还是 0
  }, 3000);
}}>+5</button>
```

- 在下次渲染前多次更新同一个 state;
- 当 setState 传递一个函数时, React 将此函数加入队列,  
  下次渲染期间 React 会遍历队列并提供更新之后的最终 state;
- setState(x) 实际上会像 setState(n => x) 一样运行, 只是没有使用 n。
```
const [number, setNumber] = useState(0);

<button onClick={() => {
  setNumber(number + 1); // 返回值: 1
  setNumber(n => n + 1); // 返回值: 2
  setNumber(n => n + 1); // 返回值: 3
}}>+3</button>
```
- [模拟状态队列](https://zh-hans.react.dev/learn/queueing-a-series-of-state-updates):
```
function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // 调用更新函数
      finalState = update(finalState);
    } else {
      // 替换下一个 state
      finalState = update;
    }
  }

  return finalState;
}
```

#### 从状态改变到 UI 展示
- Trigger(触发);
- Render(渲染): 构建虚拟DOM;
- Commit(提交): 虚拟DOM 差异计算, 更新真实 DOM;

### useReducer: 将多个状态的更新逻辑提取, 集中
- 对需要更新多个状态的组件, 将状态更新逻辑提取到 reducer 中, 避免事件处理程序分散。
```
function reducer(state, action) {
  if (action.type === 'SOME_TYPE') 
    ...
}

const [state, dispatch] = useReducer(reducer, initialArg, init?)

dispatch({ type: 'SOME_TYPE' });
```
- reducer: 纯函数, 用于更新 state。参数为 state 和 action, 返回值为更新后的 state, state 和 action 可以为任意值;
- initialArg: 任意值, 用于初始化 state;
- init: 可选参数, 函数, 用于计算初始值。如果存在, 使用 init(initialArg) 的执行结果作为初始值, 否则使用 initialArg。
- dispatch: useReducer 的返回值, 函数, 用于更新 state 并触发组件重新渲染。

#### state 中要保持数组、对象的不可变性
- 不要直接修改对象或数组;
- 或者使用 useImmer 的 useImmerReducer;
```
/*
* 返回新的对象/数组替换
*/
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        ...state,
        age: state.age + 1
      };
    }
}
const [state, dispatch] = useReducer(reducer, initialState);

/*
* 使用 useImmerReducer 直接修改对象/数组
*/
function tasksReducer(draft, action) {
  switch (action.type) {
    case 'added': {
      draft.push({
        id: action.id,
        text: action.text,
      });
      break;
    }
  }
}
const [tasks, dispatch] = useImmerReducer(
  tasksReducer,
  initialTasks
);
```

### useContext: 深层次传递数据
- 读取和订阅组件中的 context。
```
const value = useContext(SomeContext);
```
- SomeContext: 使用 createContext 创建的 context; 
- value: 离调用组件最近的 SomeContext.Provider 的 value。

### useRef: 存储的信息发生改变, 不会触发新的渲染
```
const ref = useRef(initialValue)
```
- 通过 ref.current 访问 ref 的当前值;
- 不要在渲染期间读取和写入 ref.current, 可以在 事件处理 或 effects 中读写;
- 使用 ref 存储 timeoutID、DOM元素和其他不影响组件渲染输出的对象;
- 和 state 一样, React 在每次重新渲染之间保留 ref;
- 和 state 不同, ref.current 值的改变是同步的。

#### ref 操作 DOM
- 获取指定 DOM 节点:
```
const myRef = useRef(null);

<input ref={myRef} >
```
- 访问其他组件的 DOM 节点:
```
const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} >;
})

function Form() {
  const inputRef = useRef(null);
  
  return (
    <MyInput ref={inputRef}>
  )
}
```

### useEffect: 将组件与外部系统同步
```
useEffect(setup, dependencies?);
```
- setup: 处理 Effect 的函数, [可选]返回一个清理(cleanup)函数,  
    依赖项改变导致重新渲染时, React 首先使用旧值运行 cleanup 函数, 然后使用新值运行 setup 函数;  
    组件从 DOM 中移除后, React 将最后一次运行 cleanup 函数;  
    setup 返回普通函数(cleanup), 不能返回 Promise, 也不能为 async(返回 Promise);
- dependencies: 可选, 依赖项数组, setup 中引用的 响应式值 的列表。

#### 响应式值
- 组件内的所有值都是响应式的, 任何响应式的值都可以在重新渲染时发生变化, 所以需要将响应式的值包括在 Effect 依赖项中:
- props;
- state;
- 组件内部声明的变量、函数。

#### React 组件中的两种逻辑类型
- 渲染逻辑代码: 接收 props 和 state, 并对它们进行转换, 最终返回 JSX;  
    渲染的代码必须是纯粹的, 只应该“计算”结果。
- 事件处理程序: 嵌套在组件内部的函数, 可能更新输入字段、提交 HTTP POST 等;  
    包含由特定的用户操作引起的“副作用”(改变了程序的 state)。

#### Effects
- Effect 在 React Commit 阶段的最后执行, 确保能够访问到最新的 DOM 结构。
- Effect 允许你指定由渲染本身引起的副作用(而不是由特定事件引起的副作用)。
- 由 state 变化引起的 Effect, 浏览器先绘制并更新屏幕然后执行 Effect, 如果 Effect 也立即更新这个 state, 则重新执行整个流程; 
- 由交互引起的 Effect, 浏览器也可能在处理 Effect 内部状态前重新绘制屏幕。
- 生命周期: 和组件的挂载、更新、卸载不同, Effect 只做开始同步和停止同步;  
    每个 Effect 代表一个独立的同步过程, 两个 Effect 之间的逻辑互不干涉。

#### 开发环境下 Effect 运行两次 / Effect 造成的条件竞争(两个异步操作彼此竞争)
- 组件连续渲染两次时, 
- useEffect 中定义变量 ignore;
- 第一次渲染, 执行 Effect;
- 执行第一次 Effect 的 cleanup 将其 ignore 设置为 true, 这样第一次 Effect 异步操作完成后的返回值就无法影响到程序的 State;
- 第二次渲染, 执行 Effect 获取数据并改变程序 State:
```
useEffect(() => {
  let ignore = false;

  const data = await fetchTodos();

  if (!ignore) {
    setTodos(data);
  }

  return () => {
    ignore = true;
  }
})
```

### useEffectEvent(实验性 API): 提取 Effect 中的非响应式逻辑, 能够读取最新的 props 和 state
- 从 Effect 中提取非响应式逻辑;
- 当你只想读取某个响应式的值, 而不是对其变化做出反应时使用 useEffectEvent;
- EffectEvent 只能在 Effect 内部使用, 不能传递给其他组件或 Hook。
```
/*
* 点击 “+” 增加 increment, 
* 如果 useEffect 中依赖 increment, 就会导致点击 “+” 时计时器停止计时
* 但是因为没有改变定时器的相关逻辑, 不需要重新设置定时器。
* 此时需要使用 useEffectEvent 提取非响应式逻辑, 其能读取最新的 props 和 state
*/
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  const onTick = useEffectEvent(() => { // 可接受传参
    setCount(c => c + increment);
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick();
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, []); // 如果依赖 increment, 连续点击增加 increment 会导致计时器停止
}
```

### useLayoutEffect: 阻止浏览器在 Effect 前重新绘制屏幕
```
useLayoutEffect(setup, dependencies?)
```
- 在浏览器重新绘制屏幕前计算布局;
- useLayoutEffect 中的代码和状态更新都会在历览器重新绘制屏幕前处理;
- 阻塞浏览器重新绘制;
- 可能会影响性能。

### useSyncExternalStore: 订阅非响应式数据的变化, 数据变化组件 rerender
- React 外部的数据(全局变量、其他 Store)为非响应式数据, useEffect 无法监听其变化, 需要使用 useSyncExternalStore。
```
useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)
```
- useSyncExternalStore: 返回外部 store 中数据当前的快照, 可用于程序逻辑渲染;
- subscribe: 函数, 订阅外部 store 并返回一个取消订阅的函数; 接收一个 callback, store 变化时调用 callback 会导致组件重新渲染;
- getSnapshot: 函数, 从外部 store 读取数据的快照;
- getServerSnapshot: 可选项, 函数, 仅在服务端渲染以及 hydration 时用到, 返回外部 store 中数据的初始快照。

#### 例: 订阅外部 count 的变化
```
function ExternalCountStore() {
  let listeners = [];
  let count = 0;

  this.addCount = function () {
    count++;
    this.emitChange();
  };

  this.subscribe = function (listener) {
    listeners = [...listeners, listener];

    return () => {
      listeners = listeners.filter(l => l !== listener);
    }
  };

  this.getSnapshot = function () {
    return count;
  };

  this.emitChange = function () {
    for (let listener of listeners) {
      listener();
    }
  }
}

const externalCountStore = new ExternalCountStore();

export default function ExternalVariables() {
  const externalCount = useSyncExternalStore(
    externalCountStore.subscribe, 
    externalCountStore.getSnapshot
  );

  return (
    <>
      <p>{externalCount}</p>
      <button onClick={() => externalCountStore.addCount()}>
        外部变量 externalCount++
      </button>
    </>
  );
}
```

#### 例: 订阅网络连接
```
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  }
}

fuction getSnapshot() {
  return navigator.onLine;
}

export default function useOnlineStatus() {
  const isOnLine = useSyncExternalStore(subscribe, getSnapshot);

  return isOnLine;
}
```
