# URL

## 概要

URL（Uniform Resource Locator）は、インターネット上のリソースの場所を示すアドレス。Webページ、画像、APIエンドポイントなど、あらゆるリソースを一意に識別する。

## URLの構造

URLは以下の要素で構成される：

```
https://example.com:8080/path/to/page?key=value&foo=bar#section
└─┬──┘ └────┬────┘└─┬─┘└─────┬─────┘└────────┬───────┘└───┬──┘
スキーム   ホスト  ポート    パス        クエリパラメータ  フラグメント
```

| 要素 | 説明 | 例 |
|------|------|-----|
| スキーム | プロトコル | `https`, `http`, `ftp` |
| ホスト | サーバーのアドレス | `example.com` |
| ポート | 接続先ポート（省略可） | `:8080` |
| パス | リソースの場所 | `/path/to/page` |
| クエリパラメータ | 追加情報（`?`で開始） | `?key=value` |
| フラグメント | ページ内位置（`#`で開始） | `#section` |

### 各要素の区切り文字

| 文字 | 役割 |
|------|------|
| `://` | スキームとホストの区切り |
| `:` | ホストとポートの区切り |
| `/` | パスの区切り |
| `?` | クエリパラメータの開始 |
| `&` | クエリパラメータ間の区切り |
| `=` | キーと値の区切り |
| `#` | フラグメントの開始（クエリの終了） |

## URLエンコーディング

### なぜエンコーディングが必要か

URLには使用できる文字が制限されている。予約文字（`/`, `?`, `&` など）は特別な意味を持つため、データとしてこれらの文字を含めたい場合はエンコードが必要。

### エンコーディングの仕組み

文字を `%XX` の形式に変換する（XXは16進数のASCIIコード）。

```
文字 → ASCIIコード（16進数） → %XX
 /   →        0x2F          → %2F
```

### よく使うエンコード一覧

| 文字 | ASCIIコード | エンコード |
|------|-------------|-----------|
| スペース | 0x20 | `%20` または `+` |
| `!` | 0x21 | `%21` |
| `#` | 0x23 | `%23` |
| `%` | 0x25 | `%25` |
| `&` | 0x26 | `%26` |
| `/` | 0x2F | `%2F` |
| `?` | 0x3F | `%3F` |
| `@` | 0x40 | `%40` |

### スペースのエンコード

スペースは場所によってエンコード方法が異なる：

| 使用場所 | エンコード |
|---------|-----------|
| パス部分 | `%20` |
| クエリパラメータ | `+` または `%20` |

```
https://example.com/my%20file.txt?name=hello+world
                      ↑ パス部分        ↑ クエリ部分
```

## スラッシュ（/）と %2F

### パス区切りとしての `/`

スラッシュはURLのパス区切り文字として予約されている。

```
https://example.com/users/123
                   ↑    ↑
              パス区切り文字
```

### データとしての `/` → `%2F`

パスの値の一部としてスラッシュを含めたい場合は `%2F` にエンコードする。

```
# ファイル名が "2025/08/07.md" の場合
https://example.com/files/2025%2F08%2F07.md
                         └── ファイル名 ──┘
```

### よくある問題

パス区切りの `/` が `%2F` になってしまうと、ルーティングエラーが発生する：

| URL | サーバーの解釈 |
|-----|---------------|
| `/users/123` | `users` と `123` の2つのセグメント ✅ |
| `/users%2F123` | `users%2F123` という1つのセグメント ❌ |

## 二重エンコード問題

### 原因

すでにエンコードされたURLを再度エンコードすると発生する。

```
/path/to/file
↓ 1回目のエンコード
/path/to/file（正常）
↓ 誤って2回目のエンコード
%2Fpath%2Fto%2Ffile（問題発生）
```

`%` 自体がエンコードされると `%25` になる：
```
%2F → %252F（%が%25にエンコードされた）
```

### 回避策

#### 1. エンコード前にチェック

```javascript
function safeEncode(str) {
  try {
    if (str !== decodeURIComponent(str)) {
      return str; // すでにエンコード済み
    }
  } catch (e) {}
  return encodeURIComponent(str);
}
```

#### 2. エンコード処理を一箇所に集約

```javascript
// ❌ 悪い例：複数箇所でエンコード
const path = encodeURIComponent(userInput);
const url = buildUrl(encodeURIComponent(path));

// ✅ 良い例：最終出力時に一度だけ
const url = buildUrl(userInput);
```

#### 3. URLオブジェクトを使用

```javascript
const url = new URL('https://example.com');
url.pathname = '/path/to/file';
url.searchParams.set('name', 'foo/bar');
console.log(url.toString());
// → https://example.com/path/to/file?name=foo%2Fbar
```

#### 4. 運用ルール

| レイヤー | データの状態 |
|---------|-------------|
| 内部処理 | 常にデコード済みで扱う |
| 外部出力時 | 出力直前に一度だけエンコード |

### デバッグ方法

```bash
# 変数の中身を詳細に確認
echo "$VAR" | xxd
echo "$VAR" | cat -A
```

```javascript
console.log(JSON.stringify(variable));
```

## フラグメント

### 基本

`#` 以降はフラグメント（アンカー）と呼ばれ、ページ内の特定位置を示す。

```
https://example.com/page?id=123#section1
                              └─ フラグメント
```

### 特徴

- クエリパラメータの終了を示す
- **サーバーには送信されない**（ブラウザ側でのみ使用）
- ページ内リンクやSPAのルーティングに使用

```javascript
// URL: https://example.com/page?id=123#section
// サーバーが受け取るのは /page?id=123 のみ
```

## JavaScriptでのURL操作

### エンコード関数

```javascript
// パス・フラグメント用（/, ?, # はエンコードしない）
encodeURI("https://example.com/path?q=hello world")
// → https://example.com/path?q=hello%20world

// パラメータ値用（すべての予約文字をエンコード）
encodeURIComponent("hello/world?foo=bar")
// → hello%2Fworld%3Ffoo%3Dbar
```

### URLオブジェクト

```javascript
const url = new URL('https://example.com/path');

// クエリパラメータの操作
url.searchParams.set('key', 'value');
url.searchParams.append('tag', 'javascript');
url.searchParams.get('key'); // → 'value'

// 各部分の取得
url.protocol  // → 'https:'
url.hostname  // → 'example.com'
url.pathname  // → '/path'
url.search    // → '?key=value&tag=javascript'
url.hash      // → ''（フラグメント）
```

## 参考リンク

- [RFC 3986 - URI 仕様](https://datatracker.ietf.org/doc/html/rfc3986)
- [MDN - encodeURIComponent](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)
- [MDN - URL API](https://developer.mozilla.org/ja/docs/Web/API/URL)
