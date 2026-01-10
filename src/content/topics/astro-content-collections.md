# Astro Content Collections

Content Collectionsは、Astroで構造化されたコンテンツ（Markdown、MDX、JSON、YAML）を型安全に管理するための機能です。ブログ、ドキュメント、製品カタログなど、同じ構造のコンテンツを扱う場合に最適です。

## Content Collectionsとは

- `src/content/`ディレクトリ内のコンテンツを型安全に管理
- Zodスキーマによるfrontmatterのバリデーション
- TypeScriptの型推論によるエディタサポート
- ビルド時のバリデーションでエラーを早期発見

## 基本的なセットアップ

### 1. コレクションの定義

`src/content/config.ts`でコレクションを定義します：

```ts
import { defineCollection, z } from 'astro:content';

// ブログコレクションの定義
const blog = defineCollection({
  type: 'content',  // Markdown/MDX
  schema: z.object({
    title: z.string(),
    date: z.string(),
    author: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

// 複数のコレクションをエクスポート
export const collections = { blog };
```

### 2. コンテンツファイルの作成

`src/content/blog/`ディレクトリにMarkdownファイルを配置：

`src/content/blog/first-post.md`:

```markdown
---
title: "最初の投稿"
date: "2025-01-09"
author: "山田太郎"
tags: ["astro", "web"]
---

ここに本文を書きます。

## セクション

詳細な内容...
```

### 3. コンテンツの取得と表示

```astro
---
import { getCollection } from 'astro:content';

// 全ての記事を取得
const posts = await getCollection('blog');

// 下書きを除外してソート
const publishedPosts = posts
  .filter((post) => !post.data.draft)
  .sort((a, b) => new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf());
---
<ul>
  {publishedPosts.map((post) => (
    <li>
      <a href={`/blog/${post.slug}`}>
        {post.data.title}
      </a>
      <time>{post.data.date}</time>
    </li>
  ))}
</ul>
```

## Zodスキーマ

AstroはZodを組み込みでサポートしており、`astro:content`から直接インポートできます。

### よく使う型定義

```ts
import { z } from 'astro:content';

const schema = z.object({
  // 必須の文字列
  title: z.string(),
  
  // オプショナル
  subtitle: z.string().optional(),
  
  // デフォルト値
  published: z.boolean().default(false),
  
  // 配列
  tags: z.array(z.string()),
  
  // 数値
  order: z.number(),
  
  // 列挙型
  category: z.enum(['tech', 'life', 'news']),
  
  // 日付（文字列から変換）
  date: z.string().transform((str) => new Date(str)),
  
  // Astroの組み込み画像スキーマ
  // image: image(),
});
```

### バリデーションエラー

スキーマに合わないfrontmatterがあると、ビルド時にエラーが表示されます：

```
[ERROR] blog → first-post.md frontmatter does not match collection schema.
"title" is required
```

## 動的ページの生成

Content Collectionsと動的ルーティングを組み合わせて、各記事のページを生成します。

`src/pages/blog/[slug].astro`:

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

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
<BaseLayout title={post.data.title}>
  <article>
    <h1>{post.data.title}</h1>
    <time>{post.data.date}</time>
    <Content />
  </article>
</BaseLayout>
```

## コレクションの種類

### type: 'content'

Markdown/MDXコンテンツ用。本文をレンダリングできます。

```ts
const blog = defineCollection({
  type: 'content',
  schema: z.object({ /* ... */ }),
});
```

### type: 'data'

JSON/YAMLデータ用。本文なしの構造化データに使用します。

```ts
const authors = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    email: z.string().email(),
    avatar: z.string().url(),
  }),
});
```

`src/content/authors/john.json`:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "avatar": "https://example.com/avatar.jpg"
}
```

## 単一エントリの取得

特定のエントリを取得する場合：

```astro
---
import { getEntry } from 'astro:content';

// スラッグで取得
const post = await getEntry('blog', 'first-post');

// 存在しない場合はundefined
if (!post) {
  return Astro.redirect('/404');
}

const { Content } = await post.render();
---
```

## フィルタリング

`getCollection`の第2引数でフィルタリングできます：

```astro
---
import { getCollection } from 'astro:content';

// 下書きを除外
const publishedPosts = await getCollection('blog', ({ data }) => {
  return !data.draft;
});

// 特定のタグでフィルタ
const astroPosts = await getCollection('blog', ({ data }) => {
  return data.tags.includes('astro');
});
---
```

## 参考

- 公式ドキュメント「Content Collections」: https://docs.astro.build/en/guides/content-collections/
- 公式ドキュメント「Querying Collections」: https://docs.astro.build/en/guides/content-collections/#querying-collections
- Zod公式ドキュメント: https://zod.dev/
