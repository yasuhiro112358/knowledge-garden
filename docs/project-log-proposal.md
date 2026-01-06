# 作業履歴記録方法の提案

## 1. 目的

Knowledge Gardenプロジェクトの開発作業履歴を記録し、将来の参照や振り返りに役立てる。

## 2. 選択肢

### 2.1 CHANGELOG.md（リリース・重要な変更の記録）

**形式**: Keep a Changelog形式

**特徴**:
- リリースや重要な変更を記録
- バージョン管理と連携しやすい
- ユーザー向けの変更履歴としても使用可能

**メリット**:
- ✅ 標準的な形式（Keep a Changelog）
- ✅ リリースごとの変更が明確
- ✅ ユーザー向けの変更履歴としても使用可能

**デメリット**:
- ❌ 細かい作業履歴は記録しにくい
- ❌ 日々の作業ログには向かない

**例**:
```markdown
# Changelog

## [Unreleased]

### Added
- Astroプロジェクトのセットアップ
- Docker + Traefik構成の実装
- GitHub Actionsでの自動デプロイ

## [0.1.0] - 2025-01-XX

### Added
- 初期実装
- トピック一覧・詳細ページ
- 日次ノート一覧・詳細ページ
```

### 2.2 PROJECT_LOG.md（作業履歴の時系列記録）

**形式**: 時系列の作業ログ

**特徴**:
- 日々の作業を時系列で記録
- 細かい作業も記録可能
- プロジェクトの進捗が分かりやすい

**メリット**:
- ✅ 細かい作業も記録できる
- ✅ プロジェクトの進捗が分かりやすい
- ✅ 後から振り返りやすい

**デメリット**:
- ❌ 長くなりやすい
- ❌ 重要な変更が見えにくい可能性

**例**:
```markdown
# プロジェクト作業履歴

## 2025-01-XX

### 実装
- Astroプロジェクトのセットアップ
- 要件定義書の作成
- 技術選定（Astro採用）

### 決定事項
- サブドメイン方式を採用（ADR-0001）
- VPS + Traefik + Docker構成を採用（ADR-0003）

### 課題・メモ
- 画像パスの変換ロジックを実装
- Dockerコンテナ化の検討
```

### 2.3 docs/project-log/（日付ベースのログファイル）

**形式**: 日付ごとのログファイル（`YYYY-MM-DD.md`）

**特徴**:
- 日付ごとにファイルを分ける
- 詳細な作業記録が可能
- 検索しやすい

**メリット**:
- ✅ 日付ごとに整理される
- ✅ 詳細な作業記録が可能
- ✅ 検索しやすい

**デメリット**:
- ❌ ファイル数が増える
- ❌ 全体像が見えにくい

**例**:
```
docs/project-log/
├── 2025-01-10.md
├── 2025-01-11.md
└── 2025-01-12.md
```

### 2.4 ハイブリッド方式（推奨）

**構成**:
- `CHANGELOG.md`: リリース・重要な変更の記録
- `docs/project-log.md`: 作業履歴の時系列記録（月単位でセクション分け）

**特徴**:
- 重要な変更と詳細な作業履歴を分離
- 両方のメリットを活用

**メリット**:
- ✅ 重要な変更が明確
- ✅ 詳細な作業履歴も記録
- ✅ 用途に応じて参照できる

## 3. 推奨案

### 3.1 推奨: ハイブリッド方式

**構成**:
1. **CHANGELOG.md**: リリース・重要な変更の記録（Keep a Changelog形式）
2. **docs/project-log.md**: 作業履歴の時系列記録（月単位でセクション分け）

**理由**:
- 重要な変更（CHANGELOG）と詳細な作業履歴（project-log）を分離できる
- 用途に応じて参照できる
- 標準的な形式（Keep a Changelog）を採用

### 3.2 記録内容の分類

**CHANGELOG.mdに記録する内容**:
- リリース（バージョン）
- 重要な機能追加
- 破壊的変更
- バグ修正
- セキュリティ修正

**docs/project-log.mdに記録する内容**:
- 日々の作業内容
- 実装の詳細
- 決定事項（ADRへの参照）
- 課題・メモ
- 学んだこと
- 次回の作業予定

## 4. 実装例

### 4.1 CHANGELOG.md

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Astroプロジェクトのセットアップ
- Docker + Traefik構成の実装
- GitHub Actionsでの自動デプロイ設定
- ADR形式での決定事項記録

### Changed
- サブドメイン方式（knowledge.newtralize.com）を採用

## [0.1.0] - 2025-01-XX

### Added
- 初期実装
- トピック一覧・詳細ページ
- 日次ノート一覧・詳細ページ
- Markdownレンダリング機能
- 画像パス自動変換機能
```

### 4.2 docs/project-log.md

```markdown
# プロジェクト作業履歴

このドキュメントは、Knowledge Gardenプロジェクトの開発作業履歴を時系列で記録します。

## 2025年1月

### 2025-01-XX

**実装**:
- Astroプロジェクトのセットアップ
- 要件定義書の作成
- 技術選定書の作成

**決定事項**:
- サブドメイン方式を採用 → [ADR-0001](../adr/0001-use-subdomain-for-knowledge-garden.md)
- Astro 4.xを採用 → [ADR-0002](../adr/0002-use-astro-as-static-site-generator.md)

**課題・メモ**:
- 画像パスの変換ロジックを実装
- Dockerコンテナ化の検討

**次回作業**:
- infra-opsリポジトリへの統合
- テストデプロイ
```

## 5. 運用方法

### 5.1 記録のタイミング

- **CHANGELOG.md**: リリース時、重要な変更時
- **docs/project-log.md**: 作業セッションごと、または日次

### 5.2 記録の粒度

- **CHANGELOG.md**: ユーザーが知るべき変更
- **docs/project-log.md**: 開発者が知るべき詳細

### 5.3 テンプレート

作業ログのテンプレートを作成し、統一された形式で記録する。

## 6. 参考

- [Keep a Changelog](https://keepachangelog.com/)
- [Semantic Versioning](https://semver.org/)

