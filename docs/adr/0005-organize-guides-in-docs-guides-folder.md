# ADR-0005: 手順書を`docs/guides/`フォルダに統合

## Status

**Accepted** (2025-01)

## Context

プロジェクトの進行に伴い、以下のような手順書が散在していた：

- `DOCKER.md`（ルート） - Docker運用ガイド
- `docs/docker-deployment.md` - Dockerデプロイメントガイド（重複）
- `docs/github-actions-setup-guide.md` - GitHub Actionsセットアップ手順
- `SETUP.md`（ルート） - セットアップ手順（古い内容）

これらを整理し、管理しやすくする必要があった。

また、提案書（`domain-proposal.md`、`hosting-comparison.md`、`server-consolidation.md`、`technology-selection.md`など）が多数存在していたが、決定事項はADRとして記録されているため、提案書は不要である。

## Decision

1. **手順書を`docs/guides/`フォルダに統合**
   - すべての手順書を`docs/guides/`フォルダに集約
   - 手順書のインデックスとして`docs/guides/README.md`を作成

2. **提案書を削除**
   - 決定事項はADRとして記録されているため、提案書は不要
   - 今後の提案はチャットで行い、決定事項のみADRとして記録

3. **ドキュメントの分類**
   - **手順書（Guides）**: `docs/guides/` - 実際の作業手順
   - **仕様書・設計書（Specifications）**: `docs/` - 要件定義、機能仕様、技術選定など
   - **アーキテクチャ決定記録（ADR）**: `docs/adr/` - 重要な決定事項の記録

## Rationale

### 手順書の統合

- **一箇所に集約**: 手順書が見つけやすくなる
- **分類が明確**: 手順書と仕様書・設計書が分離される
- **拡張性**: 新しい手順書を追加しやすい
- **保守性**: 手順書の更新・削除が容易

### 提案書の削除

- **重複の排除**: 決定事項はADRに記録されているため、提案書は不要
- **情報の一元化**: 決定事項はADRに集約される
- **保守コストの削減**: 提案書の更新が不要になる
- **チャットでの提案**: より柔軟で迅速な議論が可能

## Consequences

### ポジティブ

- ✅ 手順書が整理され、見つけやすくなった
- ✅ ドキュメント構造が明確になった
- ✅ 提案書の保守コストが削減された
- ✅ 決定事項がADRに集約され、追跡しやすくなった

### ネガティブ

- ⚠️ 過去の提案内容を参照したい場合は、ADRを確認する必要がある
- ⚠️ リンクの更新が必要（実施済み）

## 実施内容

1. `docs/guides/`フォルダを作成
2. 手順書を移動・統合：
   - `DOCKER.md` → `docs/guides/docker-deployment.md`
   - `docs/github-actions-setup-guide.md` → `docs/guides/github-actions-setup-guide.md`
   - `SETUP.md`の有用な情報 → `docs/guides/local-development.md`に統合
3. 提案書を削除：
   - `docs/domain-proposal.md`（決定事項はADR 0001に記録）
   - `docs/hosting-comparison.md`（決定事項はADR 0003に記録）
   - `docs/server-consolidation.md`（決定事項はADR 0003に記録）
   - `docs/technology-selection.md`（決定事項はADR 0002に記録）
   - `docs/guides/organization-proposal.md`（実装済み）
4. すべてのリンクを更新

## References

- [ADR 0001: Knowledge Gardenのサブドメイン方式採用](./0001-use-subdomain-for-knowledge-garden.md)
- [ADR 0002: Astroを静的サイトジェネレーターとして採用](./0002-use-astro-as-static-site-generator.md)
- [ADR 0003: VPS（Traefik + Docker）でのホスティング](./0003-use-vps-with-traefik-and-docker.md)
- [手順書インデックス](../guides/README.md)

