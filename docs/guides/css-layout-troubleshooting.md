# CSS・レイアウトの確認ポイント

ローカル開発環境でCSSやレイアウトが正しく適用されない場合の確認ポイントです。

## 1. ブラウザの開発者ツールで確認

### 1.1 コンソールエラーの確認

1. ブラウザの開発者ツールを開く（F12 または Cmd+Option+I）
2. **Console**タブでエラーを確認
3. 以下のようなエラーがないか確認：
   - `Failed to load resource: ...`（CSSファイルの読み込みエラー）
   - `Uncaught SyntaxError: ...`（JavaScriptエラー）
   - `@apply cannot be used with ...`（Tailwind CSSのエラー）

### 1.2 ネットワークタブでCSSの読み込み確認

1. **Network**タブを開く
2. ページをリロード（Cmd+R または F5）
3. CSSファイルが読み込まれているか確認：
   - `/_astro/...css` のようなファイルが存在するか
   - ステータスコードが `200` になっているか
   - ファイルサイズが `0` でないか

### 1.3 要素のスタイル確認

1. **Elements**（または**Inspector**）タブを開く
2. スタイルが当たっていない要素を選択
3. **Styles**パネルで以下を確認：
   - Tailwind CSSのクラスが適用されているか
   - スタイルが打ち消されていないか（`~~text-gray-900~~`のように取り消し線が引かれている）
   - `@apply`ディレクティブが正しく展開されているか

## 2. Tailwind CSSの設定確認

### 2.1 `tailwind.config.mjs`の確認

```javascript
// tailwind.config.mjs
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  // ↑ このパスが正しいか確認（srcディレクトリ内のファイルをスキャン）
  theme: {
    extend: {},
  },
  plugins: [],
};
```

**確認ポイント**:
- `content`配列に、スタイルを適用したいファイルのパターンが含まれているか
- 新しいファイルを追加した場合、Tailwind CSSがそのファイルをスキャンしているか

### 2.2 `astro.config.mjs`の確認

```javascript
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()], // ← Tailwind統合が有効か確認
});
```

**確認ポイント**:
- `tailwind()`が`integrations`配列に含まれているか
- エラーが発生していないか

## 3. `@apply`ディレクティブの確認

### 3.1 PostCSSの設定確認

Astro + Tailwind CSSでは、通常は自動的にPostCSSが設定されますが、`@apply`を使う場合は確認が必要です。

**確認方法**:
1. ブラウザの開発者ツールで、`@apply`を使っている要素を確認
2. スタイルが展開されているか確認（`@apply text-3xl font-bold` → 実際のCSSプロパティに展開されているか）

### 3.2 `@apply`が動作しない場合

`@apply`が動作しない場合は、以下のいずれかの方法で対応：

**方法1: 直接Tailwindクラスを使用**
```astro
<!-- @applyを使わずに直接クラスを指定 -->
<div class="text-3xl font-bold mt-8 mb-4">
```

**方法2: インラインスタイルを使用**
```astro
<div style="font-size: 1.875rem; font-weight: 700; margin-top: 2rem; margin-bottom: 1rem;">
```

**方法3: 通常のCSSを使用**
```astro
<style>
  .markdown-content h1 {
    font-size: 1.875rem;
    font-weight: 700;
    margin-top: 2rem;
    margin-bottom: 1rem;
  }
</style>
```

## 4. よくある問題と対処法

### 4.1 スタイルが全く適用されない

**原因**:
- Tailwind CSSが正しく読み込まれていない
- `content`パスが間違っている

**対処法**:
1. 開発サーバーを再起動
   ```bash
   # Ctrl+Cで停止してから
   npm run dev
   ```
2. `tailwind.config.mjs`の`content`パスを確認
3. ブラウザのキャッシュをクリア（Cmd+Shift+R または Ctrl+Shift+R）

### 4.2 一部のスタイルだけ適用されない

**原因**:
- 使用しているTailwindクラスが`content`パスに含まれていないファイルで定義されている
- クラス名のタイポ

**対処法**:
1. クラス名を確認（Tailwind CSSの公式ドキュメントで確認）
2. 該当ファイルが`content`パスに含まれているか確認
3. 開発サーバーを再起動

### 4.3 `@apply`が動作しない

**原因**:
- PostCSSの設定が正しくない
- `@apply`で使用しているクラスが存在しない

**対処法**:
1. `@apply`を使わずに直接クラスを指定
2. または、通常のCSSを使用

### 4.4 レイアウトが崩れている

**原因**:
- レスポンシブクラス（`md:`, `lg:`など）が正しく動作していない
- コンテナの幅設定が間違っている

**対処法**:
1. ブラウザの開発者ツールで、実際に適用されているスタイルを確認
2. レスポンシブクラスが正しく動作しているか確認（画面サイズを変更して確認）
3. `max-w-4xl`などの幅設定が正しいか確認

## 5. デバッグ手順

### ステップ1: 開発サーバーの再起動

```bash
# 開発サーバーを停止（Ctrl+C）
# 再度起動
npm run dev
```

### ステップ2: ブラウザのキャッシュクリア

- **Chrome/Edge**: Cmd+Shift+R（Mac）または Ctrl+Shift+R（Windows）
- **Firefox**: Cmd+Shift+R（Mac）または Ctrl+F5（Windows）
- **Safari**: Cmd+Option+E（キャッシュをクリア）

### ステップ3: 開発者ツールで確認

1. 開発者ツールを開く
2. **Console**タブでエラーを確認
3. **Network**タブでCSSファイルの読み込みを確認
4. **Elements**タブでスタイルの適用を確認

### ステップ4: ビルドして確認

```bash
npm run build
npm run preview
```

本番環境と同じ状態で確認できます。

## 6. 確認チェックリスト

- [ ] ブラウザのコンソールにエラーがない
- [ ] CSSファイルが正しく読み込まれている（Networkタブで確認）
- [ ] Tailwind CSSのクラスが適用されている（Elementsタブで確認）
- [ ] `@apply`ディレクティブが正しく展開されている
- [ ] `tailwind.config.mjs`の`content`パスが正しい
- [ ] `astro.config.mjs`でTailwind統合が有効になっている
- [ ] 開発サーバーを再起動した
- [ ] ブラウザのキャッシュをクリアした

## 7. 参考

- [Tailwind CSS ドキュメント](https://tailwindcss.com/docs)
- [Astro + Tailwind CSS 統合](https://docs.astro.build/en/guides/integrations-guide/tailwind/)
- [ローカル開発環境のセットアップ](./local-development.md)

