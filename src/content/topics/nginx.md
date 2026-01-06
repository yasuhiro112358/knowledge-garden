# Ubuntu の Nginx 運用メモ

このページは Ubuntu で Nginx をインストール/起動/停止/アンインストールする方法と、関連ファイルの場所を手短にまとめたものです。

## インストール
- パッケージの更新とインストール
  ```bash
  sudo apt update
  sudo apt install -y nginx
  ```
- バージョン確認
  ```bash
  nginx -v
  ```

## 起動・停止・自動起動（systemd）
- 起動/停止/再起動/リロード/状態
  ```bash
  sudo systemctl start nginx
  sudo systemctl stop nginx
  sudo systemctl restart nginx
  sudo systemctl reload nginx    # 設定変更の反映（接続を切らずに反映）
  sudo systemctl status nginx --no-pager
  ```
- 自動起動の有効/無効
  ```bash
  sudo systemctl enable nginx
  sudo systemctl disable nginx
  ```
- 自動起動の状態確認
  ```bash
  systemctl is-enabled nginx                             # enabled/disabled/static/indirect を表示
  systemctl status nginx --no-pager | grep -i 'Loaded:'  # Loaded: ...; enabled; vendor preset: ...
  systemctl list-unit-files nginx.service --no-pager     # ユニットファイルの有効/無効
  ```
  - 表示の意味
    - enabled: ブート時に自動起動する設定。今動いているかは別（下記参照）
    - disabled: 自動起動しない（手動で start すれば動く）
    - static/indirect: 直接 enable できない/間接的に起動。依存関係で起動しうる
    - masked: 起動不可（手動でも開始できない）
  - 稼働中かの確認（自動起動設定とは別）
    ```bash
    systemctl is-active nginx   # active / inactive / failed など
    ```
  - 自動起動設定と同時に起動する
    ```bash
    sudo systemctl enable --now nginx
    ```
  - status の Loaded 行例
    ```
    Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)
                        #           ユニット定義の場所      # 自動起動設定
    ```

## 設定ファイルと関連場所
- メイン設定
  - `
  /etc/nginx/nginx.conf
  `（ここから `conf.d/*.conf` と `sites-enabled/*` を読み込み）
  - 追加設定: `
  /etc/nginx/conf.d/*.conf
  `
- サーバーブロック（仮想ホスト）
  - 置き場所: `
  /etc/nginx/sites-available/
  `
  - 有効化: `
  /etc/nginx/sites-enabled/
  `（`sites-available` のファイルへシンボリックリンク）
- ドキュメントルート（デフォルト）
  - `
  /var/www/html
  `
- ログ
  - アクセスログ: `
  /var/log/nginx/access.log
  `
  - エラーログ: `
  /var/log/nginx/error.log
  `
- システムサービス
  - ユニットファイル: `
  /lib/systemd/system/nginx.service
  `（上書きは `
  /etc/systemd/system/nginx.service.d/override.conf
  ` を作成）
- その他
  - 実行ユーザー: `www-data`
  - キャッシュ: `
  /var/cache/nginx
  `
  - TLS/証明書: `
  /etc/ssl
  ` や `
  /etc/letsencrypt
  `（Let’s Encrypt を使う場合）

## 最小サイトを追加する（HTTP）
1) サーバーブロックを作成
```bash
sudo tee /etc/nginx/sites-available/myapp > /dev/null <<'CONF'
server {
    listen 80;
    server_name _;  # もしくは example.com

    root /var/www/myapp/public;   # 実在するディレクトリに合わせる
    index index.html index.htm;

    # 静的ファイルの最小構成
    location / {
        try_files $uri $uri/ =404;
    }

    # アプリへリバースプロキシする場合の例
    # location / {
    #     proxy_set_header Host $host;
    #     proxy_set_header X-Real-IP $remote_addr;
    #     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    #     proxy_set_header X-Forwarded-Proto $scheme;
    #     proxy_pass http://127.0.0.1:3000;
    # }
}
CONF
```
2) 有効化してテスト→リロード
```bash
sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/myapp
sudo nginx -t
sudo systemctl reload nginx
```

## 設定テストと基本トラブルシュート
- 構文チェック
  ```bash
  sudo nginx -t
  ```
- ポート確認（80/443 が LISTEN しているか）
  ```bash
  sudo ss -lntp | grep -E ':80|:443'
  ```
- ログ確認
  ```bash
  sudo tail -f /var/log/nginx/access.log /var/log/nginx/error.log
  ```
- UFW（ファイアウォール）が有効な場合
  ```bash
  sudo ufw allow 'Nginx Full'   # 80/443 を許可
  # または 80 のみ
  # sudo ufw allow 'Nginx HTTP'
  # 443 のみ
  # sudo ufw allow 'Nginx HTTPS'
  ```

## アンインストール（削除・完全削除）
- バイナリの削除（設定は残す）
  ```bash
  sudo apt remove -y nginx nginx-common nginx-core
  ```
- 完全削除（設定も削除）
  ```bash
  sudo apt purge -y nginx nginx-common nginx-core
  sudo apt autoremove -y
  ```
- 残存ディレクトリを必要に応じて片付け
  ```bash
  # 本当に不要か確認してから削除
  sudo rm -rf /etc/nginx /var/log/nginx /var/cache/nginx /var/www/html
  ```

## 補足
- すでに前段で Traefik 等のリバースプロキシを使う場合、Nginx はバックエンド用途（内部ポート）に限定し、サーバーの公開ポート 80/443 を直接開けない設計も有効です。
- 設定変更時は毎回 `nginx -t` → `systemctl reload nginx` の流れを徹底すると安全です。
