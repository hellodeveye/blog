---
title: Mysql 分区表简单使用
date: 2018-08-28 09:37:18
tags: mysql
categories: mysql
---
## Mysql分区表

### 一、按HASH分区（HASH）
**HASH分区特点**  
- 根据MOD（分区键，分区数）的值把数据行存储到表的不同分区中  
- 数据可以平均的分布在各个分区中  
- HASH分区的键值必须是一个`INT`类型的值，或者是通过函数可以转为`INT`类型  

**如何建立按HASH分区：**
```
    CREATE TABLE 'sys_test'(
        `user_id` INT(10) UNSIGNED NOT NULL,
        `username` VARCHAR(10) NOT NULL,
        `created` TIMESTAMP NOT NULL,
        `user_type` TINYINT(4) NOT NULL
    )ENGINE = INNODB
    PARTITION BY HASH(user_id)
    PARTITIONS 4;
```
### 二、按范围分区（RANGE）
**如何建立按RANGE分区：**
```
    CREATE TABLE 'sys_test'(
        `user_id` INT(10) UNSIGNED NOT NULL,
        `username` VARCHAR(10) NOT NULL,
        `created` TIMESTAMP NOT NULL,
        `user_type` TINYINT(4) NOT NULL
    )ENGINE = INNODB
    PARTITION BY RANGE(user_id)(
        PARTITION p0 VALUES LESS THAN (10000),
        PARTITION p1 VALUES LESS THAN (20000),
        PARTITION p2 VALUES LESS THAN (30000),
        PARTITION p3 VALUES LESS THAN MAXVALUE
    );
```
### 三、LIST分区
- 按分区键取值的列表进行分区
- 同范围分区一样，各分区的列表值不能重复
- 每一行数据必须能找到对应的分区表，否则数据插入失败    
**如何建立按RANGE分区：**
```
    CREATE TABLE 'sys_test'(
        `user_id` INT(10) UNSIGNED NOT NULL,
        `username` VARCHAR(10) NOT NULL,
        `created` TIMESTAMP NOT NULL,
        `user_type` TINYINT(4) NOT NULL
    )ENGINE = INNODB
    PARTITION BY RANGE(user_type)(
        PARTITION p0 VALUES LESS THAN (1,3,5,7,9),
        PARTITION p1 VALUES in (2,4,6,8)
    );
```
### 四、KEY分区
- 按照Key进行分区非常类似于按照Hash进行分区，只不过Hash分区允许使用用户自定义的表达式  
- Key分区不允许使用用户自定义的表达式，需要使用MySQL服务器提供的HASH函数  
- Hash分区只支持整数分区，而Key分区支持使用BLOB或Text类型外其他类型的列作为分区键   
**如何建立按RANGE分区：**
```
    CREATE TABLE 'sys_test'(
        `user_id` INT(10) UNSIGNED NOT NULL,
        `username` VARCHAR(10) NOT NULL,
        `created` TIMESTAMP NOT NULL,
        `user_type` TINYINT(4) NOT NULL
    )ENGINE = INNODB
    PARTITION BY KEY(user_id)
    PARTITIONS 4;
```
### 总结
**使用分区表的注意事项：**
- 结合业务场景选择分区键，避免跨分区查询
- 对分区表进行查询最好在`where`从句中包含分区键
- 具有主键或唯一索引的表，主键或唯一索引必须是分区表的一部分