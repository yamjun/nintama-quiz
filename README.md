# [技術紹介](https://yamjun.github.io/nintama-quiz/intro.html) 
![yamjun github io_nintama-quiz_intro html](https://github.com/user-attachments/assets/90f132fe-cca1-4fc5-9862-0007db8db5bc)


# 忍たま太郎クイズ

忍たま乱太郎に関するクイズアプリケーションです。懐かしいキャラクターや作品の知識を試すことができます。

## 🎯 特徴

- **忍たま乱太郎の豊富なクイズ問題**: キャラクター、設定、作品情報に関する問題
- **ユーザー認証システム**: Supabaseを使用した安全なログイン・登録機能
- **ランキング機能**: スコアを保存してランキングを確認
- **レスポンシブデザイン**: スマートフォンやタブレットでも快適に利用可能
- **オフライン対応**: Supabaseに接続できない場合はローカルストレージでランキング管理

## 🚀 セットアップ

### 必要なもの

- ウェブブラウザ
- Supabaseアカウント（ランキング機能を使用する場合）

### インストール手順

1. リポジトリをクローンまたはダウンロード
```bash
git clone https://github.com/yamjun/nintama-quiz.git
cd nintama-quiz
```

2. `supabase-config.js`を設定（ランキング機能を使用する場合）
```javascript
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
```

3. ローカルサーバーでファイルを開く
- HTTPサーバーを使用（例：Live Server、Python's http.server等）
- 直接 `index.html` をブラウザで開くことも可能

### Supabase設定

ランキング機能を有効にするには、Supabaseの設定が必要です。
詳細は [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) を参照してください。

## 📖 使い方

1. **クイズの開始**: 「クイズ」タブで問題に回答
2. **アカウント作成**: 「新規登録」からアカウントを作成（任意）
3. **ログイン**: 既存のGoogleアカウントでログイン
4. **ランキング確認**: 「ランキング」タブで自分や他のプレイヤーのスコアを確認

## 📁 ファイル構成

```
nintama-quiz/
├── index.html           # メインのHTMLファイル
├── style.css           # スタイルシート
├── script.js           # アプリケーションのメインロジック
├── quiz-data.js        # クイズ問題データ
├── supabase-config.js  # Supabase設定ファイル
├── SUPABASE_SETUP.md   # Supabase設定ガイド
└── README.md           # このファイル
```

## 🛠 技術スタック

- **フロントエンド**: HTML5、CSS3、Vanilla JavaScript
- **バックエンド**: Supabase（認証・データベース）
- **スタイリング**: カスタムCSS（レスポンシブデザイン）
- **データ管理**: Supabase + ローカルストレージ（フォールバック）

## 🎮 クイズ内容

忍たま乱太郎に関する様々な問題を収録：
- キャラクターの名前や特徴
- 正式な名前（フルネーム）
- 作品の基本情報
- アニメの放送開始年
- その他の作品設定

## 🤝 開発・貢献

### 新しいクイズ問題の追加

`quiz-data.js` の `quizDatabase` 配列に新しい問題オブジェクトを追加：

```javascript
{
    question: "問題文",
    options: ["選択肢1", "選択肢2", "選択肢3", "選択肢4"],
    correct: 0  // 正解のインデックス（0-3）
}
```

### スタイルのカスタマイズ

`style.css` でアプリケーションの見た目をカスタマイズできます。

## 📝 ライセンス

このプロジェクトは個人利用・学習目的で作成されています。
忍たま乱太郎は尼子騒兵衛先生の作品です。

## 🔧 トラブルシューティング

- **ランキングが表示されない**: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) の設定手順を確認
- **スコアが保存されない**: ブラウザのコンソール（F12）でエラーを確認
- **認証エラー**: Supabaseの設定とAPIキーを確認

---

楽しい忍たま乱太郎クイズをお楽しみください！ 🥷✨
