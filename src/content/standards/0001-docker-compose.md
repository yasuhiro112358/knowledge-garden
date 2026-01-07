---
title: Docker Compose Standard
status: Active
version: v1.0
updated: 2026-01-07
tags: ["standards","docker","compose"]
---

本標準は、Docker Compose ファイル構成・運用ルールのベストプラクティスを定め、環境間の一貫性と再利用性を高めることを目的とします。特定プロジェクトに依存しない一般公開向けの標準です。

## ファイル命名と役割
- 共通: `compose.yaml`（環境非依存の最小構成）
- ローカル: `compose.override.yaml`（**自動読込**、build/ports/volumes 等の開発用）
- 本番: `compose.production.yaml`（**明示マージ**、image/restart/labels 等の本番用）
  - 重要: `.production` は「自動で効く特別な意味」ではなく、**一般的な命名慣習**です（適用は `-f` で明示します）。

## 実行コマンド
```bash
# ローカル
docker compose up -d
docker compose down

# 本番
docker compose -f compose.yaml -f compose.production.yaml pull
docker compose -f compose.yaml -f compose.production.yaml up -d
```

## ポリシー
- Compose V2（`docker compose`）を使用
- ベースは環境非依存の最小構成に限定
- 差分は override（ローカル）/ prod（本番）へ分離
- .env は変数展開用途に使用（秘匿情報はGitに含めない）

## 参考
- [Compose Specification](https://docs.docker.com/compose/compose-file/) - Docker公式のComposeファイル仕様
- [Docker Compose CLI Reference](https://docs.docker.com/compose/reference/) - `docker compose`コマンドの公式リファレンス
- [Docker Compose Best Practices](https://docs.docker.com/compose/production/) - 本番環境でのベストプラクティス


