---
title: Facade设计模式
date: 2019-02-27 11:08:44
cover: /img/485120-learn-to-code.jpg
tags: desin pattern
categories: java
---
## 意图
为子系统中的一组接口提供一个统一的接口。Facade定义了一个更高级别的接口，使子系统更方便的使用。
## 说明  
**现实世界的例子**   
> 一个金矿是如何运作的？ 你说：“旷工去金矿里面挖金子！”，这是你所相信的。因为你在金矿外边提供了一个简单的接口。
而实现这个接口却需要做很多事情。提供一个简单的接口去处理复杂的子系统就相当于是一个`Facade`模式。   

**简单来说**   
> `Facade`模式为复杂的子系统提供了简化的接口。

**维基百科说**  
> 外观是一个对象，它为更大的代码体提供了简化的接口，例如类库。   
### 程序示例
以上面的金矿为例，在这里，我们有矿工的等级制度。   
```
public abstract class MineWorker {

  private static final Logger LOGGER = LoggerFactory.getLogger(MineWorker.class);

  public void goToSleep() {
    LOGGER.info("{} goes to sleep.", name());
  }

  public void wakeUp() {
    LOGGER.info("{} wakes up.", name());
  }

  public void goHome() {
    LOGGER.info("{} goes home.", name());
  }

  public void goToMine() {
    LOGGER.info("{} goes to the mine.", name());
  }

  private void action(Action action) {
    switch (action) {
      case GO_TO_SLEEP:
        goToSleep();
        break;
      case WAKE_UP:
        wakeUp();
        break;
      case GO_HOME:
        goHome();
        break;
      case GO_TO_MINE:
        goToMine();
        break;
      case WORK:
        work();
        break;
      default:
        LOGGER.info("Undefined action");
        break;
    }
  }

  /**
   * Perform actions
   */
  public void action(Action... actions) {
    for (Action action : actions) {
      action(action);
    }
  }

  public abstract void work();

  public abstract String name();

  enum Action {
    GO_TO_SLEEP, WAKE_UP, GO_HOME, GO_TO_MINE, WORK
  }
}
```

```
public class TunnelDigger extends MineWorker {

  private static final Logger LOGGER = LoggerFactory.getLogger(TunnelDigger.class);

  @Override
  public void work() {
    LOGGER.info("{} creates another promising tunnel.", name());
  }

  @Override
  public String name() {
    return " tunnel digger";
  }
}

public class GoldDigger extends MineWorker {

  private static final Logger LOGGER = LoggerFactory.getLogger(GoldDigger.class);

  @Override
  public void work() {
    LOGGER.info("{} digs for gold.", name());
  }

  @Override
  public String name() {
    return " gold digger";
  }
}

public class CartOperator extends MineWorker {

  private static final Logger LOGGER = LoggerFactory.getLogger(CartOperator.class);

  @Override
  public void work() {
    LOGGER.info("{} moves gold chunks out of the mine.", name());
  }

  @Override
  public String name() {
    return " cart operator";
  }
}
```
为了操控这些金矿工人，我们有一个`Facade`
```
public class GoldmineFacade {

  private final List<MineWorker> workers;

  public GoldmineFacade() {
    workers = new ArrayList<>();
    workers.add(new GoldDigger());
    workers.add(new CartOperator());
    workers.add(new TunnelDigger());
  }

  public void startNewDay() {
    makeActions(workers, MineWorker.Action.WAKE_UP, MineWorker.Action.GO_TO_MINE);
  }

  public void digOutGold() {
    makeActions(workers, MineWorker.Action.WORK);
  }

  public void endDay() {
    makeActions(workers, MineWorker.Action.GO_HOME, MineWorker.Action.GO_TO_SLEEP);
  }

  private static void makeActions(Collection<MineWorker> workers,MineWorker.Action... actions) {
    for (MineWorker worker : workers) {
      worker.action(actions);
    }
  }
}
```
现在使用我们的`Facade`
```
GoldmineFacade facade = new GoldmineFacade();
facade.startNewDay();
//  gold digger wakes up.
//  gold digger goes to the mine.
//  cart operator wakes up.
//  cart operator goes to the mine.
//  tunnel digger wakes up.
//  tunnel digger goes to the mine.
facade.digOutGold();
//  gold digger digs for gold.
//  cart operator moves gold chunks out of the mine.
//  tunnel digger creates another promising tunnel.
facade.endDay();
//  gold digger goes home.
//  gold digger goes to sleep.
//  cart operator goes home.
//  cart operator goes to sleep.
//  tunnel digger goes home.
//  tunnel digger goes to sleep.
```
## 适用性
使用`Facade`时
- 您想为复杂的子系统提供简单的接口。子系统随着它们的发展变得越来越复杂。大多数模式在应用时会导致更多更小的类。这使得子系统更易于重复使用并且更易于自定义，但对于不需要自定义它的客户端也变得更难使用。外观可以提供子系统的简单默认视图，对大多数客户端来说足够好。只有需要更多可定制性的客户才需要超越外观。   
- 客户端和抽象的实现类之间存在许多依赖关系。引入外观以将子系统与客户端和其他子系统分离，从而提升子系统的独立性和可移植性。   
- 你想分层你的子系统。使用外观来定义每个子系统级别的入口点。如果子系统是依赖的，那么您可以通过使它们仅通过它们的外观相互通信来简化它们之间的依赖关系。   
