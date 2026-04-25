---
title: "VSCode Copilot 背后的基础知识"
date: "2026-04-15"
tags: ["AI", "Copilot", "VSCode"]
description: "结合 VS Code 官方文档，从 Language Models、Agent Loop、Context、Tools 到 Agent Types，梳理 Copilot 在编辑器中的工作机制与实践原则。"
cover: "https://picsum.photos/seed/vscode-copilot-basics/1200/630"
---

**本文概览**：本文参考 [How AI works in VS Code](https://code.visualstudio.com/docs/copilot/core-concepts)，沿用 **`Language Models -> Agent Loop -> Context -> Tools -> Agent Types`** 结构，从机制出发，结合实际使用中的理解，介绍 Copilot 在 VS Code 中的工作方式。

---

## 1. Large Language Model

每个模型都有不同的优缺点，有的速度快适合简单的完成，有的拥有更大的上下文窗口或者更强的推理，适合复杂任务，我们可以根据需求切换不同的模型。

> 复杂任务尽量都去用推理能力更强的模型，opus/codex/gemini pro...

Copilot 按照 request 次数收费。

- Copilot Pro 每月 300 次高级请求，GPT-5 mini、GPT-4.1 和 GPT-4o 无限
- Copilot Pro+ 每月 1500 次高级请求
- 点击状态栏中 Copilot 图标可以看到 usage 面板

| Feature | Premium request consumption 高级请求消费 |
| --- | --- |
| Copilot Chat | Copilot Chat 使用每个用户提示的**高级请求**，乘以模型的速率。这包括在 IDE 中的 Copilot 聊天中请求、编辑、代理和计划模式 |
| Copilot CLI | 每个发送给 Copilot CLI 的提示都使用**默认型号的高级请求**。对于其他模型，这个数值会乘以模型的速率 |
| Copilot code review | 每次 Copilot 审核拉取请求或审核你的 IDE 代码时，都会消耗一个高级请求 |
| Copilot coding agent | Copilot coding Agent 每次会话使用一个高级请求，乘以模型速率；此外会话中每个实时引导评论也会消耗高级请求 |
| Copilot Spaces | Copilot Spaces 使用每个用户提示的高级请求，乘以模型的速率 |
| Spark | 每个给 Spark 的提示使用固定的四个高级请求 |
| Codex 插件 | 每个 OpenAI Codex 提示使用一个高级请求，乘以模型乘数率 |
| 第三方 coding agent（Codex/Claude） | 每个向第三方 coding agent 发送的提示都使用一个高级请求 |

## 2. Agent Loop

**核心概念**：Agent Loop 是 Copilot 处理任务时的执行模式。

> 📎 [How AI works in VS Code - Agent Loop](https://code.visualstudio.com/docs/copilot/core-concepts)

### 2.1 什么是 Agent Loop

Agent Loop 是 Copilot 处理任务时的执行模式。市面上的 Agent 基本都是基于 ReAct 做的一套 While 循环：

```text
用户输入
→ Agent 推理（判断下一步做什么）
  → 工具调用（读文件、改代码、跑测试……）
    → 工具输出反馈给 Agent
      → Agent 再次推理
        → …… 直到任务完成
```

官方将这个循环归纳为三个阶段：

1. **Understand**：读取文件、搜索代码库、查阅文档，理解需要改什么
2. **Act**：修改代码、运行终端命令、安装依赖、调用外部服务
3. **Validate**：运行测试、检查编译错误、审查自身修改。如果有问题，继续迭代

Agent 会根据需要将这些动作串联起来，直到完成任务。

- 回答一个代码库相关的问题可能只需要读几个文件
- 实现一个新功能则可能要经历“编辑 → 跑测试 → 诊断失败 → 再编辑”的多轮循环

Agent 在每一轮迭代中，都会先通过推理决定下一步该执行哪类动作。

如果模型在 Understand 的时候，认为当前上下文已经够用，它可能就不会主动搜索，减少上下文占用。当然这又会产生决策惰性，可以再根据具体的需求来判断是否添加 Hook。

### 2.2 用户始终保有控制权

在整个 Agent Loop 过程中：

- ✅ 每一步操作，尤其是终端命令，都需要用户审批
- ✅ 文件修改以 diff 形式展示，可以逐条接受或拒绝来 Review Edits
- ✅ Agent 执行过程中会在对话记录里创建 checkpoint，可以随时回滚到之前的状态
- ✅ 可以在 Agent 执行中途发送新消息，重新引导方向，新的消息会排队执行，多条消息排队过程中可以调节顺序

### 2.3 Tips

- **为什么清晰的任务描述很重要？** Agent Loop 的第一步就是“理解目标”。目标越清晰，Understand 阶段越短，后续循环越高效。模糊的描述会导致 Agent 消耗更多轮次在理解需求上，还可能搜索到不相关的上下文。
- **为什么建议提供约束条件？** 显式的约束减少了模型在理解需求时的歧义，让每一步对应更明确的行动，从而降低出错的空间。

---

## 3. Context 上下文机制

**核心概念**：Context 是模型在生成回复时能“看到”的所有信息。模型只能基于它看到的东西进行推理，Context 之外的一切，对模型来说都不存在。有效管理上下文是提升 Copilot 表现的关键。

> 📎 [Manage context for AI](https://code.visualstudio.com/docs/copilot/chat/copilot-chat-context) · [Workspace Context](https://code.visualstudio.com/docs/copilot/reference/workspace-context)

### 3.1 什么是 Context

Context 是模型在生成回复时能“看到”的所有信息。模型只能基于它看到的东西进行推理，Context 之外的一切，对模型来说都不存在。我们对话过程中没告诉 AI 的也能理解，是它自己去搜索了相关的资料。

### 3.2 VS Code 如何组装上下文

每次发送消息时，VS Code 会从多个来源组装一个完整的 prompt 发送给模型：

| 层级 | 内容 | 来源 |
| --- | --- | --- |
| 🏢 **System instructions** | Agent 的内置行为指令 | 系统 |
| 🛠️ **Customizations** | 自定义 Agent、Skills、Custom Instructions | 用户配置 |
| 💬 **User message** | 你当前发送的消息 | 用户 |
| 📚 **Conversation history** | 当前会话中的历史消息 | 自动累积 |
| 👁️ **Implicit context** | 当前编辑的文件、选中代码、可见错误、git 状态 | 自动 |
| 📎 **Explicit references** | 通过 `#file`、`#codebase`、`#fetch`、拖拽等方式添加的内容 | 用户主动提供 |
| 🔧 **Tool outputs** | 文件读取、终端输出、代码搜索结果等工具调用的返回值 | Agent 决策 |

**这个组装后的 prompt 就是模型看到的全部。** 这就是为什么用 `#file` 指定文件比泛泛提问效果更好，因为我们确保了关键信息能被模型看到。

### 3.3 上下文窗口

上下文窗口是模型在单次请求中能处理的总信息量，以 token 为单位。上述所有层级的内容：系统指令、历史对话、文件内容、工具输出、你的消息、模型的回复，全部从同一个 token 预算中扣减。不同模型的窗口大小不同，比如 128K tokens。

一些版本的 VS Code 的 Chat 输入框在对话中会出现一个**上下文窗口使用量指示器**，可以看到当前 token 用量和分类占比。

### 3.4 上下文压缩

当上下文窗口接近满载时，VS Code 会自动进行压缩。

- **对话历史**会被压缩为摘要，当前执行的任务和关键代码片段会被保持，但是早期的详细指示可能会丢失
- **旧的工具输出**通常是最先被清理的内容
- 添加的文件如果超出上下文窗口大小，会被替换成一个包含函数和描述但不包括具体实现代码的大纲；如果大纲也非常大，文件就不会被添加到 prompt 里

通常保留的 summary 内容包括：

- 当前进展与关键决策
- 重要的上下文、约束或用户偏好
- 还剩下什么需要去做
- 继续任务需要使用的关键数据、示例或参考内容

### 3.5 工作区索引与检索

Copilot 检索工作区信息时使用多种策略：

| 索引类型 | 说明 |
| --- | --- |
| 🌐 **Remote index** | 代码托管在 GitHub 上时，可构建远程索引，适合大型代码库 |
| 💻 **Local index** | 本地语义索引，提供快速精确的搜索结果 |
| 📁 **Basic index** | 本地基础索引，适合语义索引不可用时的大型代码库 |

此外，还可以通过以下方式显式提供上下文：

| 方式 | 说明 |
| --- | --- |
| `#file` / `#folder` | 指定具体文件或文件夹 |
| `#codebase` | 让 VS Code 自动搜索相关代码 |
| `#fetch <URL>` | 抓取网页内容，如 API 文档 |
| `#githubRepo <repo>` | 在 GitHub 仓库中进行代码搜索 |
| 拖拽文件到 Chat | 直接添加文件为上下文 |
| 图片 / 浏览器元素 | 视觉上下文（Preview） |

### 3.6 Implicit Context 的差异

不同 Agent 对隐式上下文的处理方式不同：

- **Ask**：自动将当前活动文件包含为上下文
- **Agent**：自主判断当前活动文件是否需要加入上下文

### 3.7 Tips

- **为什么长对话后 Agent 的表现会下降？** 因为上下文压缩是渐进发生的。在第 5 轮提到的关键约束，可能在第 20 轮时已经被压缩或丢弃了。
- **如何持久化关键决策？** 在关键节点让 Agent 将当前规划和已确认的决策写成文档。文件不会被上下文压缩影响，下次新开会话时通过 `#file` 引入即可恢复完整背景。
- **为什么有时候开新会话比继续追问更有效？** 新会话等于全新的 token 预算。旧会话中积累的工具输出、探索性对话都不再占用空间。

---

## 4. Tools 工具机制

**核心概念**：Tools 是让模型能够**作用于开发环境**的机制。没有 Tools，模型只能基于已有上下文生成文本；有了 Tools，Agent 可以读写文件、执行命令、搜索代码、调用外部服务。

> 📎 [Tools available to agents](https://code.visualstudio.com/docs/copilot/agents/agent-tools)

### 4.1 Tools 的角色

Tools 是让模型能够作用于开发环境的机制。

没有 Tools，模型只能基于已有上下文生成文本；有了 Tools，Agent 可以读写文件、执行命令、搜索代码、调用外部服务。

### 4.2 工具类型

| 类型 | 能力 |
| --- | --- |
| 🔨 **内置工具** | 文件读写、终端执行、代码搜索、编辑器导航、网络搜索 |
| 🔗 **MCP servers** | 通过 Model Context Protocol 连接外部服务，如数据库、API、文档系统等 |
| ⚓ **Hooks** | 在 Agent Loop 的特定节点自动执行命令，如每次编辑后自动格式化 |

### 4.3 工具调用

```text
调用工具 → 工具输出注入上下文 → 可用 token 减少
  → 多次调用 → 上下文可能被大量工具输出占据
    → 触发压缩 → 早期对话和决策信息被压缩
```

另外，启用过多工具也会影响模型的工具选择准确性，定义清晰且互不重叠的工具集更有效。

### 4.4 Tips

- **当 Agent 没有主动搜索时**，不一定是遗漏。可能是模型判断当前上下文已经够用，主动搜索反而会挤占空间。如果它确实遗漏了关键信息，可以用 `#file` 等方式显式注入。
- **MCP 的价值**：MCP 是标准化的外部工具接入协议，将 Copilot 的能力边界从“本地工作区”扩展到外部世界。

---

## 5. Agent 的类型与选择

**核心概念**：Agent 运行在不同的环境中，适用于不同的场景和监督程度。理解不同类型 Agent 的特点，能帮助你为特定任务选择最合适的工具。

> 📎 [Agents Overview](https://code.visualstudio.com/docs/copilot/agents/overview) · [Local Agents](https://code.visualstudio.com/docs/copilot/agents/local-agents) · [Planning with Agents](https://code.visualstudio.com/docs/copilot/agents/planning)

### 5.1 四大类 Agent

| 类型 | 运行环境 | 交互方式 | 适用场景 |
| --- | --- | --- | --- |
| 🖥️ **Local Agents** | 本地 VS Code | 实时交互 | 需要即时反馈的任务：探索、规划、编码 |
| 🔄 **Background Agents** | 本地独立进程 | 后台自主执行 | 范围明确的任务，执行期间继续做其他事 |
| ☁️ **Cloud Agents** | GitHub 远程基础设施 | 通过 PR 协作 | 团队协作、代码审查、Issue 分配给 Agent |
| 🔗 **Third-party Agents** | 外部 AI 提供商 | 可与其他类型互相移交 | 需要特定模型能力时 |

### 5.2 Local Agent 的三个内置 Custom Agent

#### Agent（编码 Agent）

用于基于高层级需求的复杂编码任务。

Agent 自主运行 Agent Loop：确定相关上下文和文件、规划工作、执行修改、遇到问题时自动迭代修复。代码修改直接应用到编辑器中，通过 diff 视图审阅。

#### Plan Agent（规划模式）

Plan Agent 的核心设计原则是**只读**，它不修改任何文件，只负责在实现前创建结构化的执行方案。

Plan Agent 四阶段工作流：

| 阶段 | 行为 | 说明 |
| --- | --- | --- |
| 🔍 **Discovery（发现）** | 使用只读工具调研代码库 | 识别需求和约束 |
| 🤝 **Alignment（对齐）** | 交互式提问 | 暂停 Agent 等待你回答，确保理解准确 |
| 🎨 **Design（设计）** | 输出结构化方案 | 包含步骤分解、验证标准、已确认的决策 |
| 🔄 **Refinement（迭代）** | 根据反馈调整方案 | 可多次迭代再确认 |

方案确认后，可以一键移交给编码 Agent、Background Agent 或 Cloud Agent 去实现。

**为什么 Plan Agent 被设计为只读？**

- **分离决策与执行**：规划阶段关注“是否遗漏需求”，执行阶段关注“是否正确修改”，混在一起会让两种标准互相干扰
- **降低风险**：方案不确定时就开始修改文件，可能需要大量回滚
- **提高可审阅性**：审阅一份结构化方案比审阅散落在多个文件中的 diff 更高效

#### Ask（问答模式）

Ask 用于回答关于代码库、编程概念和技术问题的问题。它使用只读的 agentic 能力来调研代码库和收集上下文，但不会修改文件。

与 Agent 的区别在于：Ask 自动将当前活动文件包含为上下文，适合需要理解代码或探索想法的场景。

### 5.3 Tips

| 我想要…… | 建议使用 |
| --- | --- |
| 探索想法、理解代码、快速问答 | Ask |
| 制定结构化实现方案 | Plan Agent |
| 端到端实现功能、修复跨文件问题 | Agent（编码 Agent） |
| 执行明确任务，同时做其他事 | Background Agent / Cloud Agent |
| 创建 PR 进行团队协作 | Cloud Agent |

推荐工作流：

```text
Plan Agent（规划）
  ↓ 方案确认，Handoff
编码 Agent / Background Agent（实现）
  ↓ 实现完成
审阅修改 / 运行测试
```

这也是当前 VS Code 推荐的复杂任务模式：**Explore → Plan → Implement → Review**。

---

## 6. Customization 工具

**核心概念**：为了增加 AI 能力和适配自己的需求，围绕模型本身做了很多 Harness 工作。这些定制化工具能显著提升 Copilot 在特定场景下的表现。

### 6.1 Custom Agent

Agent 通过 `*.agent.md` 文件定义，每个文件就是一个独立的 Agent 角色。官方内置的 Plan Agent 也是一种 Custom Agent，它被限制为只读工具，从而实现了“只规划、不执行”的行为。

### 6.2 Skill

Skill 是一套包含指令、脚本和资源的能力包。把专业知识、步骤、代码打包成“技能包”。

Skills 的工作原理是渐进式加载：

1. **Discovery**：启动时，Agent 仅加载每个 Skill 的名称和描述
2. **Activation**：当任务与某个 Skill 的描述匹配时，Agent 才会按需将该 Skill 的完整 `SKILL.md` 指令读入当前上下文
3. **Execution**：Agent 遵循指令执行任务，并根据需要动态加载引用文件或运行捆绑的脚本代码

### 6.3 Instruction

Instruction 使你能够定义通用的指导方针和规则，自动影响 AI 生成代码和处理其他开发任务的方式。

如果每个聊天都需要包含重复的上下文，那么就可以在 Markdown 文件中自定义指令。支持全局、workspace 和 grep 匹配特定文件。

### 6.4 MCP

模型上下文协议（MCP）是一个用于连接人工智能模型与外部工具和服务的开放标准。在 Visual Studio Code 中，MCP 服务器提供文件操作、数据库或外部 API 等任务的工具。

### 6.5 Hook

Hook 使你能够在代理会话的关键生命周期点执行自定义壳命令。使用 hook 自动化工作流程、执行安全策略、验证操作并与外部工具集成。

---

## 7. 总结与实践原则

**核心总结：** 模型驱动推理，Agent Loop 编排执行，Context 决定可见范围，Tools 决定能力边界，Agent Types 决定协作模式，Customization 适配具体场景。理解机制，最佳实践就是自然推论。

| 原则 | 对应机制 | 要点 |
| --- | --- | --- |
| 优化项目配置 | Context + Customization | 用 Instructions / Skills 提前注入 AI 无法从代码推断的信息，保持精练 |
| 选对交互方式 | Agent Types | 问答用 Ask，局部编辑用 Inline Chat，跨文件用 Agent，复杂需求先 Plan |
| 写好 Prompt | Agent Loop · Understand | 具体化约束，拆解任务，提供测试用例让 AI 自验证，方向不对尽早纠偏 |
| 主动注入上下文 | Context 组装 | `#file` 显式指定比依赖自动搜索更可靠 |
| 匹配模型能力 | LLM | 简单补全用快速模型，复杂推理用强模型，不满意就换模型试 |
| 先规划再实现 | Plan Agent + Agent Loop | Explore → Plan → Implement → Review，分离决策与执行 |
| 审阅验证产出 | 用户控制权 | AI 输出是起点不是终点，审阅 diff，跑测试，跑偏用 checkpoint 回滚 |
| 管理会话生命周期 | 上下文窗口与压缩 | 新任务开新会话，子代理隔离调研，主动总结文档防压缩丢失 |
