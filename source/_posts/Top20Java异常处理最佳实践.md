---
title: Top20Java异常处理最佳实践
date: 2018-10-31 15:58:01
tags: 转载
categories: java
---
### 1.Java中的异常类型
![](https://howtodoinjava.files.wordpress.com/2013/04/exceptionhierarchy3.png)
#### 检查异常
这些必须是在`throws`子句中声明的异常，它们扩展了`Exception`，皆为“in your face”的异常类型，Java希望你处理它们，因为它们在某种程度上依赖于程序之外的外部因素，已检查的异常表示在正常系统操作期间可能发生的预期问题。当您尝试通过网络或文件系统使用外部系统时，通常会发生这些异常。大多数情况下，对已检查异常的正确响应应该是稍后再试，或提示用户修改其输入。   
#### 未检查的异常
这些是不需要在`throws`子句中声明的异常。JVM根本不会强制您处理它们，因为它们主要是由于程序错误而在运行时生成的。它们扩展了RuntimeException。最常见的例子是NullPointerException[相当可怕......不是吗？]。可能不应该重试未经检查的异常，并且正确的操作通常应该是什么都不做，并让它从您的方法和执行堆栈中出来。在高执行级别，应记录此类异常。   
#### 错误
是严重的运行时环境问题，几乎无法恢复。例如：OutOfMemoryError、LinkageError和StackOverflowError。它们通常会使程序或程序的一部分崩溃。只有良好的记录日志习惯才能帮助您确定错误的确切原因。   
### 2.自定义异常
每当用户因某些原因觉得他想要使用自己的应用程序特定异常时，他就可以创建一个新类，扩展适当的超类（一般为`Exception`）并在适当的地方使用它。自定义的异常可以通过两种方式使用：

1.在程序出现问题时直接抛出自定义异常
```
throw new DaoObjectNotFoundException("Couldn't find dao with id " + id);
```
2.或者将原始异常包装在自定义异常中抛出
```
catch (NoSuchMethodException e) {
  throw new DaoObjectNotFoundException("Couldn't find dao with id " + id, e);
}
```
包装异常可以通过添加自己的信息/上下文信息为用户提供额外信息，同时仍保留原始异常的堆栈跟踪和消息。它还允许您隐藏代码的实现细节，这是包装异常的最重要原因。   
### 3.您必须考虑并遵循的Java异常处理最佳实践
#### 3.1. 永远不要吞下catch块中的异常
```
catch (NoSuchMethodException e) {
   return null;
}
```
这样做只是返回“null”而不是处理或重新抛出异常，它完全吞下异常，永远失去错误的原因。当你不知道失败的原因时，你将来如何防止失败？永远不要这样做!!
#### 3.2. 声明您的方法可以抛出特定已检查异常
```
public void foo() throws Exception { //Incorrect way
}
```
始终避免在上面的代码示例中执行此操作。它完全违背了检查异常的全部目的。声明您的方法可以抛出的特定已检查异常。如果有太多这样的已检查异常，您应该将它们包装在您自己的异常中，并在异常消息中添加信息。如果可能，您还可以考虑代码重构。
```
public void foo() throws SpecificException1, SpecificException2 { //Correct way
}
```
#### 3.3. 不要捕获Exception类而是捕获特定的子类
```
try {
   someMethod();
} catch (Exception e) {
   LOGGER.error("method has failed", e);
}
```
捕获异常的问题是，如果稍后调用的方法在其方法签名中添加了一个新的已检查异常，那么开发人员的意图是您应该处理特定的新异常。如果您的代码只捕获Exception（或Throwable），您将永远不会知道更改以及您的代码现在出错并且可能在运行时的任何时间点中断的事实。
#### 3.4.永远不要捕获Throwable类
那么，它是一步更严重的麻烦。因为java错误也是Throwable的子类。错误是JVM本身无法处理的不可逆转的条件。对于某些JVM实现，JVM实际上甚至可能不会在Error上调用catch子句。
#### 3.5. 始终正确地将异常包装在自定义异常中，以便不会丢失堆栈跟踪
```
catch (NoSuchMethodException e) {
   throw new MyServiceException("Some information: " + e.getMessage());  //Incorrect way
}
```
这会破坏原始异常的堆栈跟踪，并且总是错误的。这样做的正确方法是：
```
catch (NoSuchMethodException e) {
   throw new MyServiceException("Some information: " , e);  //Correct way
}
```
#### 3.6. 记录异常或抛出它不要同时执行
```
catch (NoSuchMethodException e) {
   LOGGER.error("Some information", e);
   throw e;
}
```
与上面的示例代码一样，对于代码中的单个问题，日志记录和抛出将导致日志文件中出现多条日志消息，这样会使正在尝试挖掘日志的工程师陷入其中。
#### 3.7. 永远不要在finally块中抛出任何异常
```
try {
  someMethod();  //Throws exceptionOne
} finally {
  cleanUp();    //If finally also threw any exception the exceptionOne will be lost forever
}
```
这很好，只要cleanUp()永远不会抛出任何异常。在上面的示例中，如果someMethod()抛出异常，并且在finally块中，cleanUp()也会抛出异常，第二个异常将来自方法，并且原始的第一个异常（正确的原因）将永远丢失。如果您在finally块中调用的代码可能会抛出异常，请确保您要么处理它，要么记录它。永远不要让它从最后一块出来。
#### 3.8. 始终只捕获您可以处理的异常
```
catch (NoSuchMethodException e) {
   throw e; //Avoid this as it doesn't help anything
}
```
那么这是最重要的概念。不要为了捕获它而捕获任何例外。仅在您要处理它时才捕获任何异常，或者您希望在该异常中提供其他上下文信息。如果你无法在catch块中处理它，那么最好的建议就是不要只是重新抛出它。
#### 3.9. 不要使用printStackTrace()语句或类似方法
完成代码后永远不要留下printStackTrace()。碰巧你的同事最终将得到其中一个堆栈跟踪，并且对于如何处理它几乎没有用，因为它不会附加任何上下文信息。
#### 3.10. 如果您不打算处理异常，请使用finally块而不是catch块
```
try {
  someMethod();  //Method 2
} finally {
  cleanUp();    //do cleanup here
}
```
这也是一种很好的做法。如果在你的方法中你正在访问某个方法2，并且方法2抛出了一些你不想在方法1中处理的异常，但是如果发生异常仍然需要一些清理，那么在finally块中进行清理。不要使用catch块。
#### 3.11. 记住“提早赶快”的原则
这可能是关于异常处理的最着名的原则。它基本上说你应该尽快抛出异常，尽可能地追赶它。您应该等到拥有正确处理它的所有信息。

这个原则隐含地说你将更有可能将它放在低级方法中，在那里你将检查单个值是否为空或不合适。并且您将异常爬上堆栈跟踪几个级别，直到达到足够的抽象级别才能处理问题。


#### 3.12. 处理异常后始终清理
如果您使用的是数据库连接或网络连接等资源，请确保清理它们。如果您调用的API仅使用未经检查的异常，则仍应使用try-finally块清理资源。里面的try块访问资源，里面最后关闭资源。即使在访问资源时发生任何异常，也会优雅地关闭资源。


#### 3.13. 仅从方法中抛出相关的异常
相关性对于保持应用程序清洁非常重要。一种尝试读取文件的方法; 如果抛出NullPointerException，则它不会向用户提供任何相关信息。相反，如果将此类异常包装在自定义异常（例如NoSuchFileFoundException）中，那么它对于该方法的用户将更有用。


#### 3.14. 切勿在程序中使用流量控制的异常
我们已多次阅读它，但有时我们会在项目中看到代码，其中开发人员尝试使用应用程序逻辑的异常。永远不要那样做。它使代码难以阅读，理解和丑陋。


#### 3.15. 验证用户输入以在请求处理的早期捕获不利条件
始终在很早的阶段验证用户输入，甚至在它到达实际控制器之前。它将帮助您最小化核心应用程序逻辑中的异常处理代码。如果用户输入中存在一些错误，它还可以帮助您使应用程序保持一致。   

例如：如果在用户注册应用程序中，您遵循以下逻辑：   

1）验证用户   
2）插入用户   
3）验证地址   
4）插入地址   
5）如果出现问题则回滚所有内容   

这是非常不正确的方法。在各种情况下，它可能使数据库处于不一致状态。而是首先验证所有内容，然后在dao层中获取用户数据并进行数据库更新。正确的方法是：   

1）验证用户   
2）验证地址   
3）插入用户   
4）插入地址   
5）如果出现问题则回滚所有内容   
### 3.16. 始终在单个日志消息中包含有关异常的所有信息
```
LOGGER.debug("Using cache sector A");
LOGGER.debug("Using retry sector B");
```
不要这样做。   

使用多行日志消息对LOGGER.debug（）进行多次调用可能在您的测试用例中看起来很好，但是当它出现在并行运行400个线程的应用服务器的日志文件中时，所有转储信息都是相同的日志文件，您的两条日志消息可能最终在日志文件中间隔1000行，即使它们出现在代码中的后续行中。   

像这样做：   
```
LOGGER.debug("Using cache sector A, using retry sector B");
```
#### 3.17. 将所有相关信息传递给例外，以尽可能提供信息
这对于使异常消息和堆栈跟踪有用且信息量非常重要。如果您无法确定日志中的任何内容，那么日志的用途是什么。这些类型的日志只存在于您的代码中以用于装饰目的。


#### 3.18. 始终终止被中断的线程
```
while (true) {
  try {
    Thread.sleep(100000);
  } catch (InterruptedException e) {} //Don't do this
  doSomethingCool();
}
```
InterruptedException是您的代码的线索，它应该停止它正在做的任何事情。线程中断的一些常见用例是活动事务超时，或线程池关闭。您的代码应该尽力完成它正在做的事情，并完成当前的执行线程，而不是忽略InterruptedException。所以要纠正上面的例子：
```
while (true) {
  try {
    Thread.sleep(100000);
  } catch (InterruptedException e) {
    break;
  }
}
doSomethingCool();
```
#### 3.19. 使用模板方法重复try-catch
在代码中的100个位置没有使用类似的catch块。它增加了代码的两面性，这对任何事都没有帮助。对这种情况使用模板方法。   

例如，下面的代码尝试关闭数据库连接。
```
class DBUtil{
    public static void closeConnection(Connection conn){
        try{
            conn.close();
        } catch(Exception ex){
            //Log Exception - Cannot close connection
        }
    }
}
```
这种方法将在您的应用程序中的数千个位置使用。不要将整个代码放在每个地方而是定义上面的方法，并在下面的地方使用它：
```
public void dataAccessCode() {
    Connection conn = null;
    try{
        conn = getConnection();
        ....
    } finally{
        DBUtil.closeConnection(conn);
    }
}
```
#### 3.20. 使用javadoc记录应用程序中的所有异常
将一段代码可能在运行时抛出的所有异常作为javadoc的惯例。还尝试包括可能的行动方案，用户应该遵循这些异常发生的情况。   

这就是我现在想到的与Java异常处理最佳实践相关的全部内容。如果您发现任何遗漏或与我的观点无关，请给我发表评论。我很乐意讨论。   

> 原文地址：https://howtodoinjava.com/best-practices/java-exception-handling-best-practices/

