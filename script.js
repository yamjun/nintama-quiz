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
    
    // ハンバーガーメニューの外側クリック時に閉じる
    setupHamburgerMenuListeners();
    
    // クイズ開始（エラーに関係なく必ず実行）
    startQuiz();
}

// 認証UI更新
function updateAuthUI(user) {
    const guestMenu = document.getElementById('guest-menu');
    const userMenu = document.getElementById('user-menu');
    const userName = document.getElementById('user-name');
    
    if (user) {
        guestMenu.style.display = 'none';
        userMenu.style.display = 'block';
        
        // Google認証の場合はuser_metadataから名前を取得
        let displayName = user.email || 'ユーザー';
        if (user.user_metadata && user.user_metadata.full_name) {
            displayName = user.user_metadata.full_name;
        } else if (user.user_metadata && user.user_metadata.name) {
            displayName = user.user_metadata.name;
        }
        
        userName.textContent = displayName;
    } else {
        guestMenu.style.display = 'block';
        userMenu.style.display = 'none';
    }
}

// フォームイベントリスナー設定
function setupFormListeners() {
    // メール認証機能は削除済み
}

// ハンバーガーメニューリスナー設定
function setupHamburgerMenuListeners() {
    // 外側クリック時にメニューを閉じる
    document.addEventListener('click', function(event) {
        const hamburgerMenu = document.querySelector('.hamburger-menu');
        const dropdown = document.getElementById('hamburger-dropdown');
        
        if (!hamburgerMenu.contains(event.target) && dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
        }
    });
}


// Google OAuth ログイン処理
async function loginWithGoogle() {
    // Supabase未設定の場合はエラーメッセージを表示
    if (SUPABASE_URL === 'YOUR_SUPABASE_URL' || typeof supabase === 'undefined') {
        alert('Supabaseが設定されていません。ゲストモードでお楽しみください。');
        return;
    }
    
    try {
        // GitHub Pages環境に応じたリダイレクトURLを設定
        let redirectUrl = window.location.origin;
        
        // GitHub Pagesの場合、リポジトリ名を含めたパスを設定
        if (window.location.hostname === 'yamjun.github.io' || 
            window.location.hostname.includes('github.io')) {
            // リポジトリ名を取得（例：/nintama3/）
            const pathSegments = window.location.pathname.split('/').filter(segment => segment);
            if (pathSegments.length > 0) {
                redirectUrl = `${window.location.origin}/${pathSegments[0]}/`;
            }
        }
        
        console.log('リダイレクトURL:', redirectUrl);
        
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectUrl
            }
        });
        
        if (error) throw error;
        
        // OAuth認証は別ページにリダイレクトされるため、
        // ここではモーダルを閉じる処理のみ実行
        closeModal('login-modal');
        
    } catch (error) {
        console.error('Google認証エラー:', error);
        alert('Google認証でエラーが発生しました: ' + error.message);
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

// ハンバーガーメニュー制御
function toggleHamburgerMenu() {
    const dropdown = document.getElementById('hamburger-dropdown');
    dropdown.classList.toggle('show');
}

// セクション切り替え
function showQuiz() {
    document.getElementById('quiz-section').style.display = 'block';
    document.getElementById('ranking-section').style.display = 'none';
    // ハンバーガーメニューを閉じる
    document.getElementById('hamburger-dropdown').classList.remove('show');
}

function showRanking() {
    document.getElementById('quiz-section').style.display = 'none';
    document.getElementById('ranking-section').style.display = 'block';
    // ハンバーガーメニューを閉じる
    document.getElementById('hamburger-dropdown').classList.remove('show');
    // ランキングデータを読み込み
    loadRanking();
}

// モーダル表示時にハンバーガーメニューを閉じる
function showLoginModal() {
    document.getElementById('login-modal').style.display = 'flex';
    document.getElementById('hamburger-dropdown').classList.remove('show');
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
            let defaultName = currentUser.email || 'ログインユーザー';
            
            // Google認証の場合は名前を優先
            if (currentUser.user_metadata && currentUser.user_metadata.full_name) {
                defaultName = currentUser.user_metadata.full_name;
            } else if (currentUser.user_metadata && currentUser.user_metadata.name) {
                defaultName = currentUser.user_metadata.name;
            }
            
            document.getElementById('player-name').value = defaultName;
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
            console.error('Supabaseエラー詳細:', error);
            console.error('エラーコード:', error.code);
            console.error('エラーメッセージ:', error.message);
            
            // RLSポリシーエラーの場合は具体的なメッセージを表示
            if (error.code === 'PGRST116' || error.message?.includes('row-level security')) {
                rankingList.innerHTML = '<div class="loading">ランキングデータにアクセスできません。<br>Supabaseのアクセス権限設定を確認してください。<br><small>コンソールで詳細を確認できます。</small></div>';
                console.error('RLSポリシーが設定されていない可能性があります。Supabaseダッシュボードでquiz_scoresテーブルのRLSポリシーを確認してください。');
                return;
            }
            throw error;
        }
        
        console.log('取得したデータ:', data);
        
        if (!data || data.length === 0) {
            console.log('データは取得できましたが、スコアがありません');
            rankingList.innerHTML = '<div class="loading">まだスコアがありません</div>';
            return;
        }
        
        displayRanking(data);
        
    } catch (error) {
        console.error('ランキング読み込みエラー:', error);
        
        // エラーが発生した場合はローカルストレージを使用
        console.log('Supabaseでエラーが発生したため、ローカルストレージを使用します');
        loadRankingFromLocalStorage();
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