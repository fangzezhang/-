# eslint报错及解决方案
创建时间：2022-04-21

### eslint rules 中的 0 1 2
- 0 or 'off': close the rule;
- 1 or 'warn': turn the rule on as a warning;
- 2 or 'error': turn the rule on as an error;

### vue-cli 中使用 TypeScript namespace 时, eslint 报错
- TSlint 2019 年就已经废弃, 合并到 eslint 中, 这个错误可以通过配置 eslint [globals](https://eslint.org/docs/user-guide/configuring/language-options#specifying-globals) 解决：
```javascript
// package.json
"eslintConfig": {
  "globals": {
    "Components": "readonly"
  }
}
```
