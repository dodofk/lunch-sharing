// 問題資料庫
const questions = [
    // 最近生活
    { text: "如果你現在可以立刻吃到一樣東西，最想吃什麼？", category: "最近生活" },
    { text: "這週有什麼讓你心情不錯的小事嗎？（即使是小小的也算）", category: "最近生活" },
    { text: "最近花過最划算或最滿意的一筆錢是什麼？", category: "最近生活" },
    { text: "手機裡你最常用或最離不開的一個 app 是什麼？", category: "最近生活" },
    { text: "公司附近你最常去或最推薦的一家店是哪間？", category: "最近生活" },
    { text: "最近有沒有吃到什麼讓你驚豔的食物或飲料？（甜的鹹的都可以）", category: "最近生活" },
    { text: "最近在追什麼內容嗎？（劇、動畫、YouTube、綜藝、Podcast 都算）", category: "最近生活" },
    { text: "最近腦海中一直出現的一首歌或一個旋律是什麼？", category: "最近生活" },
    { text: "有沒有什麼你『一直說要做但到現在還沒做』的事？（例如：整理房間、看某部劇、學某個東西）", category: "最近生活" },
    { text: "最近有什麼讓你覺得『還好我有這個』或『幸好我做了』的小事？", category: "最近生活" },
    
    // 興趣與好奇
    { text: "最近有沒有什麼事讓你覺得『這個好有趣』？", category: "興趣好奇" },
    { text: "如果同事們會對你的一個興趣感到驚訝，你覺得會是什麼？", category: "興趣好奇" },
    { text: "如果有機會學一項新技能，你最想學什麼？（不一定要真的會去學）", category: "興趣好奇" },
    { text: "你平常會主動去了解哪方面的資訊？（科技、美食、時事、娛樂、運動...）", category: "興趣好奇" },
    { text: "最近有沒有學到一個讓你覺得『原來如此』或『長知識了』的事？", category: "興趣好奇" },
    { text: "有沒有什麼最近很喜歡的小物、配件或日常用品？", category: "興趣好奇" },
    { text: "最近有沒有看到什麼讓你會心一笑的梗圖、影片或貼文？", category: "興趣好奇" },
    { text: "如果明天突然放假一天，你最想做什麼？（不一定要出門）", category: "興趣好奇" },
    { text: "有沒有什麼你『一開始不感興趣但後來意外喜歡上』的事？", category: "興趣好奇" },
    { text: "最近有沒有什麼內容讓你覺得『這個一定要推薦給別人』？", category: "興趣好奇" },
    
    // 輕鬆閒聊
    { text: "最近有什麼食物是你連續吃好幾天，或一直想吃的？", category: "輕鬆閒聊" },
    { text: "每天上班前或下班後，有什麼你固定會做的小習慣嗎？", category: "輕鬆閒聊" },
    { text: "工作之餘，你通常怎麼讓自己放鬆或轉換心情？", category: "輕鬆閒聊" },
    { text: "假日最理想的過法是什麼？（耍廢、出門、社交、獨處...）", category: "輕鬆閒聊" },
    { text: "最近有什麼你『一直被推坑但還沒嘗試』的事嗎？", category: "輕鬆閒聊" },
    { text: "最近有沒有吃到什麼讓你意外驚豔或踩雷的食物？", category: "輕鬆閒聊" },
    { text: "有沒有什麼你平常會做、但覺得不是每個人都會做的事？", category: "輕鬆閒聊" },
    { text: "如果要在公司附近開一家店，你想開什麼類型的店？", category: "輕鬆閒聊" },
    { text: "最近有什麼東西讓你心動但還在猶豫要不要買？", category: "輕鬆閒聊" },
    { text: "如果可以立刻去一個地方（哪裡都行），你會想去哪裡？為什麼？", category: "輕鬆閒聊" }
];

// Storage keys
const STORAGE_KEY = 'lunch-sharing-v1';

// Current session state
let currentSession = null;
let drawnQuestions = new Set();

// ============ Storage Functions ============

function getAllSessions() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : {};
    } catch (e) {
        console.warn('Failed to read from localStorage:', e);
        return {};
    }
}

function saveSessions(sessions) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (e) {
        console.warn('Failed to write to localStorage:', e);
    }
}

function loadSession(sessionName) {
    const sessions = getAllSessions();
    const sessionData = sessions[sessionName];
    if (sessionData && sessionData.drawn) {
        drawnQuestions = new Set(sessionData.drawn);
    } else {
        drawnQuestions = new Set();
    }
    currentSession = sessionName;
    updateUI();
}

function saveCurrentSession() {
    if (!currentSession) return;
    const sessions = getAllSessions();
    sessions[currentSession] = {
        drawn: Array.from(drawnQuestions),
        updatedAt: new Date().toISOString()
    };
    saveSessions(sessions);
}

function deleteSession(sessionName) {
    const sessions = getAllSessions();
    delete sessions[sessionName];
    saveSessions(sessions);
}

// ============ UI Functions ============

function updateUI() {
    const inputBox = document.getElementById('sessionInput');
    const sessionRow = inputBox.parentElement;
    const sessionDisplay = document.getElementById('sessionDisplay');
    const sessionName = document.getElementById('sessionName');
    const sessionCount = document.getElementById('sessionCount');
    const drawBtn = document.getElementById('drawBtn');
    const resetBtn = document.getElementById('resetBtn');
    const questionText = document.getElementById('questionText');
    const questionType = document.getElementById('questionType');
    const questionCard = document.getElementById('questionCard');
    
    if (currentSession) {
        // Show session info
        sessionRow.style.display = 'none';
        sessionDisplay.style.display = 'flex';
        sessionName.textContent = currentSession;
        
        // Enable draw button
        drawBtn.disabled = false;
        
        // Show count
        const remaining = questions.length - drawnQuestions.size;
        const total = questions.length;
        if (remaining === 0) {
            sessionCount.innerHTML = '✅ 所有題目都抽完囉！可以點「重新開始」換下一組';
            drawBtn.disabled = true;
            drawBtn.innerHTML = '<span class="btn-icon">✅</span> 題目已用完';
        } else {
            sessionCount.innerHTML = `還剩 <span class="count-number">${remaining}</span> / ${total} 題`;
            drawBtn.disabled = false;
            drawBtn.innerHTML = '<span class="btn-icon">🎲</span> 抽一個問題';
        }
        
        // Show reset button
        resetBtn.style.display = 'flex';
        
        // If first time, show hint
        if (drawnQuestions.size === 0) {
            questionText.textContent = '點擊下方按鈕開始抽題目！';
            questionType.textContent = '';
            questionCard.classList.remove('active');
        }
    } else {
        // Show input
        sessionRow.style.display = 'flex';
        sessionDisplay.style.display = 'none';
        sessionCount.textContent = '';
        drawBtn.disabled = true;
        resetBtn.style.display = 'none';
        questionText.textContent = '先輸入組名，再點擊下方按鈕抽題目';
        questionType.textContent = '';
        questionCard.classList.remove('active');
    }
}

function saveSession() {
    const input = document.getElementById('sessionInput');
    const name = input.value.trim();
    
    if (!name) {
        alert('請輸入組名！');
        return;
    }
    
    loadSession(name);
    input.value = '';
}

function resetQuestions() {
    if (!currentSession) return;
    
    if (!confirm(`確定要重置嗎？\n這會清除「${currentSession}」的資料，並讓你輸入新的組名。`)) {
        return;
    }
    
    // Delete the session from storage and clear everything
    deleteSession(currentSession);
    currentSession = null;
    drawnQuestions = new Set();
    
    updateUI();
}

// ============ Draw Question ============

function drawQuestion() {
    if (!currentSession) return;
    
    const card = document.getElementById('questionCard');
    const text = document.getElementById('questionText');
    const type = document.getElementById('questionType');
    const btn = document.getElementById('drawBtn');
    
    // If all questions drawn, show message
    if (drawnQuestions.size >= questions.length) {
        text.textContent = '所有題目都抽完囉！';
        type.textContent = '';
        card.classList.add('active');
        updateUI();
        return;
    }
    
    // Button animation
    btn.disabled = true;
    btn.style.opacity = '0.7';
    
    // Card shake animation
    card.classList.add('shake');
    
    // Rapid text switching effect
    let count = 0;
    const interval = setInterval(() => {
        const randomIdx = Math.floor(Math.random() * questions.length);
        text.textContent = questions[randomIdx].text;
        text.style.opacity = '0.5';
        count++;
        
        if (count > 8) {
            clearInterval(interval);
            
            // Pick final question
            let availableQuestions = questions.filter((_, idx) => !drawnQuestions.has(idx));
            if (availableQuestions.length === 0) {
                drawnQuestions.clear();
                availableQuestions = questions;
            }
            
            const finalQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
            const finalIndex = questions.indexOf(finalQuestion);
            drawnQuestions.add(finalIndex);
            
            // Save to localStorage
            saveCurrentSession();
            
            // Display result
            text.textContent = finalQuestion.text;
            text.style.opacity = '1';
            type.textContent = finalQuestion.category;
            
            card.classList.remove('shake');
            card.classList.add('active');
            
            btn.disabled = false;
            btn.style.opacity = '1';
            
            updateUI();
        }
    }, 80);
}

// ============ Initialization ============

function init() {
    // Check if there's a saved session from today
    const sessions = getAllSessions();
    const sessionNames = Object.keys(sessions);
    
    if (sessionNames.length > 0) {
        // Sort by updatedAt, most recent first
        const sortedSessions = sessionNames.sort((a, b) => {
            const aTime = sessions[a].updatedAt || 0;
            const bTime = sessions[b].updatedAt || 0;
            return new Date(bTime) - new Date(aTime);
        });
        
        const lastSession = sortedSessions[0];
        const lastData = sessions[lastSession];
        
        // Auto-restore if used today
        if (lastData.updatedAt) {
            const lastDate = new Date(lastData.updatedAt);
            const today = new Date();
            const isToday = lastDate.toDateString() === today.toDateString();
            
            if (isToday) {
                loadSession(lastSession);
                return;
            }
        }
    }
    
    // Fresh start
    updateUI();
}

// Handle Enter key in session input
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('sessionInput');
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveSession();
            }
        });
    }
    
    init();
    
    console.log('午餐分享會網站已載入 🍱');
    console.log(`共有 ${questions.length} 個問題可供抽取`);
    console.log('使用 localStorage 儲存抽題紀錄');
});
