---
title: Tailwind CSS ダークモードの使い方
tags:
  - Tailwind CSS
  - CSS
  - ダークモード
---

# Tailwind CSS ダークモードの使い方

Tailwind CSSでダークモードを実装する際の設定方法とベストプラクティスをまとめます。

## ダークモードの設定方法

Tailwind CSSでは、`tailwind.config.mjs`（または`.js`）でダークモードの動作を設定します。

### 設定オプション

```javascript
// tailwind.config.mjs
export default {
  darkMode: 'media', // または 'class'
  // ...
};
```

#### `darkMode: 'media'`（推奨）

- **動作**: ユーザーのシステム設定（`prefers-color-scheme`）に基づいて自動的にダークモードを適用
- **メリット**:
  - JavaScript不要で動作
  - フラッシュ（一瞬ライトモードが見える現象）が発生しにくい
  - ブラウザが直接メディアクエリを判定するため、パフォーマンスが良い
- **デメリット**:
  - ユーザーがシステム設定と異なる設定にしたい場合、手動で切り替えできない

```javascript
// システム設定がダークモード → 自動的にダークモード適用
// システム設定がライトモード → 自動的にライトモード適用
```

#### `darkMode: 'class'`

- **動作**: HTML要素に`dark`クラスがあるかどうかで判定
- **メリット**:
  - JavaScriptで手動切り替えが可能
  - localStorageに保存してユーザー設定を永続化できる
- **デメリット**:
  - 初期表示時にフラッシュが発生する可能性がある
  - JavaScriptが必要

```javascript
// JavaScriptで切り替え
document.documentElement.classList.add('dark');    // ダークモード
document.documentElement.classList.remove('dark'); // ライトモード
```

## ダークモード用のクラス指定

Tailwind CSSでは、`dark:`プレフィックスを使用してダークモード時のスタイルを指定します。

### 基本的な使い方

```html
<!-- ライトモード: 白背景、ダークモード: グレー背景 -->
<div class="bg-white dark:bg-gray-900">
  <p class="text-gray-900 dark:text-gray-100">
    テキスト
  </p>
</div>
```

### 複数のプロパティを指定

```html
<div class="
  bg-white dark:bg-gray-800
  text-gray-900 dark:text-gray-100
  border-gray-200 dark:border-gray-700
">
  コンテンツ
</div>
```

### ホバーなどと組み合わせる

```html
<a class="
  text-blue-600 hover:text-blue-700
  dark:text-blue-400 dark:hover:text-blue-300
">
  リンク
</a>
```

## フラッシュを防ぐ方法

### `darkMode: 'media'` の場合

`darkMode: 'media'`を使用する場合、ブラウザが直接`@media (prefers-color-scheme: dark)`を判定するため、フラッシュは発生しにくくなります。

しかし、CSSが読み込まれる前にHTMLが表示される可能性があるため、インラインスタイルで初期背景色を設定することが推奨されます：

```html
<head>
  <style>
    /* ダークモード時の初期背景色を設定してフラッシュを防ぐ */
    html {
      background-color: #f9fafb; /* ライトモードの背景色 */
    }
    @media (prefers-color-scheme: dark) {
      html {
        background-color: #111827; /* ダークモードの背景色 */
      }
      body {
        background-color: #111827;
        color: #f9fafb;
      }
    }
  </style>
</head>
```

### `darkMode: 'class'` の場合

ページの読み込み前に、ユーザーの設定を確認し、適切なクラスをHTML要素に追加するスクリプトを`<head>`内の最初に配置します：

```html
<head>
  <script>
    // ページ読み込み前にダークモードを適用（フラッシュを防ぐ）
    (function() {
      const isDark = localStorage.getItem('darkMode') === 'true' || 
                     (!localStorage.getItem('darkMode') && 
                      window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (isDark) {
        document.documentElement.classList.add('dark');
      }
    })();
  </script>
</head>
```

## 判断基準：`media` vs `class`

| 要件 | 推奨設定 |
|------|---------|
| システム設定に従って自動適用 | `darkMode: 'media'` |
| ユーザーが手動で切り替えたい | `darkMode: 'class'` |
| フラッシュを完全に防ぎたい | `darkMode: 'media'` + インラインスタイル |
| JavaScriptなしで動作させたい | `darkMode: 'media'` |

## よくある問題と解決方法

### 問題1: ダークモードが適用されない

**原因**: `dark:`プレフィックスが正しく記述されていない、またはTailwindの設定が間違っている

**解決方法**:
```html
<!-- ❌ 間違い -->
<div class="bg-white dark-bg-gray-900">

<!-- ✅ 正しい -->
<div class="bg-white dark:bg-gray-900">
```

### 問題2: フラッシュが発生する

**原因**: CSSが読み込まれる前にHTMLが表示される

**解決方法**: `<head>`の最初にインラインスタイルを配置して初期背景色を設定

### 問題3: 一部の要素だけダークモードにならない

**原因**: その要素に`dark:`プレフィックスが付けられていない

**解決方法**: すべての背景色・テキスト色に`dark:`バリアントを追加

## デフォルトスタイルは必要か？

### 結論: インラインスタイルで初期背景色を設定することを推奨

理由：
1. **フラッシュ防止**: CSS読み込み前に適切な背景色を表示できる
2. **ユーザー体験向上**: 画面のちらつきを防ぐ
3. **実装が簡単**: `<head>`に数行のCSSを追加するだけ

ただし、`darkMode: 'media'`を使用する場合は、インラインスタイルは必須ではありませんが、より滑らかな体験のために推奨されます。

## 参考リンク

- [Tailwind CSS Dark Mode 公式ドキュメント](https://tailwindcss.com/docs/dark-mode)
- [prefers-color-scheme MDN](https://developer.mozilla.org/ja/docs/Web/CSS/@media/prefers-color-scheme)

