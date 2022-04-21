# eslint报错及解决方案
创建时间：2022-04-21

### 1. vue-cli 中使用 TypeScript namespace 时, eslint 报错
```javascript
// types file
declare namespace Components {}
// .vue
export default class Tree extends Vue {
  item: Array<Components.TreeItem> = [];  // ESLint: 'Components' is not defined.(no-undef)
}
```
- TSlint 2019 年就已经废弃, 合并到 eslint 中, 这个错误可以通过配置 eslint [globals](https://eslint.org/docs/user-guide/configuring/language-options#specifying-globals) 解决：
```javascript
// package.json
"eslintConfig": {
  "globals": {
    "Components": "readonly"
  }
}
```
