# Knowledge Garden

個人的な学習メモとナレッジベースを管理するリポジトリです。

🌐 **公開サイト**: [https://yasuhiro112358.github.io/knowledge-garden/](https://yasuhiro112358.github.io/knowledge-garden/)

## 📋 ドキュメント

- [Architecture Decision Records (ADR)](./docs/adr/README.md) - アーキテクチャ決定の記録
- [Changelog](./CHANGELOG.md) - リリース・重要な変更の記録
- [プロジェクト作業履歴](./docs/project-log.md) - 開発作業の時系列記録
- [要件定義書](./docs/requirements.md) - プロジェクトの要件と仕様
- [機能仕様書](./docs/functional-spec.md) - 詳細な機能仕様
- [手順書（Guides）](./docs/guides/README.md) - 開発・デプロイ・運用の手順書
- [GitHub Actions 自動デプロイ設定ガイド](./docs/github-actions-setup.md) - Xserver VPSへの自動デプロイ設定

## 構造

```
/（GitHubリポジトリのルート）
├── src/                   ← Astroサイトのソースコード
│   ├── content/          ← コンテンツ（Markdownファイル）
│   │   ├── topics/        ← 技術まとめ（後で成文化）
│   │   │   ├── docker.md
│   │   │   ├── git.md
│   │   │   └── obsidian.md
│   │   └── daily/        ← 日々のメモ（気軽に記録）
│   │       └── 2025-08-08.md
│   ├── pages/            ← ページコンポーネント
│   ├── layouts/          ← レイアウトコンポーネント
│   └── utils/            ← ユーティリティ関数
├── public/               ← 静的アセット（そのまま配信される）
│   └── img/              ← 画像ファイル
│       └── screenshots/
├── snippets/
│   └── useful-commands.md  ← 使い回しコードやコマンド
├── templates/
│   └── daily-note.md
├── README.md
└── package.json
```

## 使い方

### Daily Notes
- `src/content/daily/` フォルダに日付ベースのメモを作成
- テンプレートは `templates/daily-note.md` を使用
- 気軽に思いついたことを記録
- 画像は `/img/` から始まる絶対パスで指定（例: `/img/screenshots/image.png`）
- **自動的に公開サイトに反映されます**

### Topics
- `src/content/topics/` フォルダに技術的なまとめを作成
- 体系的に整理された知識を蓄積
- 後から検索しやすいように構造化
- 画像は `/img/` から始まる絶対パスで指定（例: `/img/screenshots/image.png`）
- **自動的に公開サイトに反映されます**

### Snippets
- `snippets/` フォルダに再利用可能なコードやコマンドを保存
- よく使うコマンドやスクリプトの備忘録

### Templates
- `templates/` フォルダにテンプレートファイルを配置
- 新しいノート作成時の雛形として使用

## 開発・ビルド

このリポジトリは [Astro](https://astro.build) を使用して静的サイトを生成します。

### セットアップ

```bash
npm install
```

### 開発サーバー起動

```bash
npm run dev
```

開発サーバーは `http://localhost:4321` で起動します。

### ビルド

```bash
npm run build
```

ビルド結果は `dist/` ディレクトリに出力されます。

### プレビュー

```bash
npm run preview
```

ビルドしたサイトをローカルでプレビューできます。

## 自動デプロイ

このリポジトリは GitHub Actions を使用して自動的に GitHub Pages にデプロイされます。

- `main` ブランチにプッシュすると自動的にビルド・デプロイが実行されます
- デプロイには数分かかる場合があります
- デプロイ状況は GitHub の Actions タブで確認できます

## Tips
- Obsidianなどのマークダウンエディタとの連携を想定
- GitHubでの管理により、どこからでもアクセス可能
- 日々の学習を継続的に記録することで知識を蓄積
- **Markdownファイルを追加・更新するだけで自動的に公開サイトに反映されます**
