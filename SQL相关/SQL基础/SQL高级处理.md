# SQL高级处理
## 窗口函数
- 窗口函数可以进行排序、生成序列号等一般聚合函数无法实现的高级操作;
- 理解 PARTITION BY 和 ORDER BY 两个关键字的含义很重要;

### 什么是窗口函数
- OLAP(Online Analytical Processing): 对数据库数据进行按时分析处理;
- 窗口函数就是为了实现 OLAP 而添加的标准 SQL 功能;

### 窗口函数的语法
```
<窗口函数> OVER ([PARTITION BY <列清单>]
                    ORDER BY <排序用列清单>)
```
- PARTITION BY 并不是必须的;
- PARTITION BY 能够设定排序的对象范围;
- ORDER BY 能够指定按照哪一列、何种顺序进行排序;
- PARTITION BY 对表横向进行分组, ORDER BY 决定纵向排序规则;
- 窗口函数兼具 分组 和 排序 两种功能;
- RANK 函数并不会减少元表中记录的函数;
- 通过 PARTITION BY 分组后的记录集合称为“窗口”, 这里的窗口代表“范围”。

#### 窗口函数大体分为两种
- 能够作为窗口函数的聚合函数(SUM, AVG, COUNT, MAX, MIN);
- RANK, DENSE_RANK, ROW_NUMBER 等专用窗口函数;

### RANK 函数
```
SELECT shohin_mei, shohin_bunrui, hanbai_tanka, 
    RANK() OVER (PARTITION BY shohin_bunrui 
                    ORDER BY hanbai_tanka) AS ranking
FROM shop.shohin;
```
- 是用来计算记录排序的函数;
- PARTITION BY 能够设定排序的对象范围, 上面是按照商品种类(shohin_bunrui)进行排序;
- ORDER BY 能够指定按照哪一列、何种顺序进行排序, 上面是按照销售单价升序排列;
- 窗口函数具有 GROUP BY 子句的分组功能, 以及 ORDER BY 子句的排序功能,  
    但是 PARTITION BY 子句不具备 GROUP BY 子句的聚合功能;
- RANK 函数并不会减少元表中记录的函数;

### 无需指定 PARTITION BY 
```
SELECT shohin_mei, shohin_bunrui, hanbai_tanka, 
	RANK() OVER (ORDER BY hanbai_tanka) AS ranking
FROM shop.shohin;
```
- PARTITION BY 并不是必须的, 不指定也可以正常使用窗口函数;
- 得出的结果和未使用 GROUP BY 的聚合函数时的效果一样;
- 从分组后排序, 变成全部商品按照销售单价进行排序;

### 专用窗口函数的种类
- RANK 函数: 计算排序时, 如果存在相同位次的记录, 则跳过之后的位次;  
    例: 有3条记录排在第一位时: 1, 1, 1, 4 ...
- DENSE_RANK 函数: 计算排序, 即使存在相同位次的记录, 也不会跳过之后的位次;  
    例: 有3条记录排在第一位时: 1, 1, 1, 2 ...
- ROW_NUMBER 函数: 赋予唯一的连续位次;  
    例: 有3条记录排在第一位时: 1, 2, 3, 4 ...
- 使用专用窗口函数无需任何参数, 只需 RANK() 或 ROW_NUMBER() 保持括号为空即可。

### 窗口函数的适用范围
- 窗口函数只能写在 SELECT 子句中, 不能在 WHERE 或者 GROUP BY 子句中使用;
- 原因: 在 DBMS 内部, 窗口函数是对 WHERE 或者 GROUP BY 子句处理后的“结果”进行的操作;

### 作为窗口函数使用的聚合函数
- 所有的聚合函数都能用作窗口函数, 其语法和专用窗口函数完全相同;
- 将 SUM 函数作为窗口函数, 按照 shohin_id 升序排列后 “累计” 统计 “和”;
```
SELECT shohin_id, shohin_mei, hanbai_tanka,
    SUM(hanbai_tanka) OVER (ORDER BY shohin_id) AS current_sum
FROM shop.shohin;
```

- 将 AVG 函数作为窗口函数使用, 计算排在自己之上的记录的平均值;
```
SELECT shohin_id, shohin_mei, hanbai_tanka,
    AVG(hanbai_tanka) OVER (ORDER BY shohin_id) AS current_sum
FROM shop.shohin;
```

### 计算移动平均
- 窗口函数就是将表以窗口为单位进行分割, 并在其中进行排序的函数;
- 还包含在窗口中指定更详细的统计范围的功能;
```
-- 指定从 current 向上2行(共3行)作为统计对象
SELECT shohin_id, shohin_mei, hanbai_tanka,
    AVG(hanbai_tanka) OVER (ORDER BY shohin_id
                                ROWS 2 PRECEDING) AS moving_avg
FROM shop.shohin;
```

#### 指定框架(统计范围)
- ROWS: 行;
- PRECEDING: 之前;
- FOLLOWING: 之后;
- ROWS 2 PRECEDING: 指定“截止到之前2行”作为框架:
```
之前 2 行的记录
之前 1 行的记录
当前行
```

- ROWS 2 FOLLOWING: 指定“截止到之后2行”作为框架:
```
当前行
之后 1 行的记录
之后 2 行的记录
```

- 当前记录的前后1行作为统计对象:
```
SELECT shohin_id, shohin_mei, hanbai_tanka,
    AVG(hanbai_tanka) OVER (ORDER BY shohin_id
                                ROWS BETWEEN 1 PRECEDING 
                                AND 1 FOLLOWING) AS moving_avg
FROM shop.shohin;
```

- 按照 ranking 列进行排列:
```
SELECT shohin_mei, shohin_bunrui, hanbai_tanka,
    RANK() OVER (PARTITION BY shohin_bunrui ORDER BY hanbai_tanka) AS ranking
FROM shop.shohin
ORDER BY ranking;
```

## GROUPING 运算符
- 只使用 GROUP BY 子句和聚合函数无法同时计算出小计、合计值,  
    如果想一次得到这两个值, 可以使用 GROUPING 运算符;
- 有些 DBMS 尚未支持 GROUPING 运算符;

### GROUPING 运算符包含以下3种:
- ROLLUP
- CUBE
- GROUPING SETS

### 同时计算出合计值
- 使用 UNION 和 GROUP BY 将小计和合计值结合:
```
-- 使用 GROUP BY 计算小计:
SELECT shohin_bunrui, SUM(hanbai_tanka)
    FROM shop.shohin
GROUP BY shohin_bunrui;

-- 使用集合运算的 UNION 将合计与小计结合:
SELECT '合计' AS shohin_bunrui, SUM(hanbai_tanka)
    FROM shop.shohin
UNION ALL
SELECT shohin_bunrui, SUM(hanbai_tanka)
    FROM shop.shohin
GROUP BY shohin_bunrui;
```

#### ROLLUP: 同时计算出合计值和小计值
```
SELECT shohin_bunrui, SUM(hanbai_tanka) AS sum_tanka
    FROM shop.shohin
GROUP BY shohin_bunrui WITH ROLLUP;
```
```
-- GROUP BY 增加按照日期分组, 并进行小计、合计
SELECT shohin_bunrui, torokubi, SUM(hanbai_tanka) AS sum_tanka
    FROM shop.shohin
GROUP BY shohin_bunrui, torokubi WITH ROLLUP;
```

#### GROUPING 函数: 让 NULL 更容易分辨
- 该函数在超级分组记录所产生的 NULL 时返回 1, 其他情况返回 0;
- 这样就能判断出是超级分组记录中的 NULL 还是原始数据本身为 NULL;
- GROUPING 函数还能在超级分组记录的键值中插入字符串:  
    GROUPING 函数返回值为 1 时, 指定 “合计” 或 “小计”, 其他情况返回通常的列的值;
```
SELECT CASE WHEN GROUPING(shohin_bunrui) = 1 THEN '商品种类合计'
            ELSE shohin_bunrui
        END AS shohin_bunrui,
        CASE WHEN GROUPING(torokubi) = 1 THEN '登记日期合计'
            ELSE torokubi
        END AS torokubi,
        SUM(hanbai_tanka) AS sum_tanka
    FROM shop.shohin
GROUP BY shohin_bunrui, torokubi WITH ROLLUP;
```

#### CUBE: 用数据来搭积木
- **MYSQL 中不支持此函数;**
- 将 GROUP BY 子句中聚合键的“所有可能组合”的聚合结果集中到一起;
