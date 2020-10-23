---
title: Linux常用命令
date: 2020-09-27 15:52:43
tags: Linux
categories: Linux
---

- 查看配置文件只匹配不是以“#”开头的行
```
 cat .zshrc | grep -v "^#" > profile.txt
```
