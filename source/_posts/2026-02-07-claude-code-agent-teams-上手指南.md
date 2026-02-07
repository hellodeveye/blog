---
title: Claude Code Agent Teams 上手指南：启用、协作与最佳实践
date: 2026-02-07 14:30:00
tags: [Claude Code, Agent Teams, 多智能体, OpenClaw, 工具]
categories: [工具]
---

![Agent Teams 封面图](https://oss.foundra.me/images/2026/02/07/agent-teams-cover.jpeg)

**OpenClaw 社区先做到了多会话协作，Anthropic 直接把它做成了官方功能。** 这不是一个小更新，而是 Claude Code 的工作方式从“单兵作战”升级为“团队协作”。这篇文章带你快速上手 Agent Teams：什么时候值得用、怎么开、怎么配、怎么管、哪里会踩坑。

## 先说结论：这不是“更强的 Sub-agent”，而是“真正的团队”
以前你只有一个会话，所有事情顺序完成：先研究、再改代码、再写测试。Agent Teams 出现后，**一个 lead 负责拆解任务，多个 teammate 并行协作**，还能互相交流、共享任务列表。

更直观的对比：
- **Sub-agents**：像派一个助理去拿答案，回来报告。
- **Agent Teams**：像把一群专家放进同一个项目里协作。

如果任务需要互相沟通、互相校验，Agent Teams 才真正发挥价值。

## 什么时候该用？什么时候是过度设计？
**适合用的场景**（并行能带来明显收益）：
- **研究/评审**：不同队友分别看代码、查资料、提风险点。
- **跨层开发**：一个队友做前端，一个队友做后端，一个队友写测试。
- **调试**：多条假设并行验证，避免单一路径走歪。

**不适合用的场景**：
- 强顺序依赖（第二步必须等第一步完成）。
- 同文件高频编辑（容易覆盖冲突）。
- 很小的任务（协调成本比收益更高）。

一句话：**能拆成独立任务的，用团队；必须串行的，用单人或 sub-agent。**

## 如何启用 Agent Teams（30 秒完成）
Agent Teams 目前是实验功能，默认关闭。你有两种方式开启：

**方式 1：修改 `settings.json`**（推荐，持久化）
```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

**方式 2：环境变量**（临时）
```bash
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
```

启用后，Claude Code 会识别团队指令。官方文档可参考：
[Agent Teams 文档](https://code.claude.com/docs/en/agent-teams)

## 启动团队：最重要的是“清晰的角色分工”
你不需要特殊语法，只要给 lead 一个清晰任务和分工提示。

示例（高质量提示）：
> 我在设计一个 CLI 工具，扫描代码里的 TODO 并生成报告。创建一个 agent team：
> - teammate A：从用户体验角度给出功能优先级
> - teammate B：提出技术架构与实现路径
> - teammate C：以“反对者”视角挑出风险与替代方案

好的 prompt = **明确角色 + 独立任务 + 预期输出**。这一步越清楚，成本越低。

## 运行中如何控制团队
当团队跑起来后，必须知道 3 个关键操作：

1) **直接和任意队友对话**
- In-process 模式：`Shift + 上/下` 切换队友
- Split-pane 模式：点击对应 pane（需要 tmux 或 iTerm2）

2) **Delegate mode（防止 lead 抢活）**
有时候 lead 会“忍不住自己干”。开启 delegate mode 后，lead 只能协调：分配任务、发消息、管理列表。
- 切换快捷键：`Shift + Tab`

3) **任务分配与回收**
- 可由 lead 指派，也可被队友自动领取
- 队友完成后建议主动“汇报 + 标记完成”

## Agent Teams vs Sub-agents：如何选？
**决策问题就一个：是否需要队友之间的沟通？**

- 不需要互相沟通，只要结果 → **Sub-agents**（便宜、快、适合单点任务）
- 需要协作、互相对齐 → **Agent Teams**（贵、但能处理复杂系统）

**成本提醒**：Agent Teams 可能是 sub-agent 成本的数倍，请在“收益明显”时使用。

## 最佳实践：少走弯路的 7 条经验
1) **Spawn prompt 要细**：不要假设队友知道你的历史上下文。清楚写清目标、范围、输入/输出。
2) **任务粒度适中**：能在 15–40 分钟内完成并交付。
3) **避免同文件编辑**：同一文件交给一个队友，减少合并冲突。
4) **定期 check-in**：每 15–20 分钟主动询问进展，避免跑偏太久。
5) **先做“研究/评审”试水**：最容易看到并行价值。
6) **任务列表清晰**：拆成可验收的子任务，完成后立刻标记。
7) **用角色命名**：如 `frontend`, `backend`, `test`, `review`，便于协作。

## 当前已知限制（避免误踩）
- **会话恢复不支持**：`/resume` 或 `/rewind` 不会恢复队友。
- **任务状态偶尔延迟**：完成了但未标记，需手动更新或提醒。
- **一个会话只能有一个团队**：不能创建多个团队或转移 lead。
- **Split-pane 有终端限制**：仅支持 tmux 或 iTerm2。

## Key Takeaways
- Agent Teams 适合**并行协作**，不适合顺序强依赖任务。
- **清晰的角色与任务拆解**是效率与成本的关键。
- Delegate mode 可以让 lead 专注管理，不再自己动手。
