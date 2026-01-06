# プロジェクト作業履歴

このドキュメントは、Knowledge Gardenプロジェクトの開発作業履歴を時系列で記録します。

## 2025年1月

### 2025-01-XX（初期セットアップ）

**実装**:
- Astroプロジェクトのセットアップ
  - `package.json`、`astro.config.mjs`、`tsconfig.json`の作成
  - Tailwind CSS、MDX統合の設定
- Markdown読み込み機能の実装
  - `src/utils/markdown.ts`: ファイルシステムからMarkdownを読み込む
  - `src/utils/markdownRenderer.ts`: Markdown-itでHTMLに変換
- ページコンポーネントの実装
  - ホームページ（`src/pages/index.astro`）
  - トピック一覧・詳細ページ（`src/pages/topics/`）
  - 日次ノート一覧・詳細ページ（`src/pages/daily/`）
- レイアウトコンポーネントの実装
  - `src/layouts/BaseLayout.astro`: 共通レイアウト

**決定事項**:
- サブドメイン方式を採用 → [ADR-0001](./adr/0001-use-subdomain-for-knowledge-garden.md)
- Astro 4.xを採用 → [ADR-0002](./adr/0002-use-astro-as-static-site-generator.md)
- VPS + Traefik + Dockerを採用 → [ADR-0003](./adr/0003-use-vps-with-traefik-and-docker.md)
- Markdownをコンテンツ形式として採用 → [ADR-0004](./adr/0004-use-markdown-for-content-format.md)

**ドキュメント作成**:
- 要件定義書（`docs/requirements.md`）
- 機能仕様書（`docs/functional-spec.md`）
- 技術選定書（`docs/technology-selection.md`）
- ドメイン・名前提案書（`docs/domain-proposal.md`）
- ホスティング方法の比較（`docs/hosting-comparison.md`）
- サーバー統合方針（`docs/server-consolidation.md`）
- Docker + Traefik デプロイメントガイド（`docs/docker-deployment.md`）

**実装詳細**:
- 画像パスの自動変換ロジック（`../img/` → `/img/`）
- 画像アセットの自動コピー（`scripts/copy-assets.js`）
- すべてのリンクパスを `/` ベースに更新（サブドメイン方式のため）

**Docker実装**:
- `Dockerfile`: マルチステージビルド（Node.js → Nginx）
- `docker-compose.yml`: Traefikラベル設定
- `nginx.conf`: Nginx設定（SPA対応、キャッシュ設定）
- `.dockerignore`: ビルド時の除外ファイル

**GitHub Actions**:
- `.github/workflows/docker-build.yml`: Dockerイメージのビルド・プッシュ
- `.github/workflows/docker-deploy.yml`: VPSへの自動デプロイ（オプション）

**課題・メモ**:
- 画像パスの変換ロジックを実装（ベースパスに応じて自動変換）
- Dockerコンテナ化の検討（Traefik + Docker構成）
- ADR形式での決定事項記録に移行

**次回作業**:
- [ ] DNS設定: `knowledge.newtralize.com`のAレコードまたはCNAMEレコードを設定
- [ ] infra-opsリポジトリへの統合
- [ ] テストデプロイ
- [ ] 本番デプロイ

---

## 記録方法

### 記録のタイミング
- 作業セッションごと、または日次で記録
- 重要な実装や決定事項はその都度記録

### 記録内容
- **実装**: 実装した機能や変更
- **決定事項**: ADRへの参照
- **ドキュメント作成**: 作成したドキュメント
- **実装詳細**: 技術的な詳細
- **課題・メモ**: 課題や気づき
- **次回作業**: 次の作業予定

### 形式
- 日付ごとにセクションを分ける
- カテゴリごとに整理（実装、決定事項、ドキュメントなど）
- ADRへの参照を明記

