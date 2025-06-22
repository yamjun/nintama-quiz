# Supabase設定ガイド

## ランキングが表示されない場合の解決方法

このアプリでランキングが表示されない主な原因は、SupabaseのRow Level Security (RLS) ポリシーが適切に設定されていないことです。

### 解決手順

1. **Supabaseダッシュボードにアクセス**
   - https://supabase.com にログイン
   - プロジェクトのダッシュボードを開く

2. **SQL Editorでテーブルとポリシーを作成**
   - 左メニューの「SQL Editor」をクリック
   - 以下のSQLを実行：

```sql
-- テーブル作成（まだ作成していない場合）
CREATE TABLE quiz_scores (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  player_name TEXT,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  completion_time TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- インデックス作成
CREATE INDEX idx_quiz_scores_score ON quiz_scores(score DESC);
CREATE INDEX idx_quiz_scores_created_at ON quiz_scores(created_at DESC);

-- RLS有効化
ALTER TABLE quiz_scores ENABLE ROW LEVEL SECURITY;

-- 公開読み取りポリシー（ランキング表示用）
CREATE POLICY "公開読み取り許可" ON quiz_scores
FOR SELECT USING (true);

-- 認証済みユーザー挿入ポリシー（スコア保存用）
CREATE POLICY "認証済み挿入許可" ON quiz_scores
FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
```

3. **設定確認**
   - 左メニューの「Table Editor」をクリック
   - `quiz_scores`テーブルを選択
   - 右上の「Settings」タブを確認
   - 「Row Level Security」が有効になっていることを確認

### 動作確認

1. アプリを再読み込み
2. クイズを完了してスコアを保存
3. ランキングタブでスコアが表示されることを確認

### トラブルシューティング

- **まだランキングが表示されない場合**: ブラウザのコンソール（F12）でエラーメッセージを確認
- **スコアが保存できない場合**: RLSポリシーが正しく設定されているか確認
- **その他のエラー**: `supabase-config.js`のURLとAPIキーが正しいか確認

### 補足

このアプリは認証なしでも動作するよう設計されており、Supabaseに接続できない場合はローカルストレージを使用してランキングを管理します。