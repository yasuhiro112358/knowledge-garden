## Docker Compose 開発標準（運用規格要約）

このドキュメントは、Knowledge Gardenでの Docker Compose ファイル構成・運用ルールの「要約ガイド」です。正式な規格文書は Standards を参照してください。

正式版: [KG-STD-0001 Docker Compose 標準](../standards/0001-docker-compose.md)

### 1. ファイル命名と役割

- `compose.yaml`（共通）
  - すべての環境で共通の定義（サービス名、ネットワーク、ボリューム等のベース）
  - 可能な限り環境依存の記述（ポート、ボリュームのバインド、ビルド/イメージ切替）は含めない
- `compose.override.yaml`（ローカル・自動読込）
  - ローカル開発専用の上書き設定
  - 例: `build:`の指定、`ports:`の公開、開発向けのボリュームマウント等
  - コマンド引数なしで `docker compose up -d` を実行すると自動的に読み込まれる
- `compose.production.yaml`（本番）
  - 本番用の上書き設定
  - 例: `image:` の固定、`restart: unless-stopped`、ラベル、プロダクション向け環境変数等
  - 本番適用時は明示的にファイル指定してマージする
  - 重要: `.prod` は「自動で効く特別な意味」ではなく、命名慣習（自分たちの規約）です

補足（現状との対応）:
- 現在の `docker-compose.yml` → 将来的に `compose.yaml` へ移行（ベース定義へ）
- 現在の `docker-compose.dev.yml` → `compose.override.yaml` へ移行（ローカル自動読込）
- CI/本番用の上書き → `compose.production.yaml`

段階的な移行を推奨（まずはドキュメント合意 → 実ファイル名の置換）。

### 2. 実行コマンド標準

- ローカル（開発）:
  - 自動マージ: `compose.yaml + compose.override.yaml`
  - 実行:
    ```bash
    docker compose up -d
    docker compose down
    ```
- 本番（VPS/CI）:
  - 明示マージ: `compose.yaml + compose.production.yaml`
  - 実行:
    ```bash
    docker compose -f compose.yaml -f compose.production.yaml pull
    docker compose -f compose.yaml -f compose.production.yaml up -d
    ```

推奨: `docker-compose` ではなく `docker compose` を使用（Compose V2）。

### 3. .env の扱い

- ルートの `.env` は Compose の変数展開に利用
- 機密値はGit管理しない（`.env`はリポジトリに含めない）
- 例:
  ```env
  DOCKER_USERNAME=your-dockerhub-username
  IMAGE_TAG=latest
  ```
  ```yaml
  # compose.production.yaml 例
  services:
    knowledge-garden:
      image: ${DOCKER_USERNAME}/knowledge-garden:${IMAGE_TAG}
  ```

### 4. プロファイルの活用（任意）

ローカル専用サービスやオプション機能には `profiles` を使用可能。
```yaml
services:
  knowledge-garden:
    profiles: ["default"]
  mailhog:
    image: mailhog/mailhog
    profiles: ["dev"]
```
実行例:
```bash
docker compose --profile dev up -d
```

### 5. Traefik/ネットワーク

- 共有リバースプロキシ（Traefik）を使う場合は外部ネットワークを利用:
  ```yaml
  networks:
    traefik:
      external: true
  ```
- ラベルは本番側（`compose.production.yaml`）で付与し、ローカルでは極力省略

### 6. 開発と本番の差分ポリシー

- ベース（`compose.yaml`）は「どの環境でも共通で安全」な最小限のみ
- 差分は `override`（ローカル） と `prod`（本番）へ分離
- ローカルでのみ必要なポート公開・ボリューム・ホットリロード等は `compose.override.yaml` に限定
- 本番でのみ必要な `image` 固定・`restart`・ラベル等は `compose.production.yaml` に限定

### 7. CI/CD での推奨

GitHub Actions 等では、以下の実行を標準化:
```bash
docker compose -f compose.yaml -f compose.production.yaml pull
docker compose -f compose.yaml -f compose.production.yaml up -d
docker system prune -f
```

### 8. 命名・表記の細則

- ファイル名は `compose.yaml / compose.override.yaml / compose.production.yaml`
- YAMLはインデント2スペース、サービス名はケバブケース（例: `knowledge-garden`）
- `restart: unless-stopped` を本番で明示
- 可能な限り拡張フィールド（`x-`）で共通断片を再利用して重複回避（任意）

### 9. ロールバック/運用

- 状態確認: `docker compose ps` / `docker compose logs -f`
- 切り戻し手順: 直前タグの `IMAGE_TAG` に戻して再 `up -d`
- 定期クリーンアップ: `docker system prune -f`（本番は慎重に）

---

この標準は段階的に適用します。現状のファイル名からの移行は、運用に影響が出ないように合意後に進めます。 

