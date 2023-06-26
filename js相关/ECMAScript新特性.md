# ECMAScript新特性
### ES7(2016)
- Array.prototype.includes(): 返回 true/false:
```javascript
const a = [1, 2, 3];

a.includes(1); // true
```

- **: 指数(幂)运算符, 等价于 Math.pow(), 不同处在于可以接受 BigInt 作为操作数:
```javascript
console.info(3 ** 4); // 81
```

### ES8(2017)
- async/await;
- Object.values(obj): 返回数组, 给定对象的自有可枚举 values;
- Object.entries(obj): 返回数组, 给定对象的自有可枚举键值对:
```javascript
const obj = { foo: "bar", baz: 42 };

console.info(Object.entries(obj)); // [ ['foo', 'bar'], ['baz', 42] ]
```
- padStart(), padEnd();
- Object.getOwnPropertyDescriptors(obj): 返回给定对象的所有自有属性的描述符;
- SharedArrayBuffer: JS内置对象, 用于创建一个共享的内存缓冲区。 允许多个 Worker 线程同时访问该内存缓冲区;
- Atomics: 对象, 提供静态方法对 SharedArrayBuffer 和 ArrayBuffer 对象进行原子操作:
```javascript
const sharedBuffer = new SharedArrayBuffer(16); // 创建一个长度为 16 字节的共享内存缓冲区
const sharedArray = new Int32Array(sharedBuffer);

// 利用 Atomics 原子性的增加共享内存缓冲区中特定索引处的值
Atomics.add(sharedArray, 0, 10);

// 利用 Atomics 原子性的获取共享内存缓冲区中特定缩影出的值
const value = Atomics.load(sharedArray, 0);
console.info(value); // 10
```

### ES9(2018)
- 异步迭代: await 可以和 for...of 循环一起使用, 以串行的方式运行异步操作:
```javascript
const a = [Promise.resolve(0), new Promise(resolve => setTimeout(() => {resolve(1)}, 1000))];

async function process(array) {
  for await (let i of array) {
    console.info(i);
  }
}
```
- Promise.finally();
- Rest 属性:
```javascript
const value = [1, 2, 3];
console.info(Math.max(...value)); // 3
```

### ES10(2019)
- Array.flat();
- Array.flatMap();
- String.trimStart(), String.trimEnd();
- Symbol.prototype.description: 只读属性, 返回 Symbol 对象的可选描述的字符串;
- Object.fromEntries(): 将键值对列表转换成对象;

### ES11(2020)
- ?? : 空值合并运算符, 左侧操作数为 null 或 undefined 时, 返回其右侧操作数, 否则返回左侧操作数;
```javascript
0 ?? 1 // 0
false ?? 1 // false
'' ?? 1 // ''
null ?? 1 // 1
undefined ?? 1 // 1
```
- ?. : 可选链运算符, 引用为 null 或 undefined 时返回 undefined, 不会引起错误;
- Promise.allSettled(): 所有 Promise 都已敲定时执行 then;
- import(): 动态引入;
- BigInt: 新增进本数据类型;
- globalThis: 
```
浏览器: window
worker: self
node: global
```

### ES12(2021)
- replaceAll: 所有符合匹配规则的字符都被替换;
- Promise.any(): 其中一个成功, 返回第一个成功的值, 全部失败则返回包含失败原因的数组;
- WeakRef: 创建一个对对象的弱引用:
```javascript
let obj = { a: 'a' };
const weakRef = new WeakRef(obj);

// 访问弱引用对象指向的对象
console.info(weakRef.deref()); // { a: 'a' }

// 当对象没有其他强引用时, 被垃圾回收
obj = null;

// 再次访问弱引用指向的对象
console.info(weakRef.deref()); // undefined
```
- 逻辑(与、或、空)赋值运算符: &&=, ||=, ??=
```javascript
// x &&= y: 仅在 x 为真值时为其赋值
let a = 0;

a &&= 1;
console.info(a); // 0

// x ||= y 仅在 x 为假值时为其赋值
let a = 0;
let b = null;

a ||= 1;
b ||= 1;
console.info(a); // 1
console.info(b); // 1

// x ??= y: 仅在 x 为空值(null 或 undefined) 时为其赋值
let a = 0;
let b = null;

a ??= 1;
b ??= 1;
console.info(a); // 0
console.info(b); // 1
```
- 数字分隔符: 通过"_"下划线分割数字, 使其更具可读性:
```javascript
let a = 1_000_000;

a === 1000000; // true
```

### ES13(2022)
- 顶层 await: await 不要求必须写在 async 函数中;
- Array, String, TypedArray .at(): 返回索引对应的元素, 允许输入正数和负数, 负整数从最后一个元素开始倒数;

### ES14(2023)
- Array.toReversed(), toSpliced(), toSorted(): 返回新数组, 而不是直接修改原数组;
- Array.with(index, value): 返回新数组, 修改指定索引的值;
