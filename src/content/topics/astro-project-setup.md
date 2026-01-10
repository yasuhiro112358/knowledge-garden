# Astro プロジェクト作成とディレクトリ構成

Astroプロジェクトの作成方法と基本的なディレクトリ構成について説明します。

## プロジェクト作成

`create astro` コマンドを使用して対話的にプロジェクトを作成します。

```bash
# 対話的に新規プロジェクトを作成
npm create astro@latest

# プロジェクト名・テンプレートを選択
# TypeScript, Strict Mode, ESLintなどは用途に応じて選択

cd <project-name>
npm install   # 選択次第では不要
npm run dev   # 開発サーバー起動（デフォルト: http://localhost:4321）
```

### テンプレートオプション

`create astro` では以下のテンプレートから選択できます：

- **Empty**: 最小構成のプロジェクト
- **Blog**: ブログ向けテンプレート
- **Documentation**: ドキュメントサイト向け（Starlight使用）
- **Portfolio**: ポートフォリオサイト向け

### コマンドオプション

対話を省略してオプションを直接指定することも可能です：

```bash
# テンプレートを指定して作成
npm create astro@latest my-project -- --template blog

# TypeScriptを有効化
npm create astro@latest my-project -- --typescript strict
```

## ディレクトリ構成

Astroプロジェクトの基本的なディレクトリ構成は以下の通りです：

```
project/
├── src/
│   ├── pages/          # ルーティング対象（.astro/.md/.mdx）
│   ├── components/     # 再利用可能なコンポーネント
│   ├── layouts/        # レイアウトコンポーネント
│   └── content/        # Content Collections用（任意）
├── public/             # 静的アセット（そのまま配信）
├── astro.config.mjs    # Astro設定ファイル
├── package.json        # 依存関係
└── tsconfig.json       # TypeScript設定（オプション）
```

### 各ディレクトリの役割

#### `src/pages/`

ファイルベースルーティングの対象ディレクトリです。このディレクトリ内のファイルが自動的にURLにマッピングされます。

| ファイル | URL |
|---------|-----|
| `src/pages/index.astro` | `/` |
| `src/pages/about.astro` | `/about` |
| `src/pages/blog/post.astro` | `/blog/post` |

#### `src/components/`

再利用可能なコンポーネントを配置します。Astroコンポーネント（`.astro`）やUIフレームワークのコンポーネント（`.jsx`, `.vue`, `.svelte`など）を配置できます。

#### `src/layouts/`

ページの共通レイアウトを定義するコンポーネントを配置します。ヘッダー、フッター、ナビゲーションなどの共通要素をここで管理します。

#### `src/content/`

Content Collectionsを使用する場合、構造化されたコンテンツ（Markdown/MDX）をここに配置します。

#### `public/`

静的アセット（画像、フォント、favicon等）を配置します。ここに配置されたファイルはビルド時にそのままコピーされ、ルートから直接アクセス可能です。

```
public/favicon.ico  →  /favicon.ico
public/images/logo.png  →  /images/logo.png
```

## astro.config.mjs

Astroの設定ファイルです。基本的な設定例：

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  // サイトのベースURL
  site: 'https://example.com',
  
  // ベースパス（サブディレクトリに配置する場合）
  base: '/docs',
  
  // インテグレーション
  integrations: [],
});
```

## 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# ビルド結果のプレビュー
npm run preview

# Astro CLIヘルプ
npx astro --help
```

## 参考

- 公式ドキュメント「Install and set up Astro」: https://docs.astro.build/en/install-and-setup/
- 公式ドキュメント「Project Structure」: https://docs.astro.build/en/basics/project-structure/
- create-astro README: https://github.com/withastro/astro/blob/main/packages/create-astro/README.md
