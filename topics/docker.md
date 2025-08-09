# Docker

## 概要
Dockerに関する知識とメモ

## 基本概念

### コンテナとは

### イメージとは

### ボリューム（Volumes）とは
- Dockerコンテナのデータを永続化するための仕組み
- コンテナが削除されてもデータが保持される
- ホストとコンテナ間でファイルを共有できる

**重要な概念：**
- **コンテナ自体はデータを永続化できない** - コンテナ削除でデータも消失
- **ボリュームでデータの永続化を実現** - コンテナとは独立してデータを保存
- **本番環境でのデータ保護** - サーバーデプロイ時もボリューム設定でデータを保持

#### ボリュームの種類
1. **名前付きボリューム（Named Volumes）**
   - Dockerが管理する永続化ストレージ
   - 複数のコンテナ間でデータを共有可能

2. **バインドマウント（Bind Mounts）**
   - ホストの特定のディレクトリをコンテナにマウント
   - ホストのファイルシステムに直接アクセス

3. **tmpfs マウント**
   - メモリ上に一時的なファイルシステムを作成
   - コンテナ停止時にデータは消失

#### ボリュームの基本的な使い方
```bash
# 名前付きボリュームの作成
docker volume create my-volume

# ボリューム一覧の確認
docker volume ls

# ボリュームの詳細情報
docker volume inspect my-volume

# ボリュームを使ってコンテナを起動
docker run -v my-volume:/app/data nginx

# バインドマウントの例
docker run -v /host/path:/container/path nginx

# 読み取り専用でマウント
docker run -v /host/path:/container/path:ro nginx
```

#### ボリュームの実際の保存場所
**名前付きボリュームの保存場所：**
- **Linux**: `/var/lib/docker/volumes/<volume_name>/_data`
- **macOS (Docker Desktop)**: Docker VM内の `/var/lib/docker/volumes/<volume_name>/_data`
- **Windows (Docker Desktop)**: Docker VM内の `/var/lib/docker/volumes/<volume_name>/_data`

**Docker VMとは？**
- macOSやWindowsでは、DockerはLinuxカーネルが必要なため、仮想マシン（VM）上で動作する
- Docker Desktopが自動的にLinux VMを作成・管理している
- このVMは通常のFinderやエクスプローラーからは見えない隠れた仮想環境

**ローカルファイルからの確認について：**
- **Linux**: ホストマシンのファイルシステムに直接保存されるため、通常のファイルマネージャーでアクセス可能
- **macOS/Windows**: Docker VM内に保存されるため、通常のFinderやエクスプローラーからは直接アクセス不可
- ただし、Docker Desktopの設定でファイル共有を有効にしている場合、一部アクセス可能な場合もある

```bash
# ボリュームの詳細情報で保存場所を確認
docker volume inspect my-volume
# Mountpoint フィールドに実際のパスが表示される

# macOS/WindowsでDocker VM内にアクセスする場合
docker run --rm -it --privileged --pid=host alpine:latest nsenter -t 1 -m -u -n -i sh
# この後、/var/lib/docker/volumes/ を確認可能

# よりシンプルな方法：一時コンテナでボリュームをマウントしてアクセス
docker run --rm -it -v my-volume:/data alpine:latest sh
# /data ディレクトリ内でボリュームのデータを確認・編集可能
```

**注意点：**
- macOS/WindowsのDocker Desktopでは、ボリュームはDocker VM内に保存される
- ホストから直接アクセスするのは推奨されない
- ボリューム内のデータにアクセスしたい場合は、コンテナ経由でアクセスすることを推奨

#### 本番環境でのボリューム活用
**データ永続化の重要性：**
```bash
# 開発環境
docker run -v $(pwd)/data:/app/data myapp

# 本番環境（Docker Compose例）
version: '3.8'
services:
  web:
    image: myapp
    volumes:
      - app-data:/app/data
      - /opt/config:/app/config  # ホストの設定ファイル
  
  db:
    image: postgres
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  app-data:     # 名前付きボリューム（Dockerが管理）
  postgres-data: # DBデータの永続化
```

**クラウド環境での考慮点：**
- AWS: EBS Volume, EFS
- GCP: Persistent Disk
- Azure: Azure Disk
- Kubernetes: PersistentVolume (PV) / PersistentVolumeClaim (PVC)

## よく使うコマンド

### 基本操作
```bash
# コンテナ一覧
docker ps                             # 実行中のコンテナ
docker ps -a                          # すべてのコンテナ

# イメージ一覧
docker images

# コンテナ起動
docker run <image_name>

# コンテナ停止
docker stop <container_name_or_id>

# コンテナ削除
docker rm <container_name_or_id>
```

### 実行中のコンテナに入る
```bash
# 基本的な方法（bashで入る）
docker exec -it <container_name_or_id> /bin/bash

# shで入る（bashが使えない場合）
docker exec -it <container_name_or_id> /bin/sh

# 特定のユーザーで入る
docker exec -it --user root <container_name_or_id> /bin/bash

# 作業ディレクトリを指定して入る
docker exec -it --workdir /app <container_name_or_id> /bin/bash

# 一時的にコマンドを実行（コンテナに入らない）
docker exec <container_name_or_id> ls -la
docker exec <container_name_or_id> cat /etc/os-release
```

### ボリューム関連コマンド
```bash
docker volume create <volume_name>    # ボリューム作成
docker volume ls                      # ボリューム一覧
docker volume rm <volume_name>        # ボリューム削除
docker volume prune                   # 未使用ボリューム削除
```

## Dockerfile

## Docker Compose

### 本番環境での重要な設定

#### 命名規則
**多くのオープンソースプロジェクトではケバブケース（kebab-case）が使用される**

```yaml
# 推奨：ケバブケース（kebab-case）
services:
  web-app:        # ハイフンで区切る
    image: nginx
  api-server:     # 複数単語もハイフンで繋ぐ
    image: node
  worker-queue:
    image: redis

volumes:
  app-data:       # ボリュームもケバブケース
  log-files:
  backup-storage:

networks:
  frontend-net:   # ネットワークもケバブケース
  backend-net:
```

**理由：**
- **可読性**: 単語の区切りが明確
- **一貫性**: Kubernetesなど他のツールとの統一
- **標準的**: 多くのOSSプロジェクトで採用
- **URL安全**: ハイフンはURL内で安全に使用可能

#### restart ポリシー
**`restart: unless-stopped`** は本番環境では必須の設定

**restart ポリシーの種類：**
- **no**: 再起動しない（デフォルト）
- **always**: 常に再起動（Docker起動時も含む）
- **on-failure**: 異常終了時のみ再起動
- **unless-stopped**: 手動で停止するまで再起動（**推奨**）

```yaml
# 本番環境での推奨設定例
version: '3.8'
services:
  web:
    image: nginx:latest
    restart: unless-stopped  # 重要：自動復旧設定
    ports:
      - "80:80"
    volumes:
      - web-data:/usr/share/nginx/html
      - /opt/config/nginx:/etc/nginx/conf.d:ro
    depends_on:
      - app
  
  app:
    image: myapp:latest
    restart: unless-stopped  # 重要：自動復旧設定
    environment:
      - NODE_ENV=production
    volumes:
      - app-data:/app/data
    depends_on:
      - db
  
  db:
    image: postgres:13
    restart: unless-stopped  # 重要：自動復旧設定
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    volumes:
      - postgres-data:/var/lib/postgresql/data
    secrets:
      - db_password

volumes:
  web-data:
  app-data:
  postgres-data:

secrets:
  db_password:
    external: true
```

#### なぜ unless-stopped が推奨なのか？

**メリット：**
- **サーバー再起動時**: 自動でコンテナが起動
- **コンテナクラッシュ時**: 自動で復旧
- **手動制御可能**: `docker stop` で明示的に停止可能
- **意図しない起動回避**: 手動停止したコンテナは起動時に自動起動しない

**always との違い：**
```bash
# unless-stopped の場合
docker stop my-container  # 手動停止
# → サーバー再起動時も起動しない

# always の場合  
docker stop my-container  # 手動停止
# → サーバー再起動時に自動起動してしまう
```

#### 本番環境でのその他重要設定

```yaml
services:
  app:
    image: myapp:latest
    restart: unless-stopped
    
    # リソース制限（重要）
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          memory: 256M
    
    # ヘルスチェック（重要）
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
    
    # ログ設定
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    
    # セキュリティ設定
    security_opt:
      - no-new-privileges:true
    read_only: true
    tmpfs:
      - /tmp
```

#### ヘルスチェックの詳細設定

**ヘルスチェックとは：**
- コンテナの健全性を定期的に監視する仕組み
- サービスが正常に動作しているかを自動確認
- 異常時の自動復旧やロードバランサーからの除外に活用

**設定パラメータ：**
- `test`: 実行するヘルスチェックコマンド
- `interval`: チェック間隔（デフォルト: 30s）
- `timeout`: タイムアウト時間（デフォルト: 30s）
- `retries`: 失敗の許容回数（デフォルト: 3）
- `start_period`: 初回チェックまでの猶予時間（デフォルト: 0s）

**サービス別ヘルスチェック例：**

```yaml
services:
  # Webアプリケーション
  web:
    image: nginx:latest
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s

  # MySQL データベース
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: secretpassword
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-uroot", "-p$MYSQL_ROOT_PASSWORD"]
      interval: 10s
      timeout: 5s
      retries: 10
      start_period: 60s

  # PostgreSQL データベース
  postgres:
    image: postgres:13
    environment:
      POSTGRES_PASSWORD: secretpassword
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis
  redis:
    image: redis:6-alpine
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 3s
      retries: 3

  # Node.js API
  api:
    image: node:16-alpine
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

**ヘルスチェック状態の確認：**
```bash
# コンテナの健康状態確認
docker ps

# 詳細なヘルスチェック履歴
docker inspect <container_name> | grep -A 20 "Health"

# Docker Composeでの確認
docker-compose ps
```

**ヘルスチェックのベストプラクティス：**
- **軽量なチェック**: 過度に重い処理は避ける
- **適切な間隔**: あまり頻繁すぎるとリソース消費が大きい
- **依存関係を考慮**: DBが起動してからAPIをチェック
- **適切なタイムアウト**: ネットワーク遅延を考慮した設定

**実際の運用例：**
```bash
# 本番環境での起動
docker-compose -f docker-compose.prod.yml up -d

# サービス状態確認
docker-compose ps

# ログ確認
docker-compose logs -f --tail=100

# 特定サービスの再起動
docker-compose restart app

# 設定変更後の再デプロイ
docker-compose pull
docker-compose up -d
```

### Docker Composeの停止・削除

```bash
# 基本的な停止（コンテナを停止、削除しない）
docker-compose stop

# 停止と削除（コンテナとネットワークを削除）
docker-compose down

# 特定のサービスのみ停止
docker-compose stop web

# ボリュームも含めて完全削除
docker-compose down -v

# イメージも削除（開発環境のクリーンアップ）
docker-compose down --rmi all

# 孤立したコンテナも削除
docker-compose down --remove-orphans

# 強制停止（緊急時）
docker-compose kill

# プロダクションファイル指定での停止
docker-compose -f docker-compose.prod.yml down
```

**stopとdownの違い：**
- `stop`: コンテナを停止するが、コンテナとネットワークは残る
- `down`: コンテナを停止し、コンテナとネットワークを削除する

**本番環境での推奨手順：**
```bash
# 1. まず状態確認
docker-compose ps

# 2. ログを確認（必要に応じて）
docker-compose logs

# 3. グレースフルシャットダウン
docker-compose down

# 4. 完全停止の確認
docker ps -a | grep <project_name>
```

## Dangling（ダングリング）リソース

### Danglingとは
「ぶら下がっている」という意味で、**参照されなくなった孤立したリソース**を指す。ディスク容量を無駄に消費するため、定期的にクリーンアップが必要。

#### Dangling Images（ダングリングイメージ）
- 同じタグで新しいイメージをビルドした時、古いイメージがタグを失う
- `docker build`で同じタグを何度も使用した場合に発生

```bash
# ダングリングイメージの確認
docker images -f dangling=true

# ダングリングイメージの削除
docker image prune
docker image prune -f  # 確認なしで削除
```

#### Dangling Volumes（ダングリングボリューム）
- コンテナ削除後も残ったボリューム
- 明示的に削除しない限り残り続ける

```bash
# ダングリングボリュームの確認
docker volume ls -f dangling=true

# ダングリングボリュームの削除
docker volume prune
docker volume prune -f  # 確認なしで削除
```

#### 全体的なクリーンアップ
```bash
# すべての未使用リソースを確認
docker system df

# すべての未使用リソースを削除
docker system prune

# より積極的なクリーンアップ（未使用イメージも含む）
docker system prune -a

# 未使用ネットワークの削除
docker network prune
```

## トラブルシューティング

## 参考リンク
