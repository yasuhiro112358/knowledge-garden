# Tailwind CSS + Astro メモ

## なぜ PostCSS / Autoprefixer が出てくるのか
Tailwind は **PostCSS プラグイン**として実装されているため、ビルド時に PostCSS の処理パイプラインを通してユーティリティクラスを展開（`@tailwind base;` など）します。その際、互換性強化のために一緒に使われる代表的プラグインが **Autoprefixer** です。

## PostCSS とは
- CSS をパース → プラグインで変換 → 出力する「変換エンジン」
- 役割は Gulp / Webpack / Vite とは異なり、あくまで CSS の AST 変換
- Tailwind 自体が PostCSS プラグインなので、Tailwind を使う = PostCSS を内部的に使う という構図

## @tailwind ディレクティブとは

Tailwind CSSでは、CSSファイル内で `@tailwind` ディレクティブを使用して、Tailwindのスタイルを読み込みます。

### 3つのディレクティブ

```css
@tailwind base;      /* ベーススタイル（リセットCSS、デフォルトスタイル） */
@tailwind components; /* コンポーネントクラス（カスタムコンポーネント用） */
@tailwind utilities;  /* ユーティリティクラス（flex, text-xl など） */
```

### @tailwind base とは

`@tailwind base` は、**ベーススタイル**を読み込むディレクティブです。

**含まれる内容**:
- **CSSリセット**: ブラウザのデフォルトスタイルをリセット
- **デフォルトスタイル**: `html`, `body` などの基本要素のスタイル
- **フォント設定**: `html` 要素に `font-sans` が自動適用される（`fontFamily.sans` の設定を使用）

**例**:
```css
/* @tailwind base が生成するスタイル（概念） */
html {
  font-family: system-ui, sans-serif; /* tailwind.config.mjs の fontFamily.sans を使用 */
}
body {
  margin: 0;
  /* ... リセットCSS ... */
}
```

### Astroでの扱い

Astroで `@astrojs/tailwind` を使用している場合、**これらのディレクティブは自動的に処理されます**。明示的にCSSファイルに書く必要はありません。

- `@astrojs/tailwind` が内部的に `@tailwind base`, `@tailwind components`, `@tailwind utilities` を処理
- `tailwind.config.mjs` の設定（例: `fontFamily.sans`）が `@tailwind base` に反映される
- そのため、`<html>` タグに `font-sans` クラスを追加しなくても、自動的にフォントが適用される

### 手動で使用する場合

もし `@astrojs/tailwind` を使わず、手動でTailwindを設定する場合は、CSSファイルに明示的に書く必要があります：

```css
/* src/styles/global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### よくあるプラグイン例
| プラグイン | 目的 |
|------------|------|
| tailwindcss | ユーティリティクラス生成 |
| autoprefixer | ベンダープレフィックス自動付与 |
| cssnano | 生成 CSS の最小化（本番用） |

## Autoprefixer とは
- PostCSS プラグインの一つ
- `Can I Use` のデータベースを元に、必要なベンダープレフィックスだけを追加
- 例: `display: flex;` → 古いブラウザ向けに `-webkit-` などを条件付きで追加
- 手動で前処理を書かなくてよくなるため、保守性向上

### 必要かどうかの判断
| 対象ブラウザ | Autoprefixer 推奨度 |
|--------------|-------------------|
| 最新モダンのみ (自分用/技術ブログ) | 低（外しても大きな問題になりにくい） |
| 一般ユーザー/商用/企業サイト | 高（入れておくのが無難） |
| レガシー環境（社内IE系は除外されつつある） | 高（ただしIE完全サポートはTailwind v3以降非推奨） |

## Astro との関係
- Astro プロジェクトで Tailwind を導入する際、`@astrojs/tailwind` インテグレーションまたは手動セットアップを選択
- 手動で `npx tailwindcss init -p` を実行すると `tailwind.config.js` と `postcss.config.cjs`（中に autoprefixer 記載）が生成
- Astro 側で特別な設定をしなくても、`postcss.config.*` があれば Vite（Astro内部）が PostCSS パイプラインを通してビルド

## 最小構成（参考）
```bash
npm i -D tailwindcss autoprefixer postcss
npx tailwindcss init -p
```
`postcss.config.cjs`（自動生成例）
```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

## 省略できるケース
- 対象ブラウザを "last 1 chrome version" など極端に絞る
- 社内向けツールで最新ブラウザのみ強制できる
→ その場合 `autoprefixer` を dependencies から外し、`postcss.config` から削除しても致命傷にはならない

## 省略しない方がよいケース
- 公開プロダクト / SEO 影響を受けるランディングページ
- 幅広い OS / モバイル端末（特に iOS Safari 系）
- 長期運用でブラウザ事情が変わる可能性が高い

## 実務上の推奨
1. まずは autoprefixer を入れて開始（“入れておいて損なし”）
2. Lighthouse / サポート方針で不要と確信したら削除検討
3. 削除前に `npx browserslist` で対象ブラウザを明示（`package.json > browserslist`）

## ブラウザターゲット管理（browserslist）
`package.json` 例:
```jsonc
"browserslist": [
  "defaults",
  "not dead",
  "not op_mini all"
]
```
- Autoprefixer はこの定義を読み、必要なプレフィックスのみを追加

## まとめ
| 項目 | 役割 | 必須度 | 備考 |
|------|------|--------|------|
| PostCSS | CSS 変換基盤 | Tailwind 利用時: 実質必須 | Astro+Tailwind で自動活用 |
| Tailwind | ユーティリティ生成 | 目的に応じて | PostCSS プラグイン実装 |
| Autoprefixer | ベンダープレフィックス付与 | 公開サイトでは高 | 不要なら browserslist を限定 |
| cssnano 等 | 最小化 | 任意 | 本番ビルド最適化 |

## 判断フローチャート（簡易）
```
商用 or ユーザー層が不特定多数? → はい → Autoprefixer 入れる
↓いいえ
ブラウザ統制できる? → はい → まず不要（後で追加可）
↓いいえ
Autoprefixer 入れる
```

## @tailwindcss/typography プラグイン

### 概要

`@tailwindcss/typography` は、ブログやドキュメントなどの**文章コンテンツ**を読みやすくスタイリングするためのTailwind CSSプラグインです。

### 何をするのか

`prose` クラスを適用すると、以下の要素が自動的にスタイリングされます：

- **見出し**（h1, h2, h3...）: 適切なサイズ、余白、太さ
- **段落**（p）: 行間、余白
- **リスト**（ul, ol, li）: インデント、マーカー
- **コードブロック**（pre, code）: 背景色、フォント
- **引用**（blockquote）: 左ボーダー、イタリック
- **リンク**（a）: 色、ホバー効果
- **画像**（img）: 最大幅、角丸
- **テーブル**（table）: ボーダー、パディング

### セットアップ

```bash
npm install -D @tailwindcss/typography
```

`tailwind.config.mjs` にプラグインを追加：

```js
export default {
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
```

### 使用方法

```astro
<!-- 基本的な使用 -->
<div class="prose">
  <Content />
</div>

<!-- 色テーマを指定（スレート色） -->
<div class="prose prose-slate">
  <Content />
</div>

<!-- サイズを指定（大きめ） -->
<div class="prose prose-slate prose-lg">
  <Content />
</div>

<!-- 最大幅を制限しない（コンテナ幅いっぱい） -->
<div class="prose prose-slate max-w-none">
  <Content />
</div>
```

### なぜ便利なのか

1. **コード量の削減**: 70行以上のCSSを1行のクラスに置き換え可能
2. **一貫性**: 標準的なタイポグラフィスタイルを自動適用
3. **カスタマイズ可能**: サイズや色テーマのバリエーションが豊富
4. **保守性**: プラグインが更新されれば、自動的に改善される

### 使用するべき場合

- ✅ ブログ、ドキュメントサイト
- ✅ Markdownコンテンツの表示
- ✅ 長文コンテンツのスタイリング
- ✅ 一貫したタイポグラフィが必要な場合

### 注意点

- `prose` クラスはTailwind CSSの標準機能ではなく、**プラグインが提供するクラス**
- プラグインをインストール・設定しないと使用できない
- Tailwind CSS v3 では `@tailwindcss/typography@^0.5.15` 以降を使用

### 参考

- [@tailwindcss/typography 公式ドキュメント](https://tailwindcss.com/docs/plugins/typography)

---

## 参考
- Tailwind Docs: https://tailwindcss.com/docs/installation
- PostCSS: https://postcss.org/
- Autoprefixer: https://github.com/postcss/autoprefixer
- Browserslist: https://github.com/browserslist/browserslist
