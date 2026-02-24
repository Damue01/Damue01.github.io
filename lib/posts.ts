// Blog post types and data
export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  description: string;
  cover: string;
  content: string;
}

// Static blog post data (compiled from markdown files)
// In a future iteration, this could use import.meta.glob + gray-matter
export const blogPosts: BlogPost[] = [
  {
    slug: 'ue-animation-system',
    title: 'UE Animation System',
    date: '2024-12-05',
    tags: ['UE'],
    description: '深入分析 Unreal Engine 动画系统的架构设计，包括 AnimInstance、AnimBP、Montage、BlendSpace 等核心模块的工作原理和最佳实践。',
    cover: 'https://picsum.photos/seed/ue-anim/1200/630',
    content: `# UE Animation System

## 动画系统概述

Unreal Engine 的动画系统是一个复杂而强大的框架，主要由以下核心模块组成：

- **AnimInstance**: 动画实例，管理动画蓝图的运行时状态
- **AnimBP (Animation Blueprint)**: 可视化的动画逻辑编辑器
- **Montage**: 动画蒙太奇，用于组合和控制动画序列
- **BlendSpace**: 混合空间，根据多个参数插值混合动画

## AnimInstance 架构

AnimInstance 是动画系统的核心类，负责每帧更新动画状态。它通过 NativeUpdateAnimation 和 BlueprintUpdateAnimation 提供 C++ 和蓝图两种更新路径。

## 动画蒙太奇 (Montage)

Montage 是 UE 中实现复杂动画序列的关键工具。它允许将多个动画片段组合在一起，并通过 Section 和 Slot 进行精确控制。

## BlendSpace

BlendSpace 允许根据运行时参数（如速度、方向）在多个动画之间平滑插值，是实现角色运动系统的关键。

## 性能优化建议

1. 减少不必要的骨骼更新
2. 使用 LOD 系统降低远处角色的动画复杂度
3. 合理使用动画压缩算法
4. 避免在 AnimBP 中使用复杂的数学计算`
  },
  {
    slug: 'ue-learning',
    title: 'UE 学习思路',
    date: '2024-12-05',
    tags: ['UE'],
    description: '分享 Unreal Engine 学习路线规划，从基础概念到高级特性，涵盖 C++、蓝图、渲染管线等核心知识领域。',
    cover: 'https://picsum.photos/seed/ue-learn/1200/630',
    content: `# UE 学习思路

## 前言

作为一名游戏开发者，学习 Unreal Engine 是一个系统工程。本文分享我的学习路线和心得。

## 基础阶段

### C++ 基础
- 掌握现代 C++ (C++17/20) 特性
- 理解 UE 的宏系统 (UCLASS, UPROPERTY, UFUNCTION)
- 熟悉 UObject 和 GC 机制

### 蓝图系统
- 蓝图作为快速原型工具
- 理解蓝图与 C++ 的配合模式
- 蓝图性能注意事项

## 进阶阶段

### 渲染管线
- 延迟渲染 vs 前向渲染
- Material System 和 Shader 编写
- Post Processing 效果链

### Gameplay Framework
- GameMode / GameState / PlayerState 架构
- GAS (Gameplay Ability System)
- 网络同步与复制

## 高级阶段

### 引擎源码
- 深入理解 Tick 系统
- 物理引擎集成 (Chaos)
- 多线程任务系统

## 学习资源推荐

1. 官方文档和示例项目
2. Unreal Slackers Discord
3. Ben Cloward 的材质教程
4. Alex Forsythe 的架构讲解`
  },
  {
    slug: 'umg-intro',
    title: 'UMG 初探',
    date: '2024-11-20',
    tags: ['UE', 'UMG'],
    description: 'Unreal Motion Graphics (UMG) 入门指南，探索 UE 的 UI 框架设计理念、Widget 架构和最佳实践。',
    cover: 'https://picsum.photos/seed/umg-intro/1200/630',
    content: `# UMG 初探

## 什么是 UMG

UMG (Unreal Motion Graphics) 是 Unreal Engine 内置的 UI 框架，基于 Slate 底层构建，提供可视化的 Widget 蓝图编辑器。

## 核心概念

### Widget 架构
- **UUserWidget**: 所有 UI 组件的基类
- **Slot**: 子组件的布局容器
- **Canvas Panel**: 自由定位布局
- **Vertical/Horizontal Box**: 线性布局

### 数据绑定
- Property Binding（属性绑定）
- Event-Driven Updates（事件驱动更新）
- 使用 MVVM 模式分离逻辑与表现

## 性能优化

1. 减少 Widget 层级深度
2. 使用 Invalidation Box 缓存渲染
3. 避免频繁的属性绑定
4. 合理使用 Visibility 替代 Remove/Add

## 实战经验

在实际项目中，推荐采用 C++ 基类 + UMG 蓝图派生的混合模式，兼顾性能与开发效率。`
  },
  {
    slug: 'gas-ui-sync',
    title: 'GAS UI 信息同步',
    date: '2024-11-14',
    tags: ['GAS', 'UI'],
    description: '深入解析 Gameplay Ability System 中 UI 与 Ability 数据的同步方案，包括 Attribute 变化监听、GameplayEffect 状态追踪等。',
    cover: 'https://picsum.photos/seed/gas-ui/1200/630',
    content: `# GAS UI 信息同步

## 概述

在使用 Gameplay Ability System (GAS) 开发游戏时，UI 层如何高效获取和展示 Ability 系统的数据是一个核心挑战。

## Attribute 变化监听

通过监听 ASC 的属性变化委托，UI 可以在属性值发生变化时立即响应更新。

## GameplayEffect 状态追踪

可以通过 ASC 查询当前激活的 GameplayEffect，获取 Buff/Debuff 的剩余时间、堆叠层数等信息。

## 同步架构设计

### 推荐模式

1. **ViewModel 中间层**: 在 ASC 和 UI 之间建立 ViewModel
2. **事件驱动**: 避免每帧轮询，使用委托回调
3. **批量更新**: 将同一帧内的多次变化合并为一次 UI 更新
4. **弱引用**: UI 对 ASC 使用弱引用避免生命周期问题

## 网络同步注意事项

在多人游戏中，GAS 属性的同步还需要考虑 Replication 策略、预测与回滚、以及客户端本地 UI 的即时反馈。`
  }
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(p => p.slug === slug);
}

export function getAllPosts(): BlogPost[] {
  return [...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostsByTag(tag: string): BlogPost[] {
  return getAllPosts().filter(p => p.tags.includes(tag));
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  blogPosts.forEach(p => p.tags.forEach(t => tags.add(t)));
  return Array.from(tags);
}
