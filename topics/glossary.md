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

## BaaS (Backend as a Service)
- **Backend as a Service** の略
- アプリケーションのバックエンド機能（データベース、認証、ストレージ、APIなど）をクラウド上で提供するサービス
- 開発者はサーバー管理やインフラ構築をせずに、バックエンド機能を利用できる
- 代表的なサービス:
  - Firebase (Google)
  - Supabase
  - AWS Amplify
  - Appwrite
  - Hasura
  - Backendless

## セルフホスティング (Self-hosting)
- 企業や個人が自らのサーバーやインフラ上でソフトウェアやサービスを運用すること
- クラウドプロバイダーのマネージドサービスではなく、自分でサーバーを管理・運用する
- **メリット:**
  - データの完全な管理とコントロール
  - カスタマイズ性が高い
  - コストが予測しやすい（固定費）
  - データの所在地を完全にコントロールできる（コンプライアンス対応）
- **デメリット:**
  - 運用・保守の責任を負う必要がある
  - スケーリングの管理が必要
  - セキュリティパッチの適用など、メンテナンスが必要
- 例: Supabase、Appwriteはセルフホスティング可能。Firebaseは不可。

## ベンダーロックイン (Vendor Lock-in)
- 特定のベンダーや製品に依存することで、他のベンダーや製品への移行が困難になる状態
- **リスク:**
  - コスト増加（移行コスト、継続的な利用コスト）
  - 技術的な柔軟性の低下
  - ベンダーの方針変更やサービス終了の影響を受けやすい
  - データやコードの移植性が低い
- **対策:**
  - オープンソースの技術を採用
  - 標準的なプロトコルやAPIを使用
  - セルフホスティング可能なサービスを選ぶ
  - 抽象化レイヤーを設けて、実装を交換可能にする
- 例: Firebaseはベンダーロックインが高い。Supabase（PostgreSQLベース）は低い。

## GraphQL
- **Graph Query Language** の略
- Facebook（現Meta）が開発した、APIのためのクエリ言語およびランタイム
- REST APIの代替として使用される
- **主な特徴:**
  - **単一エンドポイント**: 1つのエンドポイントで全てのデータを取得可能
  - **必要なデータのみ取得**: クライアントが必要なフィールドを指定して取得できる（オーバーフェッチングを防ぐ）
  - **型安全性**: スキーマ定義により、型安全なAPIを提供
  - **リアルタイム機能**: Subscriptionにより、リアルタイムデータ更新が可能
- **REST APIとの違い:**
  - REST: 複数のエンドポイント（`/users`, `/posts`など）でリソースを取得
  - GraphQL: 1つのエンドポイント（通常は`/graphql`）で、クエリで必要なデータを指定
- **メリット:**
  - オーバーフェッチング（不要なデータの取得）を防げる
  - アンダーフェッチング（複数回のAPI呼び出し）を1回のクエリで解決
  - フロントエンドとバックエンドの疎結合
  - 強力な型システム
- **デメリット:**
  - 学習曲線がやや高い
  - キャッシングが複雑（RESTのHTTPキャッシングほど単純ではない）
  - クエリの複雑さによってはパフォーマンス問題が発生する可能性
- **代表的な実装:**
  - Apollo Server / Apollo Client
  - Hasura（GraphQLエンジン）
  - Relay（Facebook製）
  - GraphQL Yoga

## Apollo Server
- GraphQL APIを構築するためのオープンソースのサーバーライブラリ
- Node.js環境で動作
- Apollo GraphQL（旧Meteor Development Group）が開発・メンテナンス
- **主な機能:**
  - スキーマ定義（GraphQLスキーマ）
  - リゾルバ（Resolver）の設定
  - データソースの統合
  - プラグインシステム（認証、ログ、キャッシングなど）
  - サブスクリプション（リアルタイム通信）のサポート
- **特徴:**
  - Express、Fastify、Koa、Lambdaなど、様々なフレームワークと統合可能
  - TypeScriptの型安全性を活用できる
  - 開発者ツール（Apollo Studio）との統合
  - パフォーマンス最適化機能（DataLoader、キャッシングなど）
- **Apollo Clientとの関係:**
  - Apollo Server: バックエンド（サーバー側）のGraphQL実装
  - Apollo Client: フロントエンド（クライアント側）のGraphQL実装
  - 両方を組み合わせて、エンドツーエンドのGraphQLアプリケーションを構築
- **使用例:**
  - 多くの企業やスタートアップで採用されている
  - GitHub、Netflix、Airbnb、PayPalなどがGraphQLを使用（Apollo Serverを直接使用しているかは不明）

## ストアドプロシージャ (Stored Procedure)
- データベースサーバー内に保存された、一連のSQL文をまとめたプログラム
- データベース内で定義・保存され、必要に応じて呼び出して実行する
- **主な特徴:**
  - **再利用性**: 一度定義すれば、何度でも呼び出し可能
  - **パフォーマンス**: データベースサーバー側で実行されるため、ネットワーク通信が少なく高速
  - **セキュリティ**: アプリケーションから直接SQLを実行せず、プロシージャ経由でアクセスできる
  - **ビジネスロジックの集約**: 複雑な処理をデータベース側に集約できる
- **メリット:**
  - ネットワーク通信の削減（複数のSQL文を1回の呼び出しで実行）
  - SQLインジェクション攻撃のリスク低減
  - ビジネスロジックの一元管理
  - トランザクション処理の簡素化
- **デメリット:**
  - データベースに依存するため、移植性が低い場合がある
  - デバッグが難しい場合がある
  - バージョン管理が複雑になる場合がある
- **使用例:**
  ```sql
  -- PostgreSQLの例
  CREATE OR REPLACE FUNCTION get_user_orders(user_id INTEGER)
  RETURNS TABLE(order_id INTEGER, order_date DATE, total_amount DECIMAL)
  AS $$
  BEGIN
    RETURN QUERY
    SELECT o.id, o.order_date, o.total
    FROM orders o
    WHERE o.user_id = get_user_orders.user_id;
  END;
  $$ LANGUAGE plpgsql;
  ```
- **対応データベース:**
  - PostgreSQL（PL/pgSQL）
  - MySQL（ストアドプロシージャ、ストアドファンクション）
  - SQL Server（T-SQL）
  - Oracle（PL/SQL）
- **注意:** NoSQLデータベース（Firestore、MongoDBなど）では、ストアドプロシージャの概念が異なるか、存在しない場合がある
