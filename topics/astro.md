# Astro 入門手順書

このページは、Astro を初めて使う方向けの最短手順と基本概念をまとめたものです。

## Astro とは
- 高速な静的サイト/SSR に対応した Web フレームワーク
- Island Architecture（必要な箇所だけクライアントJSを読み込む）
- Markdown/MDX と各種UIフレームワーク（React/Vue/Svelteなど）を統合可能

## 前提条件
- Node.js: v18.20.8 以降、または v20.3.0 以降、または v22.0.0 以降（v19 と v21 は非対応）
- npm / pnpm / yarn のいずれか（ここでは npm を使用）

```bash
node -v
npm -v
```

## プロジェクト作成
```bash
# 対話的に新規プロジェクトを作成
npm create astro@latest
# プロジェクト名・テンプレート（ブログ/最小構成など）を選択
# TypeScript, Strict Mode, eslint などは用途に応じて選択

cd <project-name>
npm install   # 選択次第では不要
npm run dev   # 開発サーバー起動（デフォルト: http://localhost:4321）
```
* create astroコマンドの詳細
https://github.com/withastro/astro/blob/main/packages/create-astro/README.md

## ディレクトリ構成（基本）
```
project/
  src/
    pages/          # ルーティング（.astro/.md/.mdx）
    components/     # 再利用コンポーネント
    layouts/        # レイアウト
    content/        # Content Collections（任意）
  public/           # 静的アセット（そのまま配信）
  astro.config.mjs  # 設定
```

## 最初のページ
- `src/pages/index.astro` を作成すると `/` にマッピングされます。
```astro
---
// frontmatter（サーバー側）
const title = 'Hello Astro';
---
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <title>{title}</title>
  </head>
  <body>
    <h1>{title}</h1>
    <p>Astro へようこそ。</p>
  </body>
</html>
```
- 動的ルート例: `src/pages/posts/[slug].astro` は `/posts/任意` に対応。

## コンポーネントと Island Architecture
- `.astro` コンポーネントでマークアップ中心に記述し、必要箇所だけ React/Vue/Svelte をクライアント側で有効化
- クライアントディレクティブ（例）
  - `client:load` ページ読込時に実行
  - `client:idle` アイドル時に実行
  - `client:visible` ビューポートに入ったら実行
  - `client:only="react"` そのフレームワークのみクライアント側で読み込み

```astro
---
import Counter from '../components/Counter.jsx';
---
<section>
  <h2>Counter</h2>
  <Counter client:visible />
</section>
```

## データ取得（サーバー側）
- frontmatter 内はサーバーで実行。fetch やファイル読み出しが可能。
```astro
---
const res = await fetch('https://api.example.com/posts');
const posts = await res.json();
---
<ul>
  {posts.map((p) => <li>{p.title}</li>)}
</ul>
```

## Content Collections（構造化されたMarkdown運用）
1) 依存追加（Astro v3+ は標準。型定義用に @astrojs/content を使用）
```bash
npm i -D @astrojs/content
```
2) `src/content/config.ts` を定義
```ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    tags: z.array(z.string()).optional()
  }),
});

export const collections = { blog };
```
3) `src/content/blog/hello-world.md` を作成
```md
---
title: "Hello World"
date: "2025-08-10"
---
本文…
```
4) ページで読み込み
```astro
---
import { getCollection } from 'astro:content';
const posts = await getCollection('blog');
---
<ul>
  {posts.map((p) => <li>{p.data.title}</li>)}
</ul>
```

## Markdown/MDX
- MDX を使う場合
```bash
npm i -D @astrojs/mdx
```
- `astro.config.mjs`
```js
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [mdx()],
});
```
- `src/pages/notes.mdx` を作成すれば `/notes` で閲覧可能

## よく使うインテグレーション
```bash
# Tailwind CSS
npm i -D @astrojs/tailwind tailwindcss

# 画像最適化
npm i -D @astrojs/image

# サイトマップ
npm i -D @astrojs/sitemap
```
- `astro.config.mjs` に integrations を追加

## ビルドとデプロイ
```bash
npm run build   # 出力は dist/
```
- 静的ホスティング（Netlify/Vercel/S3+CF 等）で配信可能
- SSR/Node ランタイムが必要ならアダプタを導入
```bash
npm i -D @astrojs/node
```
```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
});
```
```bash
npm run build
node ./dist/server/entry.mjs
```

## Docker（簡易）
- 静的サイト（preview サーバーで配信）
```dockerfile
# Dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
# preview は開発用だが最小構成の配信に利用可
RUN npm i -g serve
EXPOSE 4321
CMD ["serve", "-s", "dist", "-l", "4321"]
```

## トラブルシュート
- 404 が出る: `src/pages` 配下のパスと拡張子（.astro/.md/.mdx）を確認
- ビルド失敗: Node バージョン、依存の整合（npm ci）、astro.config.mjs を確認
- クライアントJSが動かない: client ディレクティブの指定漏れやDOM依存コードのタイミングを確認

## 参考
- 公式: https://docs.astro.build/
- 使用例など、概要が掴める: https://qiita.com/udayaan/items/24ecb2f5f4608fc1df4c