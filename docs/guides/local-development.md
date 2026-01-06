# ローカル開発環境のセットアップ

このドキュメントは、Knowledge Gardenをローカル環境で開発・動作確認するための手順を説明します。

## 前提条件

- Node.js v20以上がインストールされている
- npmがインストールされている
- Gitがインストールされている

### バージョン確認

```bash
node -v  # v20以上であることを確認
npm -v
git --version
```

## セットアップ手順

### ステップ1: リポジトリのクローン

```bash
# リポジトリをクローン（まだの場合）
git clone https://github.com/your-username/knowledge-garden.git
cd knowledge-garden
```

### ステップ2: 依存関係のインストール

```bash
npm install
```

### ステップ3: 開発サーバーの起動

```bash
npm run dev
```

開発サーバーが起動すると、以下のメッセージが表示されます：

```
  Astro  v4.15.0  ready in XXX ms

  ➜  Local:   http://localhost:4321/
  ➜  Network: use --host to expose
```

### ステップ4: ブラウザで確認

ブラウザで `http://localhost:4321/` を開いて、サイトが表示されることを確認してください。

## 開発時の操作

### ファイルの変更を確認

開発サーバーは自動的にファイルの変更を検知して、ブラウザを自動リロードします。

1. `topics/` や `daily/` ディレクトリのMarkdownファイルを編集
2. ブラウザが自動的にリロードされる
3. 変更が反映されていることを確認

### 新しいトピックの追加

1. `topics/` ディレクトリに新しいMarkdownファイルを作成（例: `topics/new-topic.md`）
2. ファイルを保存
3. ブラウザで `http://localhost:4321/topics/new-topic` にアクセスして確認

### 新しい日次ノートの追加

1. `daily/` ディレクトリに新しいMarkdownファイルを作成（例: `daily/2025-01-15.md`）
2. ファイルを保存
3. ブラウザで `http://localhost:4321/daily/2025-01-15` にアクセスして確認

### 画像の追加

1. `img/` ディレクトリに画像を配置（例: `img/screenshots/test.png`）
2. Markdownファイル内で以下のように参照：
   ```markdown
   ![説明](../img/screenshots/test.png)
   ```
3. 開発サーバーが自動的に画像をコピーして表示

## ビルドとプレビュー

### ビルド

本番環境と同じようにビルドして確認できます：

```bash
npm run build
```

ビルド結果は `dist/` ディレクトリに出力されます。

### プレビュー

ビルドしたサイトをローカルでプレビューできます：

```bash
npm run preview
```

プレビューサーバーが起動すると、以下のメッセージが表示されます：

```
  ➜  Local:   http://localhost:4321/
```

## トラブルシューティング

### ポートが既に使用されている

**エラー**: `Port 4321 is already in use`

**対処**:
1. 既に起動している開発サーバーを停止
2. または、別のポートを指定：
   ```bash
   npm run dev -- --port 4322
   ```

### 依存関係のエラー

**エラー**: `Cannot find module` など

**対処**:
```bash
# node_modulesを削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

### 画像が表示されない

**対処**:
1. 画像パスが `../img/` で始まっているか確認
2. 開発サーバーを再起動：
   ```bash
   # Ctrl+Cで停止してから
   npm run dev
   ```

### ビルドエラー

**対処**:
1. エラーメッセージを確認
2. Markdownファイルの構文エラーがないか確認
3. 型エラーの場合、TypeScriptの型定義を確認

### ホットリロードが動作しない

**対処**:
1. ブラウザのキャッシュをクリア
2. 開発サーバーを再起動
3. ブラウザの開発者ツールでエラーを確認

## 開発時のベストプラクティス

### ファイル構成

- `topics/` - 技術的なまとめ（体系的に整理）
- `daily/` - 日々のメモ（気軽に記録）
- `snippets/` - 再利用可能なコードやコマンド
- `templates/` - テンプレートファイル

### Markdownの書き方

- 見出しは `#` から始める（`#` がトップレベル）
- 画像は `../img/` で始まるパスを使用
- コードブロックには言語指定を推奨

### Gitの使い方

```bash
# 変更を確認
git status

# 変更をステージング
git add .

# コミット
git commit -m "feat: 新しいトピックを追加"

# プッシュ
git push origin main
```

## カスタマイズ

### サイト名や説明の変更

`src/layouts/BaseLayout.astro` を編集して、サイト名や説明を変更できます。

### スタイルの変更

Tailwind CSSを使用しているので、`src/layouts/BaseLayout.astro` のスタイルセクションを編集するか、Tailwindクラスを使用してスタイルを変更できます。

### ベースパスの変更

`astro.config.mjs` の `base` オプションを変更することで、ベースパスを変更できます。

## 参考

- [Astro ドキュメント](https://docs.astro.build/)
- [Markdown ガイド](https://www.markdownguide.org/)
- [プロジェクトの要件定義](../requirements.md)
- [機能仕様書](../functional-spec.md)

