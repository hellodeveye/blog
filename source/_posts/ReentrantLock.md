---
title: ReentrantLock
author: kim
date: 2018-08-31 07:35:32
tags: JUC
categories:
- java
---
### synchroized 的功能扩展：重入锁
重入锁使用`java.util.concurrent.locks.ReetrantLock`类实现。
ReetrantLock 的几个重要方法如下：
- lock(): 获得锁，如果锁已经被占用，则等待。
- lockInterruptibly(): 获得锁，但优先响应中断。
- tryLock(): 尝试获得锁，如果成功返回 true ，失败返回 false 。该方法不等待，立即返回。
- tryLock(long time, TimeUnit unit): 在给定时间内尝试获得锁。
- unlock(): 释放锁。
下面是重入锁的简单案列:

```
import java.util.concurrent.locks.ReentrantLock;

public class ReenterLock implements Runnable {

    public static ReentrantLock lock = new ReentrantLock();
    public static int i = 0;

    @Override
    public void run() {
        for (int j = 0; j< 1000000;j++){
            lock.lock();
            try {
                i++;
            }finally {
                lock.unlock();
            }
        }
    }

    public static void main(String[] args) throws InterruptedException {
        ReenterLock reenterLock = new ReenterLock();
        Thread t1 = new Thread(reenterLock);
        Thread t2 = new Thread(reenterLock);
        t1.start();
        t2.start();
        t1.join();
        t2.join();
        System.out.println(i);

        // 运行结果： 2000000
    }
}
```
从这段代码可以看出，重入锁有着显示的操作过程。开发人员必须手动指定何时加锁，何时释放锁。也正是因为这样，重入锁对逻辑控制的灵活性要远
远好于 `synchroized`。但值得注意的是，在退出临界区是，必须记得释放锁，否则其他线程再没有机会访问临界区了。  
 ### 中断响应  
 对于`synchroized`来说，如果一个线程在等待锁，那么结果只有两种情况，要么它获得这把锁继续执行，要么它就保持等待。
 而使用重入锁，则提供另外一种可能，那就是线程可以响应中断。也就是在等待锁的过程中，程序可以根据需要取消对锁的请求。
### 锁申请等待限时
除了等待外部通知之外，要避免死锁还有另外一种方法，那就是限时等待。  
`tryLock()` 方法接收两个参数，一个表示等待时长，另外一个表示计时单位。`ReentrantLock.tryLock()` 方法也可以不带参数直接运行。在这种
情况下，当前线程会尝试获得锁，如果锁并未被其他线程占用，则申请锁会成功，并立即返回 `true` 。如果锁被其他线程占用，则当前线程不会进行等，
而是立即返回 `false`。这种模式不会引起线程等待，因此也不会产生死锁。  
### 公平锁
在大多数情况下，锁的申请都是非公平的。而重入锁允许我们对其公平性进行设置。他有一个如下的构造函数：   
```
public ReentrantLock(boolean fair)
```
当参数fair 为true 时，表示公平锁。   
公平锁的一个大特点时：它不会产生饥饿现象。只要你排队，最终还是可以等到资源的。如果我们使用`synchroized`关键字进行锁控制，那么产生的锁就是非公平的。

