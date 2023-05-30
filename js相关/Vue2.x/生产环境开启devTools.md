# 生产环境开启devTools
- 定位 Vue 根元素
- 从根元素的 Properties 中获取 \_\_vue__, 保存为全局变量;
```
let app = document.querySelector('#app').__vue__
let Vue = app.constructor
while (Vue.super) { Vue = Vue.super }

Vue.config.devtools = true
__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = Vue
```
