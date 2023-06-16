# buffer
### 正确拼接 Buffer
- 用一个数组存储接收到的所有 Buffer 片段, 并记录所有片段的总长度;
- 调用 Buffer.concat() 生成一个合并的 Buffer 对象。
```javascript
const chunks = [];
let size = 0;

res.on('data', function(chunk) {
  chunks.push(chunk);
  size += chunk.length;
});
res.on('end', function() {
  let buf = Buffer.concat(chunks, size);
})
```

- Buffer.concat 原理
```javascript
Buffer.concat = function(list, length) {
  const buffer = new Buffer(length);
  let pos = 0;

  for (let i = 0; i < list.length; i++) {
    let buf = list[i];
  
    buf.copy(buffer, pos);
    pos += buf.length;
  }

  return buffer;
}
```
