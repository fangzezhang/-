# Async和Generator
async/await 基于协程的概念:
- 协程可以通过程序控制来暂停执行协程并跳出, 和返回协程继续执行。
- ES6 是通过 Generator 实现协程概念：
- 通过 function* 的形式创建 Generator 函数;
- 执行函数创建协程;
- 通过 .next() 执行协程;
- 遇到 yield 跳出, 回到主协程;
- 通过 .next() 返回暂停位置, 协程继续执行;
- 通过 yield 和 .next() 完成父子协程之间的通信。

## 前置知识
### 协程(Coroutine)
- 线程可以拥有多个协程，一个线程同时只能执行一个协程。
- 协程由程序所控制, 即可以由开发者控制。
### 父协程
- 从 A 协程启动 B 协程，我们就把 A 称为 B 的父协程。
### ES6 对协程的实现: Generator
- 一个生成器函数: function * gen() {};
- 执行 let a = gen() 创建协程 a;
- a.next() 执行协程;
- 遇到 yield 关键字暂停协程, 并返回信息给父协程;
- 遇到 return 则结束协程, 并将 return 信息返回给父协程。

### async 函数
- 一定返回一个 promise 对象作为结果, 如果不是则使用 Promise 隐式包裹返回值;
- async 函数体被0个或多个 await 分隔开, 从第一行直到(并包括)第一个 await 表达式都是同步运行;
- 如果没有 await 表达式, async 函数同步运行, 否则 async 函数一定异步执行。
```typescript
async function test() {}
async function test1() {return 1}
async function test2() {return Promise.resolve(2)}

test(); // Promise {<fulfilled>: undefined};
test1(); // Promise {<fulfilled>: 1};
test2(); // Promise {<fulfilled>: 2};
```
### await 表达式的作用
- 父协程调用 async 函数 foo, foo 代码同步执行直到遇到 await;
- await 默认创建一个 Promise 对象 _promise, 并暂停协程的执行, 将 _promise 返回给父协程;
- 父协程监听 _promise.then, 并继续执行;
- 父协程同步代码执行完毕, 检查微任务队列, 执行 _promise.then() 中的回调;
- 回调函数将函数控制权交给 foo 协程, 并将值传给 foo 协程;
- foo 协程继续执行后面的代码, 结束之后将控制权归还父协程。

## Generator + Promise 实现 async/await
- 实现和 async/wait 类似的执行 generator 函数;
- 实现接收 yield 返回值(通过 .next(res) 传值到子协程);
- 实现执行函数返回 Promise 对象的功能。
```javascript
function genToAsync(genFn) {
  const gen = genFn();
  const _next = function(val = undefined) {
    const info = gen.next(val);
    if (info.done) {
      return Promise.resolve(info.value);
    } else {
      return Promise.resolve(info.value)
        .then(res => {
          return _next(res);
        });
    }
  };

  return _next();
}

// 异步任务
function task() {
  return new Promise(resolve => {
    setTimeout(function () {
      resolve('task');
    }, 1000);
  })
}

// 项目代码
function* gen() { 
  console.info(1);
  const res = yield task();
  console.info(res);
}
genToAsync(gen)
  .then(res => {
    console.info(res);
  });
```
