# GitHub Actions 自動デプロイ セットアップ手順書

このドキュメントは、GitHub Actionsを使用した自動デプロイの初回セットアップ手順を説明します。

詳細な仕様や説明については、[GitHub Actions 自動デプロイ設定ガイド](../github-actions-setup.md)を参照してください。

## 前提条件

- Docker Hubアカウントを持っている
- VPSにSSH接続できる
- VPSにDockerとDocker Composeがインストールされている
- Traefikが既に動作している

## セットアップ手順

### ステップ1: Docker Hubアカウントの準備

1. [Docker Hub](https://hub.docker.com/)でアカウントを作成（まだ持っていない場合）
2. ログイン後、**Settings** → **Security** → **New Access Token** でアクセストークンを生成
3. トークン名を入力（例: `github-actions`）
4. 生成されたトークンをコピー（後で使用します）

### ステップ2: SSH鍵の生成と設定

#### 2.1 ローカルでSSH鍵を生成

```bash
# SSH鍵を生成（まだ持っていない場合）
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions

# パスフレーズを設定（推奨）
# Enter passphrase (empty for no passphrase): [パスフレーズを入力]
```

#### 2.2 公開鍵をVPSにコピー

```bash
# 公開鍵をVPSにコピー
ssh-copy-id -i ~/.ssh/github_actions.pub user@vps-host

# または、手動でコピーする場合
cat ~/.ssh/github_actions.pub | ssh user@vps-host "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

#### 2.3 SSH接続のテスト

```bash
# ローカルからVPSに接続できるか確認
ssh -i ~/.ssh/github_actions user@vps-host

# 接続できれば成功
```

#### 2.4 GitHub Secretsに秘密鍵を設定

```bash
# 秘密鍵の内容をコピー
cat ~/.ssh/github_actions
```

1. GitHubリポジトリの **Settings** → **Secrets and variables** → **Actions** を開く
2. **New repository secret** をクリック
3. Name: `VPS_SSH_KEY`
4. Secret: 上記でコピーした秘密鍵の内容を貼り付け（改行を含めてそのまま）
5. **Add secret** をクリック

**重要**: 
- 秘密鍵は絶対に公開しない
- GitHub Secretsに設定する際は、改行を含めてそのまま貼り付ける

### ステップ3: GitHub Secretsの設定

リポジトリの **Settings** → **Secrets and variables** → **Actions** で以下を設定：

#### Docker Hub認証情報

1. **New repository secret** をクリック
2. Name: `DOCKER_USERNAME`、Secret: Docker Hubのユーザー名 → **Add secret**
3. **New repository secret** をクリック
4. Name: `DOCKER_PASSWORD`、Secret: ステップ1で生成したアクセストークン → **Add secret**

#### VPS接続情報

1. **New repository secret** をクリック
2. Name: `VPS_HOST`、Secret: VPSのIPアドレスまたはホスト名（例: `vps.example.com` または `123.45.67.89`） → **Add secret**
3. **New repository secret** をクリック
4. Name: `VPS_USER`、Secret: SSHユーザー名（例: `ubuntu`、`root`） → **Add secret**
5. `VPS_SSH_KEY`はステップ2.4で既に設定済み

#### このリポジトリのパス

1. **New repository secret** をクリック
2. Name: `KNOWLEDGE_GARDEN_PATH`、Secret: このリポジトリをクローンする予定のVPS上のパス（例: `/opt/knowledge-garden`） → **Add secret**

### ステップ4: VPS側の初回セットアップ

#### 4.1 VPSにSSH接続

```bash
ssh user@vps-host
```

#### 4.2 リポジトリをクローン

```bash
# リポジトリをクローン（例: /opt/knowledge-garden）
cd /opt
git clone https://github.com/your-username/knowledge-garden.git
cd knowledge-garden
```

#### 4.3 環境変数を設定

```bash
# .envファイルを作成
echo "DOCKER_USERNAME=your-dockerhub-username" > .env

# 確認
cat .env
```

**注意**: `your-dockerhub-username`は実際のDocker Hubのユーザー名に置き換えてください。

#### 4.4 パスの確認

```bash
# 現在のパスを確認
pwd

# このパスが GitHub Secrets の KNOWLEDGE_GARDEN_PATH と一致しているか確認
```

### ステップ5: 初回テスト

#### 5.1 手動でワークフローを実行

1. GitHubリポジトリの **Actions** タブを開く
2. 左側のメニューから **Build and Deploy to VPS** を選択
3. **Run workflow** をクリック
4. ブランチを選択（`main`）→ **Run workflow** をクリック

#### 5.2 ログを確認

1. 実行中のワークフローをクリック
2. 各ステップのログを確認
3. エラーがないか確認

**成功の確認**:
- ビルドジョブが成功している
- デプロイジョブが成功している
- エラーが表示されていない

### ステップ6: 自動デプロイの確認

#### 6.1 テスト用の変更をプッシュ

```bash
# ローカルで小さな変更を加える（例: README.mdにコメントを追加）
git add .
git commit -m "test: GitHub Actions自動デプロイのテスト"
git push origin main
```

#### 6.2 自動デプロイの確認

1. GitHubリポジトリの **Actions** タブを開く
2. 新しいワークフローが自動的に実行されていることを確認
3. ワークフローが成功することを確認
4. サイトが更新されていることを確認（`https://knowledge.newtralize.com`）

## トラブルシューティング

### SSH接続エラー

**エラー**: `Permission denied (publickey)`

**対処手順**:
1. SSH鍵が正しく設定されているか確認
   ```bash
   # ローカルで確認
   ls -la ~/.ssh/github_actions*
   ```
2. VPS側で公開鍵が`~/.ssh/authorized_keys`に追加されているか確認
   ```bash
   # VPSにSSH接続して確認
   ssh user@vps-host
   cat ~/.ssh/authorized_keys | grep github-actions
   ```
3. SSH鍵の権限を確認
   ```bash
   # ローカルで実行
   chmod 600 ~/.ssh/github_actions
   chmod 644 ~/.ssh/github_actions.pub
   ```
4. GitHub Secretsの`VPS_SSH_KEY`が正しく設定されているか確認

### Dockerイメージが見つからない

**エラー**: `Error: image not found`

**対処手順**:
1. Docker Hubにイメージがプッシュされているか確認
   - [Docker Hub](https://hub.docker.com/)にログイン
   - リポジトリ一覧で`knowledge-garden`を確認
2. `DOCKER_USERNAME`が正しく設定されているか確認
   - GitHub Secretsで確認
3. イメージ名が正しいか確認
   - イメージ名は`your-username/knowledge-garden:latest`の形式

### このリポジトリが見つからない

**エラー**: `No such file or directory`

**対処手順**:
1. `KNOWLEDGE_GARDEN_PATH`が正しく設定されているか確認
   - GitHub Secretsで確認
2. VPS側でパスを確認
   ```bash
   # VPSにSSH接続して確認
   ssh user@vps-host
   ls -la /opt/knowledge-garden
   ```
3. このリポジトリが正しい場所にクローンされているか確認
   - ステップ4を再実行
4. パスが一致しているか確認
   - VPS側の実際のパスとGitHub Secretsの`KNOWLEDGE_GARDEN_PATH`が一致しているか

### docker-composeコマンドが見つからない

**エラー**: `docker-compose: command not found`

**対処手順**:
1. VPSにDocker Composeがインストールされているか確認
   ```bash
   # VPSにSSH接続して確認
   ssh user@vps-host
   docker compose version
   # または
   docker-compose version
   ```
2. Docker Compose V2を使用している場合、ワークフローのスクリプトを確認
   - `.github/workflows/docker-build.yml`で`docker compose`（ハイフンなし）を使用しているか確認

### ワークフローが実行されない

**対処手順**:
1. ブランチが`main`であることを確認
2. ワークフローファイルが正しい場所にあることを確認
   - `.github/workflows/docker-build.yml`
3. ワークフローの構文エラーがないか確認
   - GitHub Actionsのログで確認

### デプロイは成功するがサイトにアクセスできない

**対処手順**:
1. Traefikが動作しているか確認
   ```bash
   # VPSにSSH接続して確認
   ssh user@vps-host
   docker ps | grep traefik
   ```
2. コンテナが起動しているか確認
   ```bash
   docker ps | grep knowledge-garden
   ```
3. Traefikのネットワーク（`traefik`）に接続されているか確認
   ```bash
   docker network inspect traefik | grep knowledge-garden
   ```
4. DNS設定を確認
   - `knowledge.newtralize.com`がVPSのIPアドレスを指しているか確認

## 参考

- [GitHub Actions 自動デプロイ設定ガイド](../github-actions-setup.md) - 詳細な仕様と説明
- [Docker + Traefik デプロイメントガイド](./docker-deployment.md)
- [GitHub Actions ドキュメント](https://docs.github.com/ja/actions)

