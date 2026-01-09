# Astro ビルドとデプロイ

Astroプロジェクトのビルドと各種プラットフォームへのデプロイ方法について説明します。

## ビルドコマンド

```bash
# 本番ビルド
npm run build

# ビルド結果のプレビュー
npm run preview
```

ビルド結果は`dist/`ディレクトリに出力されます。

## 出力モード

Astroは3つの出力モードをサポートしています。

### 1. static（デフォルト）

すべてのページを事前にHTMLとして生成します。

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',  // デフォルト
});
```

**特徴**:
- ビルド時にすべてのページが生成される
- サーバー不要で静的ホスティングに配置可能
- 最も高速なパフォーマンス

### 2. server（SSR）

すべてのページをリクエスト時にサーバーでレンダリングします。

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
});
```

**特徴**:
- リクエストごとにサーバーでHTMLを生成
- 動的なコンテンツに対応
- アダプターが必要

詳細は[SSRとアダプター](astro-ssr.md)を参照してください。

### 3. hybrid

静的ページとサーバーレンダリングページを混在させます。

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  output: 'hybrid',
  adapter: node({ mode: 'standalone' }),
});
```

ページごとに`prerender`を指定：

```astro
---
// このページは静的に生成
export const prerender = true;
---
```

## 静的サイトのデプロイ

静的ビルド（`output: 'static'`）の場合、`dist/`ディレクトリを静的ホスティングサービスに配置するだけです。

### 主要なホスティングサービス

| サービス | 特徴 |
|---------|------|
| Netlify | Git連携、自動ビルド、無料枠あり |
| Vercel | Git連携、自動ビルド、エッジ機能 |
| Cloudflare Pages | 高速なCDN、無料枠あり |
| GitHub Pages | GitHubリポジトリから直接ホスティング |
| AWS S3 + CloudFront | スケーラブル、カスタマイズ性高い |

### Netlifyへのデプロイ

```yaml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"
```

### Vercelへのデプロイ

Vercelは自動検出しますが、明示的に設定する場合：

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

### GitHub Pagesへのデプロイ

GitHub Actionsを使用した例：

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

GitHub Pagesでサブディレクトリにデプロイする場合、`base`を設定：

```js
// astro.config.mjs
export default defineConfig({
  site: 'https://username.github.io',
  base: '/repository-name',
});
```

## サイト設定

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  // サイトのURL（サイトマップ生成、canonical URLに使用）
  site: 'https://example.com',
  
  // ベースパス（サブディレクトリにデプロイする場合）
  base: '/blog',
  
  // トレイリングスラッシュの扱い
  trailingSlash: 'always',  // 'never' | 'always' | 'ignore'
});
```

## ビルド最適化

```js
// astro.config.mjs
export default defineConfig({
  build: {
    // インライン化するスタイルの最大サイズ
    inlineStylesheets: 'auto',
  },
  
  // 画像最適化（Astro 3.0+）
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
});
```

## トラブルシューティング

### 404エラーが発生する

- `src/pages/`配下のパスとファイル拡張子を確認
- 動的ルートの`getStaticPaths()`が正しく定義されているか確認
- トレイリングスラッシュの設定を確認

### ビルドが失敗する

- Node.jsバージョンを確認（v18.20.8以降、v20.3.0以降、v22.0.0以降）
- `npm ci`で依存関係をクリーンインストール
- `astro.config.mjs`の構文エラーを確認

### 静的アセットが見つからない

- `public/`ディレクトリに配置されているか確認
- パスが正しいか確認（`public/images/logo.png` → `/images/logo.png`）
- `base`を設定している場合、パスにベースを含める

## 参考

- 公式ドキュメント「Build your Astro Site」: https://docs.astro.build/en/guides/deploy/
- 公式ドキュメント「On-demand Rendering」: https://docs.astro.build/en/guides/on-demand-rendering/
- 公式ドキュメント「Deploy your Astro Site」: https://docs.astro.build/en/guides/deploy/
