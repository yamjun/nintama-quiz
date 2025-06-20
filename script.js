// ゲーム状態管理
let currentQuiz = [];
let currentQuestionIndex = 0;
let selectedOptionIndex = -1;
let correctAnswers = 0;
let currentUser = null;
let startTime = null;

// 初期化
window.onload = function() {
    initializeApp();
};

async function initializeApp() {
    try {
        // Supabase設定チェック
        if (SUPABASE_URL !== 'YOUR_SUPABASE_URL' && typeof supabase !== 'undefined') {
            // ユーザー認証状態をチェック
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                currentUser = user;
                updateAuthUI(user);
            }
            
            // 認証状態の変化を監視
            supabase.auth.onAuthStateChange((event, session) => {
                if (session) {
                    currentUser = session.user;
                    updateAuthUI(session.user);
                } else {
                    currentUser = null;
                    updateAuthUI(null);
                }
            });
        } else {
            // Supabase未設定の場合はゲストモードで実行
            console.log('Supabase未設定のため、ローカルモードで動作します');
            updateAuthUI(null);
        }
    } catch (error) {
        console.error('Supabase初期化エラー:', error);
        // エラーが発生してもゲストモードで続行
        updateAuthUI(null);
    }
    
    // フォームイベントリスナー設定
    setupFormListeners();
    
    // クイズ開始（エラーに関係なく必ず実行）
    startQuiz();
    
    // ランキング読み込み
    loadRanking();
}

// 認証UI更新
function updateAuthUI(user) {
    const guestSection = document.getElementById('guest-section');
    const userSection = document.getElementById('user-section');
    const userName = document.getElementById('user-name');
    
    if (user) {
        guestSection.style.display = 'none';
        userSection.style.display = 'block';
        userName.textContent = user.email || 'ユーザー';
    } else {
        guestSection.style.display = 'block';
        userSection.style.display = 'none';
    }
}

// フォームイベントリスナー設定
function setupFormListeners() {
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegister);
}

// ログイン処理
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Supabase未設定の場合はエラーメッセージを表示
    if (SUPABASE_URL === 'YOUR_SUPABASE_URL' || typeof supabase === 'undefined') {
        alert('Supabaseが設定されていません。ゲストモードでお楽しみください。');
        return;
    }
    
    try {
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) throw error;
        
        closeModal('login-modal');
        alert('ログインしました！');
        
    } catch (error) {
        alert('ログインエラー: ' + error.message);
    }
}

// 新規登録処理
async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    
    // Supabase未設定の場合はエラーメッセージを表示
    if (SUPABASE_URL === 'YOUR_SUPABASE_URL' || typeof supabase === 'undefined') {
        alert('Supabaseが設定されていません。ゲストモードでお楽しみください。');
        return;
    }
    
    try {
        const { error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    name: name
                }
            }
        });
        
        if (error) throw error;
        
        closeModal('register-modal');
        alert('登録完了！メールアドレスを確認してください。');
        
    } catch (error) {
        alert('登録エラー: ' + error.message);
    }
}

// ログアウト処理
async function logout() {
    // Supabase未設定の場合はエラーメッセージを表示
    if (SUPABASE_URL === 'YOUR_SUPABASE_URL' || typeof supabase === 'undefined') {
        alert('Supabaseが設定されていません。');
        return;
    }
    
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        alert('ログアウトしました');
    } catch (error) {
        alert('ログアウトエラー: ' + error.message);
    }
}

// モーダル表示/非表示
function showLoginModal() {
    document.getElementById('login-modal').style.display = 'flex';
}

function showRegisterModal() {
    document.getElementById('register-modal').style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// タブ切り替え
function showTab(tabName) {
    // タブボタンの状態更新
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // タブコンテンツの表示切り替え
    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
    });
    document.getElementById(tabName + '-tab').style.display = 'block';
    
    // ランキングタブの場合はデータを再読み込み
    if (tabName === 'ranking') {
        loadRanking();
    }
}

// クイズ機能
function startQuiz() {
    currentQuiz = getRandomQuestions(3);
    currentQuestionIndex = 0;
    correctAnswers = 0;
    selectedOptionIndex = -1;
    startTime = Date.now();
    
    document.getElementById('question-section').style.display = 'block';
    document.getElementById('result-section').style.display = 'none';
    document.getElementById('complete-section').style.display = 'none';
    
    displayQuestion();
}

function getRandomQuestions(count) {
    const shuffled = [...quizDatabase].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function displayQuestion() {
    const question = currentQuiz[currentQuestionIndex];
    document.getElementById('question').textContent = question.question;
    
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.textContent = option;
        optionElement.onclick = () => selectOption(index);
        optionsContainer.appendChild(optionElement);
    });
    
    document.getElementById('progress-text').textContent = `問題 ${currentQuestionIndex + 1} / 3`;
    document.getElementById('submit-btn').disabled = true;
    selectedOptionIndex = -1;
}

function selectOption(index) {
    const options = document.querySelectorAll('.option');
    options.forEach((option, i) => {
        option.classList.remove('selected');
        if (i === index) {
            option.classList.add('selected');
        }
    });
    
    selectedOptionIndex = index;
    document.getElementById('submit-btn').disabled = false;
}

function checkAnswer() {
    if (selectedOptionIndex === -1) return;
    
    const question = currentQuiz[currentQuestionIndex];
    const options = document.querySelectorAll('.option');
    const isCorrect = selectedOptionIndex === question.correct;
    
    options.forEach((option, index) => {
        option.onclick = null;
        if (index === question.correct) {
            option.classList.add('correct');
        } else if (index === selectedOptionIndex && !isCorrect) {
            option.classList.add('incorrect');
        }
    });
    
    if (isCorrect) {
        correctAnswers++;
        document.getElementById('result-message').textContent = '正解！';
        document.getElementById('result-message').style.color = '#28a745';
    } else {
        document.getElementById('result-message').textContent = '不正解...';
        document.getElementById('result-message').style.color = '#dc3545';
    }
    
    document.getElementById('question-section').style.display = 'none';
    document.getElementById('result-section').style.display = 'block';
}

function nextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex >= 3) {
        showComplete();
    } else {
        document.getElementById('question-section').style.display = 'block';
        document.getElementById('result-section').style.display = 'none';
        displayQuestion();
    }
}

function showComplete() {
    const endTime = Date.now();
    const completionTime = Math.round((endTime - startTime) / 1000);
    
    document.getElementById('result-section').style.display = 'none';
    document.getElementById('complete-section').style.display = 'block';
    
    const finalScore = document.getElementById('final-score');
    finalScore.innerHTML = `正解数: ${correctAnswers} / 3<br>完了時間: ${completionTime}秒`;
    
    // スコア保存セクションの表示制御
    const scoreSaveSection = document.getElementById('score-save-section');
    if (correctAnswers > 0) {
        scoreSaveSection.style.display = 'block';
        // ログインユーザーの場合はプレイヤー名を自動入力
        if (currentUser) {
            document.getElementById('player-name').value = currentUser.email || 'ログインユーザー';
        }
    } else {
        scoreSaveSection.style.display = 'none';
    }
}

// スコア保存
async function saveScore() {
    if (correctAnswers === 0) {
        alert('スコアが0の場合は保存できません');
        return;
    }
    
    const playerName = document.getElementById('player-name').value.trim() || '匿名';
    const completionTime = Math.round((Date.now() - startTime) / 1000);
    
    try {
        // Supabase設定が正しくない場合はローカルストレージに保存
        if (SUPABASE_URL === 'YOUR_SUPABASE_URL') {
            saveScoreToLocalStorage(playerName, correctAnswers, completionTime);
            return;
        }
        
        const { error } = await supabase
            .from('quiz_scores')
            .insert([
                {
                    user_id: currentUser?.id || null,
                    player_name: playerName,
                    score: correctAnswers,
                    total_questions: 3,
                    completion_time: new Date().toISOString()
                }
            ]);
        
        if (error) throw error;
        
        alert('スコアを保存しました！');
        loadRanking();
        
    } catch (error) {
        console.error('スコア保存エラー:', error);
        // エラーの場合はローカルストレージに保存
        saveScoreToLocalStorage(playerName, correctAnswers, completionTime);
    }
}

// ローカルストレージにスコアを保存（デモ用）
function saveScoreToLocalStorage(playerName, score, completionTime) {
    const scores = JSON.parse(localStorage.getItem('quiz_scores') || '[]');
    scores.push({
        player_name: playerName,
        score: score,
        total_questions: 3,
        completion_time: new Date().toISOString(),
        time_seconds: completionTime
    });
    localStorage.setItem('quiz_scores', JSON.stringify(scores));
    alert('スコアを保存しました！（ローカル保存）');
    loadRanking();
}

// ランキング読み込み
async function loadRanking() {
    const rankingList = document.getElementById('ranking-list');
    rankingList.innerHTML = '<div class="loading">ランキングを読み込み中...</div>';
    
    try {
        // Supabase設定が正しくない場合はローカルストレージから読み込み
        if (SUPABASE_URL === 'YOUR_SUPABASE_URL' || typeof supabase === 'undefined') {
            loadRankingFromLocalStorage();
            return;
        }
        
        console.log('Supabaseからランキングを読み込み中...');
        
        const { data, error } = await supabase
            .from('quiz_scores')
            .select('*')
            .order('score', { ascending: false })
            .order('completion_time', { ascending: true })
            .limit(20);
        
        if (error) {
            console.error('Supabaseエラー:', error);
            throw error;
        }
        
        console.log('取得したデータ:', data);
        displayRanking(data);
        
    } catch (error) {
        console.error('ランキング読み込みエラー:', error);
        rankingList.innerHTML = '<div class="loading">ランキングの読み込みに失敗しました。再度お試しください。</div>';
    }
}

// ローカルストレージからランキングを読み込み（デモ用）
function loadRankingFromLocalStorage() {
    const scores = JSON.parse(localStorage.getItem('quiz_scores') || '[]');
    const sortedScores = scores.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return new Date(a.completion_time) - new Date(b.completion_time);
    }).slice(0, 20);
    
    displayRanking(sortedScores);
}

// ランキング表示
function displayRanking(scores) {
    const rankingList = document.getElementById('ranking-list');
    
    if (scores.length === 0) {
        rankingList.innerHTML = '<div class="loading">まだスコアがありません</div>';
        return;
    }
    
    rankingList.innerHTML = '';
    
    scores.forEach((score, index) => {
        const rankingItem = document.createElement('div');
        rankingItem.className = 'ranking-item';
        
        if (index === 0) rankingItem.classList.add('top-3');
        if (index === 1) rankingItem.classList.add('top-3', 'second');
        if (index === 2) rankingItem.classList.add('top-3', 'third');
        
        const date = new Date(score.completion_time);
        const formattedDate = date.toLocaleDateString('ja-JP');
        
        rankingItem.innerHTML = `
            <div class="ranking-rank">${index + 1}</div>
            <div class="ranking-name">${score.player_name}</div>
            <div class="ranking-score">${score.score}/3</div>
            <div class="ranking-date">${formattedDate}</div>
        `;
        
        rankingList.appendChild(rankingItem);
    });
}

function restartQuiz() {
    startQuiz();
}

// モーダル外クリックで閉じる
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
};