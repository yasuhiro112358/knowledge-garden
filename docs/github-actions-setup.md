# GitHub Actions 自動デプロイ設定ガイド

## 概要

GitHub Actionsを使用して、Xserver VPSへの自動デプロイを設定します。

**初回セットアップ手順については、[GitHub Actions 自動デプロイ セットアップ手順書](./guides/github-actions-setup-guide.md)を参照してください。**

## デプロイフロー

```
1. Markdownファイルを編集
2. GitHubにプッシュ（mainブランチ）
3. GitHub Actionsが自動実行
   ├─ Dockerイメージをビルド
   ├─ GHCR（GitHub Container Registry）にプッシュ（Private）
   └─ Xserver VPSにSSH接続
      ├─ このリポジトリのディレクトリに移動
      ├─ リポジトリを最新化（git pull）
      └─ docker compose pull & up
4. Traefikが自動的にルーティング設定
5. サイトが公開される
```

## 必要な設定

### 1. GitHub Secretsの設定

リポジトリの **Settings** → **Secrets and variables** → **Actions** で以下を設定：

#### コンテナレジストリ（GHCR）
- **追加設定不要**: GitHub Actions側のpushは `GITHUB_TOKEN` を使用（Secrets不要）
- **注意（Private pull）**: VPS側は `ghcr.io` への `docker login` が必要（GitHub PAT: `read:packages`）

#### VPS接続情報
- `VPS_HOST`: VPSのIPアドレスまたはホスト名（例: `vps.example.com` または `123.45.67.89`）
- `VPS_USER`: SSHユーザー名（例: `ubuntu`、`root`）
- `VPS_SSH_KEY`: SSH秘密鍵（`~/.ssh/id_rsa` の内容）

#### このリポジトリのパス
- `KNOWLEDGE_GARDEN_PATH`: このリポジトリをクローンしたVPS上のパス（例: `/srv/knowledge-garden`）

**詳細な設定手順については、[GitHub Actions 自動デプロイ セットアップ手順書](./guides/github-actions-setup-guide.md)を参照してください。**

## ワークフローの説明

### docker-build.yml（メイン）

**トリガー**:
- `main`ブランチへのプッシュ
- 手動実行（workflow_dispatch）

**処理**:
1. リポジトリをチェックアウト
2. Docker Buildxをセットアップ
3. GHCRにログイン
4. Dockerイメージをビルド
5. GHCRにプッシュ
6. VPSにSSH接続してデプロイ

**デプロイジョブ**:
- `main`ブランチの場合のみ実行
- このリポジトリのディレクトリで `git pull`、`docker compose pull`、`docker compose up -d` を実行

※ 以前あった手動デプロイ用ワークフロー（`docker-deploy.yml`）は、運用一本化のため削除しました。

## トラブルシューティング

一般的なエラーと対処方法については、[GitHub Actions 自動デプロイ セットアップ手順書](./guides/github-actions-setup-guide.md#トラブルシューティング)を参照してください。

## 参考

- [GitHub Actions 自動デプロイ セットアップ手順書](./guides/github-actions-setup-guide.md) - 初回セットアップ手順
- [GitHub Actions ドキュメント](https://docs.github.com/ja/actions)
- [appleboy/ssh-action](https://github.com/appleboy/ssh-action)
- [docker/build-push-action](https://github.com/docker/build-push-action)
- [Docker + Traefik デプロイメントガイド](./guides/docker-deployment.md)

