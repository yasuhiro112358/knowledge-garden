---
id: KG-STD-0001
title: Docker Compose 標準
status: Active
version: v1.0
updated: 2026-01-07
---

## 1. 目的と適用範囲
この標準は、Knowledge Garden における Docker Compose ファイル構成・運用ルールを定め、環境間の一貫性と可読性を確保することを目的とする。すべてのリポジトリに適用する。

## 2. 規範語（RFC 2119）
- MUST / MUST NOT / SHOULD / SHOULD NOT / MAY を規範語として用いる。

## 3. ファイル命名と役割
- ベース: `compose.yaml`（MUST）
  - すべての環境で共通の最小定義のみを含む。
- ローカル: `compose.override.yaml`（MUST）
  - **自動読み込み対象**（`docker compose up` 実行時、`compose.yaml` と併せて読み込まれる）。開発専用の上書き（build, ports, volumes 等）。
- 本番: `compose.production.yaml`（MUST）
  - **ファイル名は任意だが、本標準では `compose.production.yaml` を採用**する（命名規約。公式ドキュメントの表現に寄せる）。
  - 明示的にマージして使用（`-f` で指定）。イメージ固定、ラベル、再起動ポリシー等を記述。

現行の `docker-compose.yml`（または旧来の `docker-compose.*`）は段階的に廃止（SHOULD）。

## 4. 実行コマンド標準
- ローカル開発（自動マージ）:
  ```bash
  docker compose up -d
  docker compose down
  ```
- 本番（明示マージ）:
  ```bash
  docker compose -f compose.yaml -f compose.production.yaml pull
  docker compose -f compose.yaml -f compose.production.yaml up -d
  ```
`docker-compose` コマンドの使用は非推奨（SHOULD NOT）。Compose V2 の `docker compose` を使用（MUST）。

## 5. .env の扱い
- ルートの `.env` は Compose の変数展開に利用してよい（MAY）。
- 機密値は Git に含めてはならない（MUST NOT）。
- 例：
  ```env
  DOCKER_USERNAME=your-dockerhub-username
  IMAGE_TAG=latest
  ```
  ```yaml
  # compose.production.yaml
  services:
    knowledge-garden:
      image: ${DOCKER_USERNAME}/knowledge-garden:${IMAGE_TAG}
  ```

## 6. ネットワーク / Traefik
- 共有リバースプロキシ（Traefik）利用時は外部ネットワークを定義（SHOULD）。
  ```yaml
  networks:
    traefik:
      external: true
  ```
- 本番ラベルは `compose.production.yaml` に記述（SHOULD）。ローカルでは最小化。

## 7. 差分ポリシー
- `compose.yaml` は「環境に依存しない最小定義」に限定（MUST）。
- ローカル固有（ports/volumes/build 等）は `compose.override.yaml` に記載（MUST）。
- 本番固有（image/restart/labels 等）は `compose.production.yaml` に記載（MUST）。
- 本番固有（image/restart/labels 等）は `compose.production.yaml` に記載（MUST）。

## 8. CI/CD 推奨
```bash
docker compose -f compose.yaml -f compose.production.yaml pull
docker compose -f compose.yaml -f compose.production.yaml up -d
docker system prune -f
```

## 9. 命名・表記
- ファイル名は `compose.yaml / compose.override.yaml / compose.production.yaml`（MUST）。
- YAML インデントは 2 スペース（SHOULD）。
- サービス名はケバブケース（例: `knowledge-garden`）（SHOULD）。
- 本番は `restart: unless-stopped` を明示（SHOULD）。

## 10. 付録（参考実装）
```yaml
# compose.yaml（ベース）
services:
  knowledge-garden:
    container_name: knowledge-garden
    restart: unless-stopped

networks:
  traefik:
    external: true
```

```yaml
# compose.override.yaml（ローカル）
services:
  knowledge-garden:
    build:
      context: .
      dockerfile: Dockerfile
    networks:
      - traefik
```

```yaml
# compose.production.yaml（本番）
services:
  knowledge-garden:
    image: ${DOCKER_USERNAME}/knowledge-garden:latest
    networks:
      - traefik
    labels:
      - traefik.enable=true
      - traefik.http.routers.knowledge-garden.rule=Host(`knowledge.newtralize.com`)
      - traefik.http.routers.knowledge-garden.entrypoints=websecure
      - traefik.http.routers.knowledge-garden.tls=true
      - traefik.http.routers.knowledge-garden.tls.certresolver=le
      - traefik.http.services.knowledge-garden.loadbalancer.server.port=80
```

---

## 11. 参考文献
- [Compose Specification](https://docs.docker.com/compose/compose-file/) - Docker公式のComposeファイル仕様
- [Docker Compose CLI Reference](https://docs.docker.com/compose/reference/) - `docker compose`コマンドの公式リファレンス
- [Docker Compose Best Practices](https://docs.docker.com/compose/production/) - 本番環境でのベストプラクティス
- [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119) - 規範語の定義（MUST, SHOULD, MAY等）

### 変更履歴
- v1.0 (2026-01-07): 初版（compose.yaml 体系の採用、運用コマンドの規定）


