# Express中间件

### 应用级中间件
- app.use() | app.METHOD()
```javascript
const app = express();
app.use(
  '/user:id', 
  (req, res, next) => {
    next();
  }, 
  (req, res, next) => {
    next();
  }
);
app.get('/user/:id', (req, res, next) => {
  next();
});
```
### 路由级中间件, 用法同上
```javascript
const router = express.router();
...
app.use('/', router);
```

### 错误处理中间件
```javascript
const fs = require('fs');
app.use((err, req, res, next) => {
  res.writeHead(500, { 'Content-Type': 'text/html' });
  res.end(fs.readFileSync('./500.html'), 'utf-8');
})
```

### 内置中间件
```javascript
const options = {
  maxAge: '60 * 60 * 24',
};
app.use(express.static('public', options))
```

### 第三方插件
```javascript
const bodyParser = require('body-parser');
app.use(
  '/user', 
  bodyParser.json(), 
  proxy({
    target: 'xxx URL'
  })
);
```
