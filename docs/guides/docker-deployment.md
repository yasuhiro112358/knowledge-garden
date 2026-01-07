# Docker + Traefik 運用ガイド

## 概要

Knowledge GardenをDockerコンテナとして運用し、Traefikでルーティングする構成です。

関連: [Docker Compose 開発標準](./docker-compose-standards.md)

## 前提条件

- VPSでTraefikが既に動作している
- Dockerネットワーク（`traefik`）がTraefikによって作成済み
- Docker Hubアカウント（または他のコンテナレジストリ）
- VPSにこのリポジトリをクローン済み（初回のみ手動で実行）

## クイックスタート

### 1. ローカルでビルド・テスト（Traefikなし）

```bash
# イメージをビルド
docker build -t knowledge-garden:local .

# ローカルで起動（Traefikなし）
docker run -p 8080:80 knowledge-garden:local

# http://localhost:8080 でアクセス可能
```

**注意**: ポート8080でアクセスする場合、リンクをクリックするとポート番号が消える問題が発生する可能性があります。これは、Astroが絶対パス（`/topics/...`）でリンクを生成するためです。

**解決方法**:
1. **推奨**: 開発環境では`npm run dev`を使用する（Astroの開発サーバーは自動的にポートを保持します）
2. **代替案**: ポート80で起動する（管理者権限が必要）
   ```bash
   docker run -p 80:80 knowledge-garden:local
   # http://localhost でアクセス可能（ポート番号不要）
   ```
3. **一時的な解決策**: ブラウザのアドレスバーでポート番号を手動で追加する

### 2. ローカルでdocker composeで起動（開発環境用）

**前提条件**: ローカルにTraefikが動作している必要があります（VPS環境を想定）

```bash
# 開発環境用（compose.override.yaml が自動読込）
# ローカルでビルドして起動
docker compose up -d

# ビルドを再実行する場合
docker compose up -d --build

# ログを確認
docker compose logs -f

# 停止
docker compose down
```

**注意**: `docker-compose.dev.yml`はローカルでビルドするため、Traefikネットワークに接続する必要があります。ローカルにTraefikがない場合は、上記の「1. ローカルでビルド・テスト」の方法を使用してください。

### 3. 本番環境用 docker compose で起動

```bash
# サブドメイン方式（knowledge.newtralize.com）
# compose.yaml + compose.production.yaml をマージして起動
docker compose -f compose.yaml -f compose.production.yaml pull
docker compose -f compose.yaml -f compose.production.yaml up -d
```

### 4. ログの確認

```bash
# コンテナのログを確認
docker logs knowledge-garden
docker logs -f knowledge-garden  # リアルタイムでログを確認

# docker compose を使用している場合
docker compose logs -f
docker compose logs -f  # 開発環境用
```

### 5. コンテナの停止・削除

```bash
# docker compose を使用している場合
docker compose down
docker compose down  # 開発環境用

# 直接dockerコマンドを使用している場合
docker stop knowledge-garden
docker rm knowledge-garden
```

## デプロイ方法

### 方法1: GitHub Actionsで自動ビルド・デプロイ

1. Docker Hubの認証情報をGitHub Secretsに設定
   - `DOCKER_USERNAME`: Docker Hubのユーザー名
   - `DOCKER_PASSWORD`: Docker Hubのパスワード

2. VPSの認証情報をGitHub Secretsに設定（自動デプロイする場合）
   - `VPS_HOST`: VPSのIPアドレスまたはホスト名
   - `VPS_USER`: SSHユーザー名
   - `VPS_SSH_KEY`: SSH秘密鍵
   - `KNOWLEDGE_GARDEN_PATH`: このリポジトリをクローンしたVPS上のパス（例: `/opt/knowledge-garden`）

3. VPSにこのリポジトリをクローン（初回のみ手動で実行）
   ```bash
   ssh user@vps
   cd /opt
   git clone https://github.com/your-username/knowledge-garden.git
   cd knowledge-garden
   ```

4. `main`ブランチにプッシュすると自動的に：
   - Dockerイメージがビルドされる
   - Docker Hubにプッシュされる
   - VPSで自動デプロイされる（設定した場合）

詳細なセットアップ手順については、[GitHub Actions自動デプロイセットアップ](./github-actions-setup-guide.md)を参照してください。

### 方法2: 手動デプロイ

```bash
# 1. ローカルでビルド
docker build -t your-dockerhub-username/knowledge-garden:latest .

# 2. Docker Hubにプッシュ
docker push your-dockerhub-username/knowledge-garden:latest

# 3. VPSで更新
ssh user@vps
cd /opt/knowledge-garden  # このリポジトリをクローンしたパス
git pull origin main
DOCKER_USERNAME=your-dockerhub-username docker-compose pull
DOCKER_USERNAME=your-dockerhub-username docker-compose up -d
```

## このリポジトリだけで完結するデプロイ

このリポジトリには`docker-compose.yml`が含まれており、infra-opsリポジトリに依存せずにデプロイできます。

### compose.yaml の構成

- **本番環境用** (`compose.yaml` + `compose.production.yaml`): Docker Hubからイメージをpullして使用
  - 使用例: VPSでの本番環境、GitHub Actionsからの自動デプロイ
- **開発環境用** (`compose.override.yaml`): ローカルでビルドして使用
  - 使用例: ローカルでの動作確認、Traefik環境でのテスト

### 初回セットアップ

```bash
# VPSにSSH接続
ssh user@vps

# リポジトリをクローン
cd /opt
git clone https://github.com/your-username/knowledge-garden.git
cd knowledge-garden

# 環境変数を設定（.envファイルを作成）
echo "DOCKER_USERNAME=your-dockerhub-username" > .env

# コンテナを起動
docker-compose up -d
```

### docker-compose.ymlの構成例

```yaml
# compose.yaml（ベース）
version: '3.8'

services:
  knowledge-garden:
    container_name: knowledge-garden
    restart: unless-stopped

networks:
  traefik:
    external: true
```

```yaml
# compose.production.yaml（本番用の上書き）
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
      # その他のラベルは compose.production.yaml を参照

**注意**: このリポジトリは独立して動作します。infra-opsリポジトリへの統合は不要です。

## トラブルシューティング

### コンテナが起動しない

```bash
# ログを確認
docker logs knowledge-garden

# コンテナの状態を確認
docker ps -a | grep knowledge-garden

# イメージを再ビルド
docker-compose build --no-cache
docker-compose up -d
```

### Traefikでルーティングされない

1. Traefikのダッシュボードで確認
2. ラベルが正しく設定されているか確認：
   ```bash
   docker inspect knowledge-garden | grep -A 20 Labels
   ```
3. ネットワークが正しく接続されているか確認：
   ```bash
   docker network inspect traefik
   ```

### 画像が表示されない

1. Astroの`base`設定を確認（`astro.config.mjs`）
2. 画像パスの変換ロジックを確認（`src/utils/markdownRenderer.ts`）
3. ビルド時に画像がコピーされているか確認：
   ```bash
   docker run --rm knowledge-garden:local ls -la /usr/share/nginx/html/img
   ```

## 環境変数

現在、環境変数は使用していませんが、将来的に追加可能です：

```yaml
# docker-compose.yml
services:
  knowledge-garden:
    environment:
      - NODE_ENV=production
    # ...
```

## 更新手順

1. Markdownファイルを編集
2. GitHubにプッシュ
3. GitHub Actionsが自動的にビルド・デプロイ（設定した場合）
4. または手動でデプロイ

## 参考資料

- [GitHub Actions自動デプロイセットアップ](./github-actions-setup-guide.md) - 自動デプロイのセットアップ手順
- [ローカル開発環境のセットアップ](./local-development.md) - ローカルでの開発方法
- [Traefik ドキュメント](../../topics/traefik.md) - Traefikの使い方

