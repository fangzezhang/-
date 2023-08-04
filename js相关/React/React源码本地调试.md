# React源码本地调试
### 1. 获取 react 源码
```
git clone https://github.com/facebook/react.git
```

### [打包](https://zh-hans.legacy.reactjs.org/docs/how-to-contribute.html#development-workflow)
```
yarn build react/index,react/jsx,react-dom/index,scheduler --type=NODE
```

### 创建软连接
```
// 申明react指向
cd build/node_modules/react
yarn link

// 申明react-dom指向
cd build/node_modules/react-dom
yarn link
```

### 跳转到项目中将 react react-dom 指向之前申明的包
```
cd ./yourProject
yarn link react react-dom
```
