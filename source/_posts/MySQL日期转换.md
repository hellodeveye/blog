---
title: MySQL日期转换
date: 2020-03-20 11:44:51
tags: MySQL
categories: MySQL
---
### 涉及的函数

date_format(date, format) 函数，MySQL日期格式化函数date_format()
unix_timestamp() 函数
str_to_date(str, format) 函数
from_unixtime(unix_timestamp, format) 函数，MySQL时间戳格式化函数from_unixtime


### 时间转字符串
```
select date_format(now(), '%Y-%m-%d');
#结果：2016-01-05
```

### 时间转时间戳
```
select unix_timestamp(now());
#结果：1452001082
```

### 字符串转时间
```
select str_to_date('2016-01-02', '%Y-%m-%d %H');
#结果：2016-01-02 00:00:00
```

### 字符串转时间戳
```
select unix_timestamp('2016-01-02');
#结果：1451664000
```

### 时间戳转时间
```
select from_unixtime(1451997924);
#结果：2016-01-05 20:45:24
```

### 时间戳转字符串
```
select from_unixtime(1451997924,'%Y-%d');
#结果：2016-01-05 20:45:24
```