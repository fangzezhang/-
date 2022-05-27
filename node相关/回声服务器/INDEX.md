# 回声服务器
- request 对象是 ReadableStream;
- response 对象是 WritableStream;
- 可以使用 pipe 将数据从一端引向另一端, 形成回声服务器。

### 代码
- main.js
```javascript
const http = require('http');
const fs = require('fs');

http.createServer((request, response) => {
  if (request.method === 'POST' && request.url === '/echo') {
    request.pipe(response);
  } else {
    response.statusCode = 200;
    fs.readFile('./index.html', (err, data) => {
      response.end(data);
    })
  }
}).listen(1234);
```
- index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>index</title>
</head>
<body>
<form action="/echo" method="post">
  <input type="text" name="name">
  <input type="password" name="password">
  <button>submit</button>
</form>
</body>
</html>
```
