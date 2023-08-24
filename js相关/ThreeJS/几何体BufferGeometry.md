# 几何体BufferGeometry
## BufferGeometry
- BufferGeometry 是一个没有任何形状的空几何体, 可以通过 BufferGeometry 自定义任何几何形状, 具体点就是定义顶点数据;
- 创建空几何体:
```javascript
const geometry = new THREE.BufferGeometry();
```

- 定义几何体顶点数据:
```javascript
const vertices = new Float32Array([
  0, 0, 0, //顶点1坐标
  50, 0, 0, //顶点2坐标
  0, 100, 0, //顶点3坐标
  0, 0, 10, //顶点4坐标
  0, 0, 100, //顶点5坐标
  50, 0, 10, //顶点6坐标
]);
const attribute = new THREE.BufferAttribute(vertices, 3);
```

- 设置几何体顶点:
```javascript
geometry.attributes.position = attribute;
// geometry.setAttribute('position', attribute);
```

### 点模型 Points
```javascript
const material = new THREE.PointsMaterial({
  color: 'red',
  size: 10.0, // 点对象像素尺寸
});
const points = new THREE.Points(geometry, material); //点模型对象
```

### 线模型 Line
```javascript
// 线材质对象
const material = new THREE.LineBasicMaterial({
    color: 0xff0000 //线条颜色
}); 
// 创建线模型对象
const line = new THREE.Line(geometry, material);
// const line = new THREE.LineLoop(geometry, material); // 闭合线条
// const line = new THREE.LineSegments(geometry, material); //非连续的线条
```

### 网格模型 Mesh
```javascript
const material = new THREE.MeshBasicMaterial({
  color: 0x0000ff,
  side: THREE.FrontSide, // 默认, 只有正面可见
  side: THREE.BackSide, // 背面可见
  side: THREE.DoubleSide, // 两面可见
});
const mesh = new THREE.Mesh(geometry, material);
```
#### 三角形(面)
- 网格模型 Mesh 就是由一个个三角形拼接构成;
- 使用网格模型 Mesh 渲染几何体 geometry, 就是几何体所有顶点坐标三个为一组, 构成一个三角形, 多组顶点构成多个三角形, 模拟物体表面;

#### 三角形正反面
- 正面: 三个顶点顺序为逆时针方向;
- 反面: 三个顶点顺序为顺时针方向;
- Three.js 材质默认正面可见, 反面不可见:
