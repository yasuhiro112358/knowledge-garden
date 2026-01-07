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

## Knowledge GardenプロジェクトでのNginx設定

Knowledge Gardenプロジェクト（Astro静的サイト）で使用している`nginx.conf`の解説です。

### 設定ファイル全体

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip圧縮
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    # 静的ファイルの配信
    location / {
        try_files $uri $uri/ /index.html;
    }

    # キャッシュ設定（静的アセット）
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # HTMLファイルはキャッシュしない
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # セキュリティヘッダー
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

### 各設定の解説

#### 1. 基本設定（必須）

```nginx
listen 80;
server_name _;
root /usr/share/nginx/html;
index index.html;
```

- **`listen 80`**: ポート80でHTTPリクエストを待ち受ける
- **`server_name _`**: すべてのホスト名を受け付ける（Docker環境では`_`で十分）
- **`root /usr/share/nginx/html`**: ドキュメントルート（Astroのビルド成果物`dist/`がコピーされる場所）
- **`index index.html`**: ディレクトリアクセス時のデフォルトファイル

#### 2. Gzip圧縮（パフォーマンス最適化）

```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;
```

- **`gzip on`**: Gzip圧縮を有効化
- **`gzip_vary on`**: クライアントがGzipをサポートしている場合のみ圧縮（`Vary: Accept-Encoding`ヘッダーを追加）
- **`gzip_min_length 1024`**: 1024バイト以上のファイルのみ圧縮（小さいファイルは圧縮のオーバーヘッドが大きい）
- **`gzip_types`**: 圧縮するMIMEタイプを指定（テキスト系ファイルを圧縮）

**効果**: 転送データ量を約70-80%削減し、ページ読み込み速度が向上

#### 3. 静的ファイルの配信（SPA対応）

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

- **`try_files`**: ファイルが見つからない場合のフォールバック処理
  - `$uri`: リクエストされたファイルを探す
  - `$uri/`: ディレクトリとして探す
  - `/index.html`: 見つからない場合は`index.html`を返す（Astroのクライアントサイドルーティングに対応）

**重要**: Astroは静的サイトジェネレーターだが、クライアントサイドルーティングを使用するため、この設定が必要

#### 4. キャッシュ設定（静的アセット）

```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

- **`~*`**: 大文字小文字を区別しない正規表現マッチ
- **対象ファイル**: 画像、CSS、JavaScript、フォントなど、変更されにくい静的アセット
- **`expires 1y`**: 1年間キャッシュを有効にする（`Expires`ヘッダーを設定）
- **`Cache-Control "public, immutable"`**: 
  - `public`: プロキシやCDNでもキャッシュ可能
  - `immutable`: ファイルが変更されないことを示す（ブラウザが再検証をスキップ）

**効果**: 再訪問時の読み込み速度が大幅に向上

#### 5. HTMLファイルのキャッシュ無効化

```nginx
location ~* \.html$ {
    expires -1;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

- **`expires -1`**: キャッシュを無効化
- **`Cache-Control "no-cache, no-store, must-revalidate"`**: 
  - `no-cache`: キャッシュを使用する前に再検証が必要
  - `no-store`: キャッシュに保存しない
  - `must-revalidate`: キャッシュが期限切れの場合は再検証が必要

**理由**: HTMLファイルはコンテンツ更新時に変更されるため、常に最新版を配信する必要がある

#### 6. セキュリティヘッダー

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

- **`X-Frame-Options "SAMEORIGIN"`**: クリックジャッキング攻撃を防ぐ（同じオリジンからのみiframe埋め込みを許可）
- **`X-Content-Type-Options "nosniff"`**: MIMEタイプの推測を防ぐ（Content-Typeヘッダーを信頼）
- **`X-XSS-Protection "1; mode=block"`**: XSS攻撃に対するブラウザの保護を有効化（古いブラウザ向け）
- **`Referrer-Policy "strict-origin-when-cross-origin"`**: リファラー情報の送信を制御（クロスオリジン時のみオリジンのみ送信）
- **`always`**: エラーレスポンスでもヘッダーを追加

**効果**: セキュリティリスクを低減

### 設定の分類

#### 必須（最低限の動作に必要）
- 基本設定（`listen`, `server_name`, `root`, `index`）
- 静的ファイルの配信（`location /`）

#### 推奨（実用的な運用に必要）
- SPA対応（`try_files`）

#### 最適化（パフォーマンス向上）
- Gzip圧縮
- キャッシュ設定

#### セキュリティ（本番環境で推奨）
- セキュリティヘッダー

### 最小構成との比較

**最小構成（動作するが最適化なし）:**
```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**現在の構成（最適化とセキュリティを含む）:**
- 上記の完全版（35行）

本番環境では現在の構成を推奨します。

## トラブルシューティング

### ポート番号が消える問題（Docker環境）

**問題**: `http://localhost:8080`でアクセスできるが、リンクをクリックするとポート番号が消えて`http://localhost/topics/...`になってしまう

**原因**: Astroが絶対パス（`/topics/...`）でリンクを生成するため、ブラウザが現在のポート番号を保持しない

**解決方法**:

1. **推奨: 開発環境では`npm run dev`を使用**
   ```bash
   npm run dev
   # http://localhost:4321 でアクセス（Astroの開発サーバーは自動的にポートを保持）
   ```

2. **ポート80で起動する（管理者権限が必要）**
   ```bash
   docker run -p 80:80 knowledge-garden:local
   # http://localhost でアクセス可能（ポート番号不要）
   ```

3. **一時的な解決策: ブラウザのアドレスバーでポート番号を手動で追加**
   - リンクをクリックした後、アドレスバーに`:8080`を追加

**注意**: 本番環境（Traefik経由）では、この問題は発生しません。Traefikがポート80/443でリクエストを受け取り、内部のNginxコンテナに転送するためです。

## 補足
- すでに前段で Traefik 等のリバースプロキシを使う場合、Nginx はバックエンド用途（内部ポート）に限定し、サーバーの公開ポート 80/443 を直接開けない設計も有効です。
- 設定変更時は毎回 `nginx -t` → `systemctl reload nginx` の流れを徹底すると安全です。
