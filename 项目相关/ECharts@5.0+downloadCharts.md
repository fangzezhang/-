# ECharts@5.x
创建时间：2022-03-17

## ECharts 升级到 5.x
- 由于 ECharts@5.x 使用 ESM 方式导出, 所以需要在 babel-loader 中增加对 echarts 和 zrender 的编译:
```javascript
module: {
    rules: [{
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('node_modules/echarts'), resolve('node_modules/zrender')],
    }]
}
```
- 按需引入组件
```javascript
import * as echarts from 'echarts/core';

// 引入柱状图等
import { BarChart, LineChart } from 'echarts/charts';

// 引入提示框和标题组件
import {
  TooltipComponent,
  TitleComponent,
  DataZoomComponent,
  MarkPointComponent,
  MarkLineComponent,
  LegendScrollComponent,
  GridComponent,
} from 'echarts/components';

// 使用哪种方式渲染(Canvas or SVG)
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers';

echarts.use([
  BarChart,
  LineChart,
  TooltipComponent,
  TitleComponent,
  DataZoomComponent,
  MarkPointComponent,
  MarkLineComponent,
  LegendScrollComponent,
  GridComponent,
  CanvasRenderer,
  SVGRenderer,
]);

```
## ECharts 下载 charts(兼容IE)
#### print-打印机打印 charts
```javascript
// 先将 body 中的其他元素 display: none, 只展示需要打印的 image;
// 然后执行 window.print();
// 之后再取消 display: none。
const chart = echarts.init(el);
const src = chart.getDataURL();
const image = document.createElement('img');

image.src = src;
document.body.appendChild(image);
window.print();
```
#### 下载 png, jpeg
```javascript
const chart = echarts.init(el, null, { renderer: 'canvas' });
const src = chart.getDataURL();
let link = document.createElement('a');

const dataURLToBlobForIE = function(strUrl) {
  let parts = strUrl.split(/[:;,]/);
  let type = parts[1],
    indexDecoder = strUrl.indexOf('charset') > 0 ? 3 : 2,
    decoder = parts[indexDecoder] == 'base64' ? atob : decodeURIComponent,
    binData = decoder(parts.pop()),
    mx = binData.length,
    i = 0,
    uiArr = new Uint8Array(mx);

  for (i; i < mx; i++) {
    uiArr[i] = binData.charCodeAt(i);
  }

  return new Blob([uiArr], { type: type });
};

link.download = 'xxx.png';

if (window.navigator && window.navigator.msSaveBlob) {  // IE
  const blob = dataURLToBlobForIE(src);
  
  window.navigator.msSaveBlob(blob, link.download);

  return;
}

link.href = src;
link.click();
URL.revokeObjectURL(link.href);
link = null;
```
#### 下载 svg
```javascript
const chart = echarts.init(el, null, { renderer: 'svg' });
const src = chart.renderToSVGString();
const blob = new Blob([src], { type: 'image/svg+xml' });
let link = document.createElement('a');
    
link.download = 'xxx.svg';

if (window.navigator && window.navigator.msSaveBlob) {  // IE
  
  window.navigator.msSaveBlob(blob, link.download);

  return;
}

link.href = URL.createObjectURL(blob);
link.click();
URL.revokeObjectURL(link.href);
link = null;
```
#### 下载 pdf
```javascript
import jsPDF from 'jspdf';

const chart = echarts.init(el, null, { renderer: 'canvas' });
const src = chart.getDataURL({ type: 'jpeg' });
const img = new Image();

img.src = src;

img.onload = () => {
  const pdf = new jsPDF('l', 'pt', [img.width * 2, img.height * 2], false);
  const width = pdf.internal.pageSize.width;
  let height = pdf.internal.pageSize.height;

  pdf.addImage(img, 'JPEG', 0, 0, width, height);
  pdf.save('chart.pdf');
};
```
#### 下载 csv
```javascript
// 字符串拼接
// 生成 Blob
// 下载文件
let str = 'Name ,Age';

str += '\n';

for (let i = 0; i < 10; i++) {
  str += `name${i} ,age${i}\n`;
}

const blob = new Blob([str], { type: 'text/csv;charset=utf-8;' });

if (window.navigator.msSaveOrOpenBlob && window.Blob) {
  window.navigator.msSaveOrOpenBlob(blob, `chart.csv`);

  return;
}

let link = document.createElement('a');

link.download = `xxx.csv`;
link.href = URL.createObjectURL(blob);
link.click();
URL.revokeObjectURL(link.href);
link = null;
```
