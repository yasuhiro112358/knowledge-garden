# Astro MDX

MDX（Markdown + JSX）は、MarkdownにJSXコンポーネントを埋め込める形式です。Astroでは`@astrojs/mdx`インテグレーションを追加することでMDXを使用できます。

## MDXとは

MDXを使用すると、以下のことが可能になります：

- Markdown内でReact/Preact/Vue/Svelteコンポーネントを使用
- インタラクティブなコンテンツの作成
- 再利用可能なコンポーネントをドキュメントに埋め込み

## セットアップ

### インストール

```bash
npx astro add mdx

# または手動インストール
npm install @astrojs/mdx
```

### 設定

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [mdx()],
});
```

## 基本的な使い方

### ページとしてMDXを使用

`src/pages/`ディレクトリにMDXファイルを配置すると、ページとして認識されます。

`src/pages/about.mdx`:

```mdx
---
title: "About"
layout: "../layouts/BaseLayout.astro"
---

# About

これは通常のMarkdownテキストです。

import Card from '../components/Card.astro';

<Card title="カード">
  カードの内容
</Card>
```

### Content CollectionsでMDXを使用

`src/content/`ディレクトリ内のMDXファイルもContent Collectionsとして管理できます。

`src/content/blog/interactive-post.mdx`:

```mdx
---
title: "インタラクティブな投稿"
date: "2025-01-09"
---

# インタラクティブな投稿

import Counter from '../../components/Counter.jsx';

以下のカウンターをクリックしてみてください：

<Counter client:load />
```

## コンポーネントのインポート

MDXファイル内でコンポーネントをインポートする方法は複数あります。

### frontmatter内でインポート

```mdx
---
title: "コンポーネントの例"
---

import Alert from '../components/Alert.astro';
import Counter from '../components/Counter.jsx';

# タイトル

<Alert type="info">
  これはお知らせです。
</Alert>

<Counter client:visible />
```

### グローバルコンポーネント

頻繁に使用するコンポーネントは、MDXの設定でグローバルに定義できます：

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [
    mdx(),
  ],
});
```

## クライアントディレクティブ

UIフレームワークのコンポーネントをインタラクティブにするには、`client:`ディレクティブが必要です。

```mdx
import Counter from '../components/Counter.jsx';
import Carousel from '../components/Carousel.vue';

<!-- ページ読み込み時にハイドレーション -->
<Counter client:load />

<!-- ビューポートに入ったらハイドレーション -->
<Carousel client:visible />

<!-- アイドル時にハイドレーション -->
<Counter client:idle />
```

## カスタムコンポーネント

HTML要素をカスタムコンポーネントに置き換えることができます。

### 設定

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [mdx()],
  markdown: {
    // remarkやrehypeプラグインの設定もここで
  },
});
```

### ページごとのカスタムコンポーネント

```mdx
---
title: "カスタムコンポーネント"
---

import CustomHeading from '../components/CustomHeading.astro';
export const components = { h1: CustomHeading };

# このh1はCustomHeadingでレンダリングされる
```

## Markdownとの違い

| 機能 | Markdown (.md) | MDX (.mdx) |
|------|----------------|------------|
| 基本的なMarkdown構文 | ✅ | ✅ |
| frontmatter | ✅ | ✅ |
| JSXコンポーネント | ❌ | ✅ |
| import文 | ❌ | ✅ |
| export文 | ❌ | ✅ |
| インタラクティブ要素 | ❌ | ✅ |
| ビルド速度 | 速い | 普通 |

## レイアウトの使用

### frontmatterでレイアウトを指定

```mdx
---
title: "投稿タイトル"
layout: "../layouts/BlogLayout.astro"
---

# 投稿タイトル

本文...
```

### Content Collectionsでレンダリング

```astro
---
// src/pages/blog/[slug].astro
import { getCollection } from 'astro:content';
import BlogLayout from '../../layouts/BlogLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---
<BlogLayout title={post.data.title}>
  <Content />
</BlogLayout>
```

## 注意点

### Astroコンポーネントの制限

MDX内では`.astro`コンポーネントも使用できますが、サーバーサイドでのみレンダリングされます（静的HTML出力）。

```mdx
import Card from '../components/Card.astro';

<!-- これは静的HTMLとしてレンダリングされる -->
<Card title="静的カード" />
```

### クライアントサイドの実行

インタラクティブな機能が必要な場合は、React/Vue/Svelteなどのコンポーネントを使用し、`client:`ディレクティブを付けてください。

### パフォーマンス

- MDXはMarkdownより処理が重い
- 必要な場合のみMDXを使用
- 静的コンテンツはプレーンなMarkdownを推奨

## MDXを使うべき場合

**MDXを使うべきケース**:
- インタラクティブなコンテンツ（カウンター、フォーム、チャートなど）
- カスタムUIコンポーネントを埋め込みたい
- 動的なドキュメント

**通常のMarkdownで十分なケース**:
- シンプルなテキストコンテンツ
- 静的なブログ記事
- パフォーマンスが重要な場合

## 参考

- 公式ドキュメント「@astrojs/mdx」: https://docs.astro.build/en/guides/integrations-guide/mdx/
- 公式ドキュメント「Markdown & MDX」: https://docs.astro.build/en/guides/markdown-content/
- MDX公式: https://mdxjs.com/
