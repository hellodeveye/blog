---
title: Semaphore
date: 2018-09-03 22:41:42
tags: JUC
categories: java
---
### 允许多个线程同时访问： 信号量（Semaphore）   
信号量为多线程协作提供了更为强大的控制方法。广义上说，信号量是对锁的扩展。无论是内部锁`synchronized`还是重入锁`ReentrantLock`，一次都只允许一个线程访问一个资源，而信号量却可以指定多个线程，同时访问某一个资源。信号量主要提供以下构造函数：  
```
public Semaphore(int permits)

public Semaphore(int permits, boolean fair)  //第二个参数可以指定是否公平锁
```
在构造信号量对象时，必须要制定信号量的准入数，即同时能申请多少个许可。当每个线程每次只申请一个许可时，这就相当于指定了同时有多少个线程可以访问某一个资源。信号量的主要逻辑方法有：  
```
public void acquire() 

public void acquireUninterruptibly()

public boolean tryAcquire()

public boolean tryAcquire(long timeout, TimeUnit unit)

public void release()
```
`acquire()`方法尝试获得一个准入的许可。若无法获得，则线程会等待，直到有线程释放一个许可或者当前线程被中断。`acquireUninterruptibly()` 方法和`acquire()`方法类似，但是不响应中断。`tryAcquire()`尝试获得一个许可，如果成功返回`true`，失败则返回`false`，他不会进行等待，立即返回。`release()`用于在线程访问资源结束后，释放一个许可，以使其他等待许可的线程可以进行资源访问。  
下面是一个例子：
```
public class SemapDemo implements Runnable {

    final Semaphore semp = new Semaphore(5);

    @Override
    public void run() {
        try {
            semp.acquire();
            //模拟耗时操作
            Thread.sleep(2000);
            System.out.println(Thread.currentThread().getId() + ":done!");
            semp.release();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        ExecutorService exec = Executors.newFixedThreadPool(20);
        final SemapDemo semapDemo = new SemapDemo();
        for (int i = 0; i < 20; i++) {
            exec.submit(semapDemo);
        }
    }
}
```

申请信号量使用`acquire()`操作，在离开时，务必使用`release()`释放信号量。这就和释放锁一个道理，如果不幸发生信号量的泄露（申请了但没有释放），那么可以进入临界区的线程数量就会越来越少，直到所有的线程均不可访问。

