---
title: Docker安装mysql
date: 2019-10-20 23:28:08
tags: Docker
categories: Docker
---
#### 1. 拉取mysql 镜像

```
docker pull mysql
```

#### 2.创建mysql 容器

```
docker run -d --name mysql \
-p 3306:3306 \
-e MYSQL_ROOT_PASSWORD=123456 mysql
```

`-p`：代表端口映射，格式为宿主机映射端口:容器运行端口
`-e`： 代表添加环境变量MYSQL_ROOT_PASSWORD是root用户的登录密码

#### 3.进入mysql容器，登录mysql
```
docker exec -it mysql /bin/bash
```
- 登录mysql
```
mysql -u root -p
```
- 授权(注意mysql 8.0跟之前的授权方式不同)
```
GRANT ALL ON *.* TO 'root'@'%';
```
- 刷新权限
```
flush privileges
```
- 更改加密规则
```
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY '123456';
```
- 刷新权限
```
flush privileges;
```
