---
title: Linux常用命令
date: 2020-09-27 15:52:43
tags: Linux
categories: Linux
---
## grep
查看配置文件只匹配不是以“#”开头的行
```shell
 cat .zshrc | grep -v "^#" > profile.txt
```

```shell
grep -A 200 -B 20 "BadSqlGrammarException" ai-server.log
grep -B 20 "BadSqlGrammarException" ai-server.log
```

使用`tail`查看指定行以后的N行日志
```shell
tail -n +358653 catalina.2021-01-12.out|head -n 20
```

## hash

```shell
hash 显示hash缓存
hash –l 显示hash缓存，加参数-l既可以看到hash表命令的路径，也可以看到它的名字，说不定会有别名
hash –p path name 将命令全路径path起别名为name
hash –t name 显示指定命令的完整路径
hash –d name 清除name缓存
hash –r 清除缓存
```
## awk
查询指定日志行数

```shell
awk '/error/{print; for(i=1; i<=10; i++) {getline; print}}' ai-server.log
```