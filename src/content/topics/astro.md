# Astro 概要

Astroは、コンテンツ駆動型のWebサイト構築に最適化された静的サイトジェネレーター/Webフレームワークです。

## Astroとは

Astroは以下の特徴を持つWebフレームワークです：

- **コンテンツ重視**: ブログ、ドキュメント、マーケティングサイトなど、コンテンツ中心のサイト構築に最適化
- **高速なパフォーマンス**: デフォルトでゼロJavaScriptを出力し、必要な箇所のみクライアントJSを読み込む
- **Island Architecture**: ページ内の独立した部分（Island）のみをインタラクティブにする設計思想
- **UIフレームワーク非依存**: React、Vue、Svelte、Solid、Preactなど複数のUIフレームワークを統合可能

## Island Architectureとは

Island Architecture（アイランドアーキテクチャ）は、Astroの核となる設計思想です。

従来のSPAはページ全体をJavaScriptで制御しますが、Island Architectureでは：

1. ページの大部分は静的なHTMLとして配信
2. インタラクティブな部分（Island）のみJavaScriptを読み込む
3. 各Islandは独立してハイドレーション

これにより、ページの初期読み込みが高速になり、ユーザー体験が向上します。

## 前提条件

- **Node.js**: v18.20.8以降、v20.3.0以降、またはv22.0.0以降
  - v19とv21は非対応
- **パッケージマネージャー**: npm / pnpm / yarn のいずれか

```bash
node -v
npm -v
```

## 関連トピック

- [プロジェクト作成とディレクトリ構成](astro-project-setup.md)
- [ページとルーティング](astro-pages-routing.md)
- [コンポーネント](astro-components.md)
- [Content Collections](astro-content-collections.md)
- [データ取得](astro-data-fetching.md)
- [ビルドとデプロイ](astro-build-deploy.md)

### 拡張機能

- [TypeScript設定](astro-typescript.md)
- [MDX](astro-mdx.md)
- [インテグレーション](astro-integrations.md)
- [SSRとアダプター](astro-ssr.md)
- [Docker](astro-docker.md)

## 公式ドキュメント

- Astro公式ドキュメント: https://docs.astro.build/
- Astro GitHub: https://github.com/withastro/astro
- Astroテンプレート: https://astro.build/themes/

## 参考

- 公式ドキュメント「Why Astro?」: https://docs.astro.build/en/concepts/why-astro/
- 公式ドキュメント「Astro Islands」: https://docs.astro.build/en/concepts/islands/
