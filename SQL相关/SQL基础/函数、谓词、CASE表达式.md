# 函数、谓词、CASE表达式
## 各种各样的函数
- 所谓函数就是输入某一值得到相应输出结果的功能, 输入值称为参数, 输出值称为返回值;
- 根据用途, 函数可以大致分为: 算数函数, 字符串函数, 日期函数, 转换函数, 和聚合函数;

### 函数的种类
- 算数函数(进行数值计算的函数);
- 字符串函数(进行字符串操作的函数);
- 日期函数(进行日期操作的函数);
- 转换函数(转换数据类型和值的函数);
- 聚合函数(进行数据聚合的函数);

#### 算数函数
```
CREATE TABLE shop.samplemath(
    m NUMERIC (10, 3),
    n INT,
    p INT
);

INSERT INTO shop.samplemath VALUES(NULL, 7, 3),
    (NULL, 5, 2),
    (NULL, 4, NULL),
    (8, NULL, 3),
    (2.27, 1, NULL),
    (5.555, 2, NULL),
    (NULL, 1, NULL),
    (8.76, NULL, NULL);
```
- 四则运算(+-*/);
- ABS(数值): absolute value, 计算绝对值(NULL 的处理结果也是 NULL);
```
SELECT m, ABS(m) AS abs_col
FROM shop.samplemath;
```
- MOD(被除数, 除数): modulo, 求余;
```
SELECT n, p, MOD(n, p) AS mod_col
FROM shop.samplemath;
```
- ROUND(对象数值, 保留小数的位数): 四舍五入;

### 字符串函数
```
CREATE TABLE shop.samplestr(
	str1 VARCHAR(40),
    str2 VARCHAR(40),
    str3 VARCHAR(40),
    create_timestamp TIMESTAMP DEFAULT CREATE_TIMESTAMP,
);

INSERT INTO shop.samplestr(str1, str2, str3) VALUES('opx', 'rt', NULL),
	('abc', 'def', NULL),
    ('张', '三', '是法外狂徒'),
    ('aaa', null, null),
    ('@!@#@$%', null, null),
    ('abc', null, null),
    ('ABC', null, null),
    ('micmic', 'i', 'I'),
    ('abcdefabc', 'abc', 'ABC');
```
- ||: 将字符串拼接(Oracle, DB2, PostgreSQL 中使用);
- +: 将字符串拼接(SQL server 中使用);
- CONCAT(): 将字符串拼接(MySQL 中使用);  
    CONCAT 的参数中存在 NULL, 执行结果为 NULL;  
    若不想为 NULL, 可以通过 COALESCE 转换函数进行包裹。
```
SELECT str1, str2, CONCAT(str1, str2) AS str_concat
FROM shop.samplestr;
```
```
-- 使用 COALESCE 转换函数将 NULL 进行转换:
SELECT str1, str2, CONCAT(COALESCE(str1, ''), COALESCE(str2, '')) AS str_concat
FROM shop.samplestr;
```

- LENGTH(字符串): 字符串中包含多少个字符;
- 一个字符使用 LENGTH 函数可能得到多个字节的结果, 不同的 DBMS 执行结果也不相同;
```
SELECT str1, LENGTH(str1) AS len_str
FROM shop.samplestr;
```

- LOWER/UPPER(字符串): 大小写转换;
```
SELECT str1, LOWER(str1) AS low_str
FROM shop.samplestr
WHERE str1 IN ('ABC', 'abc', '张三');
```

- REPLACE(对象字符串, 替换前的字符串, 替换后的字符串): 字符串的替换;
```
SELECT str1, str2, str3,
    REPLACE(str1, str2, str3) AS rep_str
FROM shop.samplestr;
```

- SUBSTRING(对象字符串 FROM 截取的起始位置 FOR 截取的字符数): 字符串的截取(PostgreSQL/MySQL 专用语法);
- 截取的起始位置从字符串最左侧开始计算, 即: 字符串初始字符坐标为 1;
```
SELECT str1,
    SUBSTRING(str1 FROM 2 FOR 2) AS sub_str
FROM shop.samplestr;

-- 或者不使用 FROM...FOR, 而是直接传参:
SELECT str3,
	SUBSTRING(str3, 2, 2) AS sub_str
FROM shop.samplestr;
```
```
-- 首字母大写:
SELECT str1, 
    CONCAT(UPPER(SUBSTRING(str1, 1, 1)), LOWER(SUBSTRING(str1, 2, LENGTH(str1)))) AS first_upper
FROM shop.samplestr;
```

### 日期函数
- CURRENT_DATE: 当前日期, 由于没有参数, 所以无效使用括号;
- 返回值格式: "2023-04-26";
```
SELECT CURRENT_DATE;
```

- CURRENT_TIME: 当前时间;
- 返回值格式: "10:29:40";
```
SELECT CURRENT_TIME;
```

- CURRENT_TIMESTAMP: 当前日期和时间;
- 返回值格式: "2023-04-26 10:31:30";
```
SELECT CURRENT_TIMESTAMP;
```

- EXTRACT(日期元素 FROM 日期): 截取日期元素;
```
SELECT CURRENT_TIMESTAMP,
	EXTRACT(YEAR FROM CURRENT_TIMESTAMP) AS year,
    EXTRACT(MONTH FROM CURRENT_TIMESTAMP) AS month,
    EXTRACT(DAY FROM CURRENT_TIMESTAMP) AS day,
    EXTRACT(HOUR FROM CURRENT_TIMESTAMP) AS hour,
    EXTRACT(MINUTE FROM CURRENT_TIMESTAMP) AS minute,
    EXTRACT(SECOND FROM CURRENT_TIMESTAMP) AS second;
```

### 转换函数
- 类型转换: 数据类型的转换;
- 值的转换;
- CAST(转换前的值 AS 想要转换的数据类型): 类型转换;
```
SELECT CAST('001' AS SIGNED INTEGER) AS int_col;
```

- COALESCE(数据1, 数据2, 数据3, ...): 将 NULL 转换为其他值;
- 该函数返回可变参数中左侧开始第一个不是 NULL 的值;
```
SELECT COALESCE(NULL, 1) AS col_1,
	COALESCE(NULL, 'test', NULL) AS col_test;
```
```
SELECT str2, COALESCE(str2, 'NULL')
FROM shop.samplestr;
```

## 谓词(predicate)
- 谓词就是返回值为真值的函数;
- 掌握 LIKE 的三种使用方法(前方一致, 中间一致, 后方一致);
- 需要注意 BETWEEN 包含三个参数;
- 想要取得 NULL 数据时必须使用 IS NULL;
- 可以将子查询作为 IN 和 EXISTS 的参数;

### 什么是谓词
- 函数的一种, 是: 满足返回值是真值(TRUE/FALSE/UNKNOWN)条件的函数;
- 比较谓词: =, <, >, != 等比较运算符;
- LIKE;
- BETWEEN;
- IS NULL, IS NOT NULL;
- IN;
- EXISTS;

### LIKE谓词: 字符串的部分一致查询(模式匹配, 模式即规则)
- "=" 只有在字符串完全一致时才为真, 与之相比, LIKE 更改模糊一些, 在字符串部分一致查询时使用;
- 部分一致大体可分为: 前方一致, 中间一致, 后方一致三种类型;
- 中间一致 的查询条件最宽松, 能够获取更多的记录, 因为它同时包含前方一致和后方一致的查询结果;
- 前方一致: 选取出作为 查询条件的字符串 与 查询对象字符串起始部分 相同的记录; 
- 中间一致: 选取出 查询对象字符串中 含有作为 查询条件的字符串 的记录,  
    不论该字符串出现在 对象字符串的最后还是中间 都没有关系;
- 后方一致: 选取出作为 查询条件的字符串 与 查询对象字符串的末尾部分 相同的记录;

#### 常用通配符:
- "%" 代表 "0个, 1个, 或多个 任意字符";
- "_" 代表 "1个 任意字符";
- 前方一致:
```
-- 查询以 ddd 开头的所有字符串: 
SELECT *
    FROM shop.samplelike
WHERE strcol LIKE 'ddd%';
```
- 中间一致:
```
-- 查询包含 ddd 的字符串:
SELECT * 
    FROM shop.samplelike
WHERE strcol LIKE '%ddd%';
```
- 后方一致:
```
SELECT *
    FROM shop.samplelike
WHERE strcol LIKE '%ddd';
```
- 查询 abc + 任意3个字符:
```
SELECT *
    FROM shop.samplelike
WHERE strcol LIKE 'abc___';
```

### BETWEEN 谓词: 范围查询
- 需要三个参数;
- 查询销售单价为 100 到 1000 的商品(包含 100 和 1000):
```
SELECT * 
    FROM shop.shohin
WHERE hanbai_tanka BETWEEN 100 AND 1000;
```
```
SELECT *
	FROM shop.samplelike
WHERE LENGTH(strcol) BETWEEN 3 AND 5;
```
- 查询结果中不包含 100 和 1000, 需要使用 < 和 >:
```
SELECT *
    FROM shop.shohin
WHERE hanbai_tanka > 100
    AND hanbai_tanka < 1000;
```

### IS NULL, IS NOT NULL: 判断是否为 NULL
```
SELECT *
    FROM shop.shohin
WHERE hanbai_tanka IS NULL;
```

### IN 谓词: OR 的简便用法
- IN 谓词(NOT IN 谓词) 具有其他谓词没有的使用方法, 就是可以使用子查询作为其参数;
- IN 和 NOT IN 无法选出 NULL 数据, NULL 数据终究要使用 IS NULL, NOT NULL 进行判断;
- NOT IN 中包含 NULL 时, 返回空, 无法取出任何记录。
- OR 的使用: 查询进货单价为 200, 320, 500 的商品
```
SELECT * 
    FROM shop.shohin
WHERE shiire_tanka = 200
    OR shiire_tanka = 320
    OR shiire_tanka = 500;
```

- 使用 IN (值, ...) 替代 OR:
```
SELECT *
    FROM shop.shohin
WHERE shiire_tanka IN (200, 320, 500);
```

- 使用 NOT IN 选出进货单价除 200, 320, 500 之外的商品:
```
SELECT *
    FROM shop.shohin
WHERE shiire_tanka NOT IN (200, 320, 500);
```

- 使用子查询作为 IN 谓词的参数
```
-- 查找 '大阪' 分店在售商品:
/*
    1. 在 tenpo_shohin 表中选取 '大阪' 店中销售商品 shohin_id
    2. 在 shohin 表中选取通过 1 得到的商品销售单价
*/
CREATE TABLE shop.tenpo_shohin (
  tenpo_di char(4) NOT NULL,
  tenpo_mei varchar(200) NOT NULL,
  shohin_id char(4) NOT NULL,
  suryo int NOT NULL,
  PRIMARY KEY (tenpo_di, shohin_id)
)

INSERT INTO shop.tenpo_shohin VALUES 
	('000A', '东京', '0001', 30),
    ('000A', '东京', '0002', 50),
    ('000A', '东京', '0003', 15),
    ('000B', '名古屋', '0002', 30),
    ('000B', '名古屋', '0003', 120),
    ('000B', '名古屋', '0004', 20),
    ('000B', '名古屋', '0006', 10),
    ('000B', '名古屋', '0007', 40),
    ('000C', '大阪', '0003', 20),
    ('000C', '大阪', '0004', 50),
    ('000C', '大阪', '0006', 90),
    ('000C', '大阪', '0007', 70),
    ('000D', '福冈', '0001', 100);

SELECT shohin_mei, hanbai_tanka 
	FROM shop.shohin
WHERE shohin_id IN (SELECT SUBSTRING(shohin_id FROM 4 FOR 4) 
						FROM shop.tenpo_shohin
					WHERE tenpo_mei = '大阪');
```

### EXISTS 谓词
- 判断是否存在满足某种条件的记录;
- 存在返回真, 不存在返回假;
- EXISTS 只需要右侧一个参数, 该参数通常是一个子查询。
```
-- 查找 '大阪' 分店在售商品:
SELECT shohin_mei, hanbai_tanka
    FROM shop.shohin AS S1
WHERE EXISTS (SELECT *
                    FROM shop.tenpo_shohin AS S2
                WHERE S2.tenpo_mei = '大阪'
                AND SUBSTRING(S2.shohin_id FROM 4 FOR 4) = S1.shohin_id);
```

## CASE 表达式
- CASE 表达式的语法分为 **简单 CASE 表达式** 和 **搜索 CASE 表达式** 两种;
- 搜索 CASE 表达式包含简单 CASE 表达式的全部功能;
- CASE 表达式的 ELSE 子句可以省略(默认为 ELSE NULL);
- CASE 表达式中的 END 不能省略;
- 使用 CASE 表达式能够将 SELECT 语句中的结果进行组合;
- CASE 表达式在区分情况时使用;
- CASE 表达式可以书写在任意位置, 能够用于行列转换;

### 搜索 CASE 表达式的语法
- WHEN 子句中的判断表达式是返回值为真值的表达式, 也可以将其看作使用 =, != 或者 LIKE, BETWEEN 等谓词编写的表达式;
- WHEN 为 true, 就返回 THEN 子句的表达式, CASE 执行到此为止, 或者直到最后返回 ELSE 中的表达式。
```
CASE WHEN <判断表达式> THEN <表达式>
    WHEN <判断表达式> THEN <表达式>
    。。。
    ELSE <表达式>
END
```
```
-- 使用 CASE 将 ABC 添加到商品分类中
SELECT shohin_mei,
    CASE WHEN shohin_bunrui = '衣服' THEN CONCAT('A: ', shohin_bunrui)
        WHEN shohin_bunrui = '办公用品' THEN CONCAT('B: ', shohin_bunrui)
        WHEN shohin_bunrui = '厨房用具' THEN CONCAT('C: ', shohin_bunrui)
        ELSE NULL
    END AS abc_shohin_bunrui
FROM shop.shohin;
```

- CASE 表达式可以书写在任意位置
```
/*使用 CASE 进行行列转换*/
-- GROUP BY 无法进行行列转换:
SELECT shohin_bunrui, SUM(hanbai_tanka) AS sum_hanbai_tanka
FROM shop.shohin;

-- 使用 CASE 进行行列转换:
SELECT 
    SUM(CASE WHEN shohin_bunrui = '衣服' 
            THEN hanbai_tanka ELSE 0 END) AS sum_衣服,
    SUM(CASE WHEN shohin_bunrui = '办公用品' 
            THEN hanbai_tanka ELSE 0 END) AS sum_办公用品,
    SUM(CASE WHEN shohin_bunrui = '厨房用具' 
            THEN hanbai_tanka ELSE 0 END) AS sum_厨房用具
FROM shop.shohin;
```
```
-- 统计低(<=1000), 中(1001 ~ 3000), 高(>=3001)价值商品数量
SELECT SUM(CASE WHEN hanbai_tanka <= 1000 
        THEN 1 ELSE 0 END) AS low_price,
    SUM(CASE WHEN hanbai_tanka BETWEEN 1001 AND 3000 
        THEN 1 ELSE 0 END) AS mid_price,
    SUM(CASE WHEN hanbai_tanka >= 3001
        THEN 1 ELSE 0 END) AS high_price
FROM shop.shohin;
```
