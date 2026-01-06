# ドメイン・名前提案書

## 1. 前提条件

- 個人事業サイト: `newtralize.com` の配下またはサブドメインで公開
- **将来の構成**: `newtralize.com`は会社のトップページとして運用予定
- **サイト構成**: トップページから各サービスや情報サイト（Knowledge Garden）にリンクする構成
- 既存のリポジトリ名: `knowledge-garden`
- コンテンツ: 技術的なまとめ（topics）と日々のメモ（daily notes）

## 2. サイト名の候補

### 2.1 候補一覧

| 名前 | 英語表記 | 特徴 |
|------|---------|------|
| **Knowledge Garden** | Knowledge Garden | 現在のリポジトリ名と一致。知識を育てる庭という意味で親しみやすい |
| **Knowledge Base** | Knowledge Base | シンプルで分かりやすい。ナレッジベースとしての位置づけが明確 |
| **Learning Notes** | Learning Notes | 学習メモという意味で、内容が明確 |
| **Tech Notes** | Tech Notes | 技術メモに特化した印象。短く覚えやすい |
| **Knowledge Hub** | Knowledge Hub | 知識のハブという意味。集約的な印象 |
| **Notes** | Notes | シンプルで短い。汎用的 |
| **Study Garden** | Study Garden | 学習の庭。Knowledge Gardenと似たニュアンス |

### 2.2 推奨案

**推奨: Knowledge Garden**

**理由**:
- 既存のリポジトリ名と一致しており、混乱がない
- 「知識を育てる庭」という意味で、継続的な学習と成長を表現している
- 親しみやすく、覚えやすい
- 将来的にコンテンツが拡張されても対応できる汎用性がある

## 3. ドメイン構造の候補

### 3.1 サブディレクトリ方式

#### 案1: `/knowledge`
- **URL**: `https://newtralize.com/knowledge`
- **メリット**:
  - シンプルで短い
  - メインドメインのSEO効果を受けやすい
  - サブドメインの設定が不要
  - SSL証明書の管理が不要（メインドメインの証明書で対応）
- **デメリット**:
  - メインサイトの構造に依存する
  - 将来的に独立させたい場合に移行が必要

#### 案2: `/knowledge-garden`
- **URL**: `https://newtralize.com/knowledge-garden`
- **メリット**:
  - リポジトリ名と一致
  - 明確で分かりやすい
- **デメリット**:
  - URLがやや長い

#### 案3: `/notes`
- **URL**: `https://newtralize.com/notes`
- **メリット**:
  - 非常にシンプルで短い
  - 覚えやすい
- **デメリット**:
  - 汎用的すぎて、他の用途と競合する可能性

### 3.2 サブドメイン方式

#### 案1: `knowledge.newtralize.com`
- **URL**: `https://knowledge.newtralize.com`
- **メリット**:
  - 独立したサイトとして明確に分離できる
  - メインサイトの構造に依存しない
  - 将来的に独立したサービスとして拡張しやすい
  - ブランディングとして独立できる
- **デメリット**:
  - サブドメインのDNS設定が必要
  - SSL証明書の設定が必要（Let's Encryptで自動化可能）
  - やや設定が複雑

#### 案2: `notes.newtralize.com`
- **URL**: `https://notes.newtralize.com`
- **メリット**:
  - シンプルで短い
  - 覚えやすい
- **デメリット**:
  - 汎用的すぎる可能性

#### 案3: `kg.newtralize.com`（Knowledge Gardenの略）
- **URL**: `https://kg.newtralize.com`
- **メリット**:
  - 非常に短い
  - タイピングが楽
- **デメリット**:
  - 略称のため、意味が分かりにくい
  - ブランディングとして弱い

## 4. 推奨案（会社トップページ構成を考慮）

### 4.1 推奨構成

**サイト名**: Knowledge Garden  
**ドメイン構造**: サブドメイン方式  
**URL**: `https://knowledge.newtralize.com`

### 4.2 推奨理由（会社トップページ構成の場合）

1. **会社トップページ構成に適している**
   - 各サービスが独立していることが明確
   - トップページから明確にリンクできる
   - 将来的にサービスが増えても拡張しやすい

2. **ブランディングの観点**
   - 各サービスが独立したブランドとして認識される
   - Knowledge Gardenが情報サイトとして独立していることが明確

3. **管理の観点**
   - 各サービスを独立して管理・デプロイできる
   - トップページの変更が各サービスに影響しない

4. **技術的観点**
   - Traefik + Docker構成では、サブドメイン方式の方が設定が簡単
   - 各サービスを独立したコンテナとして管理できる

5. **将来性**
   - サービスが増えても、同じパターンで追加できる
   - 独立したサービスとして評価される可能性がある

### 4.3 代替案（シンプルさを重視する場合）

**サイト名**: Knowledge Garden  
**ドメイン構造**: サブディレクトリ方式  
**URL**: `https://newtralize.com/knowledge`

**理由**:
- 設定が簡単（サブドメイン設定が不要）
- メインドメインのSEO効果を受けやすい
- SSL証明書の管理が不要
- サービスが少ない場合に適している

**この方式を選ぶべき場合**:
- サービスが1-2個程度で、今後も増える予定がない
- 独立したブランディングが不要
- 設定を最小限に抑えたい

## 5. 実装への影響

### 5.1 サブディレクトリ方式の場合

**Astro設定**:
```javascript
// astro.config.mjs
export default defineConfig({
  site: 'https://newtralize.com',
  base: '/knowledge',
  // ...
});
```

**画像パス変換**:
- `../img/` → `/knowledge/img/`

**GitHub Actions**:
- GitHub Pagesではなく、newtralize.comのサーバーにデプロイする必要がある
- または、GitHub Pagesでビルドして、成果物をnewtralize.comにデプロイ

### 5.2 サブドメイン方式の場合

**Astro設定**:
```javascript
// astro.config.mjs
export default defineConfig({
  site: 'https://knowledge.newtralize.com',
  base: '/',
  // ...
});
```

**画像パス変換**:
- `../img/` → `/img/`（ベースパスが`/`のため）

**DNS設定**:
- `knowledge.newtralize.com`のAレコードまたはCNAMEレコードを設定
- SSL証明書の設定（Let's Encrypt推奨）

## 6. デプロイ方法の検討

### 6.1 オプション1: レンタルサーバー / Xserver VPS への直接デプロイ（推奨）

1. GitHub Actionsでビルド
2. ビルド成果物（`dist/`）をサーバーにデプロイ（rsync、SCP、FTPなど）
3. Nginx/Apacheで静的ファイルを配信

**メリット**:
- **費用面**: 既存のサーバーがあれば追加費用なし（最も経済的）
- **統合性**: newtralize.comと同じサーバーで運用でき、管理が一元化できる
- **コントロール**: 完全にコントロール可能
- **パフォーマンス**: 直接配信のため高速（CDNなしでも十分な場合が多い）
- **静的サイトは簡単**: HTML/CSS/JSをアップロードするだけなので、レンタルサーバーでも問題なく動作

**デメリット**:
- デプロイスクリプトの設定が必要（GitHub Actionsで自動化可能）
- SSL証明書の管理が必要（Let's Encrypt + Certbotで自動化可能）
- CDNがない場合、海外からのアクセスがやや遅い可能性（ただし静的サイトなので影響は限定的）

**実装方法**:
- **レンタルサーバー**: FTP/FTPSで`dist/`の内容をアップロード
- **Xserver VPS**: rsyncやSCPでデプロイ、Nginxで静的ファイル配信

### 6.2 オプション2: GitHub Pages + リバースプロキシ

1. GitHub Pagesでビルド・デプロイ（`yasuhiro112358.github.io/knowledge-garden`）
2. newtralize.comのサーバーでリバースプロキシを設定
3. `/knowledge`へのアクセスをGitHub Pagesにプロキシ

**メリット**:
- GitHub Actionsの自動デプロイをそのまま利用できる
- サーバー側の設定が比較的簡単

**デメリット**:
- リバースプロキシの設定が必要
- レスポンスがやや遅くなる可能性
- GitHub PagesのURLが残る（SEO的には問題ないが）

### 6.3 オプション3: 静的ホスティングサービス経由（Netlify/Vercel）

1. Netlify、Vercel、Cloudflare Pagesなどにデプロイ
2. カスタムドメインを設定（`knowledge.newtralize.com`または`newtralize.com/knowledge`）

**メリット**:
- 自動デプロイが簡単（GitHub連携で自動化）
- CDNによる高速配信（グローバルに最適化）
- SSL証明書の自動管理
- 無料プランがある（制限あり）

**デメリット**:
- **費用面**: 無料プランには制限があり、有料プランは月額費用がかかる
- 外部サービスへの依存
- カスタムドメイン設定が必要
- 既存のサーバーを活用できない（費用の無駄）

**Netlify/Vercelを推す理由**:
- 開発者体験が良い（設定が簡単）
- CDNによる高速配信
- 自動デプロイとSSL証明書管理が簡単

**Netlify/Vercelを推さない理由**:
- 既存のサーバー（Xserver VPS/レンタルサーバー）があれば追加費用がかかる
- 静的サイトなので、レンタルサーバーでも十分に動作する
- サーバー管理の経験があれば、直接デプロイの方が経済的

### 6.4 費用比較

| オプション | 月額費用 | 備考 |
|-----------|---------|------|
| **レンタルサーバー/VPS** | 0円（既存サーバー利用） | 既存のnewtralize.comのサーバーを活用 |
| GitHub Pages | 0円 | 無料だが、リバースプロキシが必要 |
| Netlify | 0円〜$19/月 | 無料プランは制限あり、有料プランは高額 |
| Vercel | 0円〜$20/月 | 無料プランは制限あり、有料プランは高額 |
| Cloudflare Pages | 0円 | 無料プランあり、制限は緩い |

**結論**: 既存のサーバーがある場合、**レンタルサーバー/VPSへの直接デプロイが最も経済的**です。

## 7. 会社トップページ構成を考慮した推奨

### 7.1 将来の構成イメージ

```
newtralize.com（会社トップページ）
├── サービス紹介
├── 会社情報
└── 各サービスへのリンク
    ├── service1.newtralize.com（サービス1）
    ├── service2.newtralize.com（サービス2）
    └── knowledge.newtralize.com（Knowledge Garden）
```

または

```
newtralize.com（会社トップページ）
├── サービス紹介
├── 会社情報
└── 各サービスへのリンク
    ├── newtralize.com/service1（サービス1）
    ├── newtralize.com/service2（サービス2）
    └── newtralize.com/knowledge（Knowledge Garden）
```

### 7.2 サブドメイン方式（推奨：会社トップページ構成の場合）

**構成**:
- サイト名: Knowledge Garden
- URL: `https://knowledge.newtralize.com`（サブドメイン）
- デプロイ: レンタルサーバー/VPSへの直接デプロイ

**メリット**:
- ✅ **独立したサービスとして明確**: 会社トップページから明確にリンクできる
- ✅ **ブランディングが独立**: 各サービスが独立したブランドとして認識される
- ✅ **拡張性が高い**: 将来的にサービスが増えても、同じパターンで追加できる
- ✅ **管理が分離**: 各サービスを独立して管理・デプロイできる
- ✅ **URLが覚えやすい**: `knowledge.newtralize.com`は直感的で覚えやすい
- ✅ **SEO的にも有利**: 各サービスが独立したドメインとして評価される可能性がある

**デメリット**:
- ❌ サブドメインの設定が必要（DNS設定）
- ❌ SSL証明書の設定が必要（Let's Encryptで自動化可能）
- ❌ メインドメインのSEO効果は受けにくい（ただし、独立したサービスとして評価される）

**会社トップページからのリンク例**:
```html
<!-- newtralize.com のトップページ -->
<nav>
  <a href="https://knowledge.newtralize.com">Knowledge Garden</a>
  <a href="https://service1.newtralize.com">サービス1</a>
  <a href="https://service2.newtralize.com">サービス2</a>
</nav>
```

### 7.3 サブディレクトリ方式

**構成**:
- サイト名: Knowledge Garden
- URL: `https://newtralize.com/knowledge`（サブディレクトリ）
- デプロイ: レンタルサーバー/VPSへの直接デプロイ

**メリット**:
- ✅ **設定が簡単**: サブドメイン設定が不要
- ✅ **メインドメインのSEO効果**: メインドメインの評価を受けやすい
- ✅ **SSL証明書の管理が不要**: メインドメインの証明書で対応
- ✅ **費用面で有利**: 追加設定が不要

**デメリット**:
- ❌ **独立性が低い**: 会社サイトの一部として見られやすい
- ❌ **拡張性が低い**: サービスが増えると、URLが長くなる可能性
- ❌ **ブランディングが弱い**: 独立したサービスとしての印象が弱い
- ❌ **管理が複雑**: トップページと統合管理が必要

**会社トップページからのリンク例**:
```html
<!-- newtralize.com のトップページ -->
<nav>
  <a href="/knowledge">Knowledge Garden</a>
  <a href="/service1">サービス1</a>
  <a href="/service2">サービス2</a>
</nav>
```

### 7.4 推奨：サブドメイン方式

**理由**:

1. **会社トップページ構成に適している**
   - 各サービスが独立していることが明確
   - トップページから明確にリンクできる
   - 将来的にサービスが増えても拡張しやすい

2. **ブランディングの観点**
   - 各サービスが独立したブランドとして認識される
   - Knowledge Gardenが情報サイトとして独立していることが明確

3. **管理の観点**
   - 各サービスを独立して管理・デプロイできる
   - トップページの変更が各サービスに影響しない

4. **技術的観点**
   - Traefik + Docker構成では、サブドメイン方式の方が設定が簡単
   - 各サービスを独立したコンテナとして管理できる

5. **将来性**
   - サービスが増えても、同じパターンで追加できる
   - 独立したサービスとして評価される可能性がある

**実装手順**:
1. DNS設定: `knowledge.newtralize.com`のAレコードまたはCNAMEレコードを設定
2. Traefik設定: サブドメイン用のルーティング設定（Dockerラベルで自動化）
3. SSL証明書: Let's Encryptで自動取得・更新
4. GitHub Actionsでビルド・デプロイ

### 7.5 代替案：サブディレクトリ方式（シンプルさを重視する場合）

**条件**:
- サービスが少ない（1-2個程度）
- 独立したブランディングが不要
- 設定を最小限に抑えたい

**この場合の推奨**:
- URL: `https://newtralize.com/knowledge`
- 設定が簡単で、メインドメインのSEO効果を受けやすい

### 7.3 開発者体験を重視する場合（費用に余裕がある場合）

**構成**:
- サイト名: Knowledge Garden
- URL: `https://knowledge.newtralize.com` または `https://newtralize.com/knowledge`
- デプロイ: Netlify/Vercel/Cloudflare Pages

**理由**:
- 自動デプロイとSSL証明書管理が簡単
- CDNによる高速配信
- ただし、既存サーバーがある場合は費用の無駄になる可能性がある

## 8. 決定事項の記録

### 8.1 決定事項（2025年1月）

✅ **決定**: サブドメイン方式を採用

- **サイト名**: Knowledge Garden
- **URL**: `https://knowledge.newtralize.com`（サブドメイン）
- **デプロイ**: VPSへの直接デプロイ（Traefik + Docker、GitHub Actionsで自動化）
- **ベースパス**: `/`（サブドメインのため）

**決定理由**:
- 会社トップページから各サービスにリンクする構成に適している
- 各サービスが独立していることが明確
- 将来的な拡張性が高い
- Traefik + Docker構成では設定が簡単

### 8.2 実装状況

- ✅ `astro.config.mjs`: サブドメイン方式の設定済み
- ✅ `docker-compose.yml`: サブドメイン方式のTraefikラベル設定済み
- ✅ すべてのリンクパスを `/` ベースに更新済み
- ✅ 画像パス変換ロジック: `/img/` に変換（サブドメイン方式）

### 8.3 次のステップ

- [ ] DNS設定: `knowledge.newtralize.com`のAレコードまたはCNAMEレコードを設定
- [ ] Traefik設定: サブドメイン用のルーティング設定（Dockerラベルで自動化）
- [ ] SSL証明書: Let's Encryptで自動取得・更新（Traefikが自動処理）
- [ ] infra-opsリポジトリへの統合
- [ ] テストデプロイ

## 9. 参考資料

- [ホスティング方法の詳細比較](./hosting-comparison.md) - 各オプションの詳細な比較

