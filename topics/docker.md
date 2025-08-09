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

## よく使うコマンド

```bash
# コンテナ一覧
docker ps

# イメージ一覧
docker images

# コンテナ起動
docker run

# コンテナ停止
docker stop

# ボリューム関連コマンド
docker volume create <volume_name>    # ボリューム作成
docker volume ls                      # ボリューム一覧
docker volume rm <volume_name>        # ボリューム削除
docker volume prune                   # 未使用ボリューム削除
```

## Dockerfile

## Docker Compose

## トラブルシューティング

## 参考リンク
