// 問題資料庫
const questions = [
    // 最近生活
    { text: "最近有吃到什麼好吃的想推薦？", category: "最近生活" },
    { text: "這週有什麼讓你會心一笑的小事？", category: "最近生活" },
    { text: "最近有買到什麼覺得超值的東西嗎？", category: "最近生活" },
    { text: "最近有發現什麼好用的 app 或工具？", category: "最近生活" },
    { text: "最近有去哪裡走走或探店嗎？", category: "最近生活" },
    { text: "最近有什麼讓你驚豔的飲料或甜點？", category: "最近生活" },
    { text: "最近有追什麼劇、動畫或 YouTube 頻道？", category: "最近生活" },
    { text: "最近有聽到什麼不錯的音樂或 Podcast？", category: "最近生活" },
    { text: "最近有在玩什麼遊戲（手遊、桌遊、電動都算）？", category: "最近生活" },
    { text: "最近有什麼療癒的小確幸可以分享？", category: "最近生活" },
    
    // 興趣與好奇
    { text: "最近對什麼事情特別感興趣或沉迷？", category: "興趣好奇" },
    { text: "有沒有什麼興趣是同事們可能不知道的？", category: "興趣好奇" },
    { text: "最近有想學什麼新東西嗎？", category: "興趣好奇" },
    { text: "有什麼領域的知識是你平常會主動去了解的？", category: "興趣好奇" },
    { text: "最近有看到什麼有趣的冷知識嗎？", category: "興趣好奇" },
    { text: "有沒有什麼奇怪的收藏癖好？", category: "興趣好奇" },
    { text: "最近有關注什麼有趣的社群或論壇話題？", category: "興趣好奇" },
    { text: "如果突然有一整天的自由時間，會想做什麼？", category: "興趣好奇" },
    { text: "有沒有什麼小眾的興趣想推坑給大家？", category: "興趣好奇" },
    { text: "最近有發現什麼好看的漫畫、小說或文章？", category: "興趣好奇" },
    
    // 輕鬆閒聊
    { text: "早餐 team 還是晚餐 team？最近吃了什麼好吃的？", category: "輕鬆閒聊" },
    { text: "通勤或上班時有什麼固定的儀式感？", category: "輕鬆閒聊" },
    { text: "公司有什麼你私藏的放鬆角落或時刻？", category: "輕鬆閒聊" },
    { text: "最喜歡的假日耍廢方式是什麼？", category: "輕鬆閒聊" },
    { text: "有什麼一直被推坑但還沒看/玩/吃的事情？", category: "輕鬆閒聊" },
    { text: "最近有什麼讓你意外好吃或難吃的食物？", category: "輕鬆閒聊" },
    { text: "有沒有什麼習慣是旁人覺得奇怪但自己覺得正常的？", category: "輕鬆閒聊" },
    { text: "如果要在公司附近開一家店，想開什麼？", category: "輕鬆閒聊" },
    { text: "最近有什麼想買但還在猶豫的東西？", category: "輕鬆閒聊" },
    { text: "有沒有什麼「一定要親自去」的口袋名單？", category: "輕鬆閒聊" }
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
