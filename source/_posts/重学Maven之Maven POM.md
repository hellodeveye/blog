---
title: 重学Maven之Maven POM
date: 2020-01-14 23:39:13
cover:  /img/what's-maven.jpg
tags: maven
categories: 重学Maven
---

### Maven POM

POM( Project Object Model，项目对象模型 ) 是 Maven 工程的基本工作单元，是一个XML文件，包含了项目的基本信息，用于描述项目如何构建，声明项目依赖，等等。执行任务或目标时，Maven 会在当前目录中查找 POM。它读取 POM，获取所需的配置信息，然后执行目标。   
POM 中可以指定以下配置：

- 项目依赖
- 插件
- 执行目标
- 项目构建 profile
- 项目版本
- 项目开发者列表
- 相关邮件列表信息

下面是一个简单的pom.xml 文件示例：

```
<project xmlns = "http://maven.apache.org/POM/4.0.0" xmlns:xsi = "http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation = "http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd"> 

        <!-- 模型版本 -->
        <modelVersion>4.0.0</modelVersion> 
        <!-- 公司或者组织的唯一标志，并且配置时生成的路径也是由此生成， 
		如com.companyname.project-group，maven会将该项目打成的jar包放本地路径：/com/companyname/project-group --> 
		<groupId>com.companyname.project-group</groupId> 
        <!-- 项目的唯一ID，一个groupId下面可能多个项目，就是靠artifactId来区分的 -->
        <artifactId>project</artifactId>
        <!-- 版本号 -->
        <version>1.0</version> 
</project>
```

所有 POM 文件都需要 project 元素和三个必需字段：groupId，artifactId，version。

| 节点 |描述  |
| --- | --- |
| project | 工程的根标签|
|  modelVersion|  模型版本需要设置为 4.0|
|  groupId | 这是工程组的标识。它在一个组织或者项目中通常是唯一的。例如，一个银行组织 com.companyname.project-group 拥有所有的和银行相关的项目 |
|  artifactId|这是工程的标识。它通常是工程的名称。例如，消费者银行。groupId 和 artifactId 一起定义了 artifact 在仓库中的位置|
|version  | 这是工程的版本号。在 artifact 的仓库中，它用来区分不同的版本。例如：```com.company.bank:consumer-banking:1.0 ```       ```com.company.bank:consumer-banking:1.1```   |

### 父（Super）POM


父（Super）POM是 Maven 默认的 POM。所有的 POM 都继承自一个父 POM（无论是否显式定义了这个父 POM）。父 POM 包含了一些可以被继承的默认设置。因此，当 Maven 发现需要下载 POM 中的 依赖时，它会到 Super POM 中配置的默认仓库 http://repo1.maven.org/maven2 去下载。Maven 使用 effective pom（Super pom 加上工程自己的配置）来执行相关的目标，它帮助开发者在 pom.xml 中做尽可能少的配置，当然这些配置可以被重写。使用以下命令来查看 Super POM 默认配置：

```
mvn help:effective-pom
```

接下来我们创建目录 MVN/project，在该目录下创建 pom.xml，内容如下：
```
<project xmlns = "http://maven.apache.org/POM/4.0.0" xmlns:xsi = "http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation = "http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd"> 

        <!-- 模型版本 -->
        <modelVersion>4.0.0</modelVersion> 
        <!-- 公司或者组织的唯一标志，并且配置时生成的路径也是由此生成， 如com.companyname.project-group，maven会将该项目打成的jar包放本地路径：/com/companyname/project-group --> <groupId>com.companyname.project-group</groupId> 
        <!-- 项目的唯一ID，一个groupId下面可能多个项目，就是靠artifactId来区分的 -->
        <artifactId>project</artifactId>
        <!-- 版本号 -->
        <version>1.0</version> 
</project>
```

在命令控制台，进入 MVN/project 目录，执行以下命令：
```
C:\MVN\project>mvn help:effective-pom
```

Maven 将会开始处理并显示 effective-pom
```
[INFO] Scanning for projects...
Downloading: https://repo.maven.apache.org/maven2/org/apache/maven/plugins/maven-clean-plugin/2.5/maven-clean-plugin-2.5.pom...
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time: 01:36 min
[INFO] Finished at: 2018-09-05T11:31:28+08:00[INFO] Final Memory: 15M/149M
[INFO] ------------------------------------------------------------------------
```

Effective POM 的结果就像在控制台中显示的一样，经过继承、插值之后，使配置生效。
```
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/ 2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 h ttp://maven.apache.org/xsd/maven-4.0.0.xsd">

 <modelVersion>4.0.0</modelVersion> 
 <groupId>com.companyname.project-group</groupId> 
 <artifactId>project</artifactId> 
    <version>1.0</version> 
 <build> 
     <sourceDirectory>C:\MVN\project\src\main\java</sourceDirectory> 
     <scriptSourceDirectory>src/main/scripts</scriptSourceDirectory> 
     <testSourceDirectory>C:\MVN\project\src\test\java</testSourceDirectory> 
     <outputDirectory>C:\MVN\project\target\classes</outputDirectory>
     <testOutputDirectory>C:\MVN\project\target\test-classes</testOutputDirectory>
    <resources> 
        <resource> 
            <mergeId>resource-0</mergeId> 
            <directory>C:\MVN\project\src\main\resources</directory> 
        </resource>
     /resources> 
 <testResources> 
    <testResource>
        <mergeId>resource-1</mergeId> 
        <directory>C:\MVN\project\src\test\resources</directory>
     </testResource> 
   </testResources>
    <directory>C:\MVN\project\target</directory>
    <finalName>project-1.0</finalName> 
    <pluginManagement>
    <plugins>
        <plugin>
            <artifactId>maven-antrun-plugin</artifactId> 
            <version>1.3</version> 
        </plugin> 
        <plugin> 
            <artifactId>maven-assembly-plugin</artifactId> 
            <version>2.2-beta-2</version>
        </plugin>
        <plugin>
            <artifactId>maven-clean-plugin</artifactId> 
            <version>2.2</version>
        </plugin>
        <plugin> 
            <artifactId>maven-compiler-plugin</artifactId>
            <version>2.0.2</version>
        </plugin> 
        <plugin> 
            <artifactId>maven-dependency-plugin</artifactId>
            <version>2.0</version> 
        </plugin>
        <plugin> 
            <artifactId>maven-deploy-plugin</artifactId> 
            <version>2.4</version> 
        </plugin>
        <plugin>
            <artifactId>maven-ear-plugin</artifactId> 
            <version>2.3.1</version> 
        </plugin>
        <plugin>
            <artifactId>maven-ejb-plugin</artifactId> 
            <version>2.1</version> 
        </plugin> 
        <plugin> 
             <artifactId>maven-install-plugin</artifactId> 
             <version>2.2</version>
         </plugin>
         <plugin>
             <artifactId>maven-jar-plugin</artifactId>
             <version>2.2</version> 
         </plugin> 
         <plugin> 
             <artifactId>maven-javadoc-plugin</artifactId> 
             <version>2.5</version> 
         </plugin> 
         <plugin> 
             <artifactId>maven-plugin-plugin</artifactId> 
             <version>2.4.3</version>
         </plugin> 
         <plugin> 
             <artifactId>maven-rar-plugin</artifactId>
             <version>2.2</version> 
         </plugin> 
         <plugin> 
             <artifactId>maven-release-plugin</artifactId>
             <version>2.0-beta-8</version>
         </plugin> 
         <plugin>
             <artifactId>maven-resources-plugin</artifactId> 
             <version>2.3</version>
         </plugin> 
         <plugin> 
             <artifactId>maven-site-plugin</artifactId>
             <version>2.0-beta-7</version>
         </plugin>
         <plugin>
             <artifactId>maven-source-plugin</artifactId>
             <version>2.0.4</version>
         </plugin> 
         <plugin> 
             <artifactId>maven-surefire-plugin</artifactId>
             <version>2.4.3</version> 
         </plugin> 
         <plugin>
             <artifactId>maven-war-plugin</artifactId> 
             <version>2.1-alpha-2</version>
         </plugin> 
       </plugins> 
    </pluginManagement>
    <plugins>
         <plugin> 
            <artifactId>maven-help-plugin</artifactId>
            <version>2.1.1</version>
         </plugin>
      </plugins>
    </build>
     <repositories> 
         <repository> 
             <snapshots> 
                <enabled>false</enabled>
             </snapshots>
             <id>central</id> 
             <name>Maven Repository Switchboard</name> 
             <url>http://repo1.maven.org/maven2</url>
         </repository>
     </repositories>
     <pluginRepositories> 
        <pluginRepository>
             <releases>
                <updatePolicy>never</updatePolicy> 
             </releases> 
             <snapshots>
                 <enabled>false</enabled>
             </snapshots>
            <id>central</id> 
            <name>Maven Plugin Repository</name> 
            <url>http://repo1.maven.org/maven2</url>
        </pluginRepository>
     </pluginRepositories> 
     <reporting> 
        <outputDirectory>C:\MVN\project\target/site</outputDirectory>
    </reporting> 
 </project>
```

在上面的 pom.xml 中，你可以看到 Maven 在执行目标时需要用到的默认工程源码目录结构、输出目录、需要的插件、仓库和报表目录。Maven 的 pom.xml 文件也不需要手工编写。Maven 提供了大量的原型插件来创建工程，包括工程结构和 pom.xml。