---
title: Command模式
date: 2019-05-09 15:35:13
tags: design pattern
categories: java
---
#### 命令模式是一种行为设计模式，在日常生活中我们常常会遇到
- 使用遥控器遥控电视。   
- 使用开关控制风扇。   
- 使用shell脚本执行命令等等。  

#### 什么时候使用命令模式   
- 处理Java菜单项和按钮的操作。
- 提供对宏的支持（宏的记录和回放）。
- 提供“撤消”支持。
- 进度条实现。
- 创建多步向导。

#### 下面使用命令模式实现一个对文件操作的例子
![](/img/1557388252592.jpg)

```
/**
 * 文件操作命令接口
 */
public interface ICommand {

    void execute(File file);

}
```
```
public class MakeDirCommand implements ICommand {
    @Override
    public void execute(File file) {
        System.out.println("创建了一个文件夹...");
    }
}
```
```
public class MakeFileCommand implements ICommand{

    @Override
    public void execute(File file) {
        System.out.println("创建了一个文件...");
    }
}
```
```
public class MoveCommand implements ICommand {
    @Override
    public void execute(File file) {
        System.out.println("移动一个文件...");
    }
}
```
```
public class RmCommand implements ICommand {
    @Override
    public void execute(File file) {
        System.out.println("删除一个文件...");
    }
}
```
```
public class CommandFactory {

    ICommand command;

    public CommandFactory(ICommand command) {
        this.command = command;
    }

    public void execute(File file) {
        command.execute(file);
    }
}
```
```
public class Main {

    public static void main(String[] args) {
        File file = new File("");
        CommandFactory makeDir = new CommandFactory(new MakeDirCommand());
        CommandFactory makeFile = new CommandFactory(new MakeFileCommand());
        CommandFactory move = new CommandFactory(new MoveCommand());
        CommandFactory rm = new CommandFactory(new RmCommand());

        makeDir.execute(file);
        makeFile.execute(file);
        move.execute(file);
        rm.execute(file);
    }
}
```
#### 优点   
- 使我们的代码可扩展，因为我们可以添加新命令而无需更改现有代码。  
- 使用命令对象增加调用者和接收者之间的松散耦合。  

#### 缺点
- 在不同的视图中，增加每个单独命令的类数。在某些特定情况下可能不是优选的。

> 使用命令模式实现的一个Web文件在线管理的开源项目 [https://github.com/trustsystems/elfinder-java-connector](https://github.com/trustsystems/elfinder-java-connector)
