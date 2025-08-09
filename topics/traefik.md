# Traefik

## 概要
Traefik（トラフィック）は、クラウドネイティブなリバースプロキシ／エッジルーター。Docker や Kubernetes などのプロバイダから動的に設定を取得し、ルーティング・TLS 終端・ヘルスチェック・ミドルウェア適用などを自動化できる。

## TLS 終端とは
TLS 終端（TLS termination）は、エッジ（Traefik などのリバースプロキシ）で TLS を復号して HTTP としてバックエンドに転送する方式。証明書管理と暗号処理をフロントに集約し、バックエンドは平文 HTTP で動作させる。

- 目的: 証明書の集中管理、CPU 負荷のオフロード、HTTP ルーティング/ミドルウェア活用
- メリット: 自動 HTTPS（Let’s Encrypt）、HTTP/2/ALPN、セキュリティヘッダや認証などを一括適用
- 注意点: Traefik→バックエンド間は平文になるため、同一ホスト/プライベートネットワークで隔離、必要に応じて内部 mTLS を検討
- 代替: TLS パススルー（Traefik では復号せず透過転送）。HTTP ルールやミドルウェアは使えない

設定例（Docker ラベル）：
```yaml
# 例：Traefik で TLS 終端（HTTPS を終端し、内部は HTTP:3000）
labels:
  - traefik.http.routers.web-app.entrypoints=websecure
  - traefik.http.routers.web-app.tls=true
  - traefik.http.routers.web-app.tls.certresolver=le
  - traefik.http.services.web-app.loadbalancer.server.port=3000
```

```yaml
# 例：TLS パススルー（TCP ルーター。Traefik は復号しない）
labels:
  - traefik.tcp.routers.secure-svc.rule=HostSNI(`secure.example.com`)
  - traefik.tcp.routers.secure-svc.entrypoints=websecure
  - traefik.tcp.routers.secure-svc.tls.passthrough=true
  - traefik.tcp.services.secure-svc.loadbalancer.server.port=8443
```

## 主な特徴
- 動的構成（プロバイダ）: Docker、Kubernetes、File などから自動で設定を反映
- 自動 HTTPS（Let’s Encrypt）: 証明書の取得・更新を自動化
- 高機能ルーティング: Host/Path/Headers/Method などで柔軟にマッチ
- ミドルウェア: リダイレクト、Basic 認証、圧縮、RateLimit、IP AllowList、Header 付与など
- 負荷分散とヘルスチェック、スティッキーセッション
- 観測性: ダッシュボード、アクセスログ、メトリクス（Prometheus, OTLP）
- HTTP/2、gRPC、WebSocket、TCP/UDP（DBやMQなど）も対応

## コア概念（v2）
- EntryPoints: Traefik がリッスンするポート（例: web=80, websecure=443）
- Routers: リクエストのマッチ条件（Host(`example.com`) など）と適用設定（TLS、Middlewares、Services）
- Middlewares: ルールに合致したリクエストへ適用（リダイレクト、認証、ヘッダ付与など）
- Services: バックエンド（アプリ）群への負荷分散設定（port、servers、sticky 等）
- Providers: 設定の取得元（Docker、Kubernetes、File）。変更を検知して自動反映

## 技術選定の考え方
- 目的とユースケース
  - 複数サービスをDockerで運用し、追加・変更が頻繁 → Traefikが適切（自動検出/自動HTTPS）
  - 単一サービスで構成が固定、細かなL7チューニング（rewrite/map/Lua）や強力なキャッシュが必要 → nginxも有力
- ルーティングと自動化
  - Dockerラベルでホットリロード不要の自動反映 → Traefik
  - 生成済みnginx.confを配布・明示的に管理 → nginx
- HTTPS/証明書運用
  - Let’s Encryptの自動取得・更新を簡便に → Traefik
  - 企業CA・HSM・詳細TLSポリシーの厳格管理 → nginxでも可
- TLS終端 vs パススルー
  - 終端（termination）: ミドルウェア（認証/ヘッダ/RateLimit）や詳細HTTPルールが必要。内部はプライベートネットで隔離
  - パススルー（passthrough）: エンドツーエンドTLS必須、非HTTP(TCP/gRPCのまま)を透過、下流にWAF/IDPがある
- 運用規模と基盤
  - 単一ホスト → docker compose + Traefik
  - 複数ホスト/高可用 → Kubernetes（Traefik Ingress/Nginx Ingress）を検討
- セキュリティの前提
  - docker.sockはdocker-socket-proxy経由、ダッシュボード公開時は認証必須（api.insecure=false）
  - acme.jsonは永続化し0600権限、80/443の開放とDNS設定を整備
  - 公開ネットワークと内部ネットワークを分離（DBは公開しない）
- リポジトリ/ネットワーク設計
  - インフラ用リポ（例: private-gateway）と各アプリのリポを分離
  - 外部共有ネットワーク（例: proxy-net）を作成し、公開するコンテナだけ参加させTraefikラベル付与
  - DB用リポ（例: private-db-stack）は内部ネットワークのみ接続、ポート公開/Traefikラベルなし
- 命名規則と運用
  - kebab-caseで統一（services/volumes/middlewares）
  - `restart: unless-stopped` と healthcheck を併用
  - 監視（アクセスログ/メトリクス）を有効化

### 導入チェックリスト
- DNSのA/AAAAをサーバーIPへ、80/443開放
- acme.jsonをボリューム永続化し0600権限
- api.insecure=false、ダッシュボードはBasic認証やIP制限
- proxy-net（外部ネットワーク）を作成、公開が必要なサービスのみ参加
- 各サービスに正しいHost/Pathルールと`loadbalancer.server.port`
- healthcheckと`restart: unless-stopped`設定を確認
- バックアップ対象: acme.json、Traefik設定、Composeファイル

## よく使う構成（Docker Compose）
以下は本番でも使える最小構成例。自動 HTTPS、HTTP→HTTPS リダイレクト、ダッシュボード保護などを含む。

```yaml
version: '3.8'

services:
  traefik:
    image: traefik:v2.11
    container_name: traefik
    command:
      - --entrypoints.web.address=:80
      - --entrypoints.websecure.address=:443
      - --providers.docker=true
      - --providers.docker.exposedbydefault=false
      - --api.dashboard=true
      - --api.insecure=false               # 公開時は必ず false（ダッシュボードはルーターで保護）
      - --certificatesresolvers.le.acme.email=you@example.com
      - --certificatesresolvers.le.acme.storage=/letsencrypt/acme.json
      - --certificatesresolvers.le.acme.httpchallenge=true
      - --certificatesresolvers.le.acme.httpchallenge.entrypoint=web
    ports:
      - 80:80
      - 443:443
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - traefik-letsencrypt:/letsencrypt
    restart: unless-stopped
    labels:
      # ダッシュボードをサブドメインで公開（Basic 認証で保護）
      - traefik.enable=true
      - traefik.http.routers.traefik.rule=Host(`traefik.example.com`)
      - traefik.http.routers.traefik.entrypoints=websecure
      - traefik.http.routers.traefik.tls=true
      - traefik.http.routers.traefik.tls.certresolver=le
      - traefik.http.routers.traefik.service=api@internal
      - traefik.http.routers.traefik.middlewares=traefik-auth
      # Basic 認証（例）: 下のハッシュはサンプルです。実運用は自分で生成
      - traefik.http.middlewares.traefik-auth.basicauth.users=admin:$apr1$H6uskkkW$IgXLP6ewTrSuBkTrqE8wj/

  # HTTP → HTTPS リダイレクト用の catch-all ルーター（任意）
  redirect:
    image: traefik:v2.11
    labels:
      - traefik.enable=true
      - traefik.http.routers.http-catchall.entrypoints=web
      - traefik.http.routers.http-catchall.rule=HostRegexp(`{any:.+}`)
      - traefik.http.routers.http-catchall.middlewares=redirect-to-https
      - traefik.http.middlewares.redirect-to-https.redirectscheme.scheme=https
    deploy:
      replicas: 0 # Traefik サービスに内包させる運用も可（ここは例示のため）

  web-app:
    image: yourorg/yourapp:latest
    depends_on:
      - traefik
    expose:
      - "3000"
    restart: unless-stopped
    labels:
      - traefik.enable=true
      # ルーティング
      - traefik.http.routers.web-app.rule=Host(`example.com`)
      - traefik.http.routers.web-app.entrypoints=websecure
      - traefik.http.routers.web-app.tls=true
      - traefik.http.routers.web-app.tls.certresolver=le
      # バックエンド Service のポート指定
      - traefik.http.services.web-app.loadbalancer.server.port=3000
      # 代表的なミドルウェア（圧縮、セキュアヘッダ）
      - traefik.http.routers.web-app.middlewares=web-app-compress,web-app-sec-headers
      - traefik.http.middlewares.web-app-compress.compress=true
      - traefik.http.middlewares.web-app-sec-headers.headers.stsSeconds=31536000
      - traefik.http.middlewares.web-app-sec-headers.headers.stsIncludeSubdomains=true
      - traefik.http.middlewares.web-app-sec-headers.headers.forceSTSHeader=true
      - traefik.http.middlewares.web-app-sec-headers.headers.frameDeny=true

volumes:
  traefik-letsencrypt:
```

ヒント:
- Basic 認証のハッシュは `htpasswd` で生成（例: `htpasswd -nb admin 'your-password'`）
- `acme.json` は 600 権限にして永続化すること（Let’s Encrypt レート制限の回避にも重要）
- `providers.docker.exposedbydefault=false` により、明示的に `traefik.enable=true` のものだけ公開
- DNS の A/AAAA レコードを正しい IP に向ける（HTTP-01 チャレンジには 80 番が必要）

## 代表的なミドルウェア
- redirectScheme: HTTP→HTTPS などプロトコル変換
- basicAuth / forwardAuth: 認証
- rateLimit: レート制限
- headers: セキュリティヘッダ追加（HSTS、X-Frame-Options 等）
- stripPrefix / addPrefix: パス調整
- compress: レスポンス圧縮

## ベストプラクティス
- ダッシュボードは公開しないか、必ず認証で保護（`api.insecure=false`）
- 証明書ストレージ（acme.json）はボリュームで永続化し、権限 600
- プロジェクト全体でケバブケース命名（services、volumes、middlewares など）
- `restart: unless-stopped` とヘルスチェックを併用して可用性を確保
- ルールはできるだけ具体的に（Host と Path を併用し誤ルーティングを防止）
- アクセスログとメトリクスを有効化して監視（Prometheus, Loki, OTLP など）

## トラブルシューティング
- 404 はルーター未一致の可能性（rule/entrypoints/Host の綴り・DNS を確認）
- 502/504 はバックエンド未起動やポート不一致（`loadbalancer.server.port`）
- 証明書発行失敗は 80 番ポート到達性やレート制限、ドメイン設定を確認
- `whoami` テスト: `traefik/whoami` をデプロイしてルーティング動作確認
- ログレベルを上げて原因調査（`--log.level=DEBUG`）

## 参考リンク
- 公式サイト: https://traefik.io/
- ドキュメント: https://doc.traefik.io/traefik/
- Middlewares: https://doc.traefik.io/traefik/middlewares/overview/
- Let’s Encrypt (ACME): https://doc.traefik.io/traefik/https/acme/