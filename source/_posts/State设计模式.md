---
title: State设计模式
date: 2019-02-27 11:08:44
cover: /img/485120-learn-to-code.jpg
tags: desin pattern
categories: java
---
**状态模式**是一个**行为**的设计模式。根据GoF定义，状态**允许对象在其内部状态改变时改变其行为。**    

从上面的定义可以得出，**每个对象的状态都应该有一个单独的具体类。** 每个具体的状态对象都具有接受或拒绝状态转换请求的逻辑，该请求基于它作为方法参数传递给它的当前状态和上下文信息。  

### 1.何时使用状态模式
在任何应用程序中，当我们处理一个 **在其生命周期中可能处于不同状态的对象** 以及它如何根据它的当前状态处理传入请求（或进行状态转换）时，我们可以使用状态模式。  

如果在需要进行大量逻辑判断的代码中，使用 ```if/else``` 会使得代码变得非常臃肿并且难以维护。而状态设计模式可以很好的解决这一问题，并且我们可以在不同的类中定义特定于状态的行为。

> 状态模式解决了当对象在其内部状态改变时应该改变其行为的问题。此外，添加新状态不应影响现有状态的行为。  

### 2.状态模式在日常中的列子

- 发快递的时候快递信息会有不同的状态信息："已发货->已揽收->....->确认收货"。  
- 另一个例子可以是Java线程状态。线程可以是其生命周期中的五种状态之一。它的下一个状态只有在获得当前状态后才能确定。例如，我们无法启动已停止的线程，或者我们无法让线程等待，直到它开始运行。  

### 3.状态模式的实现
定义单独的（状态）对象，这些对象封装每个状态的特定于状态。也就是说，定义用于执行特定状态的行为的接口（状态），并创建接口的实现类。

#### 3.1 UML
![](/img/State-1.png)

#### 3.2 主要的类
- State - 接口定义每个状态必须处理的操作。   
- State实现类 - 包含状态特定行为的类。   
- Context - 定义客户端进行交互的接口。它维护对具体状态对象的引用，该状态对象可用于定义对象的当前状态。它将特定于状态的行为委托给不同的State对象。   

### 4.代码实现
在这个例子中，我们将模拟快递递送系统，其中快递在转换期间可以处于不同的状态。


```
/**
 * 包裹状态
**/
public interface PackageState {
    public void updateState(DeliveryContext ctx);
}
```

```
/**
 * 确认信息
 **/
public class Acknowledged implements PackageState {
    //Singleton
    private static Acknowledged instance = new Acknowledged();

    private Acknowledged() {}

    public static Acknowledged instance() {
        return instance;
    }

    //Business logic and state transition
    @Override
    public void updateState(DeliveryContext ctx) {
        System.out.println("Package is acknowledged !!");
        ctx.setCurrentState(Shipped.instance());
    }
}
```
```
/**
 * 发货
 **/
public class Shipped implements PackageState {
    //Singleton
    private static Shipped instance = new Shipped();

    private Shipped() {}

    public static Shipped instance() {
        return instance;
    }

    //Business logic and state transition
    @Override
    public void updateState(DeliveryContext ctx) {
        System.out.println("Package is shipped !!");
        ctx.setCurrentState(InTransition.instance());
    }
}
```
```
/**
 * 转运
 **/
public class InTransition implements PackageState {
    //Singleton
    private static InTransition instance = new InTransition();

    private InTransition() {}

    public static InTransition instance() {
        return instance;
    }

    //Business logic and state transition
    @Override
    public void updateState(DeliveryContext ctx)  {
        System.out.println("Package is in transition !!");
        ctx.setCurrentState(OutForDelivery.instance());
    }
}
```
```
/**
 * 正在派件
 **/
public class OutForDelivery implements PackageState {
    //Singleton
    private static OutForDelivery instance = new OutForDelivery();

    private OutForDelivery() {}

    public static OutForDelivery instance() {
        return instance;
    }

    //Business logic and state transition
    @Override
    public void updateState(DeliveryContext ctx) {
        System.out.println("Package is out of delivery !!");
        ctx.setCurrentState(Delivered.instance());
    }
}
```
```
/**
 * 已签收
 **/
public class Delivered implements PackageState {
    //Singleton
    private static Deliveredinstance = new Delivered();

    private Delivered() {}

    public static Deliveredinstance() {
        return instance;
    }

    //Business logic
    @Override
    public void updateState(DeliveryContext ctx) {
        System.out.println("Package is delivered!!");
    }
}
```
```
/**
 * 上下文
 **/
public class DeliveryContext {

    private PackageState currentState;
    private String packageId;

    public DeliveryContext(PackageState currentState, String packageId) {
        super();
        this.currentState = currentState;
        this.packageId = packageId;

        if(currentState == null) {
            this.currentState = Acknowledged.instance();
        }
    }

    public PackageState getCurrentState() {
        return currentState;
    }

    public void setCurrentState(PackageState currentState) {
        this.currentState = currentState;
    }

    public String getPackageId() {
        return packageId;
    }

    public void setPackageId(String packageId) {
        this.packageId = packageId;
    }

    public void update() {
        currentState.updateState(this);
    }
}
```
```
public class Main {
    public static void main(String[] args) {
        DeliveryContext ctx = new DeliveryContext(null, "Test123");

        ctx.update();
        ctx.update();
        ctx.update();
        ctx.update();
        ctx.update();
    }
}
```
***输出信息:***
> Package is acknowledged !!   
> Package is shipped !!   
> Package is in transition !!   
> Package is out of delivery !!   
> Package is delivered !!   
### 5.结论
> 当我们想要避免原始的if / else语句时，状态设计模式很棒。相反，我们提取逻辑来分离类，让我们的上下文对象将行为委托给状态类中实现的方法。此外，我们可以利用状态之间的转换，其中一个状态可以改变上下文的状态。

