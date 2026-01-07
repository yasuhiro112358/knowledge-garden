# Certbot（Let’s Encrypt クライアント）メモ（APT 版）

このページは Ubuntu で「APT 版の Certbot」を使う前提で、インストール/証明書取得/自動更新/アンインストールと、関連ファイルの場所を簡潔にまとめます。

## インストール（APT 版）
```bash
sudo apt update
sudo apt install -y certbot python3-certbot-nginx   # nginx 連携時（Apacheなら python3-certbot-apache）
certbot --version
```

## 証明書の取得（代表例）
- Nginx プラグイン（自動で nginx 設定を編集・再読み込み）
  ```bash
  sudo certbot --nginx -d example.com -d www.example.com
  ```
- Webroot 方式（nginx 設定は手動保守、ドキュメントルート直下に認証ファイルを配置）
  ```bash
  sudo certbot certonly --webroot -w /var/www/html -d example.com
  ```
- Standalone 方式（:80 を一時占有。前段プロキシや既存Webサーバがある場合は事前停止が必要）
  ```bash
  sudo systemctl stop nginx  # 必要なら一時停止
  sudo certbot certonly --standalone --preferred-challenges http -d example.com
  sudo systemctl start nginx
  ```
- ワイルドカードが必要な場合（DNS-01）
  - 各 DNS 用プラグインを利用（例: Cloudflare → `python3-certbot-dns-cloudflare`）。

## 自動更新（renew）
- APT 版は systemd の `certbot.timer` により自動更新されます
  ```bash
  systemctl status certbot.timer --no-pager
  systemctl list-timers | grep certbot
  ```
- 手動で動作検証（ドライラン）
  ```bash
  sudo certbot renew --dry-run
  ```
- ログ
  ```bash
  ls -l /var/log/letsencrypt/
  ```
- 補足
  - Nginx プラグインで取得した場合は更新時に自動で適用・リロードされます。
  - Webroot 方式でも証明書パスは `live/<ドメイン>` のシンボリックリンクを参照すれば、更新時に差し替わります。
  - 追加の処理が必要なら更新フック `/etc/letsencrypt/renewal-hooks/deploy/` にスクリプトを配置（例: `systemctl reload nginx`）。

## 主要ファイル/ディレクトリ
- 証明書/鍵
  - `/etc/letsencrypt/live/<ドメイン>/fullchain.pem`, `privkey.pem`
  - `/etc/letsencrypt/archive/<ドメイン>/`（履歴）
- 設定
  - `/etc/letsencrypt/renewal/<ドメイン>.conf`
- ログ
  - `/var/log/letsencrypt/`

## インストール確認（APT 版）
```bash
certbot --version
command -v certbot
apt list --installed 2>/dev/null | grep -E '^(certbot/|python3-certbot)'
# systemd タイマー
systemctl status certbot.timer --no-pager
```

## アンインストール（APT 版）
```bash
sudo systemctl disable --now certbot.timer certbot.service
sudo apt purge -y certbot python3-certbot-nginx python3-certbot-apache python3-certbot
sudo apt autoremove -y
# データ削除（本当に不要か確認してから）
sudo rm -rf /etc/letsencrypt /var/log/letsencrypt
```

## Traefik 併用時の注意
- 80/443 を Traefik が終端し ACME を担当するなら、Certbot は不要（競合回避）。
- 既存の Certbot 証明書を一時的に使う場合は Traefik の file provider で参照可能だが、更新運用が二重化するため最終的には Traefik の ACME に集約することを推奨。
- DNS-01（ワイルドカード）を使う場合も、Traefik 側の DNS-01 に統一するとシンプルです。
