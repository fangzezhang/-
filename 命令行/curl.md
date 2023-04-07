# curl
### [官网](https://curl.se/docs/manual.html)

- GET 
```
curl https://www.baidu.com
```
- POST
- -d 代表 data, 必须是 urlencoded
```
curl -d "name=Rafael%20Sagula&phone=3320780" http://www.test.com
curl --data-urlencode "name=Rafael Sagula&phone=3320780" http://www.test.com
```
