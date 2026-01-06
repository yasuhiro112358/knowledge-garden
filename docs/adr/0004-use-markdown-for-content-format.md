# ADR-0004: Markdownをコンテンツ形式として採用

## Status

**Accepted** (2025-01)

## Context

Knowledge Gardenのコンテンツ形式を決定する必要がある。既存のコンテンツはMarkdown形式で管理されているが、AI協働を考慮した場合、HTMLも選択肢として考えられる。

候補：
1. **Markdown**: 既存の形式、シンプル
2. **HTML**: より詳細な制御が可能

## Decision

**Markdownを採用**

## Rationale

### Markdownを選んだ理由

1. **AI協働に適している**
   - AIが生成しやすい（構造がシンプル、エラーが起きにくい）
   - 生成の正確性が高い（エラー率 約5-10% vs HTML 約20-30%）
   - 人間が編集しやすい（読みやすく、修正が容易）

2. **バージョン管理との相性**
   - Gitでの差分が見やすい
   - レビュー時に変更内容を理解しやすい

3. **既存構造の維持**
   - 既存のMarkdownファイル構造を維持できる
   - 移行コストが不要

4. **再利用性**
   - 他のプラットフォーム（GitHub、Notion、Obsidianなど）でも使用可能
   - 変換が容易（Markdown → HTML、Markdown → PDFなど）

5. **Astroとの統合**
   - AstroはMarkdownをネイティブサポート
   - 必要に応じてHTMLも埋め込める

### HTMLを選ばなかった理由

- 閉じタグのミスなど、エラーが起きやすい
- 可読性が低く、人間が編集しにくい
- バージョン管理での差分が見にくい
- 特定の環境に依存しやすい

## Consequences

### ポジティブ

- ✅ AI生成コンテンツを直接使用可能
- ✅ 人間が編集しやすい
- ✅ バージョン管理との相性が良い
- ✅ 再利用性が高い
- ✅ 既存構造を維持できる

### ネガティブ

- ❌ 非常に複雑な構造が必要な場合、HTMLの方が適している場合がある
- ただし、その場合でもMarkdown内にHTMLを埋め込める（Astroでは可能）

### 実装への影響

- `topics/`、`daily/`ディレクトリのMarkdownファイルをそのまま使用
- `markdown-it`でMarkdownをHTMLに変換
- `gray-matter`でfrontmatterを解析
- 画像パスを自動変換（`../img/` → `/img/`）

## References

- [技術選定書](../technology-selection.md) - 「8. AI協働の観点」セクション

