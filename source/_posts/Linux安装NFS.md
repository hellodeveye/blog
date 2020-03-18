---
title: Linux安装NFS
date: 2019-07-18 17:44:26
tags: Linux
categories: Linux
---

#### 什么是NFS？
NFS就是Network File System的缩写，它最大的功能就是可以通过网络，让不同的机器、不同的操作系统可以共享彼此的文件。  
NFS服务器可以让PC将网络中的NFS服务器共享的目录挂载到本地端的文件系统中，而在本地端的系统中来看，那个远程主机的目录就好像是自己的一个磁盘分区一样，在使用上相当便利；  
NFS一般用来存储共享视频，图片等静态数据。
### 1.安装
查看服务器是否已经安装 `nfs` 以及 `rpcbind`
```
# 查看是否安装nfs
[root@localhost ~]# rpm -qa | grep nfs

# 查看是否安装 rpcbind
[root@localhost ~]# rpm -qa | grep rpcbind
```
如果未安装，则安装这两个软件：
```
[root@localhost ~]# yum install -y nfs-utils
[root@localhost ~]# yum install -y rpcbind
```
> 注意：先启动rpc服务，再启动nfs服务

```
[root@localhost ~]# systemctl start rpcbind.service
[root@localhost ~]# systemctl start nfs.service
```
### 2.在主服务器上配置/etc/exports 文件，添加需要挂载的文件目录：
| 参数   |      作用      |
|----------|:-------------:|
| ro | 只读 |
| rw | 读写 |
| root_squash | 当NFS客户端以root管理员访问时，映射为NFS服务器的匿名用户 |
| no_root_squash | 当NFS客户端以root管理员访问时，映射为NFS服务器的root管理员 |
| all_squash | 	无论NFS客户端使用什么账户访问，均映射为NFS服务器的匿名用户 |
| sync | 	同时将数据写入到内存与硬盘中，保证不丢失数据 |
| async | 优先将数据保存到内存，然后再写入硬盘；这样效率更高，但可能会丢失数据 |
```
# 如果有多个目录依次添加
/kim/nfs/test1    192.168.1.2(ro,no_root_squash,no_all_squash,sync)
/kim/nfs/test2    192.168.1.2(ro,no_root_squash,no_all_squash,sync)
```
### 3.启动服务和设置开启启动
```
#先启动rpc服务
[root@localhost ~]# systemctl start rpcbind
#设置开机启动
[root@localhost ~]# systemctl enable rpcbind
[root@localhost ~]# systemctl start nfs-server nfs-secure-server
#启动nfs服务和nfs安全传输服务
[root@localhost ~]# systemctl enable nfs-server nfs-secure-server
#配置防火墙放行nfs服务
[root@localhost /]# firewall-cmd --permanent --add-service=nfs
[root@localhost /]# firewall-cmd --reload
```
### 4.客户端挂载配置
使用`showmount`命令查看nfs服务器共享信息。输出格式为“共享的目录名称 允许使用客户端地址”
```
[root@localhost ~]# showmount -e 192.168.1.1
Export list for 192.168.1.1:
/kim/nfs/test1 192.168.1.2
```

**showmount** 命令的用法：

| 参数   |    作用    |
|----------|:-------------:|
| -e | 显示NFS服务器的共享列表 |
| -a | 显示本机挂载的文件资源的情况NFS资源的情况 |
| -v | 显示版本号 |

```
# 其中 IP 192.168.1.1 为主服务器， IP 192.168.1.1 为从服务器
mount -t nfs 192.168.1.1:/kim/nfs/test1 /kim/test
```
### 5.其他
假如挂载失效了，首先需要卸载客户端服务器的挂载目录：
```
# 执行延迟卸载（延迟卸载（lazy unmount）会立即卸载目录树里的文件系统，等到设备不再繁忙时才清理所有相关资源。）
[root@localhost ~]# umount -vl /kim/test
```
然后重启主服务器的`nfs` 服务：
```
[root@localhost ~]# systemctl start rpcbind.service
[root@localhost ~]# systemctl start nfs.service
```

