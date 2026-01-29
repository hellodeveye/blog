---
title: Clawdbot 安装 R2 Upload Skill 指南
date: 2026-01-29 11:32:00
tags: [Clawdbot, R2, Cloudflare, 存储, 教程]
categories: [教程]
---

之前介绍了如何配置 Clawdbot 使用国内 Minimax，今天分享如何为 Clawdbot 安装 **R2 Upload Skill**，实现图片/文件上传到 Cloudflare R2 并生成公开访问链接。

## 背景

Clawdbot 本身没有内置的文件上传功能，但通过安装 R2 Upload Skill，可以轻松实现：

- 📤 上传文件到 Cloudflare R2 或 S3 兼容存储
- 🔗 生成短期有效的预签名下载链接
- 🌐 支持自定义域名访问
- 📦 多 Bucket 配置

## 环境准备

在开始之前，你需要准备：

1. **Cloudflare R2 账号**
2. **已创建的 R2 Bucket**
3. **R2 API Token**（包含 Access Key ID 和 Secret Access Key）
4. **Clawdbot 已安装**（本文假设已安装）

## 安装步骤

### 步骤一：下载 Skill

R2 Upload Skill 托管在 ClawdHub，通过以下地址下载：

```
https://auth.clawdhub.com/api/v1/download?slug=r2-upload
```

下载后会得到一个 zip 文件。

### 步骤二：解压并安装到全局

将 Skill 安装到 Clawdbot 全局技能目录：

```bash
# 解压
unzip r2-upload.zip -d /tmp/r2-upload-extract

# 安装到全局 skills 目录
cp -r /tmp/r2-upload-extract ~/.clawdbot/skills/r2-upload

# 安装依赖
cd ~/.clawdbot/skills/r2-upload
npm install
```

### 步骤三：配置 R2 凭证

创建配置文件 `~/.r2-upload.yml`：

```yaml
# R2 Upload Configuration

default: your-bucket-name

buckets:
  your-bucket-name:
    endpoint: https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com
    access_key_id: YOUR_ACCESS_KEY_ID
    secret_access_key: YOUR_SECRET_ACCESS_KEY
    bucket_name: your-bucket-name
    public_url: https://your-custom-domain.com
    region: auto
```

**配置说明：**

| 配置项 | 说明 |
|--------|------|
| `endpoint` | R2 端点地址，格式为 `https://<ACCOUNT_ID>.r2.cloudflarestorage.com` |
| `access_key_id` | R2 API Token 的 Access Key ID |
| `secret_access_key` | R2 API Token 的 Secret Access Key |
| `bucket_name` | R2 Bucket 名称 |
| `public_url` | 自定义域名（可选，用于生成公开访问链接） |
| `region` | 地区，R2 固定使用 `auto` |

### 步骤四：重启 Clawdbot

使 Skill 生效：

```bash
clawdbot gateway restart
```

## 使用方法

### 通过 Clawdbot 对话

在 Clawdbot 对话中直接使用：

```
上传这张图片到 R2
```

或指定参数：

```
上传 /path/to/file.jpg 到 R2，有效期 24 小时
```

### 可用工具

R2 Upload Skill 提供以下工具：

| 工具 | 说明 |
|------|------|
| `r2_upload` | 上传文件并获取预签名 URL |
| `r2_list` | 列出 Bucket 中的文件 |
| `r2_delete` | 删除文件 |
| `r2_generate_url` | 为已存在文件生成预签名 URL |

### 上传示例

```bash
# 上传文件
r2-upload /path/to/file.pdf

# 指定自定义路径
r2-upload /path/to/file.pdf --key uploads/2026/report.pdf

# 指定 Bucket
r2-upload /path/to/file.pdf --bucket my-bucket

# 自定义有效期（默认 5 分钟）
r2-upload /path/to/file.pdf --expires 24h
r2-upload /path/to/file.pdf --expires 1d
r2-upload /path/to/file.png --expires 300  # 秒

# 生成公开链接（无需签名）
r2-upload /path/to/file.png --public
```

## R2 配置详解

### 获取 R2 Endpoint

1. 登录 Cloudflare Dashboard
2. 进入 R2 → 你的 Bucket
3. 查看 "S3 API" 部分，获取 Endpoint 地址

格式：`https://<ACCOUNT_ID>.r2.cloudflarestorage.com`

### 创建 API Token

1. 进入 https://dash.cloudflare.com/<ACCOUNT_ID>/r2/api-tokens
2. 创建新 Token：
   - 应用到特定 Bucket
   - 权限：Object Read & Write
3. 复制 Access Key ID 和 Secret Access Key

### 自定义域名配置（可选）

如果你有自定义域名（如 `oss.example.com`）：

1. 在 Cloudflare DNS 中添加 CNAME 记录
2. 在 R2 设置中绑定自定义域名
3. 在配置文件中设置 `public_url`

## 常见问题

### Q: 上传后链接打不开？

检查：
1. 预签名链接是否过期（默认 5 分钟）
2. Bucket 是否设置为公开访问
3. 自定义域名是否正确配置

### Q: 如何修改默认有效期？

在配置文件或环境变量中设置：

```yaml
# ~/.r2-upload.yml
default_expires: 3600  # 1 小时
```

或使用环境变量：

```bash
export R2_DEFAULT_EXPIRES=3600
```

### Q: 可以上传到多个 Bucket 吗？

可以，在配置文件中定义多个 Bucket：

```yaml
default: blog

buckets:
  blog:
    endpoint: https://blog.r2.cloudflarestorage.com
    # ... 其他配置
    
  assets:
    endpoint: https://assets.r2.cloudflarestorage.com
    # ... 其他配置
```

上传时指定 Bucket：

```
上传图片到 assets bucket
```

## 总结

通过以上步骤，你已经成功为 Clawdbot 安装了 R2 Upload Skill。现在可以轻松上传文件并生成分享链接了。

相比传统的文件上传方式，R2 + Clawdbot 的组合具有以下优势：

- ✅ 零服务器成本（R2 只收存储和流量费）
- ✅ 全球 CDN 加速
- ✅ 自动生成短期有效链接
- ✅ 安全可控的访问权限
- ✅ 支持自定义域名

如果你正在使用 Clawdbot 进行 AI 开发，R2 Upload Skill 是一个非常实用的工具。

---

**参考链接：**

- [Clawdbot 官方文档](https://docs.clawd.bot)
- [R2 官方文档](https://developers.cloudflare.com/r2/)
- [ClawdHub](https://clawdhub.com)

**标签：** Clawdbot, R2, Cloudflare, 存储, 教程
