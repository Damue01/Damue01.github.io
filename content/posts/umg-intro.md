---
title: "UMG 初探"
date: "2024-11-20"
tags: ["UE", "UMG"]
description: "Unreal Motion Graphics (UMG) 入门指南，探索 UE 的 UI 框架设计理念、Widget 架构和最佳实践。"
cover: "https://picsum.photos/seed/umg-intro/1200/630"
---

# UMG 初探

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

## Slate vs UMG

Slate 是 UE 的底层 UI 框架，UMG 是基于 Slate 的高级封装：

| 特性 | Slate | UMG |
|------|-------|-----|
| 编辑方式 | 纯 C++ | 可视化 + C++ |
| 性能 | 更高 | 略低 |
| 灵活性 | 完全控制 | 受限于蓝图 |
| 适用场景 | 编辑器 UI | 游戏 UI |

## 性能优化

1. 减少 Widget 层级深度
2. 使用 Invalidation Box 缓存渲染
3. 避免频繁的属性绑定
4. 合理使用 Visibility 替代 Remove/Add

## 实战经验

在实际项目中，推荐采用 C++ 基类 + UMG 蓝图派生的混合模式，兼顾性能与开发效率。
