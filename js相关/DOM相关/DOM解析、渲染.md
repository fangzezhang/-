# DOM解析、渲染
## 整体流程
- 浏览器会预解析, 提前下载 JS、CSS 文件;
- 浏览器解析 DOM 生成 DOM Tree; 
- 浏览器解析 CSS 生成 CSS Tree; 
- 两者结合生成 render tree;
- 分层: z-index; position: fixed;
- 图层绘制;
- 图层分块(栅格化): 可视窗口附近的图层块优先合成;
- 合成和显示。
## DOM 解析、渲染和 CSS, JS 的关系
### 结论：
- CSS 加载不会阻塞 DOM 解析;
- CSS 加载会阻塞页面渲染;
- CSS 加载会阻塞 JS 执行;
- JS 加载、执行会阻塞 DOM 解析;
- JS 会阻塞页面渲染。
### 验证方式：
#### 1. 创建一个简单的 node 服务器
<details>
<Summary>
  main.js
</Summary>
<br>

```javascript
const http = require('http');
const fs = require('fs');

const readFile = function(path, res) {
  fs.readFile(path, (error, data) => {
    res.writeHead(203);
    res.end(data);
  })
};

http.createServer((req, res) => {
  switch(req.url) {
    case '/':
      readFile(`${__dirname}/views/index.html`, res);
      break;
    case '/index.css':
      readFile(`${__dirname}/views/index.css`, res);
      break;
    case '/index.js':
      readFile(`${__dirname}/views/index.js`, res);
      break;
    default:
      res.end();
  }
})
  .listen(3000);
```
</details>

<details>
<Summary>
  views/index.html
</Summary>
<br>

```javascript
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>index</title>
  <script src="./index.js" defer></script>
  <link rel="stylesheet" href="./index.css">
</head>
<body>
<div>
  div
</div>
</body>
</html>
```
</details>

<details>
<Summary>
  views/index.css
</Summary>
<br>

```javascript
div {
  width: 100%;
  height: 300px;
  background: blue;
}
```
</details>

<details>
<Summary>
  views/index.js
</Summary>
<br>

```javascript
console.info(document.querySelector('div'));
```
</details>

#### 2. 验证手段：
- script defer 属性: JS 在**文档完成解析后**, 触发 DOMContentLoaded 事件之前执行。
- DOMContentLoaded 事件: **HTML被完全加载及解析时触发**, 而不必等待样式表，图片或者子框架完成加载。
#### 3. 开始验证：
##### CSS 加载不会阻塞 DOM 解析:
- 延迟返回 css 文件;
- 结果: 先输出 div, 几秒后渲染出页面。
```javascript
case '/index.css':
    setTimeout(() => {
        readFile(`${__dirname}/views/index.css`, res);
    }, 5000);
    break;
```
##### CSS 加载会阻塞页面渲染:
- 上已验证。
##### CSS 加载会阻塞 JS 执行:
- body 底部增加 script;
- 结果: 几秒钟后输出 0, div, 渲染出页面。
- 解释: 几秒后输出 div 貌似是 CSS 加载阻塞了 HTML 解析，但是之前已经证明了 CSS 加载并不会阻塞解析。这是因为 CSS 加载阻塞了 js, js 阻塞了页面解析。
```javascript
<script>console.info(0)</script>
```
##### JS 加载、执行会阻塞 DOM 解析:
- 上已验证。
##### JS 会阻塞页面渲染:
- script 创建一个 for 循环, 放置在 head 中。
