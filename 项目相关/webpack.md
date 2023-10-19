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
- eg: css-loader 将 .css 文件编译成 JS 代码;
- eg: style-loader 将 css-loader 转换后的结果通过 style标签 的形式追加到页面上;
- eg: file-loader 将文件拷贝到输出目录, 然后将对应的路径作为当前模块的返回值返回;
- eg: url-loader 将文件编译成 url;
- eg: bable-loader 将 ES6 转换成 ES5;

#### file-loader
```
module.exports = {
	module: {
		rules: [
			{
				test: /\.png$/,
				use: 'file-loader',
			}
		]
	}
}
```

#### bable-loader
- bable: 转换 JS 的一个平台, 需要基于这个平台通过不同的插件转换代码中的具体特性;
- bable-loader, @bable/core, @bable/preset-env; 
```
rules: [
	{
		test: /\.js$/,
		use: {
			loader: 'bable-loader',
			options: {
				presets: ['@bable/preset-env']
			}
		},
	}
]
```

### Plugin
- eg: clean-webpack-plugin 自动清理输出目录;
- eg: html-webpack-plugin 自动生成使用打包结果的 html 文件; 可以提供模板文件, 动态部分通过 lodash 模板语法的方式输出;
- eg: copy-webpack-plugin 拷贝 public 目录下的静态文件到输出目录; 开发过程中最好不要开启, 防止每次打包都拷贝;
- eg: terser-webpack-plugin 压缩 JS代码;
- eg: mini-css-extract-plugin 将 CSS 从打包结果中提取, 实现 CSS 的按需加载;
- eg: optimize-css-assets-webpack-plugin 压缩 CSS 代码;

#### production 模式下默认开启的 Plugin
- DefinePlugin: 为代码注入全局成员, production 模式下默认注入 process.env.NODE_ENV;
- TreeSharking: 打包时去除未引用代码(dead-code);

#### Plugin 工作机制
- 钩子(hook)机制;
- Plugin 必须是一个函数或一个包含 apply 方法的对象;
- apply 接收 compiler 参数, 其中包含此次构建的所有配置信息, 也是通过 compiler 注册钩子函数;

#### mini-css-extract-plugin + optimize-css-assets-webpack-plugin
- 将 CSS 从打包结果中提取, 实现 CSS 的按需加载;
- CSS 样式文件超过 150kb 可以考虑提取到单独文件中, 否则采用嵌入到代码中的方式更好(减少一次 http 请求);
```
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					// 'style-loader',  // 将样式通过 style 标签注入
					MiniCssExtractPlugin.loader
					'css-loader',
				]
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name]-[hash].boundle.css'
		}),
		new OptimizeCssAssetsWebpackPlugin(),
	]
}
```

### watch 工作模式: 自动编译
- 监视项目下的源文件, 当文件发生变化, webpack 自动重新打包;
- ``` yarn webpack --watch ```;

### webpack-dev-server
- 为了提高效率, devServer 没有将打包文件写入磁盘, 而是存储在内存中;
- 自动打包;
- 热更新(HMR);
- contentBase: 为 devServer 额外制定静态资源目录; 

#### 热更新(HMR)
- 命令行开启: webpack-dev-server --hot;
- 配置文件(webpack.config.js)的形式开启: 
```
const webpack = require('webpack');

module.exports = {
	devServer: {
	// hot: true,
		hotOnly: true, // 代码出现错误时不会自动刷新, 以免覆盖错误信息
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
	]
}
```
- 样式改动可以实现热更新, 因为样式可以通过 style 标签直接替换;
- JS 需要额外配置, 因为 JS 返回值没有规律, 无法确定某个模块更新过后应如何替换到当前运行的页面中;
- 通过 module.hot.accept(dependencies, callback) 配置;

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

### 不同的环境采用不同的配置
- 方法一: 配置文件判断 env, 根据不同的环境导出不同的配置;
- 方法二: 一个环境对应一个配置文件; 

#### 一个环境对应一个配置文件
- 三个文件: webpack.common.js, webpack.dev.js, webpack.prod.js;
- webpack-merge 插件: 配置选项中相同属性的值, 以 merge 的方式合并, 而非后面的完全替换;
- 运行命令指定配置文件: yarn webpack --config webpack.prod.js;

### 代码分割(Code Splitting)
- 多入口打包;
- 动态导入;

#### 多入口打包
- 用于多页应用程序;
- 一个文件对应一个打包入口, 公共部分单独提取到公共结果中;
```
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports: {
	entry: {
		index: './src/index.js',
		a: './src/a.js',
	},
	output: {
		filename: '[name].boundle.js',
	},
	optimization: {
		splitChunks: {
			chunks: 'all', // 将所有的公共模块都提取到一个 boundle 中
		},
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html',
			filename: 'index.html',
			chunks: ['index'],  // 指定需要注入的 bundle
		}),
		new HtmlWebpackPlugin({
			template: './src/a.html',
			filename: 'a.html',
			chunks: ['a'],
		})
	]
}
```

#### 动态导入
- 通过动态导入(import('./xxx'))自动实现模块的按需加载;
- 动态导入的模块会被自动提取到单独 boundle 中;
- 魔法注释: 动态导入中自定义 boundle 文件名, 相同命名自动打包到一起;
``` 
import(/* webpackChunkName: 'posts' */'./posts').then(({default: posts}) => {
	document.body.appendChild(posts())
})
```; 

### webpack 输出 hash 文件名
- [hash] 占位符: 全局级别的 hash, 全局使用同一个 hash, 项目中任意代码发生变化都会导致其变化;
- [chunkhash] 占位符: chunk 级别的 hash, 同一路的打包 chunkhash 都相同;
- [contenthash] 占位符: 文件级别的 hash, 不同的文件就有不同的 hash 值;