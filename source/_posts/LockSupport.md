---
title: LockSupport
date: 2018-09-05 07:26:05
tags: JUC
categories: java
---
### 线程阻塞工具类：LockSupport
&emsp;&emsp;`LockSupport`是一个非常方便实用的线程阻塞工具，它可以在线程内任意位置让线程阻塞。和`Thread.suspend()`相比，它弥补了由于`resume()`在前发生，导致线程无法继续执行的情况。和`Object.wait()`相比，他不需要先获得某个对象的锁，也不会抛出`InterrupterException`异常。  
&emsp;&emsp;`LockSupport`的静态方法`park()`可以阻塞当前线程，类似的还有`parkNanos()、parkUntil()`等方法。它们实现了一个限时的等待。  
&emsp;&emsp;除了有定时阻塞的功能外，`LockSupport.park()`还能支持中断响应，但和其他接收中断的函数很不一样，`LockSupport.park()`不会抛出`InterruptedException`异常。他只是会默默的返回，但是我们可以从`Thread.interrupted()`等方法获得中断标记。
下面是`LockSupport`使用示例：
```
public class LockSupportDemo {
    public static Object u = new Object();

    public static ChangeObjectThread t1 = new ChangeObjectThread("t1");
    public static ChangeObjectThread t2 = new ChangeObjectThread("t2");

    public static class ChangeObjectThread extends Thread {
        public ChangeObjectThread(String name) {
            super.setName(name);
        }

        @Override
        public void run() {
            synchronized (u) {
                System.out.println("in " + getName());
                LockSupport.park();
                if (Thread.interrupted()) {
                    System.out.println(getName() + " 被中断了");
                }
            }
            System.out.println(getName() + " 执行结束");
        }

    }

    /**
     * LockSupport支持中断响应  中断处于park()状态的T1 ，可以马上响应这个中断，并立即返回
     * @param args
     * @throws InterruptedException
     */
    public static void main(String[] args) throws InterruptedException {
        t1.start();
        Thread.sleep(100);
        t2.start();
        t1.interrupt();
        LockSupport.unpark(t2);
    }

}
// 执行结果：
  in t1
  t1 被中断了
  t1 执行结束
  in t2
  t2 执行结束
```
&emsp;&emsp;上述代码`t1.interrupt()`，中断了处于`park()`状态的 t1。之后，t1 可以马上响应这个中断，并且返回。之后在外边等待的 t2 才可以进入临界区，并最终由`LockSupport.unpark(t2)`操作使其运行结束。
  
> How happy we are to meet friends from afar.  
> 有朋自远方来，不亦乐乎！

