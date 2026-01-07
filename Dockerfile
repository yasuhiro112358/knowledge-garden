# Multi-stage build for Knowledge Garden
FROM node:24-alpine AS builder

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

# Nginx設定
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

