# Firebase

## 概要
Firebaseは、Googleが提供するモバイルおよびウェブアプリケーション開発のためのプラットフォーム。バックエンドサービス、SDK、UIライブラリを通じて、開発者が迅速かつ効率的にアプリケーションを構築できるよう支援する。

**主な特徴：**
- サーバー管理の負担を軽減
- リアルタイム同期機能
- スケーラビリティ
- 多様な認証方法のサポート
- サーバーレス機能

## 主なサービス

### Cloud Firestore
- 柔軟でスケーラブルなNoSQLクラウドデータベース
- リアルタイム同期
- 複雑なクエリを避け、シンプルなクエリでデータを取得できるようにスキーマを設計することが推奨

### Realtime Database
- リアルタイムでデータを同期できるNoSQLクラウドデータベース
- JSON形式のデータストア

### Authentication
- メール・パスワード認証
- ソーシャルログイン（Google、Facebook、Twitter など）
- 電話番号認証
- 匿名認証

### Cloud Functions
- サーバーレスでバックエンドロジックを実行
- イベント駆動型の関数実行
- Node.js、Python、Go などに対応

### Hosting
- 静的および動的コンテンツのホスティングサービス
- CDN配信
- SSL証明書の自動管理

### Cloud Storage
- 画像や動画などのファイルを安全に保存・配信
- 大容量ファイルの保存に適している

## 初期設定

### Firebase CLIのインストール
```bash
# npm経由でインストール
npm install -g firebase-tools

# バージョン確認
firebase --version

# ログイン（Googleアカウントでログイン可能）
firebase login
# ブラウザが開き、Googleアカウントで認証する

# プロジェクト一覧の確認
firebase projects:list
```

### プロジェクトとは
Firebaseにおける**プロジェクト**は、アプリケーション全体を管理する単位です。1つのプロジェクトには以下のリソースが含まれます：
- データベース（Firestore、Realtime Database）
- 認証設定
- ストレージ
- ホスティング設定
- Cloud Functions
- その他のFirebaseサービス

プロジェクトはFirebaseコンソールで作成・管理でき、複数のアプリ（iOS、Android、Web）を1つのプロジェクトに紐付けることができます。

### プロジェクトの初期化
```bash
# プロジェクトディレクトリで初期化
firebase init

# 対話的に以下を選択：
# - 使用するサービス（Firestore、Hosting、Functions など）
# - プロジェクトの選択または新規作成
# - 設定ファイルの生成
```

### プロジェクトの設定ファイル
初期化後に以下のファイルが生成される：
- `firebase.json` - Firebaseサービスの設定
- `.firebaserc` - プロジェクト情報（RC = Run Command の略。プロジェクトIDとエイリアスを保存）
- `firestore.rules` - Firestoreセキュリティルール（Firestore使用時）
- `firestore.indexes.json` - Firestoreインデックス設定（Firestore使用時）

## Cloud Firestore

### データ構造
- **コレクション（Collection）**: データのコンテナ
- **ドキュメント（Document）**: コレクション内の個々のデータ
- **フィールド（Field）**: ドキュメント内のキー・バリューペア

```
users (コレクション)
  └── user1 (ドキュメント)
      ├── name: "田中太郎" (フィールド)
      ├── email: "tanaka@example.com"
      └── createdAt: Timestamp
```

### データベース設計のベストプラクティス
- **複雑なクエリを避ける**: 複雑なクエリでデータを加工するのではなく、適切に設計されたデータモデルとシンプルなクエリで対応
- **データの正規化と非正規化のバランス**: クエリパフォーマンスとデータ整合性のバランスを考慮
- **クライアントサイドでの結合を避ける**: 直列的な通信（複数回のClient Side Join）を防ぐため、データ構造を最適化

### セキュリティルール
```javascript
// firestore.rules の例
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 認証済みユーザーのみ読み書き可能
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 全ユーザーが読み取り可能、書き込みは認証済みユーザーのみ
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

```bash
# セキュリティルールのデプロイ
firebase deploy --only firestore:rules
```

## Authentication

### 認証方法の有効化
1. FirebaseコンソールでAuthenticationを開く
2. 「Sign-in method」タブから使用したい認証方法を有効化
3. 必要に応じて設定（ドメイン設定、APIキー設定など）

### 主要な認証方法
- **メール・パスワード**
- **Google**
- **Facebook**
- **Twitter**
- **電話番号**
- **匿名認証**

## Hosting

### 静的サイトのデプロイ
```bash
# ビルド（プロジェクトに応じて）
npm run build

# デプロイ
firebase deploy --only hosting

# プレビュー
firebase hosting:channel:deploy preview
```

### firebase.json の設定例
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=7200"
          }
        ]
      }
    ]
  }
}
```

## Cloud Functions

### Functionsの初期化
```bash
# Functionsを選択して初期化（firebase init で選択）
# または既存プロジェクトに追加
firebase init functions

# 言語選択（JavaScript/TypeScript）
# TypeScript推奨
```

### 関数の作成例
```typescript
// functions/src/index.ts
import * as functions from 'firebase-functions';

// HTTPトリガー
export const helloWorld = functions.https.onRequest((request, response) => {
  response.json({ message: 'Hello from Firebase!' });
});

// Firestoreトリガー（ドキュメント作成時）
export const onUserCreate = functions.firestore
  .document('users/{userId}')
  .onCreate((snap, context) => {
    const newValue = snap.data();
    console.log('New user created:', newValue);
    // 処理を実装
  });

// Firestoreトリガー（ドキュメント更新時）
export const onUserUpdate = functions.firestore
  .document('users/{userId}')
  .onUpdate((change, context) => {
    const beforeData = change.before.data();
    const afterData = change.after.data();
    console.log('User updated:', { beforeData, afterData });
    // 処理を実装
  });
```

### Functionsのデプロイ
```bash
# すべての関数をデプロイ
firebase deploy --only functions

# 特定の関数のみデプロイ
firebase deploy --only functions:helloWorld

# ローカルでエミュレーター実行（開発時）
firebase emulators:start --only functions
```

## Cloud Storage

### ストレージルール
```javascript
// storage.rules の例
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // 認証済みユーザーのみアップロード可能
    match /users/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 公開読み取り、書き込みは認証済みユーザーのみ
    match /public/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

```bash
# ストレージルールのデプロイ
firebase deploy --only storage
```

## よく使うコマンド

### プロジェクト管理
```bash
# ログイン
firebase login

# ログアウト
firebase logout

# プロジェクト一覧
firebase projects:list

# 現在のプロジェクトを設定
firebase use <project-id>

# プロジェクトの追加（エイリアス指定）
firebase use --add

# 現在のプロジェクト確認
firebase use
```

### デプロイ
```bash
# すべてのサービスをデプロイ
firebase deploy

# 特定のサービスのみデプロイ
firebase deploy --only hosting
firebase deploy --only firestore:rules
firebase deploy --only functions
firebase deploy --only storage

# プレビューチャネルにデプロイ（Hosting）
firebase hosting:channel:deploy preview
```

### エミュレーター（ローカル開発）
```bash
# すべてのエミュレーターを起動
firebase emulators:start

# 特定のエミュレーターのみ起動
firebase emulators:start --only firestore
firebase emulators:start --only functions
firebase emulators:start --only auth

# ポート指定
firebase emulators:start --port 9000

# UIを開く（デフォルト: http://localhost:4000）
# ブラウザで http://localhost:4000 にアクセス
```

### その他
```bash
# 設定ファイルの確認
cat firebase.json
cat .firebaserc

# サービス一覧の確認
firebase projects:list

# ログの確認（Cloud Functions）
firebase functions:log

# 特定の関数のログ
firebase functions:log --only helloWorld
```

## 料金・無料枠

### 無料枠（Spark プラン）
- Firestore: 読み取り 50,000回/日、書き込み 20,000回/日
- Storage: 5GB保存、1GB/日ダウンロード
- Hosting: 10GB保存、360MB/日転送
- Functions: 125,000回/月、40,000GB秒/月
- Authentication: 無料（制限なし）

**注意点：**
- 無料枠を超えると従量課金
- 本番運用前に料金を確認すること

## ベストプラクティス

### データベース設計
- 複雑なクエリを避け、シンプルなクエリで対応できるデータモデルを設計
- クライアントサイドでの複数回のクエリ（直列的な通信）を避ける
- データの正規化と非正規化のバランスを考慮

### パフォーマンス
- 画像のロード時間を考慮し、データ構造を最適化
- 必要最小限のデータのみ取得するクエリを設計
- インデックスを適切に設定

### セキュリティ
- セキュリティルールを必ず設定
- 認証を適切に実装
- クライアント側で機密情報を扱わない

### 開発フロー
- エミュレーターを活用したローカル開発
- ステージング環境とプロダクション環境を分離
- セキュリティルールのテストを実施

## トラブルシューティング

### デプロイエラー
- プロジェクトIDの確認
- ログイン状態の確認（`firebase login`）
- 権限の確認

### セキュリティルールエラー
- ルールの構文を確認
- エミュレーターでテスト
- デプロイ後のルールを確認

### エミュレーターの問題
- ポートの競合を確認
- エミュレーターを再起動
- ログを確認

## 参考リンク
- [Firebase公式ドキュメント](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase CLI リファレンス](https://firebase.google.com/docs/cli)
- [Firestore データモデル](https://firebase.google.com/docs/firestore/data-model)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Cloud Functions](https://firebase.google.com/docs/functions)

