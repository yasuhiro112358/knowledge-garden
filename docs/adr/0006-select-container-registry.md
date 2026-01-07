# ADR-0006: コンテナレジストリの選定（Docker Hub / GHCR など）

## Status

**Proposed** (2026-01)

## Context

Knowledge Garden は Docker イメージとしてビルドし、VPS（Traefik + Docker）上で `docker compose` により更新・起動する。
この運用では、ビルドしたイメージを **どこに保管し、VPS からどう取得（pull）するか**を決める必要がある。

現状のCI/CD構成は「GitHub Actionsでイメージをビルド→レジストリへpush→VPSでpullして再起動」という流れであるため、レジストリ選定は以下に直接影響する：

- 認証方式（GitHub Secrets の必要性と最小化）
- コスト（無料枠、課金条件）
- 可用性・信頼性（外部依存、障害時の影響）
- rate limit（pull 制限等）と運用リスク
- OSS/個人用途での公開・非公開ポリシー

## Decision

1. 本プロジェクトのコンテナレジストリとして **GitHub Container Registry（GHCR, `ghcr.io`）を第一候補**とする。
2. 本ADRのStatusは **Proposed** とし、運用・権限・公開ポリシー（public/private）を確定後に **Accepted** へ更新する。

## Rationale

### 選定基準

- **GitHub Actionsとの統合**: 認証・権限管理が自然で、設定が簡潔であること
- **Secrets最小化**: 追加の長期資格情報（パスワード/トークン）を増やさないこと
- **運用負荷**: レジストリ自体の保守（自前運用）を避けること
- **コストと制限**: 個人運用で現実的な無料枠/制限であること

### 主要な選択肢

#### A. Docker Hub

- **Pros**
  - デファクトのレジストリで情報が多い
  - エコシステム・互換性が高い
- **Cons**
  - 認証情報（`DOCKER_USERNAME` / `DOCKER_PASSWORD` or Token）をSecretsに持つ必要がある
  - rate limit の運用リスクがある（特に匿名pull）

#### B. GHCR（`ghcr.io`）

- **Pros**
  - GitHub Actions と統合しやすく、権限は `GITHUB_TOKEN` を基本にできる
  - リポジトリ/組織の権限モデルと揃えられる
  - Secrets を減らしやすい（Docker HubのID/パスワードが不要になり得る）
- **Cons**
  - Docker Hubほど「定番」ではない（ただし一般的には十分普及）
  - private運用の場合、VPS側のpullに追加の認証設計が要る（PATなど）

#### C. 自前レジストリ（VPS上で registry を運用）

- **Pros**
  - 外部依存を減らせる
  - pull 制限の影響を受けにくい
- **Cons**
  - TLS/認証/バックアップ/監視などの運用負荷が増える
  - セキュリティ責務が増える

### 結論（第一候補をGHCR）

本プロジェクトは **GitHub Actions を中心にCI/CDを構築**しており、運用上のボトルネックは「レジストリ自体の管理」よりも「運用の簡潔さ/Secrets最小化」にある。
このため、GitHubとの統合が最も自然な **GHCR を第一候補**とするのが合理的。

## Consequences

### ポジティブ

- ✅ GitHub Actions と権限モデルが統合され、設定が簡潔になる
- ✅ Docker Hub 用の資格情報（Secrets）を減らせる可能性が高い
- ✅ プロジェクト単位でレジストリを管理でき、追跡性が上がる

### ネガティブ

- ⚠️ イメージの公開/非公開ポリシーにより、VPS側の認証設計が変わる
- ⚠️ 既存の Docker Hub 前提（ワークフロー/compose）の置換が必要になる

## 実施内容（予定）

- GitHub Actions: push先を `ghcr.io/<owner>/knowledge-garden` に変更
- `compose.production.yaml`: `image:` を `ghcr.io/...` に変更
- private運用の場合:
  - VPS側で `docker login ghcr.io` を行う（PAT等を用意）

## References

- [Docker Compose production best practices](https://docs.docker.com/compose/production/)
- [Docker Compose: Use multiple Compose files](https://docs.docker.com/compose/how-tos/multiple-compose-files/merge/)
- [GitHub Container Registry (GHCR) - docs](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [ADR](https://adr.github.io/)


