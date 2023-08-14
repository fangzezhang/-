# 插件及工具
### 如何选择一个第三方插件
- 需要查看许可证, 比如 highcharts^5.x 版本就禁止免费商用;
- 需要查看插件的兼容性, 看是否满足项目要求;
- 需要查看最新的提交日期, 检查插件是否还在维护。

## 插件
### Web 插件
- hotkeys: 热键(快捷键)绑定 https://github.com/jaywcjlove/hotkeys
- jsdiff: 比较文本差异 https://github.com/kpdecker/jsdiff
- slicksort: vue拖拽插件 https://github.com/Jexordexan/vue-slicksort 
- dropzone: 文件上传插件 https://www.dropzonejs.com/
- vee-validate: vue表单验证 https://baianat.github.io/vee-validate/examples/
- vue-clipboard2: 粘贴板 https://www.npmjs.com/package/vue-clipboard2
- WOW.js – 让页面滚动更有趣插件 http://www.dowebok.com/131.html
- swiper: 移动端网页触摸内容滑动js插件 http://www.swiper.com.cn/
- mCustomScrollbar: 滚动条插件-基于jQuery
http://manos.malihu.gr/jquery-custom-content-scroller/
- bxSlider: 滑动插件-基于jQuery https://bxslider.com/options/

### Node 插件
- [env-cmd](https://github.com/toddbluhm/env-cmd) 管理注入环境变量
- [portfinder](https://www.npmjs.com/package/portfinder): 查找可用端口 
- [body-parser](https://github.com/expressjs/body-parser): express 中间件, 解析 request body 
- [morgan](https://github.com/expressjs/morgan): 中间件, 生成日志 
- [winston](https://github.com/winstonjs/winston): 多种方式输出日志(FILE, CONSOLE, custom) 
- [@pm2/io](https://github.com/keymetrics/pm2-io-apm): 记录事件频率, 可通过 pm2 plus | Enterprise 查看 
- [lru-cache](https://github.com/isaacs/node-lru-cache): 配置 SSR 页面缓存(通常配置 maxAge: 1000 SSR页面存活1秒) 
- [dotenv](https://github.com/motdotla/dotenv#readme): 插入环境变量, 从 .env 文件加载到 process.env 中
- [concurrently](https://github.com/open-cli-tools/concurrently#readme): 并行执行多个 scripts

### webpack 插件
- [CopyWebpackPlugin](https://www.webpackjs.com/plugins/copy-webpack-plugin/#root): 将单个文件或整个文件夹复制到build目录

### webstorm 插件
- [evalRest](https://youwu.today/blog/jetbrains-evaluate-reset/): 重置 webstorm 试用期插件 [ide-eval-resetter-2.3.5-c80a1d.zip](./webstorm/ide-eval-resetter-2.3.5-c80a1d.zip)
- [settings.zip](./webstorm/settings.zip): webstorm 快捷键及风格配置 

### 工具网站
- RegExp 图形化展示: https://regexper.com/#%2F%5B%5E%5Cw.%24%5D%2F
- 贝赛尔曲线生成: http://cubic-bezier.com/#.3,-1.2,.76,.72

### 测试工具
- Apache Bench: 网络性能测试
```
// 发起 200 个并发客户端
ab -c 200 -t 100 http://127.0.0.1:8001/
```

### [Joplin](https://joplinapp.org/)
- 多端云笔记。

### [pandora](https://github.com/pengzhile/pandora)
- ChatGPT 绕过 Cloudflare。

