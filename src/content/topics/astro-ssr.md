# Astro SSR（サーバーサイドレンダリング）

AstroはデフォルトでSSG（静的サイト生成）ですが、アダプターを使用することでSSR（サーバーサイドレンダリング）やハイブリッドレンダリングに対応できます。

## SSRとは

SSR（Server-Side Rendering）では、ページをリクエスト時にサーバーでレンダリングします。

**SSRのメリット**:
- リクエストごとに動的なコンテンツを生成
- ユーザー認証に基づくパーソナライズ
- APIからのリアルタイムデータ取得
- Cookie、セッション、ヘッダーへのアクセス

**SSRのデメリット**:
- サーバーが必要（静的ホスティング不可）
- レスポンス時間がSSGより遅い
- サーバーコストがかかる

## 出力モード

### static（デフォルト）

すべてのページを事前に生成。

```js
// astro.config.mjs
export default defineConfig({
  output: 'static',
});
```

### server

すべてのページをリクエスト時に生成。

```js
// astro.config.mjs
export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
});
```

### hybrid

デフォルトは静的、必要なページのみSSR。

```js
// astro.config.mjs
export default defineConfig({
  output: 'hybrid',
  adapter: node({ mode: 'standalone' }),
});
```

## アダプター

SSRを有効にするには、ホスティング環境に対応したアダプターが必要です。

### Node.js

```bash
npx astro add node
```

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',  // または 'middleware'
  }),
});
```

**mode オプション**:
- `standalone`: 独立したNode.jsサーバーとして動作
- `middleware`: Express等のミドルウェアとして動作

### Vercel

```bash
npx astro add vercel
```

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
});
```

### Netlify

```bash
npx astro add netlify
```

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

export default defineConfig({
  output: 'server',
  adapter: netlify(),
});
```

### Cloudflare

```bash
npx astro add cloudflare
```

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
});
```

## ハイブリッドレンダリング

`output: 'hybrid'`では、デフォルトは静的生成で、必要なページのみSSRにできます。

### 静的ページ（デフォルト）

```astro
---
// このページは静的に生成される（デフォルト）
const posts = await getCollection('blog');
---
<h1>ブログ一覧</h1>
```

### SSRページ

```astro
---
// このページはリクエスト時に生成
export const prerender = false;

const user = await getUser(Astro.cookies.get('session'));
---
<h1>ダッシュボード: {user.name}</h1>
```

### server モードでの静的化

`output: 'server'`の場合、特定のページを静的にするには：

```astro
---
export const prerender = true;
---
```

## Astroオブジェクト

SSRモードでは、`Astro`オブジェクトから追加の情報にアクセスできます。

### リクエスト情報

```astro
---
// リクエストURL
const url = Astro.url;
const pathname = Astro.url.pathname;
const searchParams = Astro.url.searchParams;

// クエリパラメータ
const page = Astro.url.searchParams.get('page');

// リクエストヘッダー
const userAgent = Astro.request.headers.get('user-agent');
---
```

### Cookie

```astro
---
// Cookieの読み取り
const sessionId = Astro.cookies.get('session')?.value;

// Cookieの設定
Astro.cookies.set('visited', 'true', {
  httpOnly: true,
  secure: true,
  maxAge: 60 * 60 * 24 * 7,  // 1週間
});

// Cookieの削除
Astro.cookies.delete('session');
---
```

### リダイレクト

```astro
---
const user = await getUser(Astro.cookies.get('session'));

if (!user) {
  return Astro.redirect('/login');
}
---
```

### レスポンスヘッダー

```astro
---
// キャッシュ制御
Astro.response.headers.set('Cache-Control', 'public, max-age=3600');
---
```

## APIエンドポイント

SSRモードでは、動的なAPIエンドポイントを作成できます。

`src/pages/api/user.ts`:

```ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ cookies }) => {
  const sessionId = cookies.get('session')?.value;
  
  if (!sessionId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  const user = await getUser(sessionId);
  return new Response(JSON.stringify(user), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json();
  // データ処理...
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
```

## Node.jsでの実行

```bash
# ビルド
npm run build

# 実行
node ./dist/server/entry.mjs
```

### 環境変数

`HOST`と`PORT`でサーバー設定を制御：

```bash
HOST=0.0.0.0 PORT=3000 node ./dist/server/entry.mjs
```

## 参考

- 公式ドキュメント「On-demand Rendering」: https://docs.astro.build/en/guides/on-demand-rendering/
- 公式ドキュメント「Server-side Rendering」: https://docs.astro.build/en/guides/server-side-rendering/
- 公式ドキュメント「Adapters」: https://docs.astro.build/en/guides/deploy/#adding-an-adapter-for-ssr
- Node.js Adapter: https://docs.astro.build/en/guides/integrations-guide/node/
