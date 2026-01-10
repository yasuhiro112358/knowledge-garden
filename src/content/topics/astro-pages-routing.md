# Astro ページとルーティング

Astroはファイルベースルーティングを採用しており、`src/pages/`ディレクトリ内のファイルが自動的にURLにマッピングされます。

## 基本的なルーティング

`src/pages/`ディレクトリ内のファイルパスがそのままURLになります。

| ファイルパス | URL |
|-------------|-----|
| `src/pages/index.astro` | `/` |
| `src/pages/about.astro` | `/about` |
| `src/pages/blog/index.astro` | `/blog` |
| `src/pages/blog/post-1.astro` | `/blog/post-1` |

## Astroページの基本構造

`.astro`ファイルは、frontmatter（サーバー側処理）とテンプレート部分で構成されます。

```astro
---
// frontmatter（サーバー側で実行されるJavaScript/TypeScript）
const title = 'Hello Astro';
const currentDate = new Date().toLocaleDateString('ja-JP');
---
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <title>{title}</title>
  </head>
  <body>
    <h1>{title}</h1>
    <p>今日の日付: {currentDate}</p>
  </body>
</html>
```

### frontmatterの特徴

- `---`で囲まれた部分はサーバー側（ビルド時）に実行される
- JavaScript/TypeScriptを記述可能
- インポート、データ取得、変数定義などを行う
- クライアントには送信されない

## 動的ルーティング

角括弧 `[param]` を使用して動的なルートを定義できます。

### 単一パラメータ

`src/pages/posts/[slug].astro`:

```astro
---
export function getStaticPaths() {
  return [
    { params: { slug: 'post-1' } },
    { params: { slug: 'post-2' } },
    { params: { slug: 'post-3' } },
  ];
}

const { slug } = Astro.params;
---
<h1>投稿: {slug}</h1>
```

このファイルは以下のURLを生成します：
- `/posts/post-1`
- `/posts/post-2`
- `/posts/post-3`

### propsの受け渡し

`getStaticPaths`からpropsを渡すことも可能です：

```astro
---
export function getStaticPaths() {
  const posts = [
    { slug: 'post-1', title: '最初の投稿' },
    { slug: 'post-2', title: '2番目の投稿' },
  ];
  
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { title: post.title },
  }));
}

const { slug } = Astro.params;
const { title } = Astro.props;
---
<h1>{title}</h1>
<p>スラッグ: {slug}</p>
```

### Rest パラメータ

`[...path]`を使用すると、残りのパスセグメントすべてをキャプチャできます。

`src/pages/docs/[...path].astro`:

```astro
---
export function getStaticPaths() {
  return [
    { params: { path: 'getting-started' } },
    { params: { path: 'guides/installation' } },
    { params: { path: 'api/reference/components' } },
  ];
}

const { path } = Astro.params;
---
<p>ドキュメントパス: {path}</p>
```

これにより以下のURLが生成されます：
- `/docs/getting-started`
- `/docs/guides/installation`
- `/docs/api/reference/components`

## Markdownページ

`src/pages/`ディレクトリ内にMarkdownファイルを配置すると、そのままページとして認識されます。

`src/pages/about.md`:

```markdown
---
title: 'About'
layout: '../layouts/BaseLayout.astro'
---

# About

このサイトについて説明します。
```

### layoutプロパティ

frontmatterで`layout`を指定すると、そのレイアウトコンポーネントでMarkdownコンテンツがラップされます。

## レイアウトの使用

複数のページで共通のレイアウトを使用する場合：

`src/layouts/BaseLayout.astro`:

```astro
---
const { title } = Astro.props;
---
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <title>{title}</title>
  </head>
  <body>
    <nav><!-- ナビゲーション --></nav>
    <main>
      <slot />
    </main>
    <footer><!-- フッター --></footer>
  </body>
</html>
```

`src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="ホーム">
  <h1>ようこそ</h1>
  <p>メインコンテンツ</p>
</BaseLayout>
```

## 対応ファイル形式

`src/pages/`ディレクトリでは以下の形式がページとして認識されます：

- `.astro` - Astroコンポーネント
- `.md` - Markdown
- `.mdx` - MDX（@astrojs/mdx統合が必要）
- `.html` - HTML
- `.js`/`.ts` - APIエンドポイント

## 参考

- 公式ドキュメント「Astro Pages」: https://docs.astro.build/en/basics/astro-pages/
- 公式ドキュメント「Routing」: https://docs.astro.build/en/guides/routing/
- 公式ドキュメント「Markdown Pages」: https://docs.astro.build/en/guides/markdown-content/
