# curl
## [官网](https://curl.se/docs/manual.html)

### GET 
```
curl https://www.baidu.com
```

- '-v' 选项显示这次网络通信的所有报文信息;
```
curl -v http://localhost:2000

// 返回的报文:
* Rebuilt URL to: http://localhost:2000/
*   Trying ::1...
* TCP_NODELAY set
* Connected to localhost (::1) port 2000 (#0)
> GET / HTTP/1.1
> Host: localhost:2000
> User-Agent: curl/7.55.1
> Accept: */*
>
< HTTP/1.1 200 OK
< contentType: text/plain
< Date: Fri, 09 Jun 2023 02:30:25 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
< Transfer-Encoding: chunked
<
hello world* Connection #0 to host localhost left intact
```

### POST
- -d 代表 data, 必须是 urlencoded
```
curl -d "name=Rafael%20Sagula&phone=3320780" http://www.test.com
curl --data-urlencode "name=Rafael Sagula&phone=3320780" http://www.test.com
```
