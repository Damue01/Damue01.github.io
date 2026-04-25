# Damue's Portfolio

个人博客 & 作品集站点 — [damue.fun](https://damue.fun)

## Tech Stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS v4 (`@tailwindcss/vite`)
- Three.js (React Three Fiber)
- Framer Motion
- Markdown via `remark` + `remark-gfm` + `rehype-highlight`

## Development

```bash
npm install
npm run dev
```

打开 http://localhost:3000。

## Blog Posts

文章源文件位于 `content/posts/*.md`，带有 YAML frontmatter：

```md
---
title: "标题"
date: "YYYY-MM-DD"
tags: ["AI", "UE"]
description: "一句话简介"
cover: "封面图 URL"
---

正文 Markdown ...
```

文件会在构建期由 `import.meta.glob` 自动收集进 bundle，不需要手动登记。

## Deploy

构建并部署到 GitHub Pages（`gh-pages` 分支）：

```bash
npm run deploy
```

## Structure

- `main` — 源码分支
- `gh-pages` — 部署分支（自动生成，勿手动修改）
