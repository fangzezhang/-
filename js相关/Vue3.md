# Vue3
## 单文件组件的使用
### setup 和 \<script setup>
- \<script setup> 无需 export default {} 导出内容;
- \<script setup> 只需要 import 组件就可以使用;
- \<script setup> 会将其所有顶级绑定(变量, 方法, imports) 暴漏给 template; 可以在模块表达式中直接使用这些方法, 而无需将方法定义在 methods 中;
- 可以通过文件名隐式调用自身;
```javascript
<template>
  <HelloWorld></HelloWorld>
  <div>{{ msg }}</div>
  <div>{{ capitalize(message) }}</div>
  <input v-model="msg" />
</template>

<script setup>
  import { ref, onBeforeMount } from "vue";
  import HelloWorld from '@/views/HelloWorld.vue';

  const msg = ref('msg');
  const message = "message";

  onBeforeMount(() => {
    console.info("onBeforeMount");
  });

  function capitalize(msg) {
    console.info(msg);  // message
  }

  console.info("setup has no onBeforeCreate, onCreated");
  console.info("The code in setup is executed before onBeforeMount");
</script>
```
### \<script> 和 \<script setup>
- \<script> 只会在第一次导入组件时执行, \<script setup> 每次创建组件时都会执行。
