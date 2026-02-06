---
title: 打造自动化科技新闻博客：Tech News Skill 介绍
date: 2026-01-30 13:56:00
tags: [Clawdbot, Tech News, Skill, 自动化, 博客]
categories: [教程]
---

## 背景

每天浏览 Hacker News、GitHub Trending、技术博客获取科技资讯既耗时又容易遗漏。**Tech News Skill** 把「抓取 → 翻译 → 分类 → 生成」这条流水线自动化，让你每天几分钟内就能产出当天的科技新闻汇总。

> ⭐ **GitHub 地址**  
> [https://github.com/foundralab/my-skills/tree/main/tech-news](https://github.com/foundralab/my-skills/tree/main/tech-news)

## 功能特性（最新）

| 特性 | 说明 |
|------|------|
| 多源聚合 | Hacker News、Reddit Programming、GitHub Trending、Dev.to、Lobsters、Papers With Code、Hugging Face、arXiv AI |
| 自动翻译 | 使用 Minimax 或 OpenAI API 生成中文标题与摘要 |
| 智能分类 | AI、开发工具、基础设施、产品设计、趣闻观点 |
| 去重机制 | 默认排除近 3 天重复文章 |
| 图片支持 | 可自动抓取 og:image 并上传到 R2（可选） |
| 输出稳定 | 统一 Markdown 结构，适合二次加工或直接发布 |

## 工作流程

```
抓取多源 → 去重 → 平衡筛选 → 翻译摘要 → (可选)处理配图 → 生成Markdown
```

## 前置条件

- Python 3.8+ (`python3`)
- 翻译 API：`MINIMAX_API_KEY` 或 `OPENAI_API_KEY`
- 可选图片上传：`~/.r2-upload.yml` 或 `R2_UPLOAD_CONFIG`

示例：
```bash
export MINIMAX_API_KEY=your_key
# 或
export OPENAI_API_KEY=your_key

# 如需图片上传
export R2_UPLOAD_CONFIG=~/.r2-upload.yml
```

## 快速开始

假设 skill 安装目录为 `~/.agents/skills/tech-news`（以实际路径为准）：

```bash
TECH_NEWS_DIR=~/.agents/skills/tech-news
DATE=$(date +%F)

python3 $TECH_NEWS_DIR/scripts/generate.py \
  --date $DATE \
  --save /tmp/tech-news-$DATE.md
```

如果你不需要图片：
```bash
python3 $TECH_NEWS_DIR/scripts/generate.py --date $DATE --no-images --save /tmp/tech-news-$DATE.md
```

## 常用参数

- `--sources <list>`：指定新闻源（默认 8 个）
- `--count <n>`：每源抓取数量（默认 15）
- `--limit <n>`：最终精选数量（默认 10）
- `--max-images <n>`：处理图片上限
- `--no-images`：禁用图片
- `--output-only`：仅输出 Markdown 到 stdout

## 文章格式

默认输出结构（节选）：

```markdown
# 📰 YYYY-MM-DD 科技早报

> 📊 **今日导读**
> 精选 10 条科技新闻
> 来源：Hacker News(4) | GitHub Trending(3) | Lobsters(3)

---

## 📋 文章速览

**AI 与机器学习**：3 篇
1. ...
```

## 自动化方案

### 1. Cron（本地定时）

```bash
0 9 * * * \
  python3 ~/.agents/skills/tech-news/scripts/generate.py --date $(date +%F) --save /tmp/tech-news-$(date +%F).md
```

生成后即可用于发布或二次编辑（可用脚本自动处理）。

### 2. GitHub Actions

把 `generate.py` 放到 workflow 中，定时生成并提交到仓库。

## 常见问题

- **翻译质量一般**：确认 `MINIMAX_API_KEY` 或 `OPENAI_API_KEY` 已配置
- **图片不显示**：检查 `R2_UPLOAD_CONFIG` 或改用 `--no-images`
- **重复内容**：默认会排除近 3 天重复文章，可按需改代码

## Skill 源码与目录结构

Tech News Skill 本地结构如下：

[GitHub 仓库](https://github.com/foundralab/my-skills/tree/main/tech-news)

```
tech-news/
├── SKILL.md
├── scripts/
│   ├── generate.py
│   ├── fetch_news.py
│   └── llm_translate.py
└── references/
```

如果你想改来源、分类或输出格式，直接修改 `generate.py` 即可。

---

*让科技新闻聚合变得简单高效！*
