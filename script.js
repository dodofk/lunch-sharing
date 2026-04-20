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

// 已抽過的問題索引
let drawnQuestions = new Set();

// 抽問題功能
function drawQuestion() {
    const card = document.getElementById('questionCard');
    const text = document.getElementById('questionText');
    const type = document.getElementById('questionType');
    const btn = document.getElementById('drawBtn');
    
    // 如果全部抽完，重置
    if (drawnQuestions.size >= questions.length) {
        drawnQuestions.clear();
    }
    
    // 按鈕動畫
    btn.disabled = true;
    btn.style.opacity = '0.7';
    
    // 卡片搖晃動畫
    card.classList.add('shake');
    
    // 快速切換文字效果
    let count = 0;
    const interval = setInterval(() => {
        const randomIdx = Math.floor(Math.random() * questions.length);
        text.textContent = questions[randomIdx].text;
        text.style.opacity = '0.5';
        count++;
        
        if (count > 8) {
            clearInterval(interval);
            
            // 選出最終問題
            let availableQuestions = questions.filter((_, idx) => !drawnQuestions.has(idx));
            if (availableQuestions.length === 0) {
                drawnQuestions.clear();
                availableQuestions = questions;
            }
            
            const finalQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
            const finalIndex = questions.indexOf(finalQuestion);
            drawnQuestions.add(finalIndex);
            
            // 顯示結果
            text.textContent = finalQuestion.text;
            text.style.opacity = '1';
            type.textContent = finalQuestion.category;
            
            card.classList.remove('shake');
            card.classList.add('active');
            
            btn.disabled = false;
            btn.style.opacity = '1';
        }
    }, 80);
}

// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('午餐分享會網站已載入 🍱');
    console.log(`共有 ${questions.length} 個問題可供抽取`);
});
