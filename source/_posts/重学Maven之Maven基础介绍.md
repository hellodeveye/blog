---
title: 重学Maven之Maven基础介绍
date: 2020-01-14 23:39:12
cover:  /img/Maven-Logo.jpg
tags: maven
categories: 重学Maven
---
### 介绍

Maven 翻译为"专家"、"内行"，是 Apache 下的一个纯 Java 开发的开源项目。基于项目对象模型（缩写：POM）概念，Maven利用一个中央信息片断能管理一个项目的构建、报告和文档等步骤。Maven 是一个项目管理工具，可以对 Java 项目进行构建、依赖管理。Maven 也可被用于构建和管理各种项目，例如 C#，Ruby，Scala 和其他语言编写的项目。Maven 曾是 Jakarta 项目的子项目，现为由 Apache 软件基金会主持的独立 Apache 项目。


### Maven 主要目标

- 简化构建过程
- 提供统一的构建系统
- 提供优质的项目信息
- 提供最佳实践开发指南
- 允许透明迁移到新功能

### 约定优于配置
Maven提倡使用一个共同的标准目录结构，Maven 使用约定优于配置的原则，大家尽可能的遵守这样的目录结构。如下所示：

| 目录 |目的  |
| --- | --- |
| ${basedir} | 存放pom.xml和所有的子目录 |
|${basedir}/src/main/java  |  项目的java源代码|
|${basedir}/src/main/resources  | 项目的资源，比如说properties文件，springmvc.xml |
|${basedir}/src/test/java| 项目的测试类，比如说Junit代码 |
|${basedir}/src/test/resources |测试用的资源  |
|${basedir}/src/main/webapp/WEB-INF  | web应用文件目录，web项目的信息，比如存放web.xml、本地图片、jsp视图页面 |
|${basedir}/target | 打包输出目录 |
|${basedir}/target/classes  |编译输出目录  |
|${basedir}/target/test-classes  | 测试编译输出目录 |
|Test.java  |Maven只会自动运行符合该命名规则的测试类  |
| ~/.m2/repository | Maven默认的本地仓库目录位置 |