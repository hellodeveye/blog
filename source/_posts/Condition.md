---
title: Condition
date: 2018-09-03 07:32:09
tags: JUC
categories: java
---
## 重入锁的好搭档：Condition条件
它和`Object.wait()` 和 `Object.notify()`方法的作用是大致相同的。但是wait() 和 notify() 方法是和`synchronized`关键字合作使用的。而`Condition` 是与重入锁相关联的。通过`Lock`接口 （重入锁就实现了这一接口）的`Condition newCondition()` 方法可以生成一个与当前重入锁绑定的`Condition`实例。利用`Condition`对象，我们就可以让线程在合适的时间等待，或者在某一个特定的时刻得到通知，继续执行。  
Condition接口提供的基本方法如下：  
```
void await() throws InterruptedException;

void awaitUninterruptibly();

long awaitNanos(long nanosTimeout) throws InterruptedException;

boolean await(long time, TimeUnit unit) throws InterruptedException;

boolean awaitUntil(Date deadline) throws InterruptedException;

void signal();

void signalAll();
```
以上方法含义如下：
- `await()`方法会使当前线程等待，同时释放当前锁，当其他线程使用 `signal()` 或者 `signalAll()`方法时，线程会重新获得锁并继续执行。或者当前线程被中断时，也能跳出等待。这和`Object.wait()`方法很相似。

- `awaitUninterruptibly()` 方法与`await()` 方法基本相同。但是他并不会在等待过程中响应中断。

- `signal()` 方法用于唤醒一个在等待中的线程。相对的`signalAll()`方法会唤醒所有在等待中的线程。这和`Object.notify()`方法很类似。  

下面简单演示Condition的功能：  

```
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

public class ReenterLockCondition implements Runnable {

    public static ReentrantLock lock = new ReentrantLock();
    public static Condition condition = lock.newCondition();


    @Override
    public void run() {
        try {
            lock.lock();
            condition.await();
            System.out.println("线程执行。。。");
        }catch (InterruptedException e){
            e.printStackTrace();
        }finally {
            lock.unlock();
        }

    }

    public static void main(String[] args) throws InterruptedException {
        ReenterLockCondition t1 = new ReenterLockCondition();
        Thread thread = new Thread(t1);
        thread.start();
        Thread.sleep(2000);
        //通知线程t1继续执行
        lock.lock();
        condition.signal();
        lock.unlock();
    }
}
```
和`Object.wait()`和`notify()`方法一样，当前线程使用`Condition.await()`时，要求线程持有相关的重入锁，在`Condition.await()`调用后，这个线程会释放这把锁。同理，在`Condition.signal()`方法调用时，也要求线程获得相关锁。在`signal()`方法调用后，系统会从当前`Condition`对象的等待队列中，唤醒一个线程。一旦线程被唤醒，它会重新尝试获得与之绑定的重入锁，一旦成功获取，就可以继续执行了。因此，在`signal()`方法调用后，一般需要释放相关的锁，谦让给被唤醒的线程，他就可以继续执行。

