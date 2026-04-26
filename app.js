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
    errors: 0,
    totalKeystrokes: 0,
    isFinished: false,
    shiftDown: false,
};

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

function getRandomWord() {
    const pool = words.slice(0, Math.min(300, words.length));
    return pool[Math.floor(Math.random() * pool.length)];
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
    statErrors.innerText = state.errors;
    let accuracy = 100;
    if (state.totalKeystrokes > 0) {
        accuracy = Math.max(0, Math.round(
            ((state.totalKeystrokes - state.errors) / state.totalKeystrokes) * 100
        ));
    }
    statAccuracy.innerText = `${accuracy}%`;
    if (state.startTime && state.currentIndex > 0) {
        const elapsed = (new Date() - state.startTime) / 1000 / 60;
        const wpm = Math.round((state.currentIndex / 5) / elapsed);
        statWpm.innerText = isNaN(wpm) || !isFinite(wpm) ? 0 : wpm;
    }
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
            // 全部輸入正確：等字元音訊播完 → 1秒後播單字音訊 → 2秒後換下一題
            state.isFinished = true;
            updateStats();
            playCharAudio(targetChar).then(() => {
                setTimeout(() => {
                    playAudio(state.word.id);
                    setTimeout(() => initGame(), 2000);
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
        document.body.style.backgroundColor = '#1e1b2e';
        setTimeout(() => document.body.style.backgroundColor = '', 150);
    }

    updateStats();
}

window.addEventListener('keyup', e => {
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') state.shiftDown = false;
});

function initGame() {
    if (words.length === 0) return;
    state.word = getRandomWord();
    state.targetText = state.word.thai_word;
    state.currentIndex = 0;
    state.startTime = null;
    state.errors = 0;
    state.totalKeystrokes = 0;
    state.isFinished = false;
    state.shiftDown = false;

    statWpm.innerText = '0';
    statAccuracy.innerText = '100%';
    statErrors.innerText = '0';

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
    initGame();
});

renderKeyboard();
loadWords().then(() => {
    buildCharAudioMap();
    initGame();
});
