# C++ 参照渡し

## 概要
C++における参照渡し（Pass by Reference）に関する知識とメモ

## 基本概念

### 値渡し（Pass by Value）との違い

**値渡し（Pass by Value）:**
- 関数に引数を渡す際、値のコピーが作成される
- 関数内で引数を変更しても、呼び出し元の変数には影響しない
- オブジェクトが大きい場合、コピーのオーバーヘッドが発生

```cpp
void increment(int x) {
    x++;  // コピーを変更しているだけ
}

int main() {
    int a = 5;
    increment(a);
    // a は依然として 5
}
```

**参照渡し（Pass by Reference）:**
- 関数に引数を渡す際、変数への参照（エイリアス）を渡す
- 関数内で引数を変更すると、呼び出し元の変数も変更される
- コピーが発生しないため、効率的

```cpp
void increment(int& x) {
    x++;  // 元の変数を直接変更
}

int main() {
    int a = 5;
    increment(a);
    // a は 6 になる
}
```

### 参照とは

**参照（Reference）の特徴：**
- 既存の変数に対する別名（エイリアス）
- 宣言時に必ず初期化が必要
- 一度初期化すると、別の変数を参照することはできない
- ポインタと異なり、nullにはできない

```cpp
int a = 10;
int& ref = a;  // refはaの別名

ref = 20;      // aも20になる
std::cout << a;  // 出力: 20
```

## 参照渡しの使い方

### 基本的な構文

```cpp
// 参照渡しの関数定義
void swap(int& a, int& b) {
    int temp = a;
    a = b;
    b = temp;
}

int main() {
    int x = 10, y = 20;
    swap(x, y);
    // x = 20, y = 10
}
```

### const 参照（定数参照）

**読み取り専用の参照渡し：**
- 関数内で値を変更しない場合に使用
- コピーを避けつつ、意図しない変更を防ぐ
- 大きなオブジェクトを効率的に渡せる

```cpp
// const参照を使った効率的な関数
void printVector(const std::vector<int>& vec) {
    for (int i : vec) {
        std::cout << i << " ";
    }
    // vec.push_back(10);  // エラー: const参照なので変更不可
}

int main() {
    std::vector<int> numbers = {1, 2, 3, 4, 5};
    printVector(numbers);  // コピーなしで渡せる
}
```

**const参照の重要性：**
```cpp
// 悪い例: 大きなオブジェクトを値渡し
void processData(std::string data) {  // コピーが発生
    std::cout << data;
}

// 良い例: const参照で渡す
void processData(const std::string& data) {  // コピーなし
    std::cout << data;
}
```

### 参照を返す関数

```cpp
class Container {
private:
    int value;
public:
    Container(int v) : value(v) {}
    
    // 参照を返す（変更可能）
    int& getValue() {
        return value;
    }
    
    // const参照を返す（読み取り専用）
    const int& getValue() const {
        return value;
    }
};

int main() {
    Container c(10);
    c.getValue() = 20;  // 直接代入可能
    std::cout << c.getValue();  // 出力: 20
}
```

## ポインタとの比較

### 参照 vs ポインタ

| 特徴 | 参照 | ポインタ |
|------|------|----------|
| 初期化 | 必須 | 任意 |
| null | 不可 | 可能 |
| 再代入 | 不可 | 可能 |
| アドレス演算 | 不可 | 可能 |
| 構文 | シンプル | `*` や `->` が必要 |

```cpp
// 参照を使った場合
void incrementRef(int& x) {
    x++;
}

// ポインタを使った場合
void incrementPtr(int* x) {
    if (x != nullptr) {
        (*x)++;
    }
}

int main() {
    int a = 5;
    
    incrementRef(a);     // シンプルな呼び出し
    incrementPtr(&a);    // アドレスを渡す必要がある
}
```

### どちらを使うべきか

**参照を使う場合：**
- 引数が必ず存在することが保証される
- nullチェックが不要
- シンプルな構文を好む場合

**ポインタを使う場合：**
- 引数がnullの可能性がある
- 動的にアドレスを変更する必要がある
- 配列を扱う場合

### 呼び出し時に & をつけるケース（アドレス演算子）

関数定義では`&`を使っていないのに、呼び出し時に`&`をつけるケースがあります。
これは**ポインタを引数として受け取る関数**を呼び出す場合です。

**重要な区別：**
- **参照の`&`**（関数定義側）: 型の一部として使用（例: `int&`）
- **アドレス演算子の`&`**（呼び出し側）: 変数のメモリアドレスを取得

```cpp
// ポインタを受け取る関数（定義時に&は使っていない）
void increment(int* ptr) {
    if (ptr != nullptr) {
        (*ptr)++;
    }
}

int main() {
    int value = 10;
    
    // 呼び出し時に&をつけてアドレスを渡す
    increment(&value);  // &はアドレス演算子
    
    // valueは11になる
    std::cout << value;  // 出力: 11
}
```

**参照渡しとの比較：**

```cpp
// 参照渡し（定義時に&を使う）
void incrementByRef(int& x) {
    x++;
}

// ポインタ渡し（定義時に*を使う）
void incrementByPtr(int* x) {
    (*x)++;
}

int main() {
    int a = 5;
    int b = 5;
    
    incrementByRef(a);   // 呼び出し時に&は不要
    incrementByPtr(&b);  // 呼び出し時に&が必要（アドレスを渡す）
    
    // どちらも結果は同じ（a = 6, b = 6）
}
```

**なぜ呼び出し時に`&`が必要なのか：**

| 関数定義 | 呼び出し側 | 理由 |
|----------|------------|------|
| `void func(int& x)` | `func(a)` | 参照は自動的にバインドされる |
| `void func(int* x)` | `func(&a)` | ポインタには明示的にアドレスを渡す必要がある |

**実用的な例：**

```cpp
// C言語スタイルのAPI（ポインタを使用）
bool parseInteger(const char* str, int* result) {
    // 文字列を整数に変換し、成功したらtrueを返す
    *result = std::atoi(str);
    return true;
}

// scanf系の関数
int value;
scanf("%d", &value);  // &で変数のアドレスを渡す

int main() {
    int number;
    if (parseInteger("42", &number)) {  // &でアドレスを渡す
        std::cout << number;  // 出力: 42
    }
}
```

**呼び出し側から見た違い（可読性の観点）：**

```cpp
int x = 10;

// 参照渡し: 呼び出し側では変更されるかどうかが分かりにくい
modifyByRef(x);   // xが変更される可能性があるが、見た目では分からない

// ポインタ渡し: &があることで「変更される可能性」が明示的
modifyByPtr(&x);  // &があるので、xが変更されるかもしれないと分かる
```

この可読性の違いから、一部のコーディング規約では「出力パラメータにはポインタを使う」というルールを採用しています（例：Google C++ Style Guide）。

## よくある使用パターン

### パターン1: 複数の値を返す

```cpp
// 参照を使って複数の値を返す
void divideAndRemainder(int dividend, int divisor, 
                        int& quotient, int& remainder) {
    quotient = dividend / divisor;
    remainder = dividend % divisor;
}

int main() {
    int q, r;
    divideAndRemainder(17, 5, q, r);
    // q = 3, r = 2
}
```

### パターン2: 大きなオブジェクトの効率的な受け渡し

```cpp
struct LargeData {
    std::vector<double> data;
    std::string metadata;
    // ... 多くのメンバー
};

// 値渡し（非効率）
void processData_bad(LargeData data) {
    // 全データがコピーされる
}

// const参照渡し（効率的）
void processData_good(const LargeData& data) {
    // コピーなし、かつ変更も防止
}
```

### パターン3: メソッドチェーン

```cpp
class Builder {
private:
    std::string result;
public:
    // 自身への参照を返すことでチェーンが可能
    Builder& append(const std::string& str) {
        result += str;
        return *this;
    }
    
    Builder& appendLine(const std::string& str) {
        result += str + "\n";
        return *this;
    }
    
    std::string build() const {
        return result;
    }
};

int main() {
    std::string result = Builder()
        .append("Hello, ")
        .append("World!")
        .appendLine("")
        .appendLine("This is a test.")
        .build();
}
```

### パターン4: 範囲ベースforループでの参照

```cpp
std::vector<int> numbers = {1, 2, 3, 4, 5};

// 値のコピー（読み取りのみ、変更しても元に影響なし）
for (int n : numbers) {
    n *= 2;  // 元の配列は変更されない
}

// 参照（直接変更可能）
for (int& n : numbers) {
    n *= 2;  // 元の配列が変更される
}

// const参照（読み取り専用、効率的）
for (const int& n : numbers) {
    std::cout << n << " ";
}
```

## 注意点とベストプラクティス

### ダングリング参照を避ける

```cpp
// 危険: ローカル変数への参照を返す
int& badFunction() {
    int localVar = 10;
    return localVar;  // 警告: ローカル変数への参照を返している
}  // localVarはスコープを抜けると破棄される

// 安全: クラスメンバーへの参照を返す
class Safe {
    int member;
public:
    int& getMember() { return member; }  // OK: memberはオブジェクトと共存
};
```

### ベストプラクティスまとめ

1. **読み取り専用ならconst参照を使う**
   ```cpp
   void print(const std::string& str);  // 推奨
   ```

2. **小さな型は値渡しでOK**
   ```cpp
   void process(int value);     // int, char, boolなどは値渡しで十分
   void process(double value);  // doubleも値渡しでOK
   ```

3. **変更が必要なら参照渡し**
   ```cpp
   void modify(std::vector<int>& vec);  // 変更が必要な場合
   ```

4. **nullの可能性がある場合はポインタを使う**
   ```cpp
   void process(Widget* widget);  // nullチェックが必要な場合
   ```

5. **参照を返す場合は寿命に注意**
   ```cpp
   // メンバー変数やstatic変数への参照は安全
   // ローカル変数への参照は危険
   ```

## C++11以降の機能

### 右辺値参照（Rvalue Reference）

```cpp
// 右辺値参照（ムーブセマンティクス用）
void process(std::string&& str) {
    // strは一時オブジェクト（右辺値）からムーブ可能
    std::string local = std::move(str);
}

int main() {
    std::string temp = "Hello";
    process(std::move(temp));  // tempをムーブ
    // tempは「有効だが内容は未規定な状態」になる（内容が空かどうかなどに依存しないこと）
}
```

### ユニバーサル参照（Forwarding Reference）

```cpp
template<typename T>
void wrapper(T&& arg) {
    // 完全転送（Perfect Forwarding）
    someFunction(std::forward<T>(arg));
}
```

## 参考リンク
- [cppreference.com - Reference](https://en.cppreference.com/w/cpp/language/reference)
- [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)
