// ── 課程定義 ─────────────────────────────────────────────
const ROUND_SIZE = 10;

const THAI_44_CONSONANTS = new Set('กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮ');

const CONSONANT_CLASS = {
    'ก':'中類','ข':'高類','ฃ':'高類','ค':'低類','ฅ':'低類','ฆ':'低類','ง':'低類',
    'จ':'中類','ฉ':'高類','ช':'低類','ซ':'低類','ฌ':'低類','ญ':'低類','ฎ':'中類',
    'ฏ':'中類','ฐ':'高類','ฑ':'低類','ฒ':'低類','ณ':'低類','ด':'中類','ต':'中類',
    'ถ':'高類','ท':'低類','ธ':'低類','น':'低類','บ':'中類','ป':'中類','ผ':'高類',
    'ฝ':'高類','พ':'低類','ฟ':'低類','ภ':'低類','ม':'低類','ย':'低類','ร':'低類',
    'ล':'低類','ว':'低類','ศ':'高類','ษ':'高類','ส':'高類','ห':'高類','ฬ':'低類',
    'อ':'中類','ฮ':'低類',
};

const LESSON_CONFIG = {
    1: { subtitle: '44個泰文子音鍵位練習',     desc: '先播音再輸入，連續 10 題零錯誤自動進入下一課。' },
    2: { subtitle: '泰文母音鍵位練習',         desc: '先播音再輸入，連續 10 題零錯誤自動進入下一課。' },
    3: { subtitle: '子音+母音組合練習',         desc: '隨機子音+母音組合，先播音再輸入，連續 10 題零錯誤自動進入下一課。' },
    4: { subtitle: '子音+母音+聲調組合練習',   desc: '隨機子音+母音+聲調組合，先播音再輸入，連續 10 題零錯誤自動進入下一課。' },
    5: { subtitle: 'Kedmanee 鍵盤自由練習',     desc: '從 1000 個常用泰文單字中隨機出題，每輪 10 個。' },
};

let currentLesson = 5;
let consecutiveCorrect = 0;
let charPool = [];
const LCC = { cons: [], vow: [], tone: [] };
// ─────────────────────────────────────────────────────────

const keyboardLayout = [
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
  [
    { code: 'Space', label: 'Space', special: true, width: '300px' }
  ]
];

const keyMap = { lower: {}, upper: {} };
keyboardLayout.flat().forEach(key => {
    if (!key.special) {
        if (key.thLower) keyMap.lower[key.code] = key.thLower;
        if (key.thUpper) keyMap.upper[key.code] = key.thUpper;
    }
});
keyMap.lower['Space'] = ' ';
keyMap.upper['Space'] = ' ';

let words = [];
let charAudioMap = {};
let state = {
    word: null,
    targetText: '',
    currentIndex: 0,
    startTime: null,
    errors: 0,           // 當前單字的錯誤按鍵數（單字層級）
    totalKeystrokes: 0,  // 當前單字的總按鍵數（單字層級）
    isFinished: false,
    shiftDown: false,
};

// ---- Session Pool 輪次狀態 ----
let sessionPool = [];          // 本輪練習單字陣列（有序）
let sessionIndex = 0;          // 目前是第幾個（0-based）
let wordResults = [];          // [{word, hasError}] 每字結果
let masteredSet = new Set();   // 已熟練的 word id
let unpractisedPool = [];      // 尚未被任何輪次抽到的單字
let wordErrorFlag = false;     // 本字是否有錯誤按鍵（單字層級旗標）
let roundErrors = 0;           // 本輪累計錯誤按鍵數
let roundTotalKeystrokes = 0;  // 本輪累計總按鍵數

let USE_API = false;
const keyboardContainer = document.getElementById('keyboard');
const textDisplay = document.getElementById('text-display');
const translationDisplay = document.getElementById('translation-display');
const statWpm = document.getElementById('stat-wpm');
const statAccuracy = document.getElementById('stat-accuracy');
const statErrors = document.getElementById('stat-errors');
const resetBtn = document.getElementById('reset-btn');
const hiddenInput = document.getElementById('hidden-input');

async function loadWords() {
    try {
        const res = await fetch('/api/words');
        if (!res.ok) throw new Error('no api');
        words = await res.json();
        USE_API = true;
    } catch {
        const res = await fetch('words.json');
        words = await res.json();
        USE_API = false;
    }
}

function buildCharAudioMap() {
    charAudioMap = {};
    // 從 words 建立單字元詞彙映射（id 型）
    words.forEach(w => {
        const chars = [...w.thai_word];
        if (chars.length === 1) {
            charAudioMap[w.thai_word] = { type: 'word', id: w.id };
        }
    });
    // 為所有鍵盤字元建立 char 音訊映射
    keyboardLayout.flat().forEach(key => {
        if (!key.special) {
            [key.thLower, key.thUpper].forEach(ch => {
                if (ch && /[฀-๿]/.test(ch) && !charAudioMap[ch]) {
                    const cp = ch.codePointAt(0).toString(16).padStart(4, '0');
                    charAudioMap[ch] = { type: 'char', cp };
                }
            });
        }
    });
    console.log('charAudioMap built:', Object.keys(charAudioMap).length, 'chars');
}

// ---- 輔助函式 ----

function isThaiChar(ch) {
    const cp = ch.codePointAt(0);
    return cp >= 0x0E00 && cp <= 0x0E7F;
}

function initLCC() {
    const seen = { cons: new Set(), vow: new Set(), tone: new Set() };
    keyboardLayout.flat().forEach(key => {
        if (key.special) return;
        [
            { char: key.thLower, cls: key.thClassLower },
            { char: key.thUpper, cls: key.thClassUpper },
        ].forEach(({ char, cls }) => {
            if (!char || !isThaiChar(char)) return;
            if (cls === 'th-cons' && THAI_44_CONSONANTS.has(char) && !seen.cons.has(char)) {
                seen.cons.add(char); LCC.cons.push(char);
            } else if (cls === 'th-vow' && !seen.vow.has(char)) {
                seen.vow.add(char); LCC.vow.push(char);
            } else if (cls === 'th-tone' && !seen.tone.has(char)) {
                seen.tone.add(char); LCC.tone.push(char);
            }
        });
    });
}

function buildCharPool(lesson) {
    const seen = new Set();
    const pool = [];
    keyboardLayout.flat().forEach(key => {
        if (key.special) return;
        [
            { char: key.thLower, cls: key.thClassLower },
            { char: key.thUpper, cls: key.thClassUpper },
        ].forEach(({ char, cls }) => {
            if (!char || seen.has(char) || !isThaiChar(char)) return;
            const include =
                lesson === 1 ? THAI_44_CONSONANTS.has(char) :
                lesson === 2 ? cls === 'th-vow' : false;
            if (!include) return;
            seen.add(char);
            let chinese = '';
            if (cls === 'th-cons') {
                chinese = CONSONANT_CLASS[char] ? `子音・${CONSONANT_CLASS[char]}` : '子音';
            } else if (cls === 'th-vow') {
                chinese = '母音符號';
            }
            pool.push({ id: null, thai_word: char, chinese, english: '' });
        });
    });
    return pool;
}

function generateComboItem(lesson) {
    const cons = LCC.cons[Math.floor(Math.random() * LCC.cons.length)];
    const vow  = LCC.vow[Math.floor(Math.random() * LCC.vow.length)];
    if (lesson === 3) {
        return { id: null, thai_word: cons + vow, chinese: '子音+母音', english: '' };
    }
    const tone = LCC.tone[Math.floor(Math.random() * LCC.tone.length)];
    return { id: null, thai_word: cons + vow + tone, chinese: '子音+母音+聲調', english: '' };
}

function playCharAudioWait(char) {
    return new Promise(resolve => {
        const entry = charAudioMap[char];
        if (!entry) { resolve(); return; }
        let url;
        if (entry.type === 'word') {
            url = USE_API ? `/api/audio?id=${entry.id}` : `audio/${entry.id}.mp3`;
        } else {
            url = `audio/char_${entry.cp}.mp3`;
        }
        const audio = new Audio(url);
        audio.addEventListener('ended', resolve, { once: true });
        audio.addEventListener('error', resolve, { once: true });
        audio.play().catch(resolve);
    });
}

async function playComboAudio(text) {
    for (const ch of [...text]) {
        await playCharAudioWait(ch);
    }
}

function updateLessonUI() {
    const cfg = LESSON_CONFIG[currentLesson];
    const subtitleEl = document.getElementById('lesson-subtitle');
    const descEl = document.getElementById('lesson-desc');
    if (subtitleEl) subtitleEl.innerText = cfg.subtitle;
    if (descEl) descEl.innerText = cfg.desc;
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

function saveProgress() {
    try {
        localStorage.setItem('thaiTypingProgress', JSON.stringify({
            masteredIds: [...masteredSet],
            unpractisedIds: unpractisedPool.map(w => w.id),
        }));
    } catch (e) {}
}

function loadProgress() {
    try {
        const raw = localStorage.getItem('thaiTypingProgress');
        if (!raw) return false;
        const data = JSON.parse(raw);
        const idToWord = new Map(words.map(w => [w.id, w]));
        masteredSet = new Set(data.masteredIds.filter(id => idToWord.has(id)));
        unpractisedPool = data.unpractisedIds.map(id => idToWord.get(id)).filter(Boolean);
        return unpractisedPool.length > 0 || masteredSet.size > 0;
    } catch {
        return false;
    }
}

// ---- Session / Round 管理 ----

function startSession() {
    const total = Math.min(1000, words.length);
    const pool1000 = words.slice(0, total);

    if (loadProgress() && unpractisedPool.length > 0) {
        // 從 localStorage 恢復進度
        const nextPool = unpractisedPool.splice(0, Math.min(100, unpractisedPool.length));
        startRound(nextPool);
    } else {
        // 全新開始
        masteredSet = new Set();
        unpractisedPool = [...pool1000];
        shuffleArray(unpractisedPool);
        startRound(unpractisedPool.splice(0, Math.min(100, unpractisedPool.length)));
    }
}

function startRound(pool) {
    sessionPool = pool;
    sessionIndex = 0;
    wordResults = [];
    roundErrors = 0;
    roundTotalKeystrokes = 0;
    initGame();
}

function advanceSession() {
    // 記錄本字結果（在 playCharAudio 播放後、進入下一字前）
    wordResults.push({ word: state.word, hasError: wordErrorFlag });
    roundErrors += state.errors;
    roundTotalKeystrokes += state.totalKeystrokes;
    sessionIndex++;

    if (sessionIndex >= sessionPool.length) {
        endRound();
    } else {
        initGame();
    }
}

function endRound() {
    const masteredThisRound = [];
    const failedThisRound = [];

    wordResults.forEach(({ word, hasError }) => {
        if (hasError) {
            failedThisRound.push(word);
        } else {
            masteredThisRound.push(word);
            masteredSet.add(word.id);
        }
    });

    const total = Math.min(1000, words.length);

    // 全部 1000 個熟練 → 重置循環
    if (masteredSet.size >= total) {
        masteredSet = new Set();
        unpractisedPool = [...words.slice(0, total)];
        shuffleArray(unpractisedPool);
        saveProgress();
        startRound(unpractisedPool.splice(0, Math.min(100, unpractisedPool.length)));
        return;
    }

    saveProgress();

    if (failedThisRound.length === 0) {
        // 本輪全部零錯誤 → 從未練習池全新抽
        if (unpractisedPool.length === 0) {
            startSession();
            return;
        }
        startRound(unpractisedPool.splice(0, Math.min(100, unpractisedPool.length)));
    } else {
        // 一般情況：錯誤字保留 + 補充新字
        const needed = 100 - failedThisRound.length;
        const supplement = needed > 0
            ? unpractisedPool.splice(0, Math.min(needed, unpractisedPool.length))
            : [];
        const nextPool = [...failedThisRound, ...supplement];
        shuffleArray(nextPool);
        startRound(nextPool);
    }
}

function updateRoundProgress() {
    const progressEl = document.getElementById('round-progress');
    if (progressEl) {
        const current = Math.min(sessionIndex + 1, sessionPool.length);
        progressEl.innerText = `第 ${current} / ${sessionPool.length} 個`;
    }
    statWpm.innerText = unpractisedPool.length;
}

function playAudio(wordId) {
    const url = USE_API ? `/api/audio?id=${wordId}` : `audio/${wordId}.mp3`;
    console.log('[Audio] Playing:', url);
    const audio = new Audio(url);
    audio.play().catch(e => console.error('[Audio] Error:', e));
}

function playCharAudio(char) {
    return new Promise(resolve => {
        const entry = charAudioMap[char];
        if (!entry) { resolve(); return; }

        let audio;
        if (entry.type === 'word') {
            const url = USE_API ? `/api/audio?id=${entry.id}` : `audio/${entry.id}.mp3`;
            audio = new Audio(url);
        } else {
            audio = new Audio(`audio/char_${entry.cp}.mp3`);
        }
        audio.onended = resolve;
        audio.onerror = resolve;
        audio.play().catch(() => resolve());
    });
}

function renderKeyboard() {
    keyboardContainer.innerHTML = '';
    keyboardLayout.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'key-row';
        row.forEach(keyData => {
            const keyDiv = document.createElement('div');
            keyDiv.className = 'key';
            if (keyData.special) keyDiv.classList.add('special');
            keyDiv.dataset.code = keyData.code;
            if (keyData.width) keyDiv.style.width = keyData.width;
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
    if (state.currentIndex >= state.targetText.length) removeKeyHints();
}

function highlightKeyHint(targetChar) {
    removeKeyHints();
    for (const [code, char] of Object.entries(keyMap.lower)) {
        if (char === targetChar) {
            document.querySelector(`.key[data-code="${code}"]`)?.classList.add('hint');
            return;
        }
    }
    for (const [code, char] of Object.entries(keyMap.upper)) {
        if (char === targetChar) {
            document.querySelector(`.key[data-code="${code}"]`)?.classList.add('hint', 'hint-shift');
            document.querySelectorAll('.key[data-code="ShiftLeft"], .key[data-code="ShiftRight"]')
                .forEach(el => el.classList.add('hint'));
            return;
        }
    }
}

function removeKeyHints() {
    document.querySelectorAll('.key').forEach(el => el.classList.remove('hint', 'hint-shift'));
}

function updateStats() {
    // 本輪累計（含當前單字進行中的數值）
    const totalErrors = roundErrors + state.errors;
    const totalKeystrokes = roundTotalKeystrokes + state.totalKeystrokes;

    statErrors.innerText = totalErrors;

    let accuracy = 100;
    if (totalKeystrokes > 0) {
        accuracy = Math.max(0, Math.round(
            ((totalKeystrokes - totalErrors) / totalKeystrokes) * 100
        ));
    }
    statAccuracy.innerText = `${accuracy}%`;

    // 剩餘未練習單字數（由 updateRoundProgress 也會更新，此處同步確保一致）
    statWpm.innerText = unpractisedPool.length;
}

function handleKeyDown(e) {
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        state.shiftDown = true;
        return;
    }
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    if (e.code === 'Space' || e.code === 'Tab') e.preventDefault();

    const keyEl = document.querySelector(`.key[data-code="${e.code}"]`);
    if (keyEl) {
        keyEl.classList.add('active');
        setTimeout(() => keyEl.classList.remove('active'), 150);
    }

    if (state.isFinished) return;

    const layer = state.shiftDown ? keyMap.upper : keyMap.lower;
    const mappedChar = layer[e.code];
    if (!mappedChar) return;

    if (!state.startTime) state.startTime = new Date();

    state.totalKeystrokes++;
    const targetChar = state.targetText[state.currentIndex];
    const spans = document.querySelectorAll('.char');
    const currentSpan = spans[state.currentIndex];

    if (mappedChar === targetChar) {
        currentSpan.classList.remove('current', 'error');
        currentSpan.classList.add('correct');
        state.currentIndex++;

        if (state.currentIndex >= state.targetText.length) {
            // 全部輸入正確：等字元音訊播完 → 1秒後播單字音訊 → 2秒後進下一字
            state.isFinished = true;
            updateStats();
            playCharAudio(targetChar).then(() => {
                setTimeout(() => {
                    playAudio(state.word.id);
                    setTimeout(() => advanceSession(), 2000);
                }, 1000);
            });
            return;
        }

        playCharAudio(targetChar);
        spans[state.currentIndex]?.classList.add('current');
        highlightKeyHint(state.targetText[state.currentIndex]);
    } else {
        currentSpan.classList.add('error');
        state.errors++;
        wordErrorFlag = true;   // 標記本字有錯誤按鍵
        document.body.style.backgroundColor = '#1e1b2e';
        setTimeout(() => document.body.style.backgroundColor = '', 150);
    }

    updateStats();
}

window.addEventListener('keyup', e => {
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') state.shiftDown = false;
});

function initGame() {
    if (words.length === 0 || sessionPool.length === 0) return;

    state.word = sessionPool[sessionIndex];
    state.targetText = state.word.thai_word;
    state.currentIndex = 0;
    state.startTime = null;
    state.errors = 0;           // 單字層級重置
    state.totalKeystrokes = 0;  // 單字層級重置
    state.isFinished = false;
    state.shiftDown = false;

    wordErrorFlag = false;      // 每個新字重置錯誤旗標

    updateRoundProgress();      // 更新「第 X / N 個」與剩餘數
    updateStats();              // 更新正確率與累計錯誤（輪次層級）

    if (translationDisplay) {
        translationDisplay.innerText = `${state.word.chinese} / ${state.word.english}`;
    }

    renderText();
    hiddenInput.value = '';
    hiddenInput.focus();
}

document.addEventListener('click', () => hiddenInput.focus());
window.addEventListener('keydown', handleKeyDown);
resetBtn.addEventListener('click', () => {
    resetBtn.style.transform = 'scale(0.95)';
    setTimeout(() => resetBtn.style.transform = '', 100);
    startSession();
});

renderKeyboard();
loadWords().then(() => {
    buildCharAudioMap();
    startSession();
});
