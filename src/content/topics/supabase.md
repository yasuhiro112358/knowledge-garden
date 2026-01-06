# Supabase

## 概要

Supabaseは、オープンソースのバックエンドプラットフォームで、**PostgreSQLを基盤とした**リレーショナルデータベース、認証、ストレージ、リアルタイム通信などの機能を提供します。Firebaseのオープンソース代替として2020年に設立されました。

**Supabaseの特徴:**
- PostgreSQLベースの標準的なRDB（リレーショナルデータベース）
- 完全オープンソース
- セルフホスティング可能
- SQLクエリが直接実行可能
- ベンダーロックインが低い

BaaS全般の比較については `topics/baas.md` を参照。

## なぜSupabaseを選ぶのか？

### RDB（リレーショナルデータベース）にこだわる場合

Supabaseは、**大切なデータを管理する方向に進みたい場合の定番**です。

**Supabaseが適している場合:**
- SQLクエリやリレーショナルデータが必要
- トランザクション、外部キー制約、ストアドプロシージャなど、RDBの標準機能をフル活用したい
- データの整合性を重視する
- オープンソース重視
- ベンダーロックインを避けたい
- セルフホスティングの可能性を残したい

**Firebaseとの違い:**
- Firebase: NoSQL（Firestore）→ 複雑なクエリやJOINが苦手
- Supabase: PostgreSQL（RDB）→ 標準的なSQLが使える

## 主な機能

### 1. Database（データベース）
- **PostgreSQLベース**のリレーショナルデータベース
- 標準的なSQLクエリが直接実行可能
- トランザクション、外部キー制約、ストアドプロシージャなど、RDBの標準機能をフル活用可能
- リアルタイム同期機能
- 自動バックアップ

### 2. Authentication（認証）
- メール・パスワード認証
- OAuth認証（Google、GitHub、Twitter、Facebookなど）
- マジックリンク（パスワードレス認証）
- 電話番号認証（SMS）
- ユーザー管理機能

### 3. Storage（ストレージ）
- 画像や動画などのファイルを保存・管理
- バケット（フォルダ）単位での管理
- アクセス制御（公開/非公開）
- CDN配信

### 4. Realtime（リアルタイム）
- データベースの変更をリアルタイムで監視
- WebSocketベースのリアルタイム通信
- チャットや通知機能の実装に適している

### 5. Edge Functions（エッジ関数）
- サーバーレス関数を作成
- Denoランタイムで実行
- TypeScript/JavaScriptで記述可能
- グローバルに分散配置

## 初期設定

### アカウント作成とプロジェクト作成

1. [Supabase公式サイト](https://supabase.com/)にアクセス
2. GitHubアカウントでサインアップ（推奨）
3. 「New Project」をクリック
4. プロジェクト情報を入力：
   - プロジェクト名
   - データベースパスワード（重要：忘れないように保存）
   - リージョン（最寄りのリージョンを選択）
5. プロジェクトが作成されるまで数分待つ

### プロジェクト情報の確認

プロジェクト作成後、以下の情報が表示されます：
- **Project URL**: `https://xxxxx.supabase.co`
- **publishable key**（旧: anon key）: 公開キー（フロントエンドで使用）
- **secret key**（旧: service_role key）: 秘密キー（サーバーサイドでのみ使用、絶対に公開しない）

**重要:** 2025年5月1日から、SupabaseのAPIキーの名称が変更されました：
- `anon key` → `publishable key`
- `service_role key` → `secret key`

新規プロジェクトでは新しい名称が使用されます。既存プロジェクトは2025年9月末までに移行が必要です。

**確認方法:**
1. [Supabase Dashboard](https://app.supabase.com/)にログイン
2. 対象のプロジェクトを選択
3. 左サイドバーの「Settings」（⚙️アイコン）をクリック
4. 「DataAPI」をクリック
5. 「API Settings」セクションを開く
6. 以下の情報が表示されます：
   - **Project URL**: `https://xxxxx.supabase.co` の形式で表示（例: `https://grkhkggdojecgqdzdoku.supabase.co`）
   - **publishable key**（旧: anon key）: 「Project API keys」セクションの「publishable」に表示
   - **secret key**（旧: service_role key）: 「Project API keys」セクションの「secret」に表示（「Reveal」ボタンをクリックして表示）

**注意:**
- `secret key`（旧: service_role key）は管理者権限を持つため、**絶対にフロントエンドコードや公開リポジトリに含めない**こと
- `publishable key`（旧: anon key）は公開しても問題ないが、RLS（Row Level Security）で適切に保護されていることが前提

### Supabase CLIのインストール

**必須ではありませんが、以下の場合は推奨されます：**
- ローカル開発環境を構築したい場合
- データベースのマイグレーションを管理したい場合
- オフラインで開発・テストを行いたい場合
- 本格的な開発を行う場合

**クラウド上で直接開発する場合は不要:**
- Supabaseダッシュボードから直接操作可能
- ブラウザ上でSQL EditorやTable Editorを使用可能

**インストール方法（ローカルPCにインストール）:**

**macOSの場合（Homebrew推奨）:**

```bash
# Homebrew経由でインストール
brew install supabase/tap/supabase

# バージョン確認（インストールが成功したか確認）
supabase --version
```

**インストール後の設定:**

```bash
# Supabaseアカウントにログイン（ブラウザが開く）
supabase login

# プロジェクト一覧の確認
supabase projects list
```

**ローカル開発環境の起動:**

```bash
# ローカル環境の初期化
supabase init

# ローカル環境の起動（Dockerが必要）
supabase start

# ローカル環境の停止
supabase stop
```

**作成されるファイル・ディレクトリ:**

`supabase init`を実行すると、プロジェクトディレクトリ内に以下のファイル・ディレクトリが作成されます：

```
プロジェクトディレクトリ/
└── supabase/
    ├── config.toml          # プロジェクトの設定ファイル（ポート番号、サービス設定など）
    ├── migrations/          # データベースのマイグレーションファイル（スキーマ変更を管理）
    │   └── (マイグレーションファイル)
    └── seed.sql             # 初期データを挿入するためのSQLスクリプト（オプション）
```

**各ファイルの説明:**
- **`config.toml`**: ローカル環境の設定ファイル。ポート番号、データベース設定、API設定などが記述されます
- **`migrations/`**: データベーススキーマの変更履歴を管理するディレクトリ。`supabase db commit`でマイグレーションファイルを生成できます
- **`seed.sql`**: 開発環境用の初期データを挿入するSQLスクリプト（存在しない場合もあります）

**注意:**
- `supabase init`は現在のディレクトリに`supabase/`ディレクトリを作成します
- 既存のプロジェクトに`supabase init`を実行すると、既存のファイルは上書きされません
- `supabase start`を実行すると、Dockerコンテナが起動し、これらの設定に基づいてSupabaseサービスが立ち上がります

## 基本的な使い方

### データベースの操作

#### テーブルの作成

Supabaseダッシュボードの「Table Editor」からGUIで作成するか、SQL EditorでSQLを実行：

```sql
-- ユーザーテーブルの作成例
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 投稿テーブルの作成例（外部キー制約あり）
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### データの挿入・取得

**JavaScript/TypeScriptの例:**

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xxxxx.supabase.co'
const supabaseKey = 'your-publishable-key' // 旧: anon key

const supabase = createClient(supabaseUrl, supabaseKey)

// データの挿入
const { data, error } = await supabase
  .from('users')
  .insert([
    { email: 'user@example.com', name: '田中太郎' }
  ])

// データの取得
const { data, error } = await supabase
  .from('users')
  .select('*')

// 条件付き取得
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('email', 'user@example.com')

// JOIN（リレーション）
const { data, error } = await supabase
  .from('posts')
  .select(`
    *,
    users (*)
  `)
```

### 認証の実装

#### ユーザー登録

```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure-password'
})
```

#### ログイン

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'secure-password'
})
```

#### ログアウト

```typescript
const { error } = await supabase.auth.signOut()
```

#### 現在のユーザー情報の取得

```typescript
const { data: { user } } = await supabase.auth.getUser()
```

### リアルタイム機能

```typescript
// テーブルの変更をリアルタイムで監視
const subscription = supabase
  .channel('posts')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'posts' },
    (payload) => {
      console.log('新しい投稿:', payload.new)
    }
  )
  .subscribe()

// 購読を解除
subscription.unsubscribe()
```

### ストレージの操作

#### ファイルのアップロード

```typescript
const { data, error } = await supabase.storage
  .from('avatars')
  .upload('user-avatar.jpg', file)

// 公開URLの取得
const { data } = supabase.storage
  .from('avatars')
  .getPublicUrl('user-avatar.jpg')
```

#### ファイルのダウンロード

```typescript
const { data, error } = await supabase.storage
  .from('avatars')
  .download('user-avatar.jpg')
```

## Row Level Security (RLS)

Supabaseでは、**Row Level Security（行レベルセキュリティ）**を使用して、データベースレベルでアクセス制御を行います。

### RLSの有効化

```sql
-- テーブルにRLSを有効化
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
```

### ポリシーの作成

```sql
-- 認証済みユーザーが自分の投稿のみ読み取り可能
CREATE POLICY "Users can view own posts"
ON posts FOR SELECT
USING (auth.uid() = user_id);

-- 認証済みユーザーが自分の投稿のみ作成可能
CREATE POLICY "Users can insert own posts"
ON posts FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 認証済みユーザーが自分の投稿のみ更新可能
CREATE POLICY "Users can update own posts"
ON posts FOR UPDATE
USING (auth.uid() = user_id);
```

## よく使うコマンド

### Supabase CLI

```bash
# ローカル開発環境の起動
supabase start

# ローカル開発環境の停止
supabase stop

# データベースのマイグレーション
supabase db push

# データベースのリセット
supabase db reset

# ログの確認
supabase logs
```

### SQL Editorでの操作

Supabaseダッシュボードの「SQL Editor」で直接SQLを実行できます：

```sql
-- テーブル一覧の確認
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- テーブル構造の確認
\d users

-- データの確認
SELECT * FROM users LIMIT 10;
```

## ベストプラクティス

### データベース設計

- **正規化**: 適切に正規化されたテーブル設計
- **インデックス**: よく検索されるカラムにインデックスを設定
- **外部キー制約**: データの整合性を保つために外部キー制約を使用
- **UUID**: 主キーにはUUIDを使用（`gen_random_uuid()`）

### セキュリティ

- **RLS（Row Level Security）**: 必ず有効化して、適切なポリシーを設定
- **APIキーの管理**: `publishable key`（旧: anon key）は公開しても良いが、`secret key`（旧: service_role key）は絶対に公開しない
- **パスワードポリシー**: 強力なパスワードポリシーを設定

### パフォーマンス

- **インデックスの活用**: よく検索されるカラムにインデックスを設定
- **クエリの最適化**: 不要なデータを取得しない（`select`で必要なカラムのみ指定）
- **接続プール**: 本番環境では接続プールを適切に設定

### 開発フロー

- **ローカル開発**: Supabase CLIを使用してローカル環境を構築
- **マイグレーション**: データベーススキーマの変更はマイグレーションファイルで管理
- **環境変数**: プロジェクト情報は環境変数で管理

## 料金・無料枠

### 無料枠（Free プラン）
- データベース: 500MB、2GB転送/月
- 認証: 50,000 MAU（Monthly Active Users）
- ストレージ: 1GB、2GB転送/月
- Edge Functions: 500,000回/月
- リアルタイム: 200同時接続

**注意点:**
- 無料枠を超えると従量課金
- 本番運用前に料金を確認すること
- セルフホスティングも可能（インフラコストのみ）

## セルフホスティング

Supabaseは完全オープンソースのため、セルフホスティングが可能です。

```bash
# Docker Composeを使用したセルフホスティング
git clone --depth 1 https://github.com/supabase/supabase
cd supabase/docker
cp .env.example .env
docker-compose up -d
```

**セルフホスティングのメリット:**
- データの完全なコントロール
- コストの完全な管理
- カスタマイズ性が高い

**セルフホスティングのデメリット:**
- 運用・保守の責任を負う必要がある
- スケーリングの管理が必要

## トラブルシューティング

### よくある問題

**RLSポリシーでデータが取得できない**
- ポリシーが正しく設定されているか確認
- `auth.uid()`が正しく取得できているか確認

**接続エラー**
- プロジェクトURLとAPIキーが正しいか確認
- ネットワーク接続を確認

**パフォーマンス問題**
- インデックスが適切に設定されているか確認
- クエリが最適化されているか確認

## 参考リンク

- [Supabase公式ドキュメント](https://supabase.com/docs)
- [Supabase GitHub](https://github.com/supabase/supabase)
- [Supabase Dashboard](https://app.supabase.com/)
- [Supabase CLI リファレンス](https://supabase.com/docs/reference/cli)
- [PostgreSQL公式ドキュメント](https://www.postgresql.org/docs/)

## 次のステップ

1. **プロジェクトを作成**: Supabaseダッシュボードでプロジェクトを作成
2. **テーブルを作成**: SQL Editorでテーブルを作成
3. **認証を実装**: ユーザー登録・ログイン機能を実装
4. **RLSを設定**: セキュリティポリシーを設定
5. **リアルタイム機能を実装**: リアルタイム同期を実装

