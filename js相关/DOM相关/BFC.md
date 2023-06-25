# BFC(Block Formatting Context) 块级格式化上下文
### 目的
- 形成相对于外部完全独立的空间, 内部子元素不会影响到外部元素。

### 解决场景
- 防止外部边距合并(margin 塌缩);
- 清除浮动;
- 创建包含浮动元素的上下文环境;

### 创建方式
- overflow: 非 visible 属性(auto, scroll, hidden);
- display: flex, grid, table(flex, inline-flex, grid, inline-grid, inline-block, table, inline-table, table-cell, table-caption);
- position: absolute, fixed;
- float: left, right。
