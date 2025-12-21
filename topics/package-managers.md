# パッケージ管理ツール

最終確認日: 2025-12-21

## 分類（ざっくり）
- OSパッケージ管理: OS全体にソフトを入れる（例: brew/apt/dnf/pacman/winget）
- 言語/ランタイム管理: バージョンや依存関係を管理（例: asdf/mise/nvm/pyenv）
- アプリ配布: GUIアプリ中心（例: brew cask/winget/Chocolatey）
- コンテナ: 実行環境をパッケージ化（例: Docker）

## OS別の定番（超ざっくり）
- macOS: Homebrew（CLI/GUIアプリどちらも扱える）
- Windows: WinGet（公式） / Chocolatey（コミュニティ）
- Debian/Ubuntu: APT（apt）
- Fedora/RHEL: DNF
- Arch: pacman

関連ノート: `topics/homebrew.md`

## まず覚える基本コマンド（最小セット）
macOS (Homebrew):
```bash
brew update
brew install <pkg>
brew upgrade
brew uninstall <pkg>
brew search <pkg>
```

Windows (WinGet / Chocolatey):
```powershell
winget search <pkg>
winget install <pkg>
winget upgrade --all
winget uninstall <pkg>

choco search <pkg>
choco install <pkg> -y
choco upgrade all -y
choco uninstall <pkg>
```

Debian/Ubuntu (APT):
```bash
sudo apt update
sudo apt install <pkg>
sudo apt upgrade
sudo apt remove <pkg>
apt search <pkg>
```

Fedora/RHEL (DNF):
```bash
sudo dnf install <pkg>
sudo dnf upgrade
sudo dnf remove <pkg>
dnf search <pkg>
```

Arch (pacman):
```bash
sudo pacman -Syu
sudo pacman -S <pkg>
sudo pacman -Rns <pkg>
pacman -Ss <pkg>
```

## 選定の指針（パッケージ管理編）
- まずOS標準を使う（情報・サポートが多い）
- チーム/案件で指定がある場合はそれに合わせる
- GUIアプリ中心なら brew cask / winget / choco が便利
- 開発環境の再現性は Docker / asdf / mise などで補強

## よくある落とし穴
- OSパッケージと言語パッケージが混在してPATH競合する
- グローバルに入れたCLIのバージョンが環境ごとにズレる
- Windowsは管理者権限や実行ポリシーで詰まることがある

## 参考リンク
- Homebrew: https://brew.sh/ / https://docs.brew.sh/Installation.html
- WinGet: https://learn.microsoft.com/windows/package-manager/winget/
- Chocolatey: https://docs.chocolatey.org/en-us/choco/setup/
- APT (Debian): https://wiki.debian.org/Apt
- DNF (Fedora): https://docs.fedoraproject.org/quick-docs/dnf/
- pacman (Arch): https://man.archlinux.org/man/pacman
