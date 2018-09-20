---
title: CyclicBarrier
date: 2018-09-04 22:34:16
tags: JUC
categories: java
---
### 循环栅栏CyclicBarrier
&emsp;&emsp;`CyclicBarrier`是另外一种多线程并发控制工具，和`CountDownLatch`非常类似，它也可以实现线程间的计数等待，但它的功能比`CountDownLatch`更加复杂且强大。  

&emsp;&emsp;`CyclicBarrier`可以理解为循环栅栏。假如我们计数器设置为 10，那么凑齐第一批 10 个线程后，计数器就会归零，然后接着凑齐下一批 10 个线程，这就是循环栅栏的内在含义。
&emsp;&emsp;比`CountDownLatch`略微强大一些，`CyclicBarrier`可以接收一个参数为`barrierAction`。所谓`barrierAction`就是当计数器一次计数完成后，系统会执行的动作。如下构造函数，其中，`parties`表示计数总数，也就是参与的线程总数。
```
public CyclicBarrier(int parties, Runnable barrierAction)
```
下面演示`CyclicBarrier`的使用示例：
```
public class CyclicBarrierDemo {
    public static class Soldier implements Runnable {

        private String soldier;
        private final CyclicBarrier cyclicBarrier;

        Soldier(CyclicBarrier cyclicBarrier, String soldierName) {
            this.soldier = soldierName;
            this.cyclicBarrier = cyclicBarrier;
        }

        @Override
        public void run() {
            try {
                //等待所有列兵到齐
                cyclicBarrier.await();
                doWork();
                //等待所有士兵完成工作
                cyclicBarrier.await();
            } catch (Exception e) {
                e.getMessage();
            }   try {
                //这里可做其他业务
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        private void doWork() {
            try {
                Thread.sleep(Math.abs(new Random().nextInt() % 10000));
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(soldier + ":任务完成");
        }
    }

    public static class BarrierRun implements Runnable {
        boolean flag;
        int N;

        public BarrierRun(boolean flag, int N) {
            this.flag = flag;
            this.N = N;
        }

        @Override
        public void run() {
            if (flag) {
                System.out.println("司令：[士兵" + N + "个，任务完成]");
            } else {
                System.out.println("司令：[士兵" + N + "个，集合完成]");
                flag = true;
            }
        }
    }


    public static void main(String[] args) {
        final int N = 10;
        Thread[] allSoldier = new Thread[N];
        boolean flag = false;
        CyclicBarrier cyclicBarrier = new CyclicBarrier(N, new BarrierRun(flag, N));
        //设置屏障点，主要为了执行这个方法
        System.out.println("集合队伍！");
        for (int i = 0; i < N; i++) {
            System.out.println("士兵"+i+"报道！");
            allSoldier[i] = new Thread(new Soldier(cyclicBarrier,"士兵"+i));
            allSoldier[i].start();
        }
    }
}
// 控制台输出如下：
    集合队伍！
    士兵0报道！
    士兵1报道！
    士兵2报道！
    士兵3报道！
    士兵4报道！
    士兵5报道！
    士兵6报道！
    士兵7报道！
    士兵8报道！
    士兵9报道！
    司令：[士兵10个，集合完成]
    士兵9:任务完成
    士兵7:任务完成
    士兵5:任务完成
    士兵6:任务完成
    士兵8:任务完成
    士兵2:任务完成
    士兵1:任务完成
    士兵4:任务完成
    士兵0:任务完成
    士兵3:任务完成
    司令：[士兵10个，任务完成]
```
&emsp;&emsp;`CyclicBarrier.await()`方法可能会抛出两个异常。一个是`InterruptedException`，也就是在等待过程中，线程被中断，应该说这是一个非常通用的异常。大部分迫使线程等待的方法都有可能会抛出这个异常，使得线程在等待时依然可以响应外部紧急事件。另外一个异常是`CyclicBarrier`特有的`BrokenBarrierException`。一旦遇到这个异常，则表示当前`CyclicBarrier`已经破损了，可能系统已经没有办法等待所有线程到齐了，等待是没有结果的，就此打道回府吧。

