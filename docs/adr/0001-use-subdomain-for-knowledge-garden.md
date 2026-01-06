# ADR-0001: Knowledge Gardenのサブドメイン方式採用

## Status

**Accepted** (2025-01)

## Context

Knowledge Gardenを`newtralize.com`の配下で公開する必要がある。将来的に`newtralize.com`は会社のトップページとして運用し、そこから各サービスや情報サイトにリンクする構成を想定している。

選択肢は以下の2つ：
1. **サブディレクトリ方式**: `https://newtralize.com/knowledge`
2. **サブドメイン方式**: `https://knowledge.newtralize.com`

## Decision

**サブドメイン方式を採用**: `https://knowledge.newtralize.com`

## Rationale

### サブドメイン方式を選んだ理由

1. **会社トップページ構成に適している**
   - 各サービスが独立していることが明確
   - トップページから明確にリンクできる
   - 将来的にサービスが増えても拡張しやすい

2. **ブランディングの観点**
   - 各サービスが独立したブランドとして認識される
   - Knowledge Gardenが情報サイトとして独立していることが明確

3. **管理の観点**
   - 各サービスを独立して管理・デプロイできる
   - トップページの変更が各サービスに影響しない

4. **技術的観点**
   - Traefik + Docker構成では、サブドメイン方式の方が設定が簡単
   - 各サービスを独立したコンテナとして管理できる
   - Dockerラベルで自動ルーティング設定が可能

5. **将来性**
   - サービスが増えても、同じパターンで追加できる
   - 独立したサービスとして評価される可能性がある

### サブディレクトリ方式を選ばなかった理由

- 独立性が低く、会社サイトの一部として見られやすい
- 拡張性が低く、サービスが増えるとURLが長くなる可能性
- ブランディングが弱く、独立したサービスとしての印象が弱い
- 管理が複雑で、トップページと統合管理が必要

## Consequences

### ポジティブ

- ✅ 各サービスが独立して管理できる
- ✅ 将来的な拡張性が高い
- ✅ Traefik + Docker構成で設定が簡単
- ✅ ブランディングが独立できる

### ネガティブ

- ❌ サブドメインのDNS設定が必要
- ❌ SSL証明書の設定が必要（ただし、Let's Encrypt + Traefikで自動化可能）
- ❌ メインドメインのSEO効果は受けにくい（ただし、独立したサービスとして評価される可能性がある）

### 実装への影響

- `astro.config.mjs`: `site: 'https://knowledge.newtralize.com'`, `base: '/'`
- `docker-compose.yml`: Traefikラベルで`Host('knowledge.newtralize.com')`を設定
- すべてのリンクパスを `/` ベースに変更
- 画像パス変換: `/img/` に変換

## References

- [ドメイン・名前提案書](../domain-proposal.md)
- [Docker + Traefik デプロイメントガイド](../docker-deployment.md)

