---
title: 给 Claude Code 配一个好看的 tmux 状态栏
date: 2026-03-18
tags:
  - Claude Code
  - tmux
  - Ghostty
  - 终端美化
categories:
  - 开发工具
---

用 Claude Code 写代码的时候，总觉得底部空空的，缺点什么。看到别人的终端底部有 Git 分支、文件变更、模型名，一整条信息栏，既实用又好看。研究了一下，其实就是 tmux 状态栏，配置不复杂，记录一下完整过程。

![tmux 状态栏效果](https://oss.foundra.me/2026/03/18/tmux-statusbar.png)

<!-- more -->

## 最终效果

底部一栏显示：用户名、session、窗口、Git 仓库名、分支、文件变更数（绿/黄/红三色）、当前模型名、时间。

其中 Git 变更部分：
- 🟢 绿色 `+2` — 新增/未跟踪文件
- 🟡 黄色 `~1` — 修改的文件
- 🔴 红色 `-1` — 删除的文件

## 第一步：安装 tmux

```bash
brew install tmux
```

## 第二步：创建脚本

一共 5 个小脚本，分别负责不同信息的读取。拆开是为了让 tmux 能给每部分上不同的颜色。

```bash
mkdir -p ~/.config/tmux
```

### Git 分支名

```bash
cat > ~/.config/tmux/git-branch.sh << 'EOF'
#!/bin/bash
cd "$1" 2>/dev/null || exit 0
git rev-parse --is-inside-work-tree &>/dev/null || exit 0
branch=$(git symbolic-ref --short HEAD 2>/dev/null || git rev-parse --short HEAD 2>/dev/null)
[ -z "$branch" ] && exit 0
repo=$(basename "$(git rev-parse --show-toplevel 2>/dev/null)")
echo "${repo}  ${branch}"
EOF
```

### 新增文件数（绿色）

```bash
cat > ~/.config/tmux/git-added.sh << 'EOF'
#!/bin/bash
cd "$1" 2>/dev/null || exit 0
git rev-parse --is-inside-work-tree &>/dev/null || exit 0
staged=$(git diff --cached --numstat 2>/dev/null | wc -l | tr -d ' ')
untracked=$(git ls-files --others --exclude-standard 2>/dev/null | wc -l | tr -d ' ')
n=$((staged + untracked))
[ "$n" -gt 0 ] && echo "+${n}" || echo ""
EOF
```

### 修改文件数（黄色）

```bash
cat > ~/.config/tmux/git-modified.sh << 'EOF'
#!/bin/bash
cd "$1" 2>/dev/null || exit 0
git rev-parse --is-inside-work-tree &>/dev/null || exit 0
n=$(git diff --numstat 2>/dev/null | wc -l | tr -d ' ')
[ "$n" -gt 0 ] && echo "~${n}" || echo ""
EOF
```

### 删除文件数（红色）

```bash
cat > ~/.config/tmux/git-deleted.sh << 'EOF'
#!/bin/bash
cd "$1" 2>/dev/null || exit 0
git rev-parse --is-inside-work-tree &>/dev/null || exit 0
n=$(git diff --diff-filter=D --name-only 2>/dev/null | wc -l | tr -d ' ')
[ "$n" -gt 0 ] && echo "-${n}" || echo ""
EOF
```

### 模型名读取

从 Claude Code 的 `settings.json` 中动态读取当前模型：

```bash
cat > ~/.config/tmux/tmux-model.sh << 'EOF'
#!/bin/bash
model=""
if [ -f ~/.claude/settings.json ]; then
  model=$(grep -o '"ANTHROPIC_MODEL"[[:space:]]*:[[:space:]]*"[^"]*"' ~/.claude/settings.json | head -1 | sed 's/.*: *"//;s/"//')
fi
[ -z "$model" ] && model="$ANTHROPIC_MODEL"
[ -z "$model" ] && exit 0
echo "$model"
EOF
```

### 统一加执行权限

```bash
chmod +x ~/.config/tmux/*.sh
```

## 第三步：创建 tmux 配置

```bash
cat > ~/.tmux.conf << 'CONF'
# 基础
set -g default-terminal "tmux-256color"
set -ag terminal-overrides ",xterm-256color:RGB"
set -ag terminal-overrides ",ghostty:RGB"
set -g mouse on
set -g base-index 1
setw -g pane-base-index 1
set -g renumber-windows on
set -g history-limit 50000
set -sg escape-time 0
set -g focus-events on

# 快捷键：前缀改为 Ctrl+a
unbind C-b
set -g prefix C-a
bind C-a send-prefix
bind r source-file ~/.tmux.conf \; display-message "✅ 配置已重新加载"
bind | split-window -h -c "#{pane_current_path}"
bind - split-window -v -c "#{pane_current_path}"
bind c new-window -c "#{pane_current_path}"
bind h select-pane -L
bind j select-pane -D
bind k select-pane -U
bind l select-pane -R
setw -g mode-keys vi

# 状态栏（One Dark 配色，匹配 Ghostty 默认背景）
set -g status on
set -g status-interval 3
set -g status-position bottom
set -g status-justify left
set -g status-style "bg=#282c34,fg=#5c6370"

# 左侧：用户名 · session
set -g status-left-length 40
set -g status-left "#[fg=#98c379,bold] #(whoami)#[fg=#4b5263] · #[fg=#c678dd]#S  "

# 右侧：Git（多色）+ 模型名 + 时间
set -g status-right-length 150
set -g status-right "#[fg=#61afef]#(~/.config/tmux/git-branch.sh '#{pane_current_path}') #[fg=#98c379]#(~/.config/tmux/git-added.sh '#{pane_current_path}') #[fg=#e5c07b]#(~/.config/tmux/git-modified.sh '#{pane_current_path}') #[fg=#e06c75]#(~/.config/tmux/git-deleted.sh '#{pane_current_path}') #[fg=#4b5263]· #[fg=#98c379]#(~/.config/tmux/tmux-model.sh)#[fg=#4b5263] · #[fg=#e06c75]%H:%M "

# 窗口标签
setw -g window-status-format "#[fg=#4b5263] #I:#W "
setw -g window-status-current-format "#[fg=#abb2bf,bold] #I:#W "
setw -g window-status-separator ""

# 边框
set -g pane-border-style "fg=#3e4452"
set -g pane-active-border-style "fg=#61afef"
set -g message-style "bg=#282c34,fg=#abb2bf"
CONF
```

> 如果你的 Ghostty 用了其他主题，把 `bg=#282c34` 改成你的终端背景色，状态栏就能无缝融合。

## 第四步：启动

```bash
tmux
```

进入一个 Git 项目目录，底部就能看到完整的状态信息了。

## 第五步（可选）：开终端自动进 tmux

```bash
echo '
if command -v tmux &> /dev/null && [ -z "$TMUX" ]; then
  tmux attach -t default || tmux new -s default
fi' >> ~/.zshrc
```

## 快捷键速查

| 操作 | 按键 |
|---|---|
| 左右分屏 | `Ctrl+a` `\|` |
| 上下分屏 | `Ctrl+a` `-` |
| 切换面板 | `Ctrl+a` `h/j/k/l` |
| 新建窗口 | `Ctrl+a` `c` |
| 切换窗口 | `Ctrl+a` `1/2/3` |
| 断开（后台运行） | `Ctrl+a` `d` |
| 重新连回 | `tmux a` |
| 重载配置 | `Ctrl+a` `r` |

## 配色说明

状态栏用 One Dark 色系，和 Ghostty 默认主题一致：

| 元素 | 颜色 | 色值 |
|---|---|---|
| 用户名 / 模型名 | 🟢 绿色 | `#98c379` |
| session 名 | 🟣 紫色 | `#c678dd` |
| Git 分支 | 🔵 蓝色 | `#61afef` |
| 新增文件 | 🟢 绿色 | `#98c379` |
| 修改文件 | 🟡 黄色 | `#e5c07b` |
| 删除文件 | 🔴 红色 | `#e06c75` |
| 时间 | 🔴 红色 | `#e06c75` |

如果用 Catppuccin 或 Dracula 主题，换掉这几个色值就行。
