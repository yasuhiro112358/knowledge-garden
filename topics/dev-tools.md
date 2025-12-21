# 開発ツール定番まとめ

## 目的 / 観点
- OSの対応状況
- 定番度（どの層・用途でよく使われるか）
- ツールの種類（何を解決するか）
- 競合/代替（乗り換え候補）

最終確認日: 2025-12-21

凡例（定番度）:
- ◎: 事実上の標準 / 選定率が高い
- ○: よく使われる定番
- △: 用途や環境次第

## パッケージ管理ツール（詳細）
別ファイルに整理: `topics/package-managers.md`

## 超定番リスト（これだけは使っておけ）
※ 「定番」は開発者調査の利用率データを根拠にしている。

| カテゴリ | ツール | なぜ超定番か | 競合/補足 |
| --- | --- | --- | --- |
| バージョン管理 | Git | 開発者調査でGitが圧倒的に使われている | 競合はSVNなど（ただし比率は小さい） |
| エディタ/IDE | Visual Studio Code | 2023調査で最も利用されるIDE | JetBrains系、Vim/Neovim、Visual Studio |
| コンテナ | Docker | 主要な開発ツールの中で利用率が高い | Podman, Rancher Desktop |
| ホスティング | GitHub | 主要なバージョン管理プラットフォームで利用率が最も高い | GitLab, Bitbucket |
| パッケージ管理 | Homebrew / APT / Chocolatey など | OS標準/代表的なパッケージ管理が広く使われている | OSごとの標準に合わせる |

根拠メモ（調査データ）:
- Git利用率とGitHubの利用率が高い（Stack Overflow Developer Survey 2022）。
- VS CodeがIDEで最も利用されている（Stack Overflow Developer Survey 2023）。
- Dockerが開発ツールとして高い利用率に含まれる（Stack Overflow Developer Survey 2023）。
- Homebrew / APT / Chocolatey などが開発ツールの利用一覧に含まれる（Stack Overflow Developer Survey 2023）。

## インストール済みツールの整理
※ OS要件は変わるため、導入時に公式サイトの最新情報を確認する。

| ツール | 種類 | 主用途 | OS対応 | 定番度 | 競合/代替 |
| --- | --- | --- | --- | --- | --- |
| MAMP | ローカルWeb開発環境（Apache/MySQL/PHP） | PHP系のローカル開発 | macOS / Windows | ○ | XAMPP, Laravel Herd, Laravel Valet, Docker, Local (Flywheel), Devilbox |
| DBeaver | DBクライアント（GUI） | 複数DBの統合管理・SQL実行 | Windows / macOS / Linux | ◎ | JetBrains DataGrip, TablePlus, MySQL Workbench, pgAdmin, Sequel Ace |
| FileZilla | FTP/SFTPクライアント | ファイル転送 | Windows / macOS / Linux | ○ | Cyberduck, WinSCP, Transmit, ForkLift |
| Docker | コンテナ実行基盤 | 開発環境の再現性・分離 | Desktop: macOS / Windows / Linux, Engine: Linux | ◎ | Podman, Rancher Desktop, Colima, Lima |

## OS要件メモ（公式ドキュメントの要点）
- MAMP: macOS 11+ / Windows 10+。
- DBeaver: Windows 10+ / Windows Server 2016+ / macOS 11+。Linuxは主要ディストリで提供。
- FileZilla Client: macOSは OS X 10.9+。Windows/Linux向けの手順あり。
- Docker Desktop: macOSは「最新+2」まで、Windowsはサポート期間内の Windows 10/11、Linuxは対応ディストリ。Docker Engineは Linux 向け。

## 追加で押さえておきたい定番カテゴリ
※ ここは「候補の棚卸し」。必要になったら各ツールの OS 対応と競合を深掘りする。

### エディタ / IDE
- VS Code（定番）
- JetBrains（IntelliJ / WebStorm / PyCharm など）
- Cursor, Zed

### ターミナル / シェル
- iTerm2（macOS）, Windows Terminal（Windows）
- zsh / fish / bash

### バージョン管理
- Git（必須）
- GUI: Sourcetree, GitKraken, Fork

### パッケージ / ランタイム管理
- Homebrew（macOS）, winget/Chocolatey（Windows）
- asdf, mise, nvm, pyenv

### API / HTTP クライアント
- Postman（定番）, Insomnia, HTTPie

### DB / データ管理
- 各DB公式GUI（MySQL Workbench, pgAdmin）
- 軽量GUI（TablePlus, Sequel Ace）

### 仮想化 / 開発環境
- Docker Desktop / Colima / Podman
- UTM / Parallels / VirtualBox

### SSH / SFTP
- OpenSSH（標準）
- GUI: FileZilla, Cyberduck, WinSCP

### ドキュメント / 図
- Obsidian（ナレッジ管理）
- Mermaid, Excalidraw, draw.io

## 選定の指針（メモ）
- 迷ったら「定番」を使う（学習コストが低く、情報が多い）
- 仕事/案件で指定がある場合はそのツールに合わせる
- GUIとCLIを併用すると効率が上がる（例: DBeaver + mysql/psql）
- チームで共有するなら OS 対応とライセンスを先に確認する
