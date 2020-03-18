---
title: Docker安装nginx
date: 2019-10-20 23:29:02
tags: Docker
categories: Docker
---
#### 1. 拉取nginx 镜像
```
docker pull nginx
```
#### 2. 创建nginx 文件存放目录

```
mkdir -p ~/nginx/www ~/nginx/logs ~/nginx/conf
```
- www目录将映射为nginx容器配置的虚拟目录

- logs目录将映射为nginx容器的日志目录

- conf目录里的配置文件将映射为nginx容器的配置文件

#### 3. 创建nginx 容器

```
docker run -p 80:80 --name nginx \
-v $PWD/www:/www \
-v $PWD/conf/nginx.conf:/etc/nginx/nginx.conf \
-v $PWD/logs:/wwwlogs  \
-d nginx  
```
命令说明：

`-p 80:80`：将容器的80端口映射到主机的80端口

`--name nginx`：将容器命名为nginx

`-v $PWD/www:/www`：将主机中当前目录下的www挂载到容器的/www

`-v $PWD/conf/nginx.conf:/etc/nginx/nginx.conf`：将主机中当前目录下的nginx.conf挂载到容器的/etc/nginx/nginx.conf

`-v $PWD/logs:/wwwlogs`：将主机中当前目录下的logs挂载到容器的/wwwlogs
