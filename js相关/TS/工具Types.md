# [工具Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- Pick<Type, Keys>: 从 Type 中挑选属性 Keys(string | union of string), 构造 type;
```typescript
type Pick<T, K extends keyof T> = {[P in K]: T[P];}

interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = Pick<Todo, "title" | "completed">;
 
const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
};
```

- Exclude<UnionType, ExcludedMembers>: 从 UnionType 中排除 ExcludedMembers, 来构造类型;
```typescript
type Exclude<T, U> = T extends U ? never : T;

type T0 = Exclude<"a" | "b" | "c", "a" | "b">; // type T0 = "c"
```

- Omit<Type, Keys>: 从 Type 中选取所有属性, 然后删除 Key, 来构造类型;
```typescript
type Omit<T, K extends string | number | symbol> = {[P in Exclude<keyof T, K>]: T[P];}

interface Todo {
  title: string;
  description: string;
  completed: boolean;
  createdAt: number;
}

type TodoInfo = Omit<Todo, "completed" | "createdAt">;

const todoInfo: TodoInfo = {
  title: "Pick up kids",
  description: "Kindergarten closes at 5pm",
};
```

- Extract<Type, Union>: 从 Type 中提取可分配给 Union 的所有成员, 来构造类型;
```typescript
type Extract<T, U> = T extends U ? T : never; 

type T0 = Extract<"a" | "b" | "c", "a" | "f">; // type T0 = "a"
```

- ReturnType<Type>: 构造一个由函数 Type 的返回值类型组成的类型;
```typescript
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;
```

- Parameters<Type>: 根据函数 Type 的参数使用的类型构造元组类型;
```typescript
type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;
```

- NonNullable<Type>: 从 Type 中移除 null 和 undefined, 来构造类型;
```typescript
type NonNullable<T> = Exclude<T, null | undefined>;

type T0 = NonNullable<string | number | undefined>; // string | number
```

- Readonly<Type>: Type 所有属性设置为 readonly, 来构造类型;
```typescript
type Readonly<T> = {readonly [P in keyof T]: T[P];}
```

- Partial<Type>: Type 的所有属性设置为可选, 来构造类型;
```typescript
type Partial<T> = {[P in keyof T]?: T[P] | undefined;}
```

- Required<Type>: Type 的所有属性设置为必须, 来构造类型;
```typescript
type Required<T> = {[P in keyof T]-?: T[P];}
```

- Flatten<T>: 将数组平展为数组元素的类型;
```typescript
type Flatten<T> = T extends Array<infer Item> ? Item : T;
```

- Record<Keys, Type>: 属性为 Keys, 值为 Type, 来构建类型;
```typescript
type Record<K extends string | number | symbol, T> = {[P in K]: T;}

interface CatInfo {
  age: number;
  breed: string;
}
 
type CatName = "miffy" | "boris" | "mordred";
 
const cats: Record<CatName, CatInfo> = {
  miffy: { age: 10, breed: "Persian" },
  boris: { age: 5, breed: "Maine Coon" },
  mordred: { age: 16, breed: "British Shorthair" },
};
```
