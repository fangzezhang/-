# webpack
- loader: 专注实现资源模块的加载, 从而实现整体项目的打包;
- Plugin: 解决项目中除了资源加载以外, 其他的自动化工作;

### webpack 核心工作原理
- webpack 根据配置找到打包入口文件;
- 根据入口文件代码中的 import 或 require 关键字解析推断出入口文件所依赖的资源模块;
- 分别解析每个资源所依赖的资源模块;
- 生成项目中所有用到的文件之间的依赖关系树;
- webpack 递归该依赖树, 找到每个节点对应的资源文件;
- 根据配置文件的 rules 属性找到模块文件对应的加载器(loader), 交给加载器加载对应的模块;
- 将加载后的结果放置到打包结果中;

### loader
- module.exports = fn;
- fn 接收 source 参数(加载到的资源的内容), 返回 JS 代码(return `modules.exports = 'XXX'`);
- 打包结果文件中直接将该 JS 代码插入到模块参数中;

### Plugin
- eg: clean-webpack-plugin 自动清理输出目录;
- eg: html-webpack-plugin 自动生成使用打包结果的 html 文件; 可以提供模板文件, 动态部分通过 lodash 模板语法的方式输出;
- eg: copy-webpack-plugin 拷贝 public 目录下的静态文件到输出目录; 开发过程中最好不要开启, 防止每次打包都拷贝;
- eg: 压缩输出代码;

#### Plugin 工作机制
- 钩子(hook)机制;
- Plugin 必须是一个函数或一个包含 apply 方法的对象;
- apply 接收 compiler 参数, 其中包含此次构建的所有配置信息, 也是通过 compiler 注册钩子函数;

### watch 工作模式
- 监视项目下的源文件, 当文件发生变化, webpack 自动重新打包;
- ``` yarn webpack --watch ```;

### webpack-dev-server
- 为了提高效率, devServer 没有将打包文件写入磁盘, 而是存储在内存中;
- 自动打包;
- 热更新;
- contentBase: 为 devServer 额外制定静态资源目录; 

### sourceMap
- 源文件地图, 将源文件和打包文件进行映射;
- 用于开发阶段;
- 在压缩文件底部增加: 注释(//) + # + ' ' + .map文件;
- 在 webpack 中的开启: 
```
// webpack.config.js 
module.exports = {
	devtool: 'source-map',
}
```