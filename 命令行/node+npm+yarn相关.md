## Node 和 npm & yarn 相关
- where node: 查看 Node 安装地址;
- npm init: 生成 package.json;
- npm [-v | --version]: 查看 npm 版本;
- npm view <pkg> version: 查看XXX包的发布版本;
- npm view <pkg> versions: 查看XXX包的所有版本;
- scripts 中 &: 同时并行执行多个任务;
- scripts 中 &&: 前一个任务成功, 才执行下一个任务;

### pm2 依赖的 vm2 存在安全漏洞, 查询 vm2 版本并升级 pm2:
- npm ls -g vm2: 查询 vm2 版本
- npm install pm2@latest -g;
- pm2 update;
- npm ls -g vm2: 升级后再次确认 vm2 版本。

### node 模块作用域--变量
- __dirname: 当前模块的目录名;
- __filename: 当前模块的文件名;

### yarn 和 npm 命令对比
|  npm   | yarn  |
|  ----  | ----  |
| npm install  | yarn / yarn install |
| npm install <package...> --save  | yarn add <package...> |
| npm install <package...> --save-dev | yarn add <package...> [--dev / -D] |
| npm uninstall <pkg> --save | yarn remove <pkg> |
| npm update [pkg] | yarn upgrade [pkg] |

#### git 重新定位到私有仓库
- .npmrc 文件
    ```
    registry="https://registry.fzz.com/api/npm/"
    strict-ssl=false
    ```
- .yarnrc 文件
    ```
    registry "https://registry.fzz.com/api/npm/"
    strict-ssl false
    ```
    
### 版本相关
#### 版本生成
npm version [\<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease [--preid=<prerelease-id>] | from-git]
- npm version: 获取当前版本信息;
- newversion: 当前版本改成新的版本;
- major | minor | patch: 正式发布版本, 会将后面的- 去掉;
- premajor | preminor | prepatch | prerelease: 当前版本对应的位置 + 1, 且后面增加 -0;

#### package.json 版本控制
<https://github.com/npm/node-semver#versions>

<https://docs.npmjs.com/about-semantic-versioning>
- 元组: [major, minor, patch];
- major: 主版本, 不兼容之前版本;
- minor: 次版本, 新特性(new features), 兼容之前版本;
- patch: 补丁版本, 修复bug, 兼容之前版本;
- ~: patch, 补丁版本部分向上;  
    如果指定了 minor 则允许 patch 部分的修改;  
    如果没有 minor 则允许 minor 部分的修改。
    ```javascript
      // 指定 minor, 允许 patch 级别修改:
      ~1.2.3: >=1.2.3 <1.3.0-0
  
      // 没指定 minor, 允许 minor 级别修改:
      ~1: >=1.0.0 <2.0.0-0 (Same as 1.x)
    ```
- ^: minor, 次版本部分向上;   
    不修改最左侧非零元素:
    ```javascript
      ^1.2.3: >=1.2.3 <2.0.0-0
      ^0.2.3: >=0.2.3 <0.3.0-0
      ^0.0.3: >=0.0.3 <0.0.4-0
    ```
- X, x, *: 可以表示任意位置。
