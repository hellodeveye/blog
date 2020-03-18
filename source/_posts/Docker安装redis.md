---
title: Docker安装redis
date: 2019-10-20 23:23:05
tags: Docker
categories: Docker
---
##### 1. 拉取redis 镜像
```
docker pull redis
```
##### 2.创建redis 本地配置文件

* 去redis官网下载redis，获取redis.conf文件
* 修改redis.conf文件相关配置，主要修改如下：

```
daemonize no #用守护线程的方式启动
bind 192.168.1.1 #注释掉这部分，使redis可以外部访问
requirepass yourpassword #给redis设置密码
appendonly yes #redis持久化
tcp-keepalive 5 #防止出现远程主机强迫关闭了一个现有的连接的错误
```

- 在`/root/redis/data` 创建好文件夹用户存放redis数据，这个文件夹位置可自定义。然后将配置好的reids.conf文件复制`/root/redis/`文件夹下。

##### 3.docker 启动redis

```
docker run -p 6379:6379 --name redis \
-v /root/redis/redis.conf:/etc/redis/redis.conf \
-v /root/redis/data:/data \
-d redis:latest redis-server /etc/redis/redis.conf --appendonly yes
```

启动命令解释如下：

`-p 6379:6379`：把容器内的6379端口映射到宿主机6379端口   
`-v /root/redis/redis.conf:/etc/redis/redis.conf`：把宿主机配置好的redis.conf放到容器内的这个位置中   
`-v /root/redis/data:/data`：把redis持久化的数据在宿主机内显示，做数据备份   
redis-server /etc/redis/redis.conf：这个是关键配置，让redis不是无配置启动，而是按照这个redis.conf的配置启动   
`--appendonly yes`：redis启动后数据持久化
