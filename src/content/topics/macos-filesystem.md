# macOS ディレクトリ構成の基礎

最終確認日: 2025-12-21

## 目的
macOSの主要ディレクトリの役割と、/usr や /opt の位置づけを理解する。

## 大枠（macOSの特徴）
- 近年のmacOSは「システム領域」と「データ領域」が分離されている
- システム領域は基本的に読み取り専用（SIPにより保護）
- ユーザーデータやアプリは主にデータ領域に配置される

## 全体イメージ（ざっくりツリー）
```
/
├── System/                 # macOS本体（SIPで保護）
├── Applications/           # GUIアプリの実体
├── Users/                  # ユーザーのホーム
│   └── <you>/              # 自分のホーム
│       ├── Desktop/
│       ├── Documents/
│       └── Library/        # ユーザー設定/キャッシュ
├── Library/                # システム全体の設定/拡張
├── usr/                    # システムのコマンド/ライブラリ
│   ├── bin/                # OS標準コマンド
│   ├── sbin/               # 管理系コマンド
│   ├── lib/                # システムライブラリ
│   └── local/              # 追加ツールの置き場（SIPの保護外）
├── opt/                    # 追加ソフトの置き場（外部ツール）
├── private/                # 実体の配置（/etc, /var, /tmpの本体）
│   ├── etc/
│   ├── var/
│   └── tmp/
└── Volumes/                # 外部ディスク/ネットワークのマウント
```

### ツリーの見方
- **System**: OS本体。通常は触らない（SIPで保護）
- **Applications**: アプリ本体（.app）を置く場所
- **Users**: 自分のデータや設定の中心（普段使うのはここ）
- **Library（/Library）**: 全ユーザー共有の設定・拡張
- **usr**: OS標準のコマンド群（/usr/local が追加ツール用）
- **opt**: 追加ソフトの置き場（Homebrewやサードパーティが使う）
- **private**: /etc /var /tmp の実体
- **Volumes**: 外部ディスクの入口

## よく見るディレクトリ

### / (ルート)
- すべての起点。ここ配下に各ディレクトリがぶら下がる

### /System
- macOS本体の主要ファイル
- SIP（System Integrity Protection）により保護される

### /Users
- ユーザーのホームディレクトリ
- 例: /Users/yourname

### /Applications
- macOSアプリ（.app）を置く標準場所
- アプリは実体がここ、設定は ~/Library 側に保存されることが多い

### /Library
- システム全体で共有する設定や拡張
- ユーザー別の設定は ~/Library

### /etc
- 互換性のための設定ディレクトリ
- 実体は /private/etc へのリンク

### /var
- 可変データ（ログ、キャッシュ等）
- 実体は /private/var へのリンク

### /tmp
- 一時ファイル
- 実体は /private/tmp へのリンク

### /Volumes
- 外部ディスクやネットワークボリュームのマウント先

## /usr とは
- 伝統的な「ユーザー領域（Unix System Resources）」
- OSが提供するコマンドやライブラリが置かれる
- macOSではSIPの影響で /usr/bin や /usr/sbin は基本的に書き込み不可

主なサブディレクトリ:
- /usr/bin: OS標準のコマンド
- /usr/sbin: 管理系コマンド
- /usr/lib: システムライブラリ
- /usr/local: “ローカルで追加したもの” を置く場所（SIPの保護外）

### /usr/local の役割
- ユーザーや開発者が追加したソフトを置く慣習的な場所
- Intel MacのHomebrewは /usr/local を使うことが多い
- /usr/local/bin にCLIが入る

## /opt とは
- “Optional” の意図で、追加ソフトを入れるための場所
- Linuxではサードパーティ製品の配置先としてよく使われる
- macOSでも、独自インストーラが /opt を使うことがある

### /opt の使われ方（macOS）
- Apple SiliconのHomebrewは /opt/homebrew を使う
- Vagrantや他のサードパーティ製品が /opt 配下に入ることがある

## ざっくりまとめ
- /System, /usr/bin はOSが管理（基本的に触らない）
- /usr/local と /opt はユーザー/外部ツールの置き場所
- GUIアプリは /Applications、設定は ~/Library が多い

## コマンドの実体はどこにある？
### 基本ルール
- 実際に実行されるバイナリは **PATH に含まれるディレクトリ配下**にある
- `which` / `type` / `command -v` で実体の場所を確認できる

### 代表的な場所
- OS標準コマンド: `/usr/bin`, `/usr/sbin`
- 追加CLI（Intel）: `/usr/local/bin`
- 追加CLI（Apple Silicon / Homebrew）: `/opt/homebrew/bin`
- GUIアプリに同梱されたCLI: `/Applications/<App>.app/Contents/MacOS/`
- サードパーティの専用領域: `/opt/<tool>/bin`

### 確認コマンド
```bash
which <command>
type -a <command>
command -v <command>
ls -l "$(which <command>)"
```

## 自作CLI/スクリプトの置き場所
### 目的別のおすすめ
- 自分だけで使う: `~/.local/bin` か `~/bin`
- チーム/複数ユーザー: `/usr/local/bin`（管理者権限が必要）
- プロジェクト専用: `./scripts/` や `./bin/`（リポジトリ内）

### `~/.local` とは
- ユーザー個人専用のローカル領域として使われる慣習
- macOSでは標準で作成されないが、作って使うのは一般的

### 既存の `~/.local/bin` と干渉したくない場合
- `~/.local/mybin` のように **自分専用のサブディレクトリ**を作る
- PATH にはその専用ディレクトリだけを追加する
- ドットファイルリポの `bin/` をそこへシンボリックリンクする運用が安全

例:
```bash
mkdir -p ~/.local/mybin
echo 'export PATH="$HOME/.local/mybin:$PATH"' >> ~/.zshrc
```

PATH 追加例（zsh）:
```bash
mkdir -p ~/.local/bin
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
```

関連用語: XDG Base Directory（`topics/glossary.md`）

## 実用メモ
- どこに入っているか確認するなら:
```bash
which <command>
ls -l "$(which <command>)"
```
- Homebrewの場所:
```bash
brew --prefix
brew --repository
```
