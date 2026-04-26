// 泰文 Kedmanee 首列 (Home Row) 字元集與對應的鍵盤代碼 (event.code)
const THAI_CHARS = ['ฟ', 'ห', 'ก', 'ด', '่', 'า', 'ส', 'ว'];

// 硬體按鍵代碼映射到泰文字元
const keyMap = {
    'KeyA': 'ฟ', 'KeyS': 'ห', 'KeyD': 'ก', 'KeyF': 'ด',
    'KeyJ': '่', 'KeyK': 'า', 'KeyL': 'ส', 'Semicolon': 'ว',
    'Space': ' '
};

// 鍵盤排版資料結構 (根據原圖配置)
const keyboardLayout = [
    // Row 1
    [
        { code: 'Backquote', enUpper: '~', enLower: '`', thUpper: '%', thLower: '_', thClassUpper: 'th-vow', thClassLower: 'th-vow' },
        { code: 'Digit1', enUpper: '!', enLower: '1', thUpper: '+', thLower: 'ๅ', thClassUpper: 'th-vow', thClassLower: 'th-vow' },
        { code: 'Digit2', enUpper: '@', enLower: '2', thUpper: '๑', thLower: '/', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
        { code: 'Digit3', enUpper: '#', enLower: '3', thUpper: '๒', thLower: '-', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
        { code: 'Digit4', enUpper: '$', enLower: '4', thUpper: '๓', thLower: 'ภ', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
        { code: 'Digit5', enUpper: '%', enLower: '5', thUpper: '๔', thLower: 'ถ', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
        { code: 'Digit6', enUpper: '^', enLower: '6', thUpper: 'ู', thLower: 'ุ', thClassUpper: 'th-vow', thClassLower: 'th-vow' },
        { code: 'Digit7', enUpper: '&', enLower: '7', thUpper: '฿', thLower: 'ึ', thClassUpper: 'th-vow', thClassLower: 'th-vow' },
        { code: 'Digit8', enUpper: '*', enLower: '8', thUpper: '๕', thLower: 'ค', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
        { code: 'Digit9', enUpper: '(', enLower: '9', thUpper: '๖', thLower: 'ต', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
        { code: 'Digit0', enUpper: ')', enLower: '0', thUpper: '๗', thLower: 'จ', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
        { code: 'Minus', enUpper: '_', enLower: '-', thUpper: '๘', thLower: 'ข', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
        { code: 'Equal', enUpper: '+', enLower: '=', thUpper: '๙', thLower: 'ช', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
        { code: 'Backspace', label: 'Backspace', special: true, width: '80px' }
    ],
    // Row 2
    [
        { code: 'Tab', label: 'Tab', special: true, width: '65px' },
        { code: 'KeyQ', enUpper: 'Q', enLower: 'q', thUpper: '๐', thLower: 'ๆ', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
        { code: 'KeyW', enUpper: 'W', enLower: 'w', thUpper: '"', thLower: 'ไ', thClassUpper: 'th-vow', thClassLower: 'th-vow' },
        { code: 'KeyE', enUpper: 'E', enLower: 'e', thUpper: 'ฎ', thLower: 'ำ', thClassUpper: 'th-cons', thClassLower: 'th-vow' },
        { code: 'KeyR', enUpper: 'R', enLower: 'r', thUpper: 'ฑ', thLower: 'พ', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
        { code: 'KeyT', enUpper: 'T', enLower: 't', thUpper: 'ธ', thLower: 'ะ', thClassUpper: 'th-cons', thClassLower: 'th-vow' },
        { code: 'KeyY', enUpper: 'Y', enLower: 'y', thUpper: 'ํ', thLower: 'ั', thClassUpper: 'th-vow', thClassLower: 'th-vow' },
        { code: 'KeyU', enUpper: 'U', enLower: 'u', thUpper: '๊', thLower: 'ี', thClassUpper: 'th-tone', thClassLower: 'th-vow' },
        { code: 'KeyI', enUpper: 'I', enLower: 'i', thUpper: 'ณ', thLower: 'ร', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
        { code: 'KeyO', enUpper: 'O', enLower: 'o', thUpper: 'ฯ', thLower: 'น', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
        { code: 'KeyP', enUpper: 'P', enLower: 'p', thUpper: 'ญ', thLower: 'ย', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
        { code: 'BracketLeft', enUpper: '{', enLower: '[', thUpper: 'ฐ', thLower: 'บ', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
        { code: 'BracketRight', enUpper: '}', enLower: ']', thUpper: ',', thLower: 'ล', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
        { code: 'Backslash', enUpper: '|', enLower: '\\', thUpper: 'ฅ', thLower: 'ฃ', thClassUpper: 'th-cons', thClassLower: 'th-cons', width: '65px' }
    ],
    // Row 3 (Home Row)
    [
        { code: 'CapsLock', label: 'Caps', special: true, width: '80px' },
        { code: 'KeyA', enUpper: 'A', enLower: 'a', thUpper: 'ฤ', thLower: 'ฟ', thClassUpper: 'th-vow', thClassLower: 'th-cons' },
        { code: 'KeyS', enUpper: 'S', enLower: 's', thUpper: 'ฆ', thLower: 'ห', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
        { code: 'KeyD', enUpper: 'D', enLower: 'd', thUpper: 'ฏ', thLower: 'ก', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
        { code: 'KeyF', enUpper: 'F', enLower: 'f', thUpper: 'โ', thLower: 'ด', thClassUpper: 'th-vow', thClassLower: 'th-cons' },
        { code: 'KeyG', enUpper: 'G', enLower: 'g', thUpper: 'ฌ', thLower: 'เ', thClassUpper: 'th-cons', thClassLower: 'th-vow' },
        { code: 'KeyH', enUpper: 'H', enLower: 'h', thUpper: '็', thLower: '้', thClassUpper: 'th-tone', thClassLower: 'th-vow' },
        { code: 'KeyJ', enUpper: 'J', enLower: 'j', thUpper: '๋', thLower: '่', thClassUpper: 'th-tone', thClassLower: 'th-tone' },
        { code: 'KeyK', enUpper: 'K', enLower: 'k', thUpper: 'ษ', thLower: 'า', thClassUpper: 'th-cons', thClassLower: 'th-vow' },
        { code: 'KeyL', enUpper: 'L', enLower: 'l', thUpper: 'ศ', thLower: 'ส', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
        { code: 'Semicolon', enUpper: ':', enLower: ';', thUpper: 'ซ', thLower: 'ว', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
        { code: 'Quote', enUpper: '"', enLower: "'", thUpper: '.', thLower: 'ง', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
        { code: 'Enter', label: 'Enter', special: true, width: '90px' }
    ],
    // Row 4
    [
        { code: 'ShiftLeft', label: 'Shift', special: true, width: '100px' },
        { code: 'KeyZ', enUpper: 'Z', enLower: 'z', thUpper: '(', thLower: 'ผ', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
        { code: 'KeyX', enUpper: 'X', enLower: 'x', thUpper: ')', thLower: 'ป', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
        { code: 'KeyC', enUpper: 'C', enLower: 'c', thUpper: 'ฉ', thLower: 'แ', thClassUpper: 'th-cons', thClassLower: 'th-vow' },
        { code: 'KeyV', enUpper: 'V', enLower: 'v', thUpper: 'ฮ', thLower: 'อ', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
        { code: 'KeyB', enUpper: 'B', enLower: 'b', thUpper: 'ฺ', thLower: 'ิ', thClassUpper: 'th-vow', thClassLower: 'th-vow' },
        { code: 'KeyN', enUpper: 'N', enLower: 'n', thUpper: '์', thLower: 'ื', thClassUpper: 'th-tone', thClassLower: 'th-vow' },
        { code: 'KeyM', enUpper: 'M', enLower: 'm', thUpper: '?', thLower: 'ท', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
        { code: 'Comma', enUpper: '<', enLower: ',', thUpper: 'ฒ', thLower: 'ม', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
        { code: 'Period', enUpper: '>', enLower: '.', thUpper: 'ฬ', thLower: 'ใ', thClassUpper: 'th-cons', thClassLower: 'th-vow' },
        { code: 'Slash', enUpper: '?', enLower: '/', thUpper: 'ฦ', thLower: 'ฝ', thClassUpper: 'th-cons', thClassLower: 'th-cons' },
        { code: 'ShiftRight', label: 'Shift', special: true, width: '110px' }
    ],
    // Row 5
    [
        { code: 'Space', label: 'Space', special: true, width: '300px' }
    ]
];

// 狀態管理
let state = {
    targetText: '',
    currentIndex: 0,
    startTime: null,
    errors: 0,
    totalKeystrokes: 0,
    isFinished: false
};

// DOM 元素
const keyboardContainer = document.getElementById('keyboard');
const textDisplay = document.getElementById('text-display');
const statWpm = document.getElementById('stat-wpm');
const statAccuracy = document.getElementById('stat-accuracy');
const statErrors = document.getElementById('stat-errors');
const resetBtn = document.getElementById('reset-btn');
const hiddenInput = document.getElementById('hidden-input');

// 動態渲染鍵盤
function renderKeyboard() {
    keyboardContainer.innerHTML = '';

    keyboardLayout.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'key-row';

        row.forEach(keyData => {
            const keyDiv = document.createElement('div');
            keyDiv.className = 'key';
            if (keyData.special) keyDiv.classList.add('special');
            keyDiv.dataset.code = keyData.code; // 使用 event.code 作為識別

            if (keyData.width) {
                keyDiv.style.width = keyData.width;
            }

            if (keyData.special) {
                keyDiv.innerText = keyData.label;
            } else {
                keyDiv.innerHTML = `
                    <span class="en-upper">${keyData.enUpper}</span>
                    <span class="en-lower">${keyData.enLower}</span>
                    <span class="th-upper ${keyData.thClassUpper}">${keyData.thUpper}</span>
                    <span class="th-lower ${keyData.thClassLower}">${keyData.thLower}</span>
                `;
            }
            rowDiv.appendChild(keyDiv);
        });

        keyboardContainer.appendChild(rowDiv);
    });
}

// 泰文 Kedmanee 首列教材預設題庫 (參考 TypingStudy 第一課)
const LESSON_EXERCISES = [
    "แสดงสดล่าสุด",
    "แสดงสดล่าสุด"
];
//    "เเ ้้ ฟฟ หห กก ดด ่่ าา สส วว",
//    "เ้ ฟห กด ่า สว เ้ ฟห กด ่า สว",
//    "เก้ เห้ เด้ เฟ้ เส้ เว้ เว่า เหา",
//    "เก้า เด้า เล้า เฝ้า เห้า เผ้า เส้า",
//    "เหด เกด เวด เสด เาด เา้ เด้ ห้า"
//];

//     "ฟฟ หห กก ดด ่่ าา สส วว",
//     "ฟห กด ่า สว ฟห กด ่า สว",
//     "ฟด หก ่าว ส่ ฟด หก ่าว ส่",
//     "ฟาก หด ่าส สาว หาว ดาว สาว สาด",
//     "หาส ดาส ว่าส ่าว ฟ่า หวา ฟาก",
//     "วาส สาด ดาบ หาก ฟาง สาง ดาง"
// ];

// 產生練習字串
function generateText() {
    // 確保這裡的變數名稱與你存資料的變數名稱一模一樣
    const text = LESSON_EXERCISES[Math.floor(Math.random() * LESSON_EXERCISES.length)];

    // 如果 text 存在，才執行取代空白的動作，避免出錯
    return text ? text.replace(/\s/g, '') : "";
}
// function generateText() {
//     return LESSON_EXERCISES[Math.floor(Math.random() * LESSON_EXERCISES.length)];
// }

// 播放 Google Translate TTS 聲音 (直接使用公開 URL，相容 file:// 環境)
function speakThaiWord(word) {
    if (!word || word.trim() === '') return;
    const url = `https://translate.googleapis.com/translate_tts?ie=UTF-8&client=gtx&tl=th&q=${encodeURIComponent(word)}`;
    const audio = new Audio(url);
    audio.play().catch(e => console.error("TTS Play Error:", e));
}

// 預載本課程會用到的所有 TTS 音檔 (file:// 模式下略過，避免 CORS fetch 錯誤)
function preloadTTS() {
    // 在 file:// 協議下，fetch 會因 CORS 失敗，改由播放時即時載入
    if (location.protocol === 'file:') return;

    const uniqueChars = new Set();
    LESSON_EXERCISES.forEach(exercise => {
        for (let char of exercise) {
            if (char !== ' ' && char.trim() !== '') {
                uniqueChars.add(char);
            }
        }
    });

    console.log("Preloading TTS for characters:", Array.from(uniqueChars));
    uniqueChars.forEach(char => {
        const url = `/api/tts?text=${encodeURIComponent(char)}`;
        fetch(url).catch(e => console.error("TTS Preload Error:", e));
    });
}

// 渲染文字到畫面
function renderText() {
    textDisplay.innerHTML = '';

    state.targetText.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.innerText = char;
        span.className = 'char';

        if (index === state.currentIndex) {
            span.classList.add('current');
            highlightKeyHint(char);
        }

        textDisplay.appendChild(span);
    });

    if (state.currentIndex >= state.targetText.length) {
        removeKeyHints();
    }
}

// 虛擬鍵盤提示
function highlightKeyHint(targetChar) {
    removeKeyHints();

    let targetCode = '';
    for (const [code, char] of Object.entries(keyMap)) {
        if (char === targetChar) {
            targetCode = code;
            break;
        }
    }

    if (targetCode) {
        const keyElement = document.querySelector(`.key[data-code="${targetCode}"]`);
        if (keyElement) {
            keyElement.classList.add('hint');
        }
    }
}

function removeKeyHints() {
    document.querySelectorAll('.key').forEach(el => el.classList.remove('hint'));
}

// 計算並更新統計數據
function updateStats() {
    statErrors.innerText = state.errors;

    let accuracy = 100;
    if (state.totalKeystrokes > 0) {
        accuracy = Math.max(0, Math.round(((state.totalKeystrokes - state.errors) / state.totalKeystrokes) * 100));
    }
    statAccuracy.innerText = `${accuracy}%`;

    if (state.startTime && state.currentIndex > 0) {
        const timeElapsed = (new Date() - state.startTime) / 1000 / 60;
        const wpm = Math.round((state.currentIndex / 5) / timeElapsed);
        statWpm.innerText = isNaN(wpm) || wpm === Infinity ? 0 : wpm;
    }
}

// 處理鍵盤按下事件
function handleKeyDown(e) {
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    if (e.code === 'Space' || e.code === 'Tab') e.preventDefault();

    // 處理虛擬鍵盤發光視覺效果
    const keyEl = document.querySelector(`.key[data-code="${e.code}"]`);
    if (keyEl) {
        keyEl.classList.add('active');
        setTimeout(() => keyEl.classList.remove('active'), 150);
    }

    if (state.isFinished) return;

    let mappedChar = keyMap[e.code];
    if (!mappedChar && e.key === state.targetText[state.currentIndex]) {
        mappedChar = e.key;
    }

    if (!mappedChar) return;

    if (!state.startTime) state.startTime = new Date();

    state.totalKeystrokes++;
    const targetChar = state.targetText[state.currentIndex];
    const spanElements = document.querySelectorAll('.char');
    const currentSpan = spanElements[state.currentIndex];

    if (mappedChar === targetChar) {
        currentSpan.classList.remove('current', 'error');
        currentSpan.classList.add('correct');
        state.currentIndex++;

        // 當正確輸入非空白字元時，即時發出該字元的發音
        if (targetChar !== ' ') {
            speakThaiWord(targetChar);
        }
    } else {
        currentSpan.classList.add('error');
        state.errors++;

        document.body.style.backgroundColor = '#1e1b2e';
        setTimeout(() => document.body.style.backgroundColor = '', 150);
    }

    updateStats();

    if (state.currentIndex >= state.targetText.length) {
        state.isFinished = true;
        setTimeout(() => initGame(), 1500);
    } else {
        if (state.currentIndex < spanElements.length) {
            spanElements[state.currentIndex].classList.add('current');
            highlightKeyHint(state.targetText[state.currentIndex]);
        }
    }
}

document.addEventListener('click', () => hiddenInput.focus());

function initGame() {
    state.targetText = generateText(10);
    state.currentIndex = 0;
    state.startTime = null;
    state.errors = 0;
    state.totalKeystrokes = 0;
    state.isFinished = false;

    statWpm.innerText = '0';
    statAccuracy.innerText = '100%';
    statErrors.innerText = '0';

    renderText();
    hiddenInput.value = '';
    hiddenInput.focus();
}

// 綁定事件
window.addEventListener('keydown', handleKeyDown);
resetBtn.addEventListener('click', () => {
    resetBtn.style.transform = 'scale(0.95)';
    setTimeout(() => resetBtn.style.transform = '', 100);
    initGame();
});

// 啟動程式 (順序: 預載音檔 -> 渲染鍵盤 -> 初始化遊戲)
preloadTTS();
renderKeyboard();
initGame();
