// Supabase設定
// 実際の使用時には、あなたのSupabaseプロジェクトのURLとANON KEYに置き換えてください
const SUPABASE_URL = 'https://vrwidnjfubfkhurjpfha.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyd2lkbmpmdWJma2h1cmpwZmhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzOTU5MDAsImV4cCI6MjA2NTk3MTkwMH0.DiqoO7RQGM0uEr9qTs30W6ZGxn0Gv5RR3G6gCnRKxTs';

// Supabaseクライアント初期化
let supabase;
try {
    if (SUPABASE_URL !== 'YOUR_SUPABASE_URL' && SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY') {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } else {
        console.log('Supabase設定が未設定のため、ローカルモードで動作します');
    }
} catch (error) {
    console.error('Supabase初期化エラー:', error);
    console.log('ローカルモードで動作します');
}

// 実際のプロジェクトで使用する場合は、以下のようにSupabaseプロジェクトを作成し、
// URLとキーを設定してください：
// 
// 1. https://supabase.com でプロジェクトを作成
// 2. Settings > API からURL と anon public keyを取得
// 3. 上記の値を実際の値に置き換え
// 
// また、以下のテーブルを作成する必要があります：
//
// CREATE TABLE quiz_scores (
//   id BIGSERIAL PRIMARY KEY,
//   user_id UUID REFERENCES auth.users(id),
//   player_name TEXT,
//   score INTEGER NOT NULL,
//   total_questions INTEGER NOT NULL,
//   completion_time TIMESTAMP DEFAULT NOW(),
//   created_at TIMESTAMP DEFAULT NOW()
// );
//
// CREATE INDEX idx_quiz_scores_score ON quiz_scores(score DESC);
// CREATE INDEX idx_quiz_scores_created_at ON quiz_scores(created_at DESC);
//
// 重要: Row Level Security (RLS) ポリシーの設定
// ランキングが表示されない場合は、以下のRLSポリシーを設定してください：
//
// 1. quiz_scoresテーブルで公開読み取りを許可:
// CREATE POLICY "公開読み取り許可" ON quiz_scores
// FOR SELECT USING (true);
//
// 2. 認証済みユーザーに挿入を許可:
// CREATE POLICY "認証済み挿入許可" ON quiz_scores
// FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
//
// 3. RLSを有効化:
// ALTER TABLE quiz_scores ENABLE ROW LEVEL SECURITY;
//
// これらの設定により、ランキングの表示とスコアの保存が正常に動作します。