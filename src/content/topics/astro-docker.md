# Astro Docker

Astroプロジェクトをコンテナ化するためのDocker設定について説明します。

## 静的サイトのDocker化

静的ビルド（`output: 'static'`）の場合、ビルド結果を軽量なWebサーバーで配信します。

### Nginxを使用

```dockerfile
# Dockerfile
FROM node:20-alpine AS build
WORKDIR /app

# 依存関係のインストール
COPY package*.json ./
RUN npm ci

# ビルド
COPY . .
RUN npm run build

# 本番環境
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

`nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # SPA用のフォールバック（必要に応じて）
    location / {
        try_files $uri $uri/ /index.html;
    }

    # キャッシュ設定
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # gzip圧縮
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
```

### Serveを使用（軽量）

```dockerfile
# Dockerfile
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

## SSRサイトのDocker化

SSR（`output: 'server'`）の場合、Node.jsランタイムが必要です。

### Node.jsアダプター使用

```dockerfile
# Dockerfile
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app

# 本番用依存関係のみ
COPY package*.json ./
RUN npm ci --omit=dev

# ビルド成果物をコピー
COPY --from=build /app/dist ./dist

ENV HOST=0.0.0.0
ENV PORT=4321

EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]
```

### astro.config.mjsの設定

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
});
```

## Docker Compose

### 静的サイト

```yaml
# compose.yaml
services:
  web:
    build: .
    ports:
      - "8080:80"
    restart: unless-stopped
```

### SSRサイト

```yaml
# compose.yaml
services:
  web:
    build: .
    ports:
      - "4321:4321"
    environment:
      - NODE_ENV=production
      - HOST=0.0.0.0
      - PORT=4321
    restart: unless-stopped
```

### 開発環境

```yaml
# compose.override.yaml
services:
  web:
    build:
      context: .
      target: build  # ビルドステージで止める
    volumes:
      - .:/app
      - /app/node_modules  # node_modulesは除外
    ports:
      - "4321:4321"
    command: npm run dev -- --host 0.0.0.0
```

## .dockerignore

```dockerignore
node_modules
dist
.git
.gitignore
.env
.env.*
*.md
.vscode
.idea
```

## マルチステージビルドの利点

上記のDockerfileはマルチステージビルドを使用しています：

1. **ビルドステージ**（`build`）: 依存関係インストール・ビルド
2. **本番ステージ**: 最小限のランタイムのみ

**メリット**:
- イメージサイズの削減
- 開発用ツールが本番イメージに含まれない
- セキュリティの向上

## 環境変数

### ビルド時の環境変数

```dockerfile
ARG PUBLIC_API_URL
ENV PUBLIC_API_URL=$PUBLIC_API_URL
RUN npm run build
```

```bash
docker build --build-arg PUBLIC_API_URL=https://api.example.com -t myapp .
```

### 実行時の環境変数

```yaml
# compose.yaml
services:
  web:
    environment:
      - SECRET_API_KEY=${SECRET_API_KEY}
```

## ヘルスチェック

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4321/ || exit 1
```

## Traefik連携

リバースプロキシとしてTraefikを使用する場合：

```yaml
# compose.yaml
services:
  web:
    build: .
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.astro.rule=Host(`example.com`)"
      - "traefik.http.services.astro.loadbalancer.server.port=4321"
    networks:
      - traefik

networks:
  traefik:
    external: true
```

詳細は[Traefik](traefik.md)を参照してください。

## パフォーマンス最適化

### レイヤーキャッシュの活用

```dockerfile
# 依存関係を先にコピー（変更が少ない）
COPY package*.json ./
RUN npm ci

# ソースコードを後でコピー（変更が多い）
COPY . .
RUN npm run build
```

### Alpineベースイメージ

Node.jsのAlpineイメージを使用してイメージサイズを削減：

```dockerfile
FROM node:20-alpine
```

## 参考

- 公式ドキュメント「Deploy your Astro Site」: https://docs.astro.build/en/guides/deploy/
- Astro Docker Examples: https://docs.astro.build/en/recipes/docker/
- Node.js Adapter: https://docs.astro.build/en/guides/integrations-guide/node/
