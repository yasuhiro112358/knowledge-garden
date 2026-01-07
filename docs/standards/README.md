## Engineering Standards（運用規格）

このフォルダは、Knowledge Gardenで横断的に再利用できる「標準（Standards）」を集約します。各文書は業界の慣習に沿い、規格文書としての体裁・用語を用います。

### 文書の体裁

- 文書ID: `KG-STD-000x`（ゼロ埋め連番）
- バージョン: `vMAJOR.MINOR`（破壊的変更で MAJOR を上げる）
- 状態: Draft / Active / Deprecated
- 変更管理: Pull Request で改版（CHANGELOG を各標準内に記載）
- 用語（RFC 2119 準拠）:
  - MUST / MUST NOT / SHOULD / SHOULD NOT / MAY を規範語として使用

### 目次

- KG-STD-0001: Docker Compose 標準（compose.yaml/override/prod）

### 参考

- Compose Specification
- Docker Official Docs
- Twelve-Factor App
- OWASP ASVS / Top 10（関連箇所のみ）

今後、CI/CD、ブランチ戦略、セキュリティ、ドキュメント、ADR 運用などの標準も追加していきます。


