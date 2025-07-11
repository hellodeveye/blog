---
title: Nginx基本配置
date: 2019-01-18 10:50:25
tags: nginx
categories: nginx
---
### 1. Nginx 常用操作整理
#### 1.1 启动 Nginx
```
./sbin/nginx
```
#### 1.2 停止 Nginx
```
./sbin/nginx -s stop
./sbin/nginx -s quit
-s 都是采用向 Nginx 发送信号的方式。
```
#### 1.3 重载 Nginx
```
./sbin/nginx -s reload
```

#### 1.4 指定配置文件
```
./sbin/nginx -c /etc/nginx/nginx.conf
```
#### 1.5 配置语法检查
```
./sbin/nginx -t /etc/nginx/nginx.conf

常规用法： ./sbin/nginx -tc /etc/nginx/nginx.conf
```
### 2. 配置文件详解
Nginx配置文件的分块下，基本就分为以下几块：  
```
main # 全局设置
events { # Nginx工作模式
    ....
}
http { # http设置
    ....
    upstream myproject { # 负载均衡服务器设置
        .....
    }
    server  { # 主机设置
        ....
        location { # URL匹配
            ....
        }
    }
    server  {
        ....
        location {
            ....
        }
    }
    ....
}
```
#### 2.1 main模块
下面是一个main区域，它是一个全局的设置：
```
user nobody nobody;
worker_processes 2;
error_log /usr/local/var/log/nginx/error.log notice;
pid /usr/local/var/run/nginx/nginx.pid;
worker_rlimit_nofile 1024;
```
> user 来指定Nginx Worker进程运行用户以及用户组，默认由nobody账号运行。   
>
> worker_processes 来指定了Nginx要开启的子进程数。每个Nginx进程平均耗费10M~12M内存。根据经验，一般指定1个进程就足够了，如果是多核CPU，建议指定和CPU的数量一样的进程数即可。我这里写2，那么就会开启2个子进程，总共3个进程。
>  
> error_log 来定义全局错误日志文件。日志输出级别有debug、info、notice、warn、error、crit可供选择，其中，debug输出日志最为最详细，而crit输出日志最少。   
>
> pid 来指定进程id的存储文件位置。   
>
> worker_rlimit_nofile 来指定一个nginx进程可以打开的最多文件描述符数目，这里是65535，需要使用命令“ulimit -n 65535”来设置。   
#### 2.2 events模块
events模块来用指定nginx的工作模式和工作模式及连接数上限，一般是这样：  
```
events {
    use kqueue; #mac平台
    worker_connections  1024;
}
```
> use 用来指定Nginx的工作模式。Nginx支持的工作模式有select、poll、kqueue、epoll、rtsig和/dev/poll。其中select和poll都是标准的工作模式，kqueue和epoll是高效的工作模式，不同的是epoll用在Linux平台上，而kqueue用在BSD系统中，因为Mac基于BSD,所以Mac也得用这个模式，对于Linux系统，epoll工作模式是首选。   
>
> worker_connections 用于定义Nginx每个进程的最大连接数，即接收前端的最大请求数，默认是1024。最大客户端连接数由worker_processes和worker_connections决定，即Max_clients = worker_processes * worker_connections，在作为反向代理时，Max_clients变为：Max_clients = worker_processes * worker_connections / 4。   
>
> 进程的最大连接数受Linux系统进程的最大打开文件数限制，在执行操作系统命令“ulimit -n 65536”后worker_connections的设置才能生效。
#### 2.3 http模块
http模块可以说是最核心的模块了，它负责HTTP服务器相关属性的配置，它里面的server和upstream子模块，至关重要，等到反向代理和负载均衡以及虚拟目录等会仔细说。
```
http {
    include mime.types;
    default_type application/octet-stream;
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    access_log /usr/local/var/log/nginx/access.log  main;
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 10;
    #gzip on;
    upstream myproject {
        .....
    }
    server {
        ....
    }
}
```
##### 2.3.1 include
> 用来设定文件的mime类型,类型在配置文件目录下的mime.type文件定义，来告诉nginx来识别文件类型。
##### 2.3.2 default_type
> 设定了默认的类型为二进制流，也就是当文件类型未定义时使用这种方式，例如在没有配置asp的locate 环境时，Nginx是不予解析的，此时，用浏览器访问asp文件就会出现下载窗口了。
##### 2.3.3 log_format
> 用于设置日志的格式，和记录哪些参数，这里设置为main，刚好用于access_log来纪录这种类型。  
##### 2.3.4 access_log
> 用来纪录每次的访问日志的文件地址，后面的main是日志的格式样式，对应于log_format的main。
##### 2.3.5 sendfile
> 用于开启高效文件传输模式。将tcp_nopush和tcp_nodelay两个指令设置为on用于防止网络阻塞。
##### 2.3.6 keepalive_timeout
> 设置客户端连接保持活动的超时时间。在超过这个时间之后，服务器会关闭该连接。
#### 6.4 server模块
server模块是http的子模块，它用来定一个虚拟主机，我们先讲最基本的配置，这些在后面再讲。我们看一下一个简单的server是如何做的？  
```
server {
    listen 8080;
    server_name localhost 192.168.12.10 www.yangyi.com;
    # 全局定义，如果都是这一个目录，这样定义最简单。
    root   /Users/yangyi/www;
    index  index.php index.html index.htm;
    charset utf-8;
    access_log  usr/local/var/log/host.access.log  main;
    error_log  usr/local/var/log/host.error.log  error;
    ....
}
```
> server 标志定义虚拟主机开始。
>
> listen 用于指定虚拟主机的服务端口。
>
>server_name 用来指定IP地址或者域名，多个域名之间用空格分开。
>
> root 表示在这整个server虚拟主机内，全部的root web根目录。注意要和locate {}下面定义的区分开来。
>
> index 全局定义访问的默认首页地址。注意要和locate {}下面定义的区分开来。
>
> charset 用于设置网页的默认编码格式。
>
> access_log 用来指定此虚拟主机的访问日志存放路径，最后的main用于指定访问日志的输出格式。
#### 2.5 location模块
location模块是nginx中用的最多的，也是最重要的模块了，什么负载均衡啊、反向代理啊、虚拟域名啊都与它相关。   

location根据它字面意思就知道是来定位的，定位URL，解析URL，所以，它也提供了强大的正则匹配功能，也支持条件判断匹配，用户可以通过location指令实现Nginx对动、静态网页进行过滤处理。像我们的php环境搭建就是用到了它。   

##### 2.5.1 我们先来看这个，设定默认首页和虚拟机目录
```
location / {
    root   /Users/yangyi/www;
    index  index.php index.html index.htm;
}
```


> location / 表示匹配访问根目录。
>
> root 指令用于指定访问根目录时，虚拟主机的web目录，这个目录可以是相对路径（相对路径是相对于nginx的安装目录）。也可以是绝对路径。
>
> index 用于设定我们只输入域名后访问的默认首页地址，有个先后顺序：index.php index.html index.htm，如果没有开启目录浏览权限，又找不到这些默认首页，就会报403错误。


##### 2.5.2 location 还有一种方式就是正则匹配

下面这个例子是运用正则匹配来链接php。我们之前搭建环境也是这样做：
```
location ~ \.php$ {
    root           /Users/yangyi/www;
    fastcgi_pass   127.0.0.1:9000;
    fastcgi_index  index.php;
    include        fastcgi.conf;
}
```
> .php$ 熟悉正则的我们直到，这是匹配.php结尾的URL，用来解析php文件。里面的root也是一样，用来表示虚拟主机的根目录。
fastcgi_pass 链接的是php-fpm的地址。其他几个参数我们以后再说。
>
> location 还有其他用法，等讲到实例的时候，再看吧。

#### 2.6 upstream模块
upstream 模块负责负载均衡模块，通过一个简单的调度算法来实现客户端IP到后端服务器的负载均衡。先学习怎么用，具体的使用实例以后再说。
```
upstream deveye.cn{
    ip_hash;
    server 192.168.12.1:80;
    server 192.168.12.2:80 down;
    server 192.168.12.3:8080  max_fails=3  fail_timeout=20s;
    server 192.168.12.4:8080;
}
```
在上面的例子中，通过upstream指令指定了一个负载均衡器的名称iyangyi.com。这个名称可以任意指定，在后面需要的地方直接调用即可。里面是ip_hash这是其中的一种负载均衡调度算法，下面会着重介绍。紧接着就是各种服务器了。用server关键字表识，后面接ip。  
**Nginx的负载均衡模块目前支持4种调度算法：**


1. weight 轮询（默认）。每个请求按时间顺序逐一分配到不同的后端服务器，如果后端某台服务器宕机，故障系统被自动剔除，使用户访问不受影响。weight，指定轮询权值，weight值越大，分配到的访问机率越高，主要用于后端每个服务器性能不均的情况下。  

2. ip_hash。每个请求按访问IP的hash结果分配，这样来自同一个IP的访客固定访问一个后端服务器，有效解决了动态网页存在的session共享问题。   

3. fair（第三方）。比上面两个更加智能的负载均衡算法。此种算法可以依据页面大小和加载时间长短智能地进行负载均衡，也就是根据后端服务器的响应时间来分配请求，响应时间短的优先分配。Nginx本身是不支持fair的，如果需要使用这种调度算法，必须下载Nginx的upstream_fair模块。

4. url_hash（第三方）。按访问url的hash结果来分配请求，使每个url定向到同一个后端服务器，可以进一步提高后端缓存服务器的效率。Nginx本身是不支持url_hash的，如果需要使用这种调度算法，必须安装Nginx的hash软件包。  


在HTTP Upstream模块中，可以通过server指令指定后端服务器的IP地址和端口，同时还可以设定每个后端服务器在负载均衡调度中的状态。常用的状态有：


1. down，表示当前的server暂时不参与负载均衡。  

2. backup，预留的备份机器。当其他所有的非backup机器出现故障或者忙的时候，才会请求backup机器，因此这台机器的压力最轻。

3. max_fails，允许请求失败的次数，默认为1。当超过最大次数时，返回proxy_next_upstream 模块定义的错误。  

4. fail_timeout，在经历了max_fails次失败后，暂停服务的时间。max_fails可以和fail_timeout一起使用。


*注意：当负载调度算法为ip_hash时，后端服务器在负载均衡调度中的状态不能是weight和backup。*

> 转载自 ：[https://www.jianshu.com/p/f04733896a48](https://www.jianshu.com/p/f04733896a48)
