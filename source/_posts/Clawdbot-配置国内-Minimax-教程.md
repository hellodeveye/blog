---
title: Clawdbot 配置国内 Minimax 教程
date: 2025-01-28 11:57
tags:
  - Clawdbot
  - Minimax
  - AI
categories: 教程
---

# Clawdbot 配置国内 Minimax 教程

Clawdbot 默认使用国际站 Minimax API，但国内用户访问国际站可能存在网络延迟或访问受限问题。本文介绍如何将 Clawdbot 配置为使用国内 Minimax 地址。

## 问题背景

Clawdbot 默认配置的 Minimax 地址为国际站，可能存在以下问题：
- 网络延迟高
- 访问不稳定
- 需要特殊网络环境

国内站地址：`https://api.minimaxi.com/anthropic`

## 配置步骤

### 步骤一：修改 Agent 模型配置

编辑 `~/.clawdbot/agents/main/agent/models.json`：

```json
{
  "providers": {
    "minimax": {
      "baseUrl": "https://api.minimaxi.com/anthropic",
      "api": "anthropic-messages",
      "models": [
        {
          "id": "MiniMax-M2.1",
          "name": "MiniMax M2.1",
          "reasoning": false,
          "input": ["text"],
          "cost": {
            "input": 15,
            "output": 60,
            "cacheRead": 2,
            "cacheWrite": 10
          },
          "contextWindow": 200000,
          "maxTokens": 8192
        },
        {
          "id": "MiniMax-VL-01",
          "name": "MiniMax VL 01",
          "reasoning": false,
          "input": ["text", "image"],
          "cost": {
            "input": 15,
            "output": 60,
            "cacheRead": 2,
            "cacheWrite": 10
          },
          "contextWindow": 200000,
          "maxTokens": 8192
        }
      ],
      "apiKey": "sk-cp-xxx"
    }
  }
}
```

### 步骤二：修改全局配置

编辑 `/root/.clawdbot/clawdbot.json`：

```json
{
  "models": {
    "mode": "merge",
    "providers": {
      "minimax": {
        "baseUrl": "https://api.minimaxi.com/anthropic",
        "api": "anthropic-messages",
        "models": [
          {
            "id": "MiniMax-M2.1",
            "name": "MiniMax M2.1",
            "reasoning": false,
            "input": ["text"],
            "cost": {
              "input": 15,
              "output": 60,
              "cacheRead": 2,
              "cacheWrite": 10
            },
            "contextWindow": 200000,
            "maxTokens": 8192
          }
        ]
      }
    }
  }
}
```

## 配置说明

| 配置项 | 说明 |
|--------|------|
| `baseUrl` | API 基础地址，国内站为 `https://api.minimaxi.com/anthropic` |
| `api` | API 类型，使用 `anthropic-messages` |
| `models` | 模型列表，可配置 MiniMax-M2.1 和 MiniMax-VL-01 |
| `apiKey` | 你的 API Key |

## 重启验证

配置完成后，重启 Clawdbot：

```bash
clawdbot gateway restart
```

然后检查状态：

```bash
clawdbot status
```

## 常见问题

### Q: 配置后无法连接？

检查：
1. API Key 是否正确
2. 网络是否可访问 `https://api.minimaxi.com`
3. 配置文件语法是否正确（JSON 格式）

### Q: 如何验证配置生效？

在 Clawdbot 中执行：

```
/status
```

查看当前使用的模型配置。

## 参考链接

- [Clawdbot 官方文档](https://docs.clawd.bot)
- [MiniMax API 文档](https://platform.minimaxi.com/docs/api-reference/api-overview)

---

**文章标签：** Clawdbot, Minimax, AI配置, 国内站
