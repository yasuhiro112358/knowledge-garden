# Homebrew

最終確認日: 2025-12-21

## 概要
macOS（およびLinux）向けのパッケージマネージャ。CLIツールだけでなくGUIアプリ（cask）も扱える。

## 用語
- formula: 略語ではなく「処方/レシピ」を意味する言葉。CLIツールやライブラリの定義を指す
- cask: 略語ではなく「樽」を意味する言葉。GUIアプリの配布物を扱う仕組み
- tap: 追加リポジトリ
- bottle: 事前ビルド済みバイナリ
- cellar: formulaの本体を置く場所（例: `/opt/homebrew/Cellar`）

## インストール（概要）
- 公式のインストールスクリプトを使用する（詳細は公式ドキュメント参照）
- インストール後に `brew doctor` で状態確認

## 基本コマンド（最小セット）
```bash
brew update
brew install <formula>
brew upgrade
brew uninstall <formula>
brew search <name>
brew info <formula>
```

## cask（GUIアプリ）
```bash
brew install --cask <app>
brew uninstall --cask <app>
```

## よく使う管理コマンド
```bash
brew list
brew outdated
brew cleanup
brew doctor
brew services list
```

## tap（追加リポジトリ）
```bash
brew tap
brew tap <user/repo>
brew untap <user/repo>
```

## バージョン固定（簡易）
- 原則は最新版追従。特定バージョンが必要なら `brew extract` や `brew pin` を検討。
- ただし長期固定は非推奨（セキュリティ更新が止まる）。

## Brewfile（環境の再現）
```bash
brew bundle dump --describe --force
brew bundle
```

## 典型的な利用例
- 新規Macの初期セットアップに `Brewfile` を使う
- CLIツールとGUIアプリを一括で管理

## よくあるトラブル
- PATHが通っていない（インストール直後）
- Intel MacとApple Siliconでインストール先が異なる
- 権限やシェル初期化（`.zprofile` / `.zshrc`）の設定漏れ

## Homebrewのディレクトリ構成
### プレフィックス（インストール先）
- Apple Silicon: `/opt/homebrew`
- Intel Mac: `/usr/local`

確認コマンド:
```bash
brew --prefix
brew --repository
brew --cellar
```

### 代表的なディレクトリ
- `Cellar/`: formulaの本体（バージョン別）
- `Caskroom/`: cask（GUIアプリ）
- `opt/`: 現在の有効バージョンへのシンボリックリンク
- `bin/`, `sbin/`: 実行ファイルのシンボリックリンク
- `lib/`, `include/`, `share/`: ライブラリ/ヘッダ/共有データ
- `etc/`: 設定ファイル
- `var/`: 可変データ（ログ/キャッシュ等）
- `Frameworks/`: 一部caskが利用するFramework
- `Library/`: Homebrew本体とtaps
  - `Library/Taps/`: tapで追加したリポジトリ群

### Intel MacのHomebrew本体パス
- Intel Macでは、Homebrew本体（リポジトリ）が `/usr/local/Homebrew` にあることが多い
- Apple Siliconへ移行後にこのディレクトリが残る場合がある

## 公式ドキュメント
- 公式サイト / ドキュメントを参照
