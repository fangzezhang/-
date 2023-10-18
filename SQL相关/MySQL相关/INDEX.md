# INDEX

### 参数化查询
- 参数化查询插入变量, 防止 SQL 注入攻击;
```javascript
const mysql = require('mysql2');
const dbPool = mysql.createPool({
  host: process.env.NODE_ENV === 'development' ? 'localhost' : 'server-mysql',
  user: 'root',
  password: '****',
  database: 'server',
});

const query = function (sql, options = []) {
  return new Promise((resolve, reject) => {
    dbPool.query(sql, options, function (error, results, fields) {
      if (error) {
        return reject(error);
      }

      return resolve(results);
    });
  })
};

async function getData(req, res) {
  const {env, region} = req.query;
  const condition = [];
  const params = [];

  if (!!env) {
    condition.push('env = ?');
    params.push(env);
  }

  if (!!region) {
    condition.push('region LIKE ?');
    params.push(`%${region}%`);
  }

  return await query(
    `
      SELECT * 
      FROM server
      ${condition.length ? `WHERE ${condition.join(' AND ')}` : ''}
      ORDER BY host;
    `,
    condition.length ? params : []
  );
}
```


#### CREATE SCHEMA xxx;  
- 创建数据库;
- 等同于 CREATE DATABASE xxx;

#### PK、NN、UQ、B、UN、ZF、AI、G 代表含义
- PK: PRIMARY KEY, 主键;
- NN: NOT NULL, 非空;
- UQ: UNIQUE, 唯一索引;
- B: BINARY, 二进制数据;
- UN: UNSIGNED, 无符号整数(非负数);
- ZF: ZERO FILL, 填充0;
- AI: AUTO INCREMENT, 自增;
- G: GENERATED, 生成列。

### 参考资料
- [MySQL Workbench使用教程](http://c.biancheng.net/view/2625.html) 
