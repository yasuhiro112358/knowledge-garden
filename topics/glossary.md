# 用語メモ

最終確認日: 2025-12-21

## SIP
- System Integrity Protection の略
- macOSの保護機構で、システム領域への変更（特に /System や /usr/bin など）を制限する
- root権限でも書き換えできない範囲があるため、システムの安定性・安全性を高める

## XDG Base Directory
- ユーザー設定・データ・キャッシュなどの保存先を標準化する仕様（FreeDesktop.org）
- 目的はホーム直下にドットファイルが散らばるのを防ぐこと
- 主にUnix系で使われるが、macOSでも採用可能（徹底はアプリ次第）
- 代表的な環境変数:
  - `XDG_CONFIG_HOME`（既定: `~/.config`）
  - `XDG_DATA_HOME`（既定: `~/.local/share`）
  - `XDG_CACHE_HOME`（既定: `~/.cache`）
  - `XDG_STATE_HOME`（既定: `~/.local/state`）

## RCファイル
- **RC = Run Command** の略
- 設定ファイルや初期化スクリプトに使われる命名規則
- 元々はUnix系システムで、シェルの起動時に実行される設定ファイル（`.bashrc`, `.zshrc` など）に由来
- 現在では様々なツールで設定ファイルの拡張子やファイル名として使われる
- 代表的な例:
  - `.bashrc`, `.zshrc` - シェルの設定ファイル
  - `.firebaserc` - Firebaseプロジェクトの設定ファイル
  - `.npmrc` - npmの設定ファイル
  - `.eslintrc` - ESLintの設定ファイル
