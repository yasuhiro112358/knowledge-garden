# Ubuntu サーバーでの Docker 複数プロジェクト運用ベストプラクティス

## 基本方針（FHSに沿った配置）
- コード（Git管理）とランタイムデータ（永続化）を分離
- 設定（/etc）・データ（/var/lib, /srv）・ログ（/var/log）を意識した配置
- Secrets はGitに含めない（.env, docker secrets, 外部Secret管理）
- kebab-case 命名で統一（services/volumes/networks/フォルダ）

## どこにクローンするか（推奨）
- /srv/<stack-name>: サービス（スタック）単位のホーム。HTTP/アプリ配信向けの標準的な場所
- /opt/<app-name>: 自前配布のソフト群。自己完結型のツール/バイナリ置き場としても適切
- /home/ubuntu/apps/<stack-name>: 個人運用/検証用途なら可（本番は /srv 推奨）

関連ディレクトリの役割:
- /etc/: OSやデーモンの設定（例: /etc/docker/daemon.json, systemd units）
- /var/lib/: ランタイムデータ（例: /var/lib/docker, DBデータの実体など）
- /var/log/: ログ保管（アプリはDockerのログドライバでローテーション）
- /mnt/data または /data: 追加ディスクがある場合のマウント先（大容量データ向け）

## 推奨レイアウト例（複数スタック）
```
/srv/
  gateway/                 # 例: Traefik などのエッジ/ゲートウェイ
    compose.yml
    traefik.yml
    acme/
      acme.json            # 0600 権限で永続化
    config/
    secrets/               # Git管理外
    README.md

  private-db-stack/        # DB専用スタック（非公開）
    compose.yml
    .env                   # パスワード等はSecrets/外部ボリューム推奨
    backup/
      scripts/
      cron.d/
    data/                  # どうしてもバインドマウントが必要な場合のみ

  api-server/
    compose.yml
    .env
    config/
    scripts/

  web-app/
    compose.yml
    .env
    config/
    public/

# 共通: 外部Dockerネットワーク（例）
# proxy-net を作成して gateway と公開したいアプリだけ参加させる
```

各スタック配下の推奨ファイル:
- compose.yml: v2/v3 Compose。`restart: unless-stopped` と `healthcheck` を設定
- .env: 変数（Gitに含めない）。環境ごとに分ける（.env, .env.prod）
- config/: コンテナへマウントする設定（nginx.conf 等）
- secrets/: 認証情報。権限600/700。可能なら Docker secrets を使用
- data/: バインドマウントが必要な場合のみ。原則は「名前付きボリューム」
- scripts/: デプロイ/バックアップ/メンテのスクリプト

## Compose とネットワーク/ボリューム
- 外部ネットワークを明示して共有
```yaml
networks:
  proxy-net:
    external: true
```
- ボリュームは「名前付き」を基本にし、実体はDockerに管理させる
```yaml
volumes:
  app-data:
  db-data:
```

## 起動・自動化（2つの選択肢）
1) Compose の restart ポリシーに任せる（簡易）
- `restart: unless-stopped` を各サービスに設定
- サーバー再起動で自動復旧

2) systemd でComposeスタックを管理（明示制御）
- /etc/systemd/system/gateway.service（例）
```
[Unit]
Description=gateway stack (docker compose)
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
WorkingDirectory=/srv/gateway
RemainAfterExit=yes
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
```
- 有効化: `systemctl enable --now gateway`

## Docker デーモンのログローテーション
- /etc/docker/daemon.json（例）
```json
{
  "log-driver": "json-file",
  "log-opts": { "max-size": "10m", "max-file": "3" }
}
```
- 変更後は `systemctl restart docker`（実環境では計画的に）

## 権限とユーザー
- 運用ユーザー（例: ubuntu/deploy）を `docker` グループに追加（sudo不要運用は要検討）
- データディレクトリはコンテナのUID/GIDに合わせてchown（例: postgres 999:999）
- 機密ファイルは 600/700 権限

## セキュリティ基本
- SSH: キー認証、PasswordAuthentication=no、fail2ban
- ファイアウォール: ufw allow 22,80,443; 最小限の公開
- docker.sock 直マウントは避け、必要なら docker-socket-proxy
- Traefikダッシュボードは本番公開しない/認証保護

## バックアップ戦略
- 名前付きボリュームのスナップショット
```bash
# 例: ボリュームをtgz化（メンテナンス時間に実施）
docker run --rm -v db-data:/v -v $(pwd):/backup alpine sh -c "tar czf /backup/db-data-$(date +%F).tgz -C /v ."
```
- DBは論理バックアップ（pg_dump, mysqldump）と物理バックアップを併用
- バックアップ対象: /srv/**/compose.yml, config, secrets, acme.json

## 運用Tips
- 監視: `docker ps`, `docker compose ps`, `docker logs -f`, `docker system df`
- クリーンアップ: `docker system prune` は慎重に（本番では -a は基本使わない）
- 更新: `docker compose pull && docker compose up -d`（サービス単位で段階的に）
- リソース: `healthcheck` と `deploy.resources`（Compose v3）で制御

## システムアップデートと再起動（総合手順）
本番/準本番のUbuntuに対し、再起動が必要なアップデートへ安全に対応するための簡易手順です。

### 1) 事前チェック
- 空き容量/イメージ使用量
  ```bash
  df -h
  docker system df
  ```
- APT 整合性（ロック/破損の確認と修復）
  ```bash
  sudo dpkg --configure -a
  sudo apt -f install
  ```
- 最低限のバックアップ（必要に応じて）
  - /srv/**/compose.yml, config/, secrets/, acme.json
  - DB は論理バックアップ（pg_dump, mysqldump）

### 2) アップデート適用と再起動要否の確認
```bash
sudo apt update
sudo apt upgrade -y            # 重要更新を含む場合は sudo apt full-upgrade -y
# 再起動要否
test -f /var/run/reboot-required && cat /var/run/reboot-required || echo "reboot not required"
```

### 3) 再起動前の健全性確認
```bash
systemctl status docker --no-pager
docker ps --format '{{.Names}} {{.Status}}'
docker compose ls
sudo ss -lntp | grep -E ':80|:443'
```
- Traefik を使う場合: acme.json など永続化の確認（例: /srv/gateway/acme/acme.json は 0600）

### 4) 再起動の実行
```bash
sudo reboot
```

### 5) 再起動後の確認
```bash
uptime -p && uname -r
systemctl --failed
systemctl status docker --no-pager
docker ps --format '{{.Names}} {{.Status}}'
# 代表スタック
docker compose -f /srv/gateway/compose.yml ps 2>/dev/null || true
sudo ss -lntp | grep -E ':80|:443'
curl -I http://127.0.0.1 2>/dev/null | head -n 1 || true
```
- 自動復旧方針別
  - restart: unless-stopped のみ → 起動していないサービスは個別に `docker compose up -d`
  - systemd 管理 → `systemctl status <unit>` / `sudo systemctl restart <unit>`

### 6) よくあるトラブルと対処
- Docker が起動しない/遅い
  ```bash
  journalctl -u docker -b --no-pager | tail -n 200
  df -h
  sudo systemctl restart docker
  ```
- Compose 外部ネットワーク未作成（例: proxy-net）
  ```bash
  docker network ls | grep proxy-net || docker network create proxy-net
  ```
- Traefik が 80/443 を掴んでいない
  ```bash
  docker logs traefik --tail=200
  ```
- コンテナが Unhealthy/未起動
  ```bash
  docker ps --format '{{.Names}} {{.Status}}'
  docker logs <service> --tail=200
  docker compose -f /srv/<stack>/compose.yml up -d --remove-orphans
  ```

### 7) 自動アップデート（unattended-upgrades）方針
- 現状確認
  ```bash
  cat /etc/apt/apt.conf.d/20auto-upgrades 2>/dev/null || true
  grep -E 'Unattended-Upgrade::Automatic-Reboot' /etc/apt/apt.conf.d/50unattended-upgrades 2>/dev/null || true
  ```
- 自動再起動を避けたい場合（例）
  ```bash
  sudo sed -i 's|^//\?\s*Unattended-Upgrade::Automatic-Reboot .*|Unattended-Upgrade::Automatic-Reboot "false";|' /etc/apt/apt.conf.d/50unattended-upgrades
  ```
- 許容する場合は時間指定（例）
  ```bash
  sudo sed -i 's|^//\?\s*Unattended-Upgrade::Automatic-Reboot-Time .*|Unattended-Upgrade::Automatic-Reboot-Time "02:00";|' /etc/apt/apt.conf.d/50unattended-upgrades
  ```

## まとめ
- 本番は /srv を起点にスタック単位でクローン・運用
- 名前付きボリューム＋外部ネットワークで疎結合に
- 設定/データ/ログ/Secrets を分離し、権限とバックアップを徹底
