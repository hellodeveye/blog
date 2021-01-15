---
title: 使用Optional要注意的点
date: 2020-11-25 19:10:37
tags: Java
categories: Java
---

### Optional的API通常有两种可能引起混淆的方法:orElse()和orElseGet()

```java
Optional.of("hello").orElse(world());
Optional.of("hello").orElseGet(()->world());
```

**结论：**对于上面这个示例，orElseGet()明显优于 orElse() 。仅当不存在Optional 值时才执行作为参数传递Supplier方法（orElseGet()的参数函数为() -> world()，该方法只有不存在"hello"值时才会执行），而orElse()涉及每次运行的world()方法的计算。

**除了性能方面，其他值得考虑的因素还包括：**

- 如果该方法将执行一些附加逻辑怎么办？例如，进行一些数据库插入或更新
- 即使当我们为orElse() 参数分配一个对象时：String name = Optional.of("hello").orElse("Other")我们仍然无缘无故地创建“Other” 对象这就是为什么对我们而言，根据需要在orElse()和orElseGet()中做出谨慎的决定非常重要–默认情况下，每次使用orElseGet()更为有意义，除非默认对象已经构造并且可以直接访问。

这就是为什么对我们而言，根据需要在orElse()和orElseGet()中做出谨慎的决定非常重要。默认情况下，每次使用orElseGet()更为有意义，除非默认对象已经构造并且可以直接访问。
