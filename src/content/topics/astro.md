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
  astro.config.mjs  # Astro設定
  tsconfig.json     # TypeScript設定（.tsファイルを使う場合に必要）
```

## TypeScript設定（tsconfig.json）

Astroプロジェクトで`.ts`ファイル（TypeScript）を使用する場合、`tsconfig.json`が必要です。

### なぜ必要か

1. **型チェック**: TypeScriptの型エラーを検出
2. **エディタサポート**: VS CodeやCursorなどのエディタでIntelliSense（オートコンプリート、型情報）が動作
3. **モジュール解決**: インポートパスの解決方法を指定
4. **Astro統合**: AstroがVite経由でTypeScriptを処理する際に設定を参照

### 読み込み箇所

`tsconfig.json`は以下のツールが自動的に読み込みます：

- **Astro（Vite経由）**: ビルド時にTypeScriptファイルを処理する際
- **エディタ**: 型チェックとIntelliSenseのために
- **TypeScriptコンパイラ（`tsc`）**: 直接実行した場合

### 基本的な設定例

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "esModuleInterop": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "types": ["astro/client"]
  }
}
```

**各設定の意味**:
- `extends`: Astroの厳格な型チェック設定を継承
- `baseUrl`: モジュール解決のベースパス
- `paths`: パスエイリアス（`@/utils/markdown`で`src/utils/markdown`を参照可能）
- `esModuleInterop`: CommonJSとES Modulesの相互運用を有効化
- `module`: ES Modules形式で出力
- `moduleResolution: "bundler"`: バンドラー（Vite）向けのモジュール解決
- `types`: Astroの型定義を読み込み

### 確認方法

- **開発サーバー**: `npm run dev`で型エラーがあれば表示される
- **エディタ**: `.ts`ファイルを開くと型チェックが動作
- **ビルド**: `npm run build`で型エラーがあればビルドが失敗

**注意**: `.astro`ファイルのみを使用する場合は`tsconfig.json`は必須ではありませんが、`.ts`ファイルを使う場合は必要です。

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

**Zodスキーマについて**:
- AstroのContent Collectionsでは、**Zodスキーマが組み込まれています**（`z`は`astro:content`からインポート）
- `z.object()`でfrontmatterの型を定義することで、以下のメリットがあります：
  - **型安全性**: TypeScriptの型チェックが効く
  - **バリデーション**: ビルド時にfrontmatterの形式を検証
  - **IntelliSense**: エディタでオートコンプリートが効く
  - **エラー検出**: スキーマに合わないfrontmatterがあるとビルド時にエラー
- よく使うZodの型：
  - `z.string()`: 文字列
  - `z.number()`: 数値
  - `z.boolean()`: 真偽値
  - `z.array(z.string())`: 文字列の配列
  - `.optional()`: オプショナル（省略可能）
  - `.default('value')`: デフォルト値
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

### MDXとは

MDX（Markdown + JSX）は、MarkdownにJSX（Reactコンポーネント）を埋め込める形式です。通常のMarkdownに加えて、インタラクティブなコンポーネントを使用できます。

### AstroとMDXの関係

AstroはMDXを**ネイティブサポート**しており、以下の方法で使用できます：

1. **ページとして直接使用**: `src/pages/notes.mdx` を作成すれば `/notes` で閲覧可能
2. **Content Collectionsで使用**: `src/content/blog/post.mdx` として管理可能
3. **Reactコンポーネントを埋め込み**: MDX内でReactコンポーネントを使用可能

### セットアップ

MDXを使う場合、`@astrojs/mdx` 統合を追加します：

```bash
npm i -D @astrojs/mdx
```

`astro.config.mjs` に統合を追加：

```js
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [mdx()],
});
```

### 使用例

#### 1. ページとして使用

`src/pages/notes.mdx` を作成：

```mdx
---
title: "MDXの例"
---

# MDXの例

これは通常のMarkdownです。

<Counter client:load />
```

#### 2. Content Collectionsで使用

`src/content/config.ts` でMDXを定義：

```ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
  }),
});

export const collections = { blog };
```

`src/content/blog/post.mdx` を作成：

```mdx
---
title: "MDXブログ記事"
---

# MDXブログ記事

<MyComponent />
```

#### 3. Reactコンポーネントの使用

MDX内でReactコンポーネントを使用する場合、`client:` ディレクティブが必要です：

```mdx
---
import Counter from '../components/Counter.jsx';
---

# カウンターの例

<Counter client:load />
```

### MDXと通常のMarkdownの違い

| 機能 | Markdown | MDX |
|------|----------|-----|
| 基本的な記述 | ✅ | ✅ |
| JSXコンポーネント | ❌ | ✅ |
| インタラクティブ要素 | ❌ | ✅ |
| カスタムコンポーネント | ❌ | ✅ |

### 使用するべき場合

**MDXを使うべき場合**:
- インタラクティブなコンテンツが必要（チャート、フォーム等）
- Reactコンポーネントを埋め込みたい
- 動的な要素を含むドキュメント

**通常のMarkdownで十分な場合**:
- シンプルなテキストコンテンツ
- 静的コンテンツのみ
- コンポーネントが不要

### 注意点

- MDX内でAstroコンポーネント（`.astro`）は直接使用できません（Reactコンポーネントのみ）
- `client:` ディレクティブが必要（クライアント側で実行するため）
- ビルド時に処理されるため、サーバーサイドの処理はできません

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

プロジェクトの初期段階でやることが書いてある
https://docs.astro.build/en/guides/configuring-astro/#common-new-project-tasks