# BaaS (Backend as a Service) 技術比較

## BaaSとは

**BaaS (Backend as a Service)** は、アプリケーションのバックエンド機能（データベース、認証、ストレージ、APIなど）をクラウド上で提供するサービスです。開発者はサーバー管理やインフラ構築をせずに、バックエンド機能を利用できます。

**BaaSの主な特徴：**
- サーバー管理の負担を軽減
- 迅速な開発とプロトタイピング
- スケーラビリティの自動対応
- リアルタイム機能の簡単な実装
- 多様な認証方法のサポート
- サーバーレス機能

詳細は `topics/glossary.md` の「BaaS」を参照。

## 主要なBaaSサービス一覧

| サービス | プロバイダー | 設立年 | データベース | オープンソース | セルフホスティング |
|---------|------------|--------|------------|--------------|-----------------|
| **Firebase** | Google | 2011年 | NoSQL (Firestore) | 一部のみ | 不可 |
| **Supabase** | Supabase Inc. | 2020年 | PostgreSQL | 完全OSS | 可能 |
| **AWS Amplify** | AWS | 2017年 | DynamoDB, RDS, Aurora | 一部のみ | 不可 |
| **Appwrite** | Appwrite Inc. | 2019年 | MariaDB, MySQL, PostgreSQL | 完全OSS | 可能 |
| **Hasura** | Hasura Inc. | 2018年 | PostgreSQL, MySQL, SQL Server | 完全OSS | 可能 |

## BaaSサービス比較

### 総合比較表

| 項目 | Firebase | Supabase | AWS Amplify | Appwrite | Hasura |
|------|----------|----------|-------------|----------|--------|
| **データベース** | NoSQL (Firestore) | PostgreSQL | DynamoDB, RDS, Aurora | MariaDB, MySQL, PostgreSQL | PostgreSQL, MySQL, SQL Server |
| **API形式** | REST/リアルタイム | REST/GraphQL | REST/GraphQL | REST | GraphQL |
| **リアルタイム機能** | あり | あり | あり | あり | GraphQL Subscription |
| **認証** | 充実 | 充実 | Cognito統合 | 充実 | 外部認証統合 |
| **ストレージ** | あり | あり | S3 | あり | なし |
| **Functions** | Cloud Functions | Edge Functions | Lambda | Cloud Functions | Actions |
| **オープンソース** | 一部のみ | 完全OSS | 一部のみ | 完全OSS | 完全OSS |
| **セルフホスティング** | 不可 | 可能 | 不可 | 可能（Docker） | 可能 |
| **SQLクエリ** | 不可 | 可能 | 可能（RDS使用時） | 可能 | 可能 |
| **ベンダーロックイン** | 高い | 低い（PostgreSQL標準） | 高い（AWS依存） | 低い | 低い |
| **学習曲線** | 緩やか | 緩やか | やや高め（AWS知識） | 緩やか | GraphQL知識必要 |
| **コスト** | 従量課金 | 従量課金 | 従量課金（AWS料金） | セルフホスティングなら無料 | 従量課金 |
| **成熟度** | 高い | 中程度 | 高い | 中程度 | 中程度 |
| **コミュニティ** | 大きい | 成長中 | 大きい | 成長中 | 成長中 |

### 技術選定の判断基準

**Firebaseを選ぶべき場合:**
- 迅速な開発とプロトタイピング
- Googleエコシステムとの統合
- 充実したドキュメントとコミュニティ
- リアルタイム機能の簡単な実装
- 小規模〜中規模のアプリケーション
- 複雑なクエリや集計処理が不要

**Supabaseを選ぶべき場合:**
- SQLクエリやリレーショナルデータが必要
- PostgreSQLの標準機能を活用したい
- オープンソース重視
- ベンダーロックインを避けたい
- セルフホスティングの可能性を残したい
- Firebaseの代替として検討している

**AWS Amplifyを選ぶべき場合:**
- 既存のAWSインフラとの統合
- AWSの他のサービス（EC2、RDS、Lambdaなど）と組み合わせたい
- 高いカスタマイズ性が必要
- エンタープライズレベルの要件

**Appwriteを選ぶべき場合:**
- 完全にセルフホスティングしたい
- データの完全なコントロールが必要
- オンプレミスやプライベートクラウドでの運用
- コストを完全にコントロールしたい

**Hasuraを選ぶべき場合:**
- GraphQL APIが必要
- 既存のPostgreSQLデータベースがある
- リアルタイムSubscriptionが必要
- フロントエンドとの統合を柔軟にしたい

## 各サービスの詳細

### Firebase
Googleが提供するモバイルおよびウェブアプリケーション開発のためのプラットフォーム。バックエンドサービス、SDK、UIライブラリを通じて、開発者が迅速かつ効率的にアプリケーションを構築できるよう支援する。

**主な特徴：**
- サーバー管理の負担を軽減
- リアルタイム同期機能
- スケーラビリティ
- 多様な認証方法のサポート
- サーバーレス機能

**詳細な使い方:** Firebase特有の詳細な使い方やコマンドについては `topics/firebase.md` を参照。

### Supabase
**概要**: オープンソースのFirebase代替。PostgreSQLベースのリアルタイムデータベース。2020年設立（Firebaseより後発）。

**主な特徴:**
- PostgreSQLベースのリレーショナルデータベース
- 完全オープンソース
- セルフホスティング可能
- SQLクエリが可能
- ベンダーロックインが低い（PostgreSQL標準）

**選定のポイント:**
- SQLクエリやリレーショナルデータが必要な場合に適している
- オープンソースでセルフホスティング可能なため、ベンダーロックインを避けたい場合に有利
- Firebaseはより成熟しており、エコシステムが大きい

### AWS Amplify
**概要**: AWSが提供するフルスタック開発プラットフォーム。2017年リリース。

**主な特徴:**
- AWSエコシステムとの統合
- 高いカスタマイズ性
- DynamoDB、RDS、Auroraなど複数のデータベース選択肢
- AWS知識が必要

**選定のポイント:**
- 既存のAWSインフラとの統合が容易
- AWSの他のサービス（EC2、RDS、Lambdaなど）と組み合わせやすい
- Firebaseはよりシンプルで学習コストが低い

### Appwrite
**概要**: オープンソースのセルフホスティング可能なバックエンドプラットフォーム。2019年設立。

**主な特徴:**
- 完全オープンソース
- Dockerによるセルフホスティング
- 複数のデータベース対応（MariaDB, MySQL, PostgreSQL）
- データの完全なコントロール

**選定のポイント:**
- 完全にセルフホスティングしたい場合
- オンプレミスやプライベートクラウドでの運用
- データの完全なコントロールが必要

### Hasura
**概要**: GraphQLエンジンを提供するバックエンドプラットフォーム。2018年設立。

**主な特徴:**
- GraphQL API
- PostgreSQL、MySQL、SQL Server対応
- GraphQL Subscriptionによるリアルタイム機能
- セルフホスティング可能

**選定のポイント:**
- GraphQL APIが必要
- 既存のPostgreSQLデータベースがある場合に適している
- フロントエンドとの統合を柔軟にしたい

## 料金・無料枠比較

### Firebase（Spark プラン - 無料枠）
- Firestore: 読み取り 50,000回/日、書き込み 20,000回/日
- Storage: 5GB保存、1GB/日ダウンロード
- Hosting: 10GB保存、360MB/日転送
- Functions: 125,000回/月、40,000GB秒/月
- Authentication: 無料（制限なし）

### Supabase（無料枠）
- データベース: 500MB、2GB転送/月
- 認証: 50,000 MAU（Monthly Active Users）
- ストレージ: 1GB、2GB転送/月
- Edge Functions: 500,000回/月

### AWS Amplify
- 無料枠あり（AWS Free Tier）
- 従量課金（AWS料金体系）
- 各サービス（Lambda、DynamoDB、S3など）の料金が個別に発生

### Appwrite
- セルフホスティングなら無料（インフラコストのみ）
- クラウド版は有料プランあり

### Hasura
- 無料枠あり（Cloud版）
- セルフホスティングなら無料（インフラコストのみ）

**注意点：**
- 無料枠を超えると従量課金になるサービスが多い
- 本番運用前に料金を確認すること
- トラフィック増加に伴いコストが急増する可能性があるため、コスト監視が重要
- セルフホスティング可能なサービスは、インフラコストのみで運用可能

## 参考リンク

### Firebase
- [Firebase公式ドキュメント](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase CLI リファレンス](https://firebase.google.com/docs/cli)
- [Firestore データモデル](https://firebase.google.com/docs/firestore/data-model)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Cloud Functions](https://firebase.google.com/docs/functions)

### Supabase
- [Supabase公式ドキュメント](https://supabase.com/docs)
- [Supabase GitHub](https://github.com/supabase/supabase)

### AWS Amplify
- [AWS Amplify公式ドキュメント](https://docs.amplify.aws/)

### Appwrite
- [Appwrite公式ドキュメント](https://appwrite.io/docs)
- [Appwrite GitHub](https://github.com/appwrite/appwrite)

### Hasura
- [Hasura公式ドキュメント](https://hasura.io/docs/)
- [Hasura GitHub](https://github.com/hasura/graphql-engine)

