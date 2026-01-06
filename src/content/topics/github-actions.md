# GitHub Actions 入門

## 概要
GitHub リポジトリのイベント（push/PR/Release/cron など）をトリガーにして CI/CD を自動化する仕組み。設定はリポジトリ内の `.github/workflows/*.yml` に記述する。

## 基本用語
- Workflow: 実行単位（YAMLファイル1つが1ワークフロー）
- Job: 並列/直列で実行する処理のまとまり（仮想環境＝Runner上で動く）
- Step: ジョブ内の個々の手順（シェルコマンド or Action）
- Runner: 実行環境（GitHubホスト: ubuntu-latest 等 / セルフホスト）

## 最小ワークフロー例（Node.jsのテスト）
ファイル: `.github/workflows/ci.yml`
```yaml
name: CI
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm test
```
ポイント:
- actions/checkout: リポジトリを取得
- actions/setup-node: Nodeのセットアップと依存キャッシュ
- `on:` でトリガー（push/PR）を定義

## 代表的なトリガー
```yaml
on:
  workflow_dispatch:      # 手動実行
  schedule:
    - cron: '0 3 * * *'  # 毎日03:00 UTC
  push:
    branches: [ main ]
    paths: [ 'src/**', '!docs/**' ]
  pull_request:
    types: [ opened, synchronize ]
```

## Secrets と環境変数
- リポジトリ: Settings > Secrets and variables > Actions
- 参照: `${{ secrets.MY_TOKEN }}` / `${{ vars.MY_VAR }}`
```yaml
- name: Use secret
  run: echo "$MY_TOKEN" | wc -c
  env:
    MY_TOKEN: ${{ secrets.MY_TOKEN }}
```

## キャッシュ（actions/cache）
```yaml
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: ${{ runner.os }}-node-
```

## マトリクス実行
```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node: [18, 20, 22]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: ${{ matrix.node }} }
      - run: npm ci && npm test
```

## アーティファクト（成果物の保存/受け渡し）
```yaml
- uses: actions/upload-artifact@v4
  with:
    name: build
    path: dist/**
# 取得側
- uses: actions/download-artifact@v4
  with: { name: build }
```

## 並列制御と再実行
```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true  # 同一ブランチの古い実行を打ち切る
```

## 環境・承認ゲート（Environments）
- Settings > Environments で `staging`/`production` を作成
```yaml
environment: production
```
- 必要に応じて保護ルール（承認者、シークレットのスコープ）を設定

## 再利用ワークフロー（Reusable Workflows）
共通処理を別YAMLに切り出し、`workflow_call` で呼び出し。
```yaml
# .github/workflows/reusable-build.yml
on: { workflow_call: {} }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: echo "build"
```
呼び出し側:
```yaml
jobs:
  call-build:
    uses: ./.github/workflows/reusable-build.yml
```

## よくあるレシピ
- Docker イメージのビルド/公開（GHCR）
```yaml
- uses: docker/login-action@v3
  with:
    registry: ghcr.io
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}
- uses: docker/build-push-action@v6
  with:
    push: true
    tags: ghcr.io/${{ github.repository }}:sha-${{ github.sha }}
```
- リリース作成（タグ push で）
```yaml
on:
  push:
    tags: [ 'v*.*.*' ]
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: softprops/action-gh-release@v2
        with:
          generate_release_notes: true
```

## デバッグのコツ
- `actions/setup-*` のバージョンを固定（例: `@v4`）
- `if: failure()` / `if: always()` で後処理を確実に
- ログで環境確認: `env`, `node -v`, `git status` などを最初に出力
- `ACTIONS_RUNNER_DEBUG` / `ACTIONS_STEP_DEBUG` を有効化して詳細ログ（Secrets > Actions > Variables）

## 参考
- Marketplace: https://github.com/marketplace?type=actions
- ドキュメント: https://docs.github.com/actions