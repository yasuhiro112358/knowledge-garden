# ADR-0003: VPS（Traefik + Docker）でのホスティング

## Status

**Accepted** (2025-01)

## Context

Knowledge Gardenのホスティング方法を決定する必要がある。現在、レンタルサーバーとVPSの2台を使用しているが、将来的に1台にまとめたいと考えている。

候補：
1. **レンタルサーバー**: 既存のレンタルサーバーに統合
2. **VPS**: 既存のVPSに統合（Traefik + Docker構成）
3. **静的ホスティングサービス**: Netlify/Vercel/Cloudflare Pages

## Decision

**VPS（Traefik + Docker）に統合**

## Rationale

### VPS + Traefik + Dockerを選んだ理由

1. **費用面**
   - 既存のVPSを活用できる（追加費用なし）
   - レンタルサーバーとVPSの2台を1台にまとめられる（費用削減）

2. **技術的観点**
   - Traefikによる自動ルーティング（Dockerラベルで設定）
   - Dockerコンテナで独立管理
   - 各サービスを独立したコンテナとして運用できる
   - SSL証明書の自動管理（Let's Encrypt + Traefik）

3. **拡張性**
   - 将来的にサービスが増えても、同じパターンで追加できる
   - 各サービスを独立して管理・デプロイできる

4. **統合性**
   - infra-opsリポジトリで一元管理
   - 既存のTraefik構成に統合できる

5. **運用の観点**
   - サーバー管理のスキルがある
   - 完全にコントロール可能
   - 他のサービスも同じサーバーで運用可能

### 他の選択肢を選ばなかった理由

- **レンタルサーバー**: 設定の自由度が低く、Dockerが使えない。将来的な拡張性が低い
- **Netlify/Vercel**: 既存のサーバーを活用できない（費用の無駄）。静的サイトなので、VPSで十分に動作する

## Consequences

### ポジティブ

- ✅ 既存のVPSを活用できる（追加費用なし）
- ✅ Traefikによる自動ルーティングとSSL証明書管理
- ✅ Dockerコンテナで独立管理
- ✅ 将来的な拡張性が高い
- ✅ infra-opsリポジトリで一元管理

### ネガティブ

- ❌ サーバー管理の知識と時間が必要
- ❌ セキュリティ対策を自分で行う必要がある
- ❌ バックアップ戦略を自分で構築する必要がある

### 実装への影響

- `Dockerfile`: マルチステージビルドでNginxで配信
- `docker-compose.yml`: Traefikラベルでルーティング設定
- `nginx.conf`: Nginx設定ファイル
- infra-opsリポジトリへの統合が必要

## References

- [Docker + Traefik デプロイメントガイド](../guides/docker-deployment.md)

