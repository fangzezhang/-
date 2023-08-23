# Axios
### Axios 发起请求的几种方式
- axios('/url');
- axios(config);
- axios.get(url[, config]);
- axios.create() 创建实例的方式使用。

### axios 是一个函数
- 调用 axios() 发起请求;
- axios() 执行的是 Axios.prototype.request 方法;
- 在 axios 函数的属性上绑定 Axios.prototype 中的方法(get, request, ...);
- 在 axios 函数的属性上绑定 Axios 的属性(defaults,  interceptors)。

### axios 拦截器
#### 用法
- axios.interceptors.request.use(resolveHandler, rejectHandler);
- axios.interceptors.response.use(resolveHandler, rejectHandler);
- axios.interceptors.request.eject(interceptorId) 移除拦截器。

#### 拦截器链式调用
- 执行 Axios.prototype.request;
- 遍历 this.interceptors.request, 填充 requestInterceptorChain;
```requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected)```
- 遍历 this.interceptors.response, 填充 responseInterceptorChain;
```responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);```
- interceptor.synchronous 判断拦截器是否是同步(默认异步);
- 异步情况下形成 Promise 链并返回 Promise:
```javascript
  var promise;
  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest, undefined];

    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain.concat(responseInterceptorChain);

    promise = Promise.resolve(config);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }
```
- 同步情况下先遍历 requestInterceptorChain, 然后执行 dispatchRequest, 然后遍历 responseInterceptorChain 形成 Promise 链并返回 Promise。

### 浏览器和 Node 都可以使用 axios
- 通过 adapter 实现;
- 执行 dispatchRequest 时判断使用 XMLHttpRequest 还是 http。

#### 浏览器上发起请求
- request = new XMLHttpRequest();
- request.open(method, URL, true);
- request.timeout = config.timeout;
- request.onreadystatechange = function handleLoad() {};
- request.onabort = function handleAbort() {};
- request.onerror = function handleError() {};
- request.ontimeout = function handleTimeout() {};
- request.setRequestHeader(key, val);
- request.withCredentials = !!config.withCredentials;
- request.responseType = config.responseType;
- request.addEventListener('progress', config.onDownloadProgress);
- request.upload.addEventListener('progress', config.onUploadProgress);
- request.abort();
- request.send(requestData);

#### Node 发起请求
- req = http.request(options, function handleResponse(res) {});
- req.setTimeout(config.timeout, function handleRequestTimeout() {});
- req.abort();
```javascript
var options = {
  path: buildURL(parsed.path, config.params, config.paramsSerializer).replace(/^\?/, ''),
  method: config.method.toUpperCase(),
  headers: headers,
  agent: agent,
  agents: { http: config.httpAgent, https: config.httpsAgent },
  auth: auth
};

if (config.socketPath) {
  options.socketPath = config.socketPath;
} else {
  options.hostname = parsed.hostname;
  options.port = parsed.port;
}

```
