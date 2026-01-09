# Astro インテグレーション

Astroインテグレーションは、プロジェクトに機能を追加するための拡張機能です。UIフレームワーク、スタイリング、最適化、デプロイなど、様々なインテグレーションが公式・コミュニティから提供されています。

## インテグレーションの追加

### astro add コマンド（推奨）

```bash
# 対話的にインテグレーションを追加
npx astro add tailwind

# 複数同時に追加
npx astro add react tailwind
```

このコマンドは自動的に：
1. パッケージをインストール
2. `astro.config.mjs`に設定を追加

### 手動インストール

```bash
npm install @astrojs/tailwind tailwindcss
```

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
});
```

## 公式インテグレーション

### UIフレームワーク

| パッケージ | 説明 |
|-----------|------|
| `@astrojs/react` | Reactコンポーネントの使用 |
| `@astrojs/vue` | Vueコンポーネントの使用 |
| `@astrojs/svelte` | Svelteコンポーネントの使用 |
| `@astrojs/preact` | Preactコンポーネントの使用 |
| `@astrojs/solid-js` | SolidJSコンポーネントの使用 |
| `@astrojs/lit` | Litコンポーネントの使用 |

### スタイリング

| パッケージ | 説明 |
|-----------|------|
| `@astrojs/tailwind` | Tailwind CSSの統合 |

### コンテンツ

| パッケージ | 説明 |
|-----------|------|
| `@astrojs/mdx` | MDXサポート |
| `@astrojs/markdoc` | Markdocサポート |

### 最適化・SEO

| パッケージ | 説明 |
|-----------|------|
| `@astrojs/sitemap` | サイトマップ自動生成 |
| `@astrojs/partytown` | サードパーティスクリプトの最適化 |

### アダプター（SSR用）

| パッケージ | 説明 |
|-----------|------|
| `@astrojs/node` | Node.jsサーバー |
| `@astrojs/vercel` | Vercel |
| `@astrojs/netlify` | Netlify |
| `@astrojs/cloudflare` | Cloudflare Workers/Pages |

## Tailwind CSS

### セットアップ

```bash
npx astro add tailwind
```

または手動で：

```bash
npm install @astrojs/tailwind tailwindcss
```

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
});
```

### tailwind.config.mjs

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### 使用例

```astro
<div class="bg-blue-500 text-white p-4 rounded-lg">
  Tailwindでスタイリング
</div>
```

詳細は[Tailwind CSS](tailwind.md)を参照してください。

## React

### セットアップ

```bash
npx astro add react
```

または手動で：

```bash
npm install @astrojs/react react react-dom
```

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
});
```

### 使用例

```jsx
// src/components/Counter.jsx
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

```astro
---
import Counter from '../components/Counter.jsx';
---
<Counter client:load />
```

## Vue

### セットアップ

```bash
npx astro add vue
```

### 使用例

```vue
<!-- src/components/Counter.vue -->
<template>
  <button @click="count++">Count: {{ count }}</button>
</template>

<script setup>
import { ref } from 'vue';
const count = ref(0);
</script>
```

```astro
---
import Counter from '../components/Counter.vue';
---
<Counter client:visible />
```

## サイトマップ

### セットアップ

```bash
npx astro add sitemap
```

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://example.com',  // 必須
  integrations: [sitemap()],
});
```

ビルド時に`sitemap-index.xml`と`sitemap-0.xml`が生成されます。

### オプション

```js
sitemap({
  // 除外するページ
  filter: (page) => !page.includes('/admin/'),
  
  // 変更頻度
  changefreq: 'weekly',
  
  // 優先度
  priority: 0.7,
})
```

## 複数のインテグレーション

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://example.com',
  integrations: [
    react(),
    tailwind(),
    sitemap(),
    mdx(),
  ],
});
```

## インテグレーションの設定

各インテグレーションはオプションを受け取ることができます：

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [
    react({
      include: ['**/react/*'],
    }),
    tailwind({
      // グローバルベーススタイルを無効化
      applyBaseStyles: false,
    }),
  ],
});
```

## インテグレーションの探し方

- 公式インテグレーション: https://docs.astro.build/en/guides/integrations-guide/
- Astroインテグレーションディレクトリ: https://astro.build/integrations/
- npm: `@astrojs/`プレフィックスで検索

## 参考

- 公式ドキュメント「Integrations」: https://docs.astro.build/en/guides/integrations-guide/
- 公式ドキュメント「Using Integrations」: https://docs.astro.build/en/guides/integrations-guide/#using-integrations
- Astro Integrations: https://astro.build/integrations/
