---
title: ReentrantReadWriteLock
date: 2018-09-04 08:34:39
tags: JUC
categories: java
---
### ReadWriteLock读写锁
`ReadWriteLock` 是JDK5中提供的读写分离锁。读写分离锁可以有效地帮助减少锁竞争，以提升系统性能。用锁分离的机制来提升性能非常容易理解，比如线程 A1、A2、A3进行写操作，B1、B2、B3进行读操作，如果使用重入锁或内部锁，则理论上说所有读之间、读写之间、写和写之间都是穿行操作。当B1进行读取时，B2、B3则需要等待锁。由于读操作并不对数据的完整性造成破坏，这种等待显然是不合理的。因此，读写锁就有了发挥功能的余地。  

|| 读 | 写 |
|:-:|:-:|:-:|
| 读 |  非阻塞 | 阻塞 |
| 写 |  阻塞  | 阻塞 |  
- 读-读不互斥： 读读之间不阻塞。  
- 读-写互斥： 读阻塞写，写也会阻塞读。  
- 写-写互斥：写写阻塞。  

如果系统中，读操作次数远远大于写操作，则读写锁就可以发挥最大的功效，提升系统的性能。示例如下：  
```
public class ReadWriteLockDemo {

    private static Lock lock = new ReentrantLock();

    private static ReentrantReadWriteLock readWriteLock = new ReentrantReadWriteLock();

    private static Lock readLock = readWriteLock.readLock();

    private static Lock writeLock = readWriteLock.writeLock();

    private int value;

    public Object handleRead(Lock lock) throws InterruptedException {
        try {
            lock.lock(); //模拟读操作
            Thread.sleep(1000); //读操作耗时越多，读写锁的优势越明显
            System.out.println(Thread.currentThread().getId()+"读操作");
            return value;
        } finally {
            lock.unlock();
        }
    }

    public void handleWrite(Lock lock, int index) throws InterruptedException {
        try {
            lock.lock(); //模拟写操作
            Thread.sleep(1000);
            System.out.println(Thread.currentThread().getId()+"写操作");
            value = index;
        } finally {
            lock.unlock();
        }
    }


    public static void main(String[] args) {
        long start = System.currentTimeMillis();
        final ReadWriteLockDemo demo = new ReadWriteLockDemo();
        ExecutorService exec = Executors.newFixedThreadPool(50);
        Runnable readRunnable = new Runnable() {
            @Override
            public void run() {
                try {
                    demo.handleRead(readLock);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        };

        Runnable writeRunnable = new Runnable() {
            @Override
            public void run() {
                try {
                    demo.handleWrite(writeLock, new Random().nextInt());
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        };

        for (int i = 0; i < 18; i++) {
            exec.submit(readRunnable);

        }

        for (int i = 0; i < 20; i++) {
            exec.submit(writeRunnable);
        }
        exec.shutdown();
    }
}
```

