# Video分片加载
- MP4格式的视频是 stream 格式, 所以前端可以通过 range header 进行分片加载。
- video 的 src 是根据 MediaSource 生成的 url。

### 1.获取文件大小
- 通过 HEAD 方法获取 mp4文件整体大小
```javascript
fetch(
  'https://nickdesaulniers.github.io/netfix/demo/frag_bunny.mp4',
  {
    method: 'HEAD'
  }
)
  .then(res => {
    console.info(res.headers.get('content-length'));
    console.info(res.headers.get('content-type'));
  })
```
or
```javascript
const xhr = new XMLHttpRequest();
xhr.open('HEAD', 'https://nickdesaulniers.github.io/netfix/demo/frag_bunny.mp4');
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4) {
    console.info(xhr.getResponseHeader('content-length'));
    console.info(xhr.getResponseHeader('content-type'));
  }
};
xhr.send();
```

### 2.
