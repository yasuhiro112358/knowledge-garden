# Astro TypeScript設定

AstroプロジェクトでTypeScriptを使用するための設定方法を説明します。Astroは標準でTypeScriptをサポートしており、`.ts`ファイルと`.astro`ファイル内でTypeScriptを使用できます。

## TypeScriptの有効化

### プロジェクト作成時

`create astro`コマンド実行時にTypeScriptを選択できます：

```bash
npm create astro@latest
# TypeScriptの厳格さを選択: strict / strictest / relaxed
```

### 既存プロジェクトへの追加

既存プロジェクトにTypeScriptを追加するには、`tsconfig.json`を作成します：

```json
{
  "extends": "astro/tsconfigs/strict"
}
```

## tsconfig.json

### Astroの組み込み設定

Astroは3つのTypeScript設定プリセットを提供しています：

| プリセット | 説明 |
|-----------|------|
| `astro/tsconfigs/base` | 基本設定 |
| `astro/tsconfigs/strict` | 厳格な型チェック（推奨） |
| `astro/tsconfigs/strictest` | 最も厳格な型チェック |

### 推奨設定例

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@layouts/*": ["./src/layouts/*"]
    }
  }
}
```

### 各設定の意味

| 設定 | 説明 |
|------|------|
| `extends` | Astroの型チェック設定を継承 |
| `baseUrl` | モジュール解決のベースパス |
| `paths` | パスエイリアスの定義 |

## パスエイリアス

パスエイリアスを設定すると、相対パスの代わりに短いパスでインポートできます。

### tsconfig.json

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 使用例

```astro
---
// Before: 相対パス
import Header from '../../../components/Header.astro';

// After: エイリアス使用
import Header from '@/components/Header.astro';
---
```

## 型定義

### Astroの型定義

Astroの型定義を使用するには、`env.d.ts`を作成します：

```ts
// src/env.d.ts
/// <reference types="astro/client" />
```

これにより以下の型が使用可能になります：
- `Astro`グローバル
- `import.meta.env`の型
- 画像インポートの型

### コンポーネントのProps型

```astro
---
// 方法1: interfaceを使用
interface Props {
  title: string;
  description?: string;
  tags: string[];
}

const { title, description, tags } = Astro.props;
---
```

```astro
---
// 方法2: 型推論を使用
const { title, description = 'デフォルト' } = Astro.props as {
  title: string;
  description?: string;
};
---
```

### Content Collections の型

Content Collectionsを使用する場合、自動的に型が生成されます：

```astro
---
import { getCollection } from 'astro:content';

// 型推論が効く
const posts = await getCollection('blog');
// posts の型: CollectionEntry<'blog'>[]
---
```

## 環境変数の型定義

`src/env.d.ts`で環境変数の型を定義できます：

```ts
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL: string;
  readonly SECRET_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

## TypeScriptファイルの使用

### ユーティリティ関数

```ts
// src/utils/format.ts
export function formatDate(date: Date): string {
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
```

```astro
---
import { formatDate } from '@/utils/format';
const published = formatDate(new Date('2025-01-09'));
---
<time>{published}</time>
```

### 型のエクスポート

```ts
// src/types/index.ts
export interface Post {
  title: string;
  slug: string;
  date: Date;
  tags: string[];
}

export interface Author {
  name: string;
  email: string;
}
```

## 型チェックの実行

ビルドとは別に型チェックのみを実行できます：

```bash
# 型チェック
npx astro check

# package.jsonにスクリプトを追加
# "scripts": {
#   "check": "astro check"
# }
npm run check
```

## UIフレームワークとの併用

React、Vue、Svelteなど、各フレームワークでTypeScriptを使用する場合は、それぞれの設定も必要です。

### React with TypeScript

```bash
npm install @astrojs/react react react-dom
npm install -D @types/react @types/react-dom
```

```tsx
// src/components/Counter.tsx
import { useState } from 'react';

interface Props {
  initial?: number;
}

export default function Counter({ initial = 0 }: Props) {
  const [count, setCount] = useState(initial);
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

## トラブルシューティング

### 型エラーが表示されない

- `tsconfig.json`が存在するか確認
- エディタを再起動
- `npx astro check`で確認

### パスエイリアスが機能しない

- `tsconfig.json`の`baseUrl`と`paths`を確認
- エディタのTypeScriptサーバーを再起動

### インポートエラー

- `src/env.d.ts`に`/// <reference types="astro/client" />`があるか確認

## 参考

- 公式ドキュメント「TypeScript」: https://docs.astro.build/en/guides/typescript/
- 公式ドキュメント「Imports」: https://docs.astro.build/en/guides/imports/#aliases
- Astro TSConfig Reference: https://docs.astro.build/en/guides/typescript/#type-checking
