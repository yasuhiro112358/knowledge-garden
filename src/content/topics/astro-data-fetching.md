# Astro データ取得

Astroでは、frontmatter内でデータを取得し、テンプレートで使用できます。すべてのデータ取得はサーバー側（ビルド時またはリクエスト時）で実行されます。

## 基本的なデータ取得

frontmatter内で`fetch()`やファイル読み込みを行い、テンプレートで使用します。

### fetch API

```astro
---
// 外部APIからデータ取得
const response = await fetch('https://api.example.com/posts');
const posts = await response.json();
---
<ul>
  {posts.map((post) => (
    <li>{post.title}</li>
  ))}
</ul>
```

### エラーハンドリング

```astro
---
let posts = [];
let error = null;

try {
  const response = await fetch('https://api.example.com/posts');
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  posts = await response.json();
} catch (e) {
  error = e.message;
}
---
{error ? (
  <p>エラーが発生しました: {error}</p>
) : (
  <ul>
    {posts.map((post) => (
      <li>{post.title}</li>
    ))}
  </ul>
)}
```

## ローカルファイルの読み込み

### import.meta.glob

複数のファイルを一括で読み込む場合：

```astro
---
// Markdownファイルを全て読み込み
const posts = await Astro.glob('../content/posts/*.md');

// ソート
const sortedPosts = posts.sort(
  (a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date)
);
---
<ul>
  {sortedPosts.map((post) => (
    <li>
      <a href={post.url}>{post.frontmatter.title}</a>
    </li>
  ))}
</ul>
```

### 静的インポート

単一のファイルを読み込む場合：

```astro
---
import data from '../data/config.json';
---
<p>サイト名: {data.siteName}</p>
```

## 静的生成時のデータ取得

`getStaticPaths()`内でデータを取得し、動的ルートを生成：

```astro
---
// src/pages/posts/[id].astro
export async function getStaticPaths() {
  const response = await fetch('https://api.example.com/posts');
  const posts = await response.json();
  
  return posts.map((post) => ({
    params: { id: post.id.toString() },
    props: { post },
  }));
}

const { post } = Astro.props;
---
<article>
  <h1>{post.title}</h1>
  <p>{post.body}</p>
</article>
```

## SSR時のデータ取得

SSRモードでは、リクエストごとにデータを取得できます：

```astro
---
// SSRモードで動作
const userId = Astro.url.searchParams.get('user');

const response = await fetch(`https://api.example.com/users/${userId}`);
const user = await response.json();
---
<h1>ユーザー: {user.name}</h1>
```

## 複数のデータソースを並列取得

`Promise.all()`で複数のリクエストを並列実行：

```astro
---
const [postsRes, usersRes, categoriesRes] = await Promise.all([
  fetch('https://api.example.com/posts'),
  fetch('https://api.example.com/users'),
  fetch('https://api.example.com/categories'),
]);

const [posts, users, categories] = await Promise.all([
  postsRes.json(),
  usersRes.json(),
  categoriesRes.json(),
]);
---
```

## Content Collectionsとの併用

Content Collectionsを使用する場合は、専用の関数を使用します：

```astro
---
import { getCollection, getEntry } from 'astro:content';

// 全記事を取得
const allPosts = await getCollection('blog');

// 特定の記事を取得
const featuredPost = await getEntry('blog', 'featured-post');
---
```

詳細は[Content Collections](astro-content-collections.md)を参照してください。

## 環境変数の使用

APIキーなどの機密情報は環境変数で管理します：

```astro
---
// サーバー側の環境変数（SECRET_を含む）
const apiKey = import.meta.env.SECRET_API_KEY;

const response = await fetch('https://api.example.com/data', {
  headers: {
    'Authorization': `Bearer ${apiKey}`,
  },
});
---
```

### 環境変数の種類

| プレフィックス | アクセス可能な場所 |
|---------------|-------------------|
| `PUBLIC_` | クライアント + サーバー |
| なし / `SECRET_` | サーバーのみ |

`.env`ファイル例：

```
PUBLIC_SITE_URL=https://example.com
SECRET_API_KEY=your-secret-key
```

## キャッシュと再検証

ビルド時のデータ取得はキャッシュされます。SSRモードでキャッシュを制御する場合：

```astro
---
const response = await fetch('https://api.example.com/data', {
  // キャッシュを無効化
  cache: 'no-store',
});
---
```

## 参考

- 公式ドキュメント「Data Fetching」: https://docs.astro.build/en/guides/data-fetching/
- 公式ドキュメント「Environment Variables」: https://docs.astro.build/en/guides/environment-variables/
- 公式ドキュメント「Imports」: https://docs.astro.build/en/guides/imports/
