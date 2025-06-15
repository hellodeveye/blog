---
title: mermaid
date: 2025-06-11 22:11:19
tags: [mermaid]
categories: mermiad
---

# Mermaid 图表展示

这是一个展示Mermaid图表功能的文章，同时也演示了目录功能。

## 思维导图 (mindmap)

```mermaid
mindmap
  root((mindmap))
    Origins
      Long history
      ::icon(fa fa-book)
      Popularisation
        British popular psychology author Tony Buzan
    Research
      On effectiveness<br/>and features
      On Automatic creation
        Uses
            Creative techniques
            Strategic planning
            Argument mapping
    Tools
      Pen and paper
      Mermaid
```

## 状态图 (stateDiagram) 
```mermaid
stateDiagram-v2
    [*] --> Still
    Still --> [*]
    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]
```

## 类图 (classDiagram)
```mermaid
classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal <|-- Zebra
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    Animal: +mate()
    class Duck{
      +String beakColor
      +swim()
      +quack()
    }
    class Fish{
      -int sizeInFeet
      -canEat()
    }
    class Zebra{
      +bool is_wild
      +run()
    }
```

## 象限图 (quadrantChart)
``` mermaid
quadrantChart
    title Reach and engagement of campaigns
    x-axis Low Reach --> High Reach
    y-axis Low Engagement --> High Engagement
    quadrant-1 We should expand
    quadrant-2 Need to promote
    quadrant-3 Re-evaluate
    quadrant-4 May be improved
    Campaign A: [0.3, 0.6]
    Campaign B: [0.45, 0.23]
    Campaign C: [0.57, 0.69]
    Campaign D: [0.78, 0.34]
    Campaign E: [0.40, 0.34]
    Campaign F: [0.35, 0.78]
```

## 流程图示例

### 简单流程图

```mermaid
flowchart TD
    A[开始] --> B{是否有条件}
    B -->|是| C[执行操作A]
    B -->|否| D[执行操作B]
    C --> E[结束]
    D --> E
```

### 复杂流程图

```mermaid
flowchart LR
    A[用户请求] --> B[身份验证]
    B -->|成功| C[处理请求]
    B -->|失败| D[返回错误]
    C --> E[数据库查询]
    E --> F[数据处理]
    F --> G[返回结果]
```

## 时序图示例

```mermaid
sequenceDiagram
    participant U as 用户
    participant S as 服务器
    participant D as 数据库
    
    U->>S: 发送请求
    S->>D: 查询数据
    D->>S: 返回数据
    S->>U: 返回响应
```

## 总结

通过以上示例，我们可以看到Mermaid支持多种类型的图表：
- 思维导图：用于整理思路和概念
- 状态图：用于描述系统状态变化
- 类图：用于展示类之间的关系
- 象限图：用于分析和分类
- 流程图：用于描述业务流程
- 时序图：用于展示交互过程

这些图表都可以通过简单的文本语法来创建，非常适合技术文档和博客文章。