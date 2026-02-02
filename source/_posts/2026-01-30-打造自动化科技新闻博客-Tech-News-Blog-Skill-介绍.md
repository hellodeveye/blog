---
title: 打造自动化科技新闻博客：Tech News Blog Skill 介绍
date: 2026-01-30 13:56:00
tags: [Clawdbot, Skill, 自动化, 博客]
categories: [教程]
---

## 背景

每天浏览 Hacker News、技术博客获取科技资讯耗时且容易遗漏。于是我开发了 **Tech News Blog Skill**，自动抓取热门科技新闻并发布到 Hexo 博客。

## 功能特性

| 特性 | 说明 |
|------|------|
| 多源聚合 | Hacker News、Google AI Blog、TechCrunch |
| 智能分类 | AI、游戏、开发工具、基础设施、趣闻 |
| 一键部署 | 自动生成文章并部署到博客 |

## 工作流程

```
获取新闻 → 内容筛选 → 创建文章 → 部署博客
```

## 快速开始

### 1. 安装技能

```bash
mkdir -p ~/.clawdbot/skills
cd ~/.clawdbot/skills
wget https://oss.foundra.me/skills/tech-news-blog.skill
unzip tech-news-blog.skill
```

### 2. 使用

对 Clawdbot 说：
> "帮我生成今日科技新闻博客"

或直接部署：
```bash
cd ~/projects/blog && hexo clean && hexo g && hexo d
```

## 文章格式

生成的文章包含：
- **标题**: `YYYY-MM-DD 科技圈新闻汇总`
- **分类**: AI、游戏、开发工具、基础设施、趣闻
- **结构**: 标题 + 描述 + 原文链接

示例：
```markdown
## AI 与机器学习

### Google Project Genie 发布

Google 推出实时生成交互世界的 AI 模型...

📎 [原文链接](https://blog.google/...)
```

## 自动化方案

**Cron 定时任务**（每天 9:00 自动执行）：
```bash
0 9 * * * cd ~/projects/blog && hexo clean && hexo g && hexo d
```

**Heartbeat 检查**：
在 `HEARTBEAT.md` 中添加每日新闻检查任务。

**手动触发**：
随时对 Clawdbot 说 "生成今日科技新闻"。

## 实际效果

✅ 内容质量高 - 精选 Hacker News 热门话题  
✅ 格式统一 - 一致的文章结构  
✅ 更新及时 - 每日自动更新  
✅ 可阅读性强 - 分类清晰，重点突出  
✅ 零维护成本 - 全自动运行

## Skill 源码

📎 **下载地址**: https://oss.foundra.me/skills/tech-news-blog.skill

Skill 是一个 ZIP 压缩包，包含：
```
tech-news-blog/
└── SKILL.md    # 技能主文档
```

解压后可直接查看和修改。

---

*让科技新闻聚合变得简单高效！*
