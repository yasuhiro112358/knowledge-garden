# GitHub Actions 自動デプロイ セットアップ手順書

このドキュメントは、GitHub Container Registry (GHCR) と GitHub Actions を使用した自動デプロイの初回セットアップ手順を説明します。

詳細な仕様や説明については、[GitHub Actions 自動デプロイ設定ガイド](../github-actions-setup.md)を参照してください。

## 前提条件

- GitHubアカウントを持っている
- VPSにSSH接続できる
- VPSにDockerとDocker Composeがインストールされている
- Traefikが既に動作している

## セットアップ手順

### ステップ1: SSH鍵の生成と設定

#### 1.1 ローカルでSSH鍵を生成

```bash
# SSH鍵を生成（まだ持っていない場合）
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions

# パスフレーズを設定（推奨）
# Enter passphrase (empty for no passphrase): [パスフレーズを入力]
```

#### 1.2 公開鍵をVPSにコピー

```bash
# 公開鍵をVPSにコピー
ssh-copy-id -i ~/.ssh/github_actions.pub user@vps-host

# または、手動でコピーする場合
cat ~/.ssh/github_actions.pub | ssh user@vps-host "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

#### 1.3 SSH接続のテスト

```bash
# ローカルからVPSに接続できるか確認
ssh -i ~/.ssh/github_actions user@vps-host

# 接続できれば成功
```

### ステップ2: GitHub Secretsの設定

リポジトリの **Settings** → **Secrets and variables** → **Actions** で以下を設定：

#### VPS接続情報

1. **New repository secret** をクリック
2. Name: `VPS_HOST`、Secret: VPSのIPアドレスまたはホスト名（例: `vps.example.com` または `123.45.67.89`） → **Add secret**
3. **New repository secret** をクリック
4. Name: `VPS_USER`、Secret: SSHユーザー名（例: `ubuntu`、`root`） → **Add secret**
5. **New repository secret** をクリック
6. Name: `VPS_SSH_KEY`、Secret: 下記の秘密鍵の内容 → **Add secret**

```bash
# 秘密鍵の内容をコピー
cat ~/.ssh/github_actions
```

**重要**: 
- 秘密鍵は絶対に公開しない
- GitHub Secretsに設定する際は、改行を含めてそのまま貼り付ける

#### このリポジトリのパス

1. **New repository secret** をクリック
2. Name: `KNOWLEDGE_GARDEN_PATH`、Secret: このリポジトリをクローンする予定のVPS上のパス（例: `/srv/knowledge-garden`） → **Add secret**

### ステップ3: GitHub Personal Access Token (PAT) の作成（VPS用）

VPS側で Private イメージを pull するために必要です。

1. GitHub → **Settings** (個人アカウント設定) → **Developer settings** → **Personal access tokens** → **Tokens (classic)** → **Generate new token (classic)**
2. Note: `vps-ghcr-pull` (任意の名前)
3. Expiration: `No expiration` または適切な期間
4. 権限: **`read:packages`** にチェック
5. **Generate token** をクリック
6. 生成されたトークンをコピー（**この画面を閉じると二度と表示されません**）

### ステップ4: VPS側の初回セットアップ

#### 4.1 VPSにSSH接続

```bash
ssh user@vps-host
```

#### 4.2 GHCR にログイン（Private イメージを pull するため）

**重要**: これは **初回のみ手動で実行** します。GitHub Actions には含まれていません。

```bash
# ステップ3で作成したPATを使用
echo YOUR_GITHUB_PAT | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin

# 成功すると以下のように表示される
# Login Succeeded
```

**補足**: 
- `YOUR_GITHUB_PAT`: ステップ3で生成したトークン
- `YOUR_GITHUB_USERNAME`: あなたのGitHubユーザー名（例: `yasuhiro112358`）
- この認証情報は `~/.docker/config.json` に保存され、以降の `docker compose pull` で自動的に使用されます
- GitHub Actions からの `docker compose pull` でも、この認証情報が使われます

#### 4.3 リポジトリをクローン

```bash
# リポジトリをクローン（例: /srv/knowledge-garden）
cd /srv
git clone https://github.com/your-username/knowledge-garden.git
cd knowledge-garden
```

**注意**: `your-username` は実際のGitHubユーザー名に置き換えてください。

#### 4.4 Traefik ネットワークの確認

```bash
# Traefikネットワークが存在することを確認
docker network ls | grep traefik

# 存在しない場合は作成
docker network create traefik
```

### ステップ5: 初回デプロイ（手動）

```bash
# VPS上で実行
cd /srv/knowledge-garden

# 【推奨】GitHub Actionsで自動ビルド・デプロイ（初回も含む）
# → mainブランチにpushすれば、GitHub Actionsが以下を自動実行:
#    1. イメージをビルド
#    2. GHCRにpush
#    3. VPSにSSH接続
#    4. docker compose pull & up -d

# VPS側での手動確認（任意）:
docker compose -f compose.yaml -f compose.production.yaml pull
docker compose -f compose.yaml -f compose.production.yaml up -d

# ログ確認
docker compose -f compose.yaml -f compose.production.yaml logs -f

# ログを確認
docker compose -f compose.yaml -f compose.production.yaml logs -f
```

## 動作確認

### 1. GitHub Actions の実行

1. `main` ブランチに変更をプッシュ
   ```bash
   git add .
   git commit -m "feat: GHCR運用に移行"
   git push origin main
   ```

2. GitHubリポジトリの **Actions** タブを開く
3. **Build and Deploy to VPS** ワークフローが実行されることを確認
4. ジョブが成功（緑のチェックマーク）することを確認

### 2. GHCR にイメージがプッシュされたか確認

1. GitHubリポジトリの **Packages** セクションを確認
2. `knowledge-garden` パッケージが作成されている
3. イメージタグ（`latest`, `main`, `main-xxx` など）が表示されている

### 3. VPS でコンテナが起動しているか確認

```bash
# VPS上で実行
docker ps | grep knowledge-garden

# ログを確認
docker logs knowledge-garden

# Traefikのルーティングを確認
docker network inspect traefik | grep knowledge-garden
```

### 4. サイトにアクセス

ブラウザで `https://knowledge.newtralize.com` にアクセスして、サイトが表示されることを確認

## トラブルシューティング

### イメージのpullに失敗する

**エラー**: `Error response from daemon: pull access denied for ghcr.io/yasuhiro112358/knowledge-garden`

**原因**: VPS側でGHCRへのログインができていない（Private イメージのため）

**解決方法**:

1. ステップ4.2を実行して、VPSでGHCRにログインする
2. 認証情報が正しいか確認:
   ```bash
   cat ~/.docker/config.json
   # ghcr.io のエントリが存在することを確認
   ```

### GitHub Actions のビルドに失敗する

**エラー**: `Error: buildx failed with: ERROR: failed to solve: ...`

**原因**: Dockerfileのビルドエラー

**解決方法**:

1. ローカルでビルドして確認:
   ```bash
   docker build -t knowledge-garden:test .
   ```
2. エラー内容を確認して修正

### VPS へのSSH接続に失敗する

**エラー**: `Host key verification failed` または `Permission denied`

**原因**: SSH鍵の設定が正しくない

**解決方法**:

1. `VPS_SSH_KEY` が正しく設定されているか確認
2. VPSの `~/.ssh/authorized_keys` に公開鍵が登録されているか確認:
   ```bash
   ssh user@vps-host "cat ~/.ssh/authorized_keys"
   ```

### docker compose: command not found

**エラー**: `docker compose: command not found`

**原因**: Docker Compose V2（`docker compose`）が使えない環境

**解決方法**:

1. Docker Compose V2をインストール（Docker Engine/CLI更新）
   ```bash
   docker compose version
   ```
2. VPSのDockerを最新版に更新

### Traefikでルーティングされない

**原因**: ラベルの設定ミスまたはTraefikネットワークの接続ミス

**解決方法**:

1. コンテナのラベルを確認:
   ```bash
   docker inspect knowledge-garden | grep -A 20 Labels
   ```
2. Traefikネットワークへの接続を確認:
   ```bash
   docker network inspect traefik | grep knowledge-garden
   ```
3. Traefikのログを確認:
   ```bash
   docker logs traefik
   ```

## 参考

- [GitHub Container Registry (GHCR) - docs](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [GitHub Actions ドキュメント](https://docs.github.com/ja/actions)
- [appleboy/ssh-action](https://github.com/appleboy/ssh-action)
- [docker/build-push-action](https://github.com/docker/build-push-action)
- [Docker + Traefik デプロイメントガイド](./docker-deployment.md)
- [ADR-0006: コンテナレジストリの選定（GHCR/Private）](../adr/0006-select-container-registry.md)
