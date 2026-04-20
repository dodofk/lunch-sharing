// 問題資料庫
const questions = [
    // 輕鬆破冰
    { text: "如果你可以瞬間學會一項技能，會是什麼？", category: "破冰題" },
    { text: "最近有發現什麼好吃/好用的東西想推薦給大家？", category: "破冰題" },
    { text: "週末通常怎麼度過？有什麼固定活動嗎？", category: "破冰題" },
    { text: "你最喜歡的假日早餐是什麼？", category: "破冰題" },
    { text: "如果今天突然多放一天假，你會做什麼？", category: "破冰題" },
    
    // 工作與生活
    { text: "進公司後最意想不到的事情是什麼？", category: "工作日常" },
    { text: "你覺得工作中最療癒的時刻是什麼？", category: "工作日常" },
    { text: "有沒有什麼工作小技巧想分享？", category: "工作日常" },
    { text: "你平常怎麼幫自己充電（不是手機那種）？", category: "工作日常" },
    { text: "理想的工作環境還缺什麼？", category: "工作日常" },
    
    // 興趣與休閒
    { text: "最近有在追什麼劇/電影/動畫嗎？", category: "休閒娛樂" },
    { text: "有什麼興趣是同事們可能不知道的？", category: "休閒娛樂" },
    { text: "你最推薦的一本書或一部電影是？", category: "休閒娛樂" },
    { text: "如果有機會學一項才藝，會想學什麼？", category: "休閒娛樂" },
    { text: "最喜歡的旅遊地點或最想去的地方？", category: "休閒娛樂" },
    
    // 美食
    { text: "公司附近有什麼隱藏版美食？", category: "美食推薦" },
    { text: "你最擅長做的一道菜是什麼？", category: "美食推薦" },
    { text: "如果只能吃一種食物吃一個月，會選什麼？", category: "美食推薦" },
    { text: "有沒有什麼食物是以前不吃現在愛上的？", category: "美食推薦" },
    { text: "你最懷念的家鄉味或童年食物是什麼？", category: "美食推薦" },
    
    // 腦筋急轉彎
    { text: "如果可以和任何一個歷史人物吃午餐，會選誰？", category: "腦洞大開" },
    { text: "你覺得十年後的自己會在哪裡、做什麼？", category: "腦洞大開" },
    { text: "如果可以擁有任何一種超能力，會選什麼？", category: "腦洞大開" },
    { text: "有沒有什麼事情是你覺得「這輩子一定要做一次」的？", category: "腦洞大開" },
    { text: "如果你是一本書，書名會是什麼？", category: "腦洞大開" },
    
    // 深度話題
    { text: "最近有什麼事情讓你感到特別開心或感動？", category: "真心話" },
    { text: "有沒有一個決定，你現在想起來覺得「還好我做了」？", category: "真心話" },
    { text: "你覺得自己最大的優點是什麼？", category: "真心話" },
    { text: "如果可以給過去的自己一句建議，會說什麼？", category: "真心話" },
    { text: "最近有什麼新發現或領悟嗎？", category: "真心話" }
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
