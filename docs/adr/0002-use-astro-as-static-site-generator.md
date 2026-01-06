# ADR-0002: Astroを静的サイトジェネレーターとして採用

## Status

**Accepted** (2025-01)

## Context

Knowledge Gardenを公開するための静的サイトジェネレーターを選定する必要がある。既存のMarkdownファイル構造（`topics/`、`daily/`）を維持しつつ、自動デプロイとDockerコンテナ化に対応できる技術を選択する。

候補技術：
- Astro
- Next.js (Static Export)
- Gatsby
- Hugo
- Jekyll
- VitePress
- Docusaurus
- 11ty (Eleventy)
- Nuxt (Static)
- Vite + カスタム実装

## Decision

**Astro 4.x を採用**

## Rationale

### Astroを選んだ理由

1. **必須要件をすべて満たす**
   - ✅ Markdownのネイティブサポート
   - ✅ TypeScript完全対応
   - ✅ 既存構造への適合性が高い
   - ✅ 静的サイト生成
   - ✅ Docker対応
   - ✅ GitHub Actions対応

2. **開発体験が優れている**
   - シンプルなAPI
   - 充実したドキュメント
   - 高速なビルド（Viteベース）
   - ホットリロードが快適

3. **パフォーマンスが良い**
   - **Island Architecture**: デフォルトでHTMLとして配信し、必要な箇所だけJavaScriptを読み込む
   - デフォルトで最適化された出力
   - 軽量なHTML生成（Knowledge Gardenのようなコンテンツサイトでは、JavaScriptがほぼ不要なため特に有利）

4. **将来性がある**
   - 活発な開発
   - 成長中のコミュニティ
   - React/Vue/Svelte統合可能（将来拡張に有利）

5. **既存知識の活用**
   - プロジェクト内にAstroの知識がある（`topics/astro.md`）
   - 学習コストが低い

6. **AI協働に適している**
   - Markdownのネイティブサポートにより、AI生成コンテンツを直接使用可能
   - MarkdownはAIが生成しやすく、人間が編集しやすい
   - バージョン管理との相性が良い

### 他の技術を選ばなかった理由

- **Next.js/Gatsby**: Reactベースのフレームワークは静的サイトには過剰、学習コストとビルド時間が不利
- **Hugo/Jekyll**: TypeScript非対応のため必須要件を満たさない
- **VitePress/Docusaurus**: ドキュメントサイト向けに特化しており、柔軟性が低い
- **11ty**: TypeScriptの完全対応が弱い
- **Vite + カスタム実装**: 実装コストが高すぎる

## Consequences

### ポジティブ

- ✅ Markdownのネイティブサポートで既存構造を維持できる
- ✅ TypeScript完全対応で型安全性が確保できる
- ✅ Island Architectureでパフォーマンスが良い
- ✅ AI協働に適している
- ✅ ビルド速度が速い

### ネガティブ

- ❌ 比較的新しい技術（2021年リリース）のため、将来のメジャーバージョンアップで破壊的変更がある可能性
- ❌ エコシステムがまだ成長中

### 実装への影響

- `package.json`: Astro 4.x を依存関係に追加
- `astro.config.mjs`: 基本設定ファイル
- `src/`: Astroのソースコード構造
- Markdown-it、gray-matterなどの補助ライブラリを使用

## References

- [技術選定書](../technology-selection.md)
- [Astro公式ドキュメント](https://docs.astro.build/)

