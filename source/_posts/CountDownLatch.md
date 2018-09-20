---
title: CountDownLatch
date: 2018-09-04 21:52:18
tags: JUC
categories: java
---
### 倒计时器：CountDownLatch

&emsp;&emsp;`CountDownLatch`是一个非常实用的多线程控制工具类，这个工具通常用来控制线程等待，它可以让某一个线程等待直到倒计时结束，再开始执行。  
`CountDownLatch`的构造函数接收一个整数作为参数，即当前这个计数器的计数个数。
```
public CountDownLatch(int count)
```
下面这个例子演示`CountDownLatch`的使用：
```
public class CountDownLatchDemo implements Runnable {

    static CountDownLatchDemo countDownLatchDemo = new CountDownLatchDemo();

    static CountDownLatch end = new CountDownLatch(10);

    @Override
    public void run() {
        try {
            Thread.sleep(new Random().nextInt(10) * 1000);
            System.out.println(Thread.currentThread().getName() + "检查完成");
            end.countDown();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }


    public static void main(String[] args) throws InterruptedException {
        ExecutorService executor = Executors.newFixedThreadPool(10);
        for (int i = 0; i < 10; i++) {
            executor.submit(countDownLatchDemo);
        }
        end.await();
        System.out.println("全部线程准备就绪");
        executor.shutdown();

    }
}
```
&emsp;&emsp;上述代码初始化一个`CountDownLatch`实例，计数数量为10。这表示需要有10个线程完成任务，在等待`CountDownLatch`上的线程才能继续执行。代码中使用了`CountDownLatch.countDown()`方法，也就是通知`CountDownLatch`，一个线程已经完成了任务，倒计时器可以减 1 啦，在下边代码中使用了`CountDownLatch.await()`方法，要求主线程等待所有 10 个检查任务全部完成，待 10 个任务全部完成后主线程才能继续执行。   
&emsp;&emsp;主线程在`CountDownLatch`上等待，当所有检查任务全部完成后，主线程方能继续执行。

