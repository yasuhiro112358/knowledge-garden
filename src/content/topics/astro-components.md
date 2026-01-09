# Astro コンポーネント

Astroコンポーネントは、Astroプロジェクトの基本的な構成要素です。HTMLテンプレートとサーバー側ロジックを組み合わせた、再利用可能なUI部品を作成できます。

## Astroコンポーネントの構造

Astroコンポーネント（`.astro`ファイル）は、frontmatterとテンプレートの2つの部分で構成されます。

```astro
---
// frontmatter: サーバー側で実行されるJavaScript/TypeScript
import Header from './Header.astro';

interface Props {
  title: string;
  description?: string;
}

const { title, description = 'デフォルトの説明' } = Astro.props;
---
<!-- テンプレート: HTMLとJSX風の構文 -->
<article>
  <h2>{title}</h2>
  <p>{description}</p>
</article>
```

### Props

コンポーネントにPropsを渡すことができます。TypeScriptを使用する場合は`Props`インターフェースを定義できます。

```astro
---
interface Props {
  title: string;
  isActive?: boolean;
}

const { title, isActive = false } = Astro.props;
---
<button class:list={[{ active: isActive }]}>
  {title}
</button>
```

使用側：

```astro
---
import Button from './Button.astro';
---
<Button title="送信" isActive={true} />
```

## スロット（Slot）

スロットを使用すると、子コンテンツを受け取ることができます。

### 基本的なスロット

```astro
---
// Card.astro
---
<div class="card">
  <slot />
</div>
```

使用側：

```astro
---
import Card from './Card.astro';
---
<Card>
  <h2>カードのタイトル</h2>
  <p>カードの内容</p>
</Card>
```

### 名前付きスロット

複数のスロットを定義できます：

```astro
---
// Layout.astro
---
<div class="layout">
  <header>
    <slot name="header" />
  </header>
  <main>
    <slot />  <!-- デフォルトスロット -->
  </main>
  <footer>
    <slot name="footer" />
  </footer>
</div>
```

使用側：

```astro
---
import Layout from './Layout.astro';
---
<Layout>
  <h1 slot="header">サイトタイトル</h1>
  
  <p>メインコンテンツ（デフォルトスロット）</p>
  
  <p slot="footer">© 2025</p>
</Layout>
```

## Island Architecture とクライアントディレクティブ

Astroの特徴であるIsland Architectureを実現するため、UIフレームワークのコンポーネント（React、Vue、Svelte等）を部分的にハイドレーションできます。

### クライアントディレクティブ

| ディレクティブ | 説明 |
|---------------|------|
| `client:load` | ページ読み込み時に即座にハイドレーション |
| `client:idle` | ブラウザがアイドル状態になったらハイドレーション |
| `client:visible` | 要素がビューポートに入ったらハイドレーション |
| `client:media` | メディアクエリが一致したらハイドレーション |
| `client:only` | サーバー側レンダリングをスキップし、クライアントのみでレンダリング |

### 使用例

```astro
---
import Counter from './Counter.jsx';  // Reactコンポーネント
import Carousel from './Carousel.vue';  // Vueコンポーネント
---
<!-- ページ読み込み時に即座にインタラクティブに -->
<Counter client:load />

<!-- ビューポートに入ったらハイドレーション（遅延読み込み） -->
<Carousel client:visible />

<!-- アイドル時にハイドレーション -->
<Counter client:idle />

<!-- 特定のメディアクエリでハイドレーション -->
<Counter client:media="(max-width: 768px)" />

<!-- クライアントのみでレンダリング（SSRスキップ） -->
<Counter client:only="react" />
```

### ディレクティブなしの場合

UIフレームワークのコンポーネントを`client:`ディレクティブなしで使用すると、サーバー側でHTMLとしてレンダリングされ、クライアントJavaScriptは送信されません（静的HTML出力）。

```astro
---
import Card from './Card.jsx';
---
<!-- 静的HTMLとして出力、インタラクティブ性なし -->
<Card title="静的カード" />
```

## class:list ディレクティブ

条件付きでクラスを適用する便利な構文です：

```astro
---
const { isActive, isDisabled, size } = Astro.props;
---
<button class:list={[
  'btn',
  { active: isActive },
  { disabled: isDisabled },
  size && `btn-${size}`,
]}>
  クリック
</button>
```

## set:html ディレクティブ

HTMLを直接挿入する場合に使用します（XSSに注意）：

```astro
---
const rawHtml = '<strong>太字テキスト</strong>';
---
<div set:html={rawHtml} />
```

## コンポーネントの配置

コンポーネントは通常`src/components/`ディレクトリに配置しますが、任意の場所に配置可能です。

```
src/
├── components/
│   ├── Header.astro
│   ├── Footer.astro
│   └── ui/
│       ├── Button.astro
│       └── Card.astro
├── layouts/
│   └── BaseLayout.astro
└── pages/
    └── index.astro
```

## 参考

- 公式ドキュメント「Astro Components」: https://docs.astro.build/en/basics/astro-components/
- 公式ドキュメント「Component Props」: https://docs.astro.build/en/basics/astro-components/#component-props
- 公式ドキュメント「Slots」: https://docs.astro.build/en/basics/astro-components/#slots
- 公式ドキュメント「Client Directives」: https://docs.astro.build/en/reference/directives-reference/#client-directives
