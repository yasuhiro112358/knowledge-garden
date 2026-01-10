# Useful Commands

## ターミナル・Shell

### ディレクトリ操作
```bash
# カレントディレクトリの内容表示
ls -la

# ディレクトリ移動
cd /path/to/directory

# ディレクトリ作成
mkdir -p path/to/new/directory

# ファイル・ディレクトリ削除
rm -rf directory_name
```

### ファイル操作
```bash
# ファイル内容表示
cat filename
less filename

# ファイル検索
find . -name "*.md"
grep -r "search_term" .

# ファイルコピー・移動
cp source destination
mv source destination
```

## Git

```bash
# 差分確認
git diff
git diff --staged

# ログ確認
git log --oneline
git log --graph

# リセット
git reset --hard HEAD~1
git reset --soft HEAD~1

# スタッシュ
git stash
git stash pop
```

## Docker

```bash
# クリーンアップ
docker system prune
docker image prune

# ログ確認
docker logs container_name

# コンテナ内に入る
docker exec -it container_name bash
```

## macOS

```bash
# Homebrew
brew update && brew upgrade
brew search package_name

# プロセス確認・終了
ps aux | grep process_name
kill -9 PID
```

## 開発環境

### Node.js
```bash
# パッケージ管理
npm install
npm run build
npm run dev

# バージョン管理
nvm use 18
nvm install latest
```

### Python
```bash
# 仮想環境
python -m venv venv
source venv/bin/activate

# パッケージ管理
pip install -r requirements.txt
pip freeze > requirements.txt
```
