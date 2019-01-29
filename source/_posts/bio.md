---
title: BIO
date: 2019-01-29 15:46:57
tags: BIO
categories: java
---
**基本概念：**   
&emsp;&emsp;网络编程的基本模型是C/S模型，即两个进程间的通信。  
&emsp;&emsp;服务端提供IP和监听端口，客户端通过连接操作想服务端监听的地址发起连接请求，通过三次握手连接，如果连接成功建立，双方就可以通过套接字进行通信。   
&emsp;&emsp;传统的同步阻塞模型开发中，ServerSocket负责绑定IP地址，启动监听端口；Socket负责发起连接操作。连接成功后，双方通过输入和输出流进行同步阻塞式通信。

**BIO 通信模型如下所示：**

![](/img/bio.PNG)

**同步阻塞式I/O创建的Server源码：**   
```
public class Server {

    private static ServerSocket serverSocket;
    private static Socket socket;
    private static ExecutorService executeService = Executors.newCachedThreadPool();

    static {
        try {
            serverSocket = new ServerSocket(8080);
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    public static void main(String[] args) throws IOException {

        System.out.println("#############服务端已启动#################");

        while (true){
            socket = serverSocket.accept(); // 这就是bio同步阻塞
            Handler handler = new Handler(socket);// 创建一个任务
            executeService.execute(handler);// 任务交给线程池
        }
    }
}
```

```
public class Handler implements Runnable {

    private Socket socket;

    private InputStream inputStream;


    private OutputStream outputStream;


    public Handler (Socket socket){
        this.socket = socket;
    }

    @Override
    public void run() {
        try {

            //获取输入流
            inputStream = socket.getInputStream();

            //获取输出流
            outputStream = socket.getOutputStream();

            //创建一个缓冲区
            byte[] buffer = new byte[1024];

            //读取数据
            inputStream.read(buffer);

            String str = new String(buffer, "utf-8");

            //输出当前线程ID和缓冲区数据
            System.err.println("from client info:" + str + "thread:" + Thread.currentThread().getId());

            //服务端返回收到的数据
            String server = new String("from server：" + str);

            //数据编码转换
            Charset charset = Charset.forName("utf-8");

            //睡眠100毫秒
            TimeUnit.MILLISECONDS.sleep(100);

            //将数据转换成字节流格式
            byte[] bytes = server.getBytes(charset);

            //写入数据
            outputStream.write(bytes);

            //清空数据
            outputStream.flush();

        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }finally {
            try {
                outputStream.close();

                inputStream.close();
            } catch (IOException e) {
                e.printStackTrace();
            }

        }
    }
}
```

```
public class Client {

    private static Socket socket;

    private static InputStream inputStream;

    private static OutputStream outputStream;


    public static void main(String[] args) throws IOException, InterruptedException {

        //开始时间
        long begin = System.currentTimeMillis();

        //发送五百次数据
        for (int i = 0; i < 10; i++) {

            //创建Socket
            socket = new Socket("127.0.0.1", 8080);

            //获取输出流
            outputStream = socket.getOutputStream();

            //输出字符串
            String str = "client -" + i;

            //字符集转换
            Charset charset = Charset.forName("utf-8");

            //将字符串转换成字节流
            byte[] buffer = str.getBytes(charset);

            //写入数据
            outputStream.write(buffer);

            //清空数据
            outputStream.flush();

            //获取服务端返回的数据
            inputStream = socket.getInputStream();

            //创建缓冲区
            byte[] fromServer = new byte[1024];

            //获取长度
            int ren = inputStream.read(fromServer);

            int len = fromServer.length;

            String s = new String(fromServer, "utf-8");

            System.out.println(" ren:" + ren + " len:" + len + " s:" + s);

            outputStream.close();

            inputStream.close();

            inputStream = null;

            outputStream = null;

            socket.close();

            socket = null;

            fromServer = null;
        }
        long end = System.currentTimeMillis();

        long total = end - begin;

        System.out.println("Client-total:" + total);
    }

}
```
