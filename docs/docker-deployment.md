# Docker + Traefik デプロイメントガイド

## 1. 概要

Knowledge GardenをDockerコンテナとして運用し、Traefikでルーティングする構成です。

### 1.1 前提条件

- VPSでTraefikが既に動作している
- infra-opsリポジトリでインフラを管理している
- 全てのサービスをDockerコンテナで運用
- Dockerネットワーク（`traefik`）がTraefikによって作成済み

### 1.2 構成

```
Traefik (既存)
    ↓
Knowledge Garden Container (Nginx)
    ↓
静的ファイル (dist/)
```

## 2. 実装方針

### 2.1 Dockerfile

静的サイトをNginxで配信するDockerイメージを作成します。

### 2.2 docker-compose.yml

Traefikラベルを設定して、ルーティングを自動化します。

### 2.3 GitHub Actions

ビルドとDockerイメージの作成を自動化します。

### 2.4 infra-opsリポジトリへの統合

infra-opsリポジトリにサービスを追加する方法を提案します。

## 3. 実装詳細

### 3.1 Dockerfile

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# 依存関係のインストール
COPY package*.json ./
RUN npm ci

# ソースコードのコピー
COPY . .

# ビルド
RUN npm run build

# Nginxで配信
FROM nginx:alpine

# ビルド成果物をコピー
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx設定（SPA対応）
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 3.2 nginx.conf

```nginx
# nginx.conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # 静的ファイルの配信
    location / {
        try_files $uri $uri/ /index.html;
    }

    # キャッシュ設定
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # セキュリティヘッダー
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### 3.3 docker-compose.yml（Knowledge Gardenリポジトリ用）

```yaml
# docker-compose.yml
version: '3.8'

services:
  knowledge-garden:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: knowledge-garden
    restart: unless-stopped
    networks:
      - traefik  # Traefikと同じネットワーク
    labels:
      # Traefik有効化
      - traefik.enable=true
      
      # ルーティング設定（サブドメイン方式）
      - traefik.http.routers.knowledge-garden.rule=Host(`knowledge.newtralize.com`)
      - traefik.http.routers.knowledge-garden.entrypoints=websecure
      - traefik.http.routers.knowledge-garden.tls=true
      - traefik.http.routers.knowledge-garden.tls.certresolver=le
      
      # サービス設定
      - traefik.http.services.knowledge-garden.loadbalancer.server.port=80
      
      # ミドルウェア（圧縮、セキュリティヘッダー）
      - traefik.http.routers.knowledge-garden.middlewares=knowledge-garden-compress,knowledge-garden-sec-headers
      - traefik.http.middlewares.knowledge-garden-compress.compress=true
      - traefik.http.middlewares.knowledge-garden-sec-headers.headers.stsSeconds=31536000
      - traefik.http.middlewares.knowledge-garden-sec-headers.headers.stsIncludeSubdomains=true
      - traefik.http.middlewares.knowledge-garden-sec-headers.headers.forceSTSHeader=true
      - traefik.http.middlewares.knowledge-garden-sec-headers.headers.frameDeny=true

networks:
  traefik:
    external: true  # Traefikによって作成済みのネットワークを使用
```

### 3.4 サブディレクトリ方式の場合

`newtralize.com/knowledge` で公開する場合：

```yaml
labels:
  - traefik.enable=true
  - traefik.http.routers.knowledge-garden.rule=Host(`newtralize.com`) && PathPrefix(`/knowledge`)
  - traefik.http.routers.knowledge-garden.entrypoints=websecure
  - traefik.http.routers.knowledge-garden.tls=true
  - traefik.http.routers.knowledge-garden.tls.certresolver=le
  - traefik.http.services.knowledge-garden.loadbalancer.server.port=80
  - traefik.http.routers.knowledge-garden.middlewares=knowledge-garden-stripprefix
  - traefik.http.middlewares.knowledge-garden-stripprefix.stripprefix.prefixes=/knowledge
```

**注意**: サブディレクトリ方式の場合、Astroの`base`設定も`/knowledge`に設定する必要があります。

## 4. GitHub Actionsでの自動ビルド

### 4.1 Dockerイメージのビルドとプッシュ

```yaml
# .github/workflows/docker-build.yml
name: Build and Push Docker Image

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Docker Hub (or Container Registry)
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            your-dockerhub-username/knowledge-garden:latest
            your-dockerhub-username/knowledge-garden:${{ github.sha }}
          cache-from: type=registry,ref=your-dockerhub-username/knowledge-garden:buildcache
          cache-to: type=registry,ref=your-dockerhub-username/knowledge-garden:buildcache,mode=max
```

### 4.2 VPSへのデプロイ

infra-opsリポジトリで管理する場合、以下のいずれかの方法を選択：

#### オプション1: infra-opsリポジトリでdocker-compose.ymlを管理

infra-opsリポジトリに以下を追加：

```yaml
# infra-ops/docker-compose.yml または infra-ops/services/knowledge-garden/docker-compose.yml
services:
  knowledge-garden:
    image: your-dockerhub-username/knowledge-garden:latest
    container_name: knowledge-garden
    restart: unless-stopped
    networks:
      - traefik
    labels:
      # Traefikラベル（上記参照）
```

#### オプション2: GitHub ActionsでVPSに直接デプロイ

```yaml
# .github/workflows/deploy.yml
- name: Deploy to VPS
  uses: appleboy/ssh-action@master
  with:
    host: ${{ secrets.VPS_HOST }}
    username: ${{ secrets.VPS_USER }}
    key: ${{ secrets.VPS_SSH_KEY }}
    script: |
      cd /path/to/infra-ops
      docker-compose pull knowledge-garden
      docker-compose up -d knowledge-garden
```

## 5. infra-opsリポジトリへの統合方法

### 5.1 推奨構成

```
infra-ops/
├── docker-compose.yml          # 全体のComposeファイル
├── services/
│   ├── traefik/
│   │   └── docker-compose.yml
│   ├── knowledge-garden/
│   │   └── docker-compose.yml
│   └── other-services/
│       └── docker-compose.yml
└── .env                        # 環境変数
```

### 5.2 統合手順

1. infra-opsリポジトリに`services/knowledge-garden/docker-compose.yml`を追加
2. メインの`docker-compose.yml`でincludeする（Compose v2.20+）
3. または、個別に`docker-compose -f`で起動

### 5.3 メインのdocker-compose.yml例

```yaml
# infra-ops/docker-compose.yml
version: '3.8'

services:
  # Traefik（既存）
  traefik:
    # ... 既存の設定

  # Knowledge Garden
  knowledge-garden:
    extends:
      file: ./services/knowledge-garden/docker-compose.yml
      service: knowledge-garden

networks:
  traefik:
    external: true
```

## 6. ローカル開発

### 6.1 開発環境での起動

```bash
# Knowledge Gardenリポジトリで
docker-compose up -d

# Traefikがローカルで動いている場合
# knowledge.localhost でアクセス可能
```

### 6.2 開発用docker-compose.override.yml

```yaml
# docker-compose.override.yml（開発用）
version: '3.8'

services:
  knowledge-garden:
    build:
      context: .
      dockerfile: Dockerfile
    volumes:
      - ./dist:/usr/share/nginx/html:ro  # ホットリロード用
    labels:
      - traefik.http.routers.knowledge-garden.rule=Host(`knowledge.localhost`)
      - traefik.http.routers.knowledge-garden.entrypoints=web
```

## 7. ベースパスの設定

### 7.1 サブドメイン方式（推奨）

```javascript
// astro.config.mjs
export default defineConfig({
  site: 'https://knowledge.newtralize.com',
  base: '/',  // ルートパス
  // ...
});
```

### 7.2 サブディレクトリ方式

```javascript
// astro.config.mjs
export default defineConfig({
  site: 'https://newtralize.com',
  base: '/knowledge',  // サブディレクトリ
  // ...
});
```

## 8. デプロイフロー

### 8.1 完全自動化フロー

```
1. Markdownファイルを編集
2. GitHubにプッシュ
3. GitHub Actionsが自動実行
   - Astroでビルド
   - Dockerイメージを作成
   - Docker Hubにプッシュ
4. infra-opsリポジトリで更新
   - docker-compose.ymlを更新（イメージタグを更新）
   - VPSでdocker-compose pull && docker-compose up -d
```

### 8.2 手動デプロイフロー

```
1. Markdownファイルを編集
2. GitHubにプッシュ
3. ローカルまたはGitHub Actionsでビルド
4. Dockerイメージを作成
5. Docker Hubにプッシュ
6. VPSでdocker-compose pull && docker-compose up -d
```

## 9. トラブルシューティング

### 9.1 コンテナが起動しない

```bash
# ログを確認
docker logs knowledge-garden

# コンテナの状態を確認
docker ps -a | grep knowledge-garden
```

### 9.2 Traefikでルーティングされない

```bash
# Traefikのダッシュボードで確認
# http://traefik.your-domain.com

# ラベルが正しく設定されているか確認
docker inspect knowledge-garden | grep -A 20 Labels
```

### 9.3 画像が表示されない

- Astroの`base`設定を確認
- 画像パスの変換ロジックを確認
- Nginxの設定を確認

## 10. セキュリティ考慮事項

### 10.1 イメージのセキュリティ

- 定期的にベースイメージを更新
- 脆弱性スキャンを実行
- 最小限の権限で実行

### 10.2 ネットワーク分離

- `traefik`ネットワークは公開サービス用
- 内部サービスは別ネットワークを使用
- 必要に応じてファイアウォール設定

## 11. 次のステップ

1. Dockerfileとnginx.confを作成
2. docker-compose.ymlを作成
3. GitHub Actionsを設定
4. infra-opsリポジトリに統合
5. テストデプロイ
6. 本番デプロイ

