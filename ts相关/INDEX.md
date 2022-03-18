# INDEX
创建时间：2022-03-16  

[typescript-tutorial](https://www.typescripttutorial.net/typescript-tutorial/typescript-tuple/)

### any vs unkown 
- 推荐使用 unkown;
- unkown: 可分配任意内容, 必须进行类型检查或类型断言才能操作 unkown。
- any: 可分配任意内容, 无需类型检查, 可执行任意操作。
```typescript
function test(cb: unknown) {
  if (typeof cb === 'function') {  // 必须进行类型检查才能操作 unkown
    cb();
  }
}
```
### interface vs type
- 基本相同
- 不同点:
    > - type 除了描述对象, 还能描述其他类型;     
    > - type 不能通过 extends 扩展;
    > - type 命名不能重复; interface 相同命名, 不同的 key 会进行合并。

### extends vs & (Intersection Types)
- 基本相同
- 不同点:
    > - extends 的 instance 成员之间不能有相同的 key;
    > - & 可以, 相同 key 会合并成一个新的描述: A & B。

### 条件类型
- extends 类似于三目运算符:
```typescript
type Test<T> = T extends any[] ? T[number] : T;
```
- extends 和 Union Types:
    > T = A | B | C;  
      T extends U ? X : Y 等同于  
      (A extends U ? X : Y) | (B extends U ? X : Y) | (C extends U ? X :Y)。
- extends 作为条件约束:
    > 使用 extends 将类型参数限制为特定类型;
    > 使用 extends keyof 约束为对象属性的类型。
- infer: 变量类型推断:
```typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;
type Foo<T> = T extends { a: infer U; b: infer U } ? U : never;
type T10 = Foo<{ a: string; b: string }>; // string
type T11 = Foo<{ a: string; b: number }>; // string | number

// 作为函数参数或者说处于逆变位置(contra-variant positions)时, infer 的表现和上述不一致。
type Bar<T> = T extends { a: (x: infer U) => void; b: (x: infer U) => void }
  ? U
  : never;
type T20 = Bar<{ a: (x: string) => void; b: (x: string) => void }>; // string
type T21 = Bar<{ a: (x: string) => void; b: (x: number) => void }>; // string & number
```

### 逆变和协变
#### 变型(variance) 描述了类型和子类型之间的关系
- 协变(covariant): 子类型 ≦ 基类型
- 逆变(contravariant): 逆转了子类型序关系
```typescript
通过数组类型构造器: Animal, 得到 Animal[];  
协变: 一个 Cat[] 也是一个 Animal[];  
逆变: 一个 Animal[] 也是一个 Cat[];
```
#### 逆变和 TypeScript 的关系
- TS 中方法的参数类型是双向协变, 即: 既是协变又是逆变, 不安全。
- 解决方法: TypeScript@2.6 通过 --strictFunctionTypes 或 --strict 修复。
```typescript
// strictFunctionTypes: false, 不安全:
function fn(x: string) {
  console.log("Hello, " + x.toLowerCase());
}
 
type StringOrNumberFunc = (ns: string | number) => void;
 
let func: StringOrNumberFunc = fn;  // unsafe
func(10); // unsafe call

// strictFunctionTypes: true
function fn(x: string) {
  console.log("Hello, " + x.toLowerCase());
}
 
type StringOrNumberFunc = (ns: string | number) => void;

let func: StringOrNumberFunc = fn;  // Error
```

### 类型保护
- 用于缩小类型的范围。
```typescript
typeof
instanceof
if...else
in
```

### 类型转换, 类型断言
- JS 变量是动态类型, 不需要类型转换;
- TS 中每个变量都有一个类型, 类型转换允许将变量从一个类型转换为另一个类型。
- 类型转换和类型断言都使用 as 关键字。

### 数组
- Array\<string>;
- string[];
- Array<number|string>;
- (number|string)[];
- readonly string[];

### 元组
- 和数组类似, 但元组中元素数量固定且类型不必相同;
- 元组中值的顺序很重要, 不同类型元素位置互换会导致报错;
- 使用问号(?)指定可选元素: [number, number?]。

### interface
- 定义函数
```typescript
interface StringFormat {
  (str: string): string
}
```
- 泛型
```typescript
interface A<T> {
  a: T
}
```
- 扩展(extends): key 相同, 而属性描述不同时, 前面的属性描述要兼容后面的, 否则报错。
```typescript
  interface A {
    a: string;
  }
  interface B extends A {
    b: number;
  }
```
- interface extending classes  
[typescript-extend-interface](https://www.typescripttutorial.net/typescript-tutorial/typescript-extend-interface/)  
  >- interface 继承的是实例的属性/方法的类型;
  >- 可以继承 private, protected, public;
  >- 被 interface 继承的 class 包含 private, protected 时, interface只能被该 class 或该 class的子类 implements;
  >- 不能继承 static, constructor(); 因为实例中不应该包含这些。
```typescript
  class A { private a: number }

  interface AInsterface extends A {
    enable(): void;
  }

  class B extends A implements AInsterface {
    enable():void {}
  }

  class C implements AInsterface {}  // Error
```

### 函数
- void: 没有返回值;
- never: 函数无法正常返回, 要么抛出异常(throw Error), 要么无法终止(while(true){});
- 声明
    >- type 表达式
    >```typescript
    >type Fn = (a: string) => void;
    >```
    >- function 带有属性
    >```typescript
    >type Describe = {
    >  description: string;
    >  (a: number) => boolean;
    >}
    >```
    >- 构造函数
    >```typescript
    >type AConstructor = {
    >  new(s: string): XxxObject;
    >}
    >```
- 重载: 更明确地描述参数类型和结果之间的关系。
    >```typescript
    >function test(a: number): number;
    >function test(a: number, b: string): string;
    >```

### Class
#### 访问修饰符(Access Modifiers)
- private xxx: 
    > 仅本 class 内部可见, 子 class 不可见, 外部不可见(不能通过 实例.属性 访问)。
- protected xxx:
    > 本 class 内部可见, 子 class 内部可见, 外部不可见。
- public xxx:
    > 默认为 public, 所有位置都可见。
- static xxx:
    > 静态属性, 通过 ClassName.xxx 访问。
- private static xxx:
    > 只能在 class 内部通过 ClassName.xxx 访问, 外部无法通过 ClassName.xxx 访问。
#### 抽象类(Abstract Class)
[typescript-abstract-classes](https://www.typescripttutorial.net/typescript-tutorial/typescript-abstract-classes/)
- 抽象类使用 abstract 关键字声明;
- 抽象类不能被实例化;
- 一个抽象类至少要包含一个抽象方法;
- 抽象方法不包含函数的具体实现, 抽象方法必须在派生类中实现;
- 使用抽象类需要 extends 继承它, 并实现抽象方法。
```typescript
abstract class Test {
  constructor(private a: string, private b: string) {}

  abstract getOtherString(): string

  get ab(): string {
    return `${this.a} ${this.b}`;
  }
  
  fn():string {
    return `ab is: ${this.ab}`;
  }
}

class Xxx extends Test {
  constructor(a: string, b: string, private otherString: string) {
    super(a, b);
  }
  
  getOtherString(): string {
    return this.otherString;
  }
}
```

### 装饰器
[accessor-decorators](https://www.tslang.cn/docs/handbook/decorators.html#accessor-decorators)
- @expression 形式;
- 多个装饰器时, 从上到下依次求值; 求值结果被当作函数从下到上依次调用;




