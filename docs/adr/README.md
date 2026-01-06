# Architecture Decision Records (ADR)

このディレクトリには、Knowledge Gardenプロジェクトの重要なアーキテクチャ決定を記録します。

## ADRとは

ADR（Architecture Decision Record）は、アーキテクチャの重要な決定を記録する標準的な方法です。各決定について、背景、選択肢、決定理由、結果・影響を構造化して記録します。

## ADR一覧

| ADR | タイトル | ステータス | 日付 |
|-----|---------|----------|------|
| [0001](./0001-use-subdomain-for-knowledge-garden.md) | Knowledge Gardenのサブドメイン方式採用 | Accepted | 2025-01 |
| [0002](./0002-use-astro-as-static-site-generator.md) | Astroを静的サイトジェネレーターとして採用 | Accepted | 2025-01 |
| [0003](./0003-use-vps-with-traefik-and-docker.md) | VPS（Traefik + Docker）でのホスティング | Accepted | 2025-01 |
| [0004](./0004-use-markdown-for-content-format.md) | Markdownをコンテンツ形式として採用 | Accepted | 2025-01 |
| [0005](./0005-organize-guides-in-docs-guides-folder.md) | 手順書を`docs/guides/`フォルダに統合 | Accepted | 2025-01 |

## ADRの形式

各ADRは以下の構造を持ちます：

- **Title**: 決定事項のタイトル
- **Status**: ステータス（Proposed, Accepted, Deprecated, Superseded）
- **Context**: 背景・課題
- **Decision**: 決定内容
- **Rationale**: 決定理由
- **Consequences**: 結果・影響（ポジティブ/ネガティブ）
- **References**: 関連ドキュメントへの参照

## 新しいADRの作成

新しい決定事項がある場合は、以下の手順でADRを作成してください：

1. 次の番号のADRファイルを作成（例: `0005-決定事項のタイトル.md`）
2. テンプレートに従って記入
3. このREADMEに追加

## 参考

- [ADR形式の説明](https://adr.github.io/)
- [ADRテンプレート](https://github.com/joelparkerhenderson/architecture-decision-record)

