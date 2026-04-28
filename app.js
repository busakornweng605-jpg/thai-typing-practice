// ── 課程定義 ─────────────────────────────────────────────
const ROUND_SIZE = 10;

const THAI_44_CONSONANTS = new Set('กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮ');

// 44 個子音（傳統順序）+ 名稱 + 拼音 + 中文釋義 + 類別
const CONSONANT_INFO = {
    'ก': { name: 'ไก่',     rom: 'kɔ̀ɔ kài',       meaning: '雞',         cls: '中類' },
    'ข': { name: 'ไข่',     rom: 'khɔ̌ɔ khài',     meaning: '蛋',         cls: '高類' },
    'ฃ': { name: 'ขวด',    rom: 'khɔ̌ɔ khùat',    meaning: '瓶',         cls: '高類' },
    'ค': { name: 'ควาย',   rom: 'khɔɔ khwaai',    meaning: '水牛',       cls: '低類' },
    'ฅ': { name: 'คน',     rom: 'khɔɔ khon',      meaning: '人',         cls: '低類' },
    'ฆ': { name: 'ระฆัง',  rom: 'khɔɔ ra-khang',  meaning: '鐘',         cls: '低類' },
    'ง': { name: 'งู',     rom: 'ngɔɔ nguu',      meaning: '蛇',         cls: '低類' },
    'จ': { name: 'จาน',    rom: 'cɔɔ caan',       meaning: '盤子',       cls: '中類' },
    'ฉ': { name: 'ฉิ่ง',   rom: 'chɔ̌ɔ chìng',    meaning: '鈸',         cls: '高類' },
    'ช': { name: 'ช้าง',   rom: 'chɔɔ cháang',    meaning: '大象',       cls: '低類' },
    'ซ': { name: 'โซ่',    rom: 'sɔɔ sôo',        meaning: '鏈條',       cls: '低類' },
    'ฌ': { name: 'เฌอ',    rom: 'chɔɔ chəə',      meaning: '樹',         cls: '低類' },
    'ญ': { name: 'หญิง',   rom: 'yɔɔ yǐng',       meaning: '女人',       cls: '低類' },
    'ฎ': { name: 'ชฎา',    rom: 'dɔɔ cha-daa',    meaning: '傳統頭飾',   cls: '中類' },
    'ฏ': { name: 'ปฏัก',   rom: 'tɔɔ pa-tàk',     meaning: '矛',         cls: '中類' },
    'ฐ': { name: 'ฐาน',    rom: 'thɔ̌ɔ thǎan',    meaning: '基座',       cls: '高類' },
    'ฑ': { name: 'มณโฑ',   rom: 'thɔɔ mon-thoo',  meaning: '蒙托夫人',   cls: '低類' },
    'ฒ': { name: 'ผู้เฒ่า',rom: 'thɔɔ phûu-thâo', meaning: '老人',       cls: '低類' },
    'ณ': { name: 'เณร',    rom: 'nɔɔ neen',       meaning: '小沙彌',     cls: '低類' },
    'ด': { name: 'เด็ก',   rom: 'dɔɔ dèk',        meaning: '小孩',       cls: '中類' },
    'ต': { name: 'เต่า',   rom: 'tɔɔ tào',        meaning: '烏龜',       cls: '中類' },
    'ถ': { name: 'ถุง',    rom: 'thɔ̌ɔ thǔng',    meaning: '袋子',       cls: '高類' },
    'ท': { name: 'ทหาร',   rom: 'thɔɔ tha-hǎan',  meaning: '軍人',       cls: '低類' },
    'ธ': { name: 'ธง',     rom: 'thɔɔ thong',     meaning: '旗幟',       cls: '低類' },
    'น': { name: 'หนู',    rom: 'nɔɔ nǔu',        meaning: '老鼠',       cls: '低類' },
    'บ': { name: 'ใบไม้',  rom: 'bɔɔ bai-mái',    meaning: '葉子',       cls: '中類' },
    'ป': { name: 'ปลา',    rom: 'pɔɔ plaa',       meaning: '魚',         cls: '中類' },
    'ผ': { name: 'ผึ้ง',   rom: 'phɔ̌ɔ phûeng',   meaning: '蜜蜂',       cls: '高類' },
    'ฝ': { name: 'ฝา',     rom: 'fɔ̌ɔ fǎa',       meaning: '蓋子',       cls: '高類' },
    'พ': { name: 'พาน',    rom: 'phɔɔ phaan',     meaning: '托盤',       cls: '低類' },
    'ฟ': { name: 'ฟัน',    rom: 'fɔɔ fan',        meaning: '牙齒',       cls: '低類' },
    'ภ': { name: 'สำเภา',  rom: 'phɔɔ sǎm-phao',  meaning: '帆船',       cls: '低類' },
    'ม': { name: 'ม้า',    rom: 'mɔɔ máa',        meaning: '馬',         cls: '低類' },
    'ย': { name: 'ยักษ์',  rom: 'yɔɔ yák',        meaning: '巨人',       cls: '低類' },
    'ร': { name: 'เรือ',   rom: 'rɔɔ rʉua',       meaning: '船',         cls: '低類' },
    'ล': { name: 'ลิง',    rom: 'lɔɔ ling',       meaning: '猴子',       cls: '低類' },
    'ว': { name: 'แหวน',   rom: 'wɔɔ wǎen',       meaning: '戒指',       cls: '低類' },
    'ศ': { name: 'ศาลา',   rom: 'sɔ̌ɔ sǎa-laa',   meaning: '涼亭',       cls: '高類' },
    'ษ': { name: 'ฤๅษี',   rom: 'sɔ̌ɔ rʉʉ-sǐi',   meaning: '隱士',       cls: '高類' },
    'ส': { name: 'เสือ',   rom: 'sɔ̌ɔ sʉ̌ua',     meaning: '老虎',       cls: '高類' },
    'ห': { name: 'หีบ',    rom: 'hɔ̌ɔ hìip',      meaning: '箱子',       cls: '高類' },
    'ฬ': { name: 'จุฬา',   rom: 'lɔɔ cù-laa',     meaning: '風箏',       cls: '低類' },
    'อ': { name: 'อ่าง',   rom: 'ɔɔ àang',        meaning: '水盆',       cls: '中類' },
    'ฮ': { name: 'นกฮูก',  rom: 'hɔɔ nók-hûuk',   meaning: '貓頭鷹',     cls: '低類' },
};

const LESSON_CONFIG = {
    1: { subtitle: '44個泰文子音鍵位練習',     desc: '由 ก→ฮ 序列每輪 10 個，錯誤回填下一輪，全 44 個無誤後自動進入下一課。' },
    2: { subtitle: '泰文母音鍵位練習',         desc: '先播音再輸入，所有母音全部無誤完成後自動進入下一課。' },
    3: { subtitle: '子音+母音組合練習',         desc: '所有子音×母音組合（每輪10個），全部無誤完成後自動進入下一課。' },
    4: { subtitle: '子音+母音+聲調組合練習',   desc: '所有子音×母音×聲調組合（每輪10個），全部無誤完成後自動進入下一課。' },
    5: { subtitle: 'Kedmanee 鍵盤自由練習',     desc: '從 1000 個常用泰文單字中隨機出題，每輪 10 個。' },
};

let currentLesson = 1;
let masteredChars = new Set();       // 課程 1-2：已無誤完成的字符
let charPool = [];                   // 課程 1-2 完整池（保留順序，供熟練度與重建用）
let charUnpractisedPool = [];        // 課程 1-2 待練習池（每輪 splice 取前 N 個）
let comboMasteredSet = new Set();    // 課程 3-4：已無誤完成的組合（thai_word 為 key）
let comboUnpractisedPool = [];       // 課程 3-4：尚未練習的組合
let comboPoolTotal = 0;              // 課程 3-4：完整組合池大小
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
    if (lesson === 1) {
        // 課程 1：依 CONSONANT_INFO 傳統順序，每個子音音訊為「字母名+名稱詞」
        // 路徑為 audio/cons_<codepoint>.mp3（由 add_consonant_audio.py 產生）
        return Object.entries(CONSONANT_INFO).map(([char, info]) => {
            const cp = char.codePointAt(0).toString(16).padStart(4, '0');
            return {
                id: null,
                thai_word: char,
                chinese: `${char}.${info.name} (${info.rom}) ${info.meaning}・${info.cls}`,
                english: '',
                nameWord: info.name,
                audioUrl: `audio/cons_${cp}.mp3`,
            };
        });
    }
    // 課程 2：母音（從 keyboardLayout 提取，去重）
    const seen = new Set();
    const pool = [];
    keyboardLayout.flat().forEach(key => {
        if (key.special) return;
        [
            { char: key.thLower, cls: key.thClassLower },
            { char: key.thUpper, cls: key.thClassUpper },
        ].forEach(({ char, cls }) => {
            if (!char || seen.has(char) || !isThaiChar(char)) return;
            if (cls !== 'th-vow') return;
            seen.add(char);
            pool.push({ id: null, thai_word: char, chinese: '母音符號', english: '' });
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

function buildFullComboPool(lesson) {
    const pool = [];
    const consList = Object.keys(CONSONANT_INFO);  // 44 個子音傳統順序
    if (lesson === 3) {
        // 母音外層、子音內層：每輪 10 個子音輪流，配同一母音
        LCC.vow.forEach(vow => {
            consList.forEach(cons => {
                pool.push({ id: null, thai_word: cons + vow, chinese: `子音+母音 (${cons}+${vow})`, english: '' });
            });
        });
    } else {
        // 課程 4：聲調外層 → 母音中層 → 子音內層
        LCC.tone.forEach(tone => {
            LCC.vow.forEach(vow => {
                consList.forEach(cons => {
                    pool.push({ id: null, thai_word: cons + vow + tone, chinese: `子音+母音+聲調 (${cons}+${vow}+${tone})`, english: '' });
                });
            });
        });
    }
    return pool;
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

/** 課程音訊播放：課程 1 播子音字母誦讀（如「ยอ หญิง」「นอ หนู」），其餘課程播字符序列 */
function playLessonAudio() {
    if (currentLesson === 1 && state.word && state.word.audioUrl) {
        return new Promise(resolve => {
            const audio = new Audio(state.word.audioUrl);
            audio.addEventListener('ended', resolve, { once: true });
            audio.addEventListener('error', resolve, { once: true });
            audio.play().catch(resolve);
        });
    }
    return playComboAudio(state.targetText);
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
    if (currentLesson !== 5) return;
    try {
        localStorage.setItem('thaiTypingProgress', JSON.stringify({
            masteredIds: [...masteredSet],
            unpractisedIds: unpractisedPool.map(w => w.id),
        }));
    } catch (e) {}
}

function loadProgress() {
    if (currentLesson !== 5) return false;
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
    updateLessonUI();
    masteredChars.clear();

    if (currentLesson === 5) {
        const total = Math.min(1000, words.length);
        if (loadProgress() && unpractisedPool.length > 0) {
            startRound(unpractisedPool.splice(0, Math.min(ROUND_SIZE, unpractisedPool.length)));
        } else {
            masteredSet = new Set();
            unpractisedPool = [...words.slice(0, total)];
            shuffleArray(unpractisedPool);
            startRound(unpractisedPool.splice(0, Math.min(ROUND_SIZE, unpractisedPool.length)));
        }
    } else {
        if (currentLesson <= 2) {
            charPool = buildCharPool(currentLesson);
            charUnpractisedPool = [...charPool];   // 序列待練池，依序 splice 消費
        } else {
            charPool = [];
            charUnpractisedPool = [];
        }
        if (currentLesson >= 3) {
            comboMasteredSet.clear();
            const fullPool = buildFullComboPool(currentLesson);
            comboPoolTotal = fullPool.length;
            comboUnpractisedPool = fullPool;
            // 不 shuffle：保持 44 子音序列輪流順序
        }
        startCharRound();
    }
}

function startCharRound() {
    if (currentLesson === 1 || currentLesson === 2) {
        // 課程 1-2：從待練池前端 splice 取 ROUND_SIZE 個（保持序列）
        if (charUnpractisedPool.length === 0) {
            // 池空但未全熟練 → 重建（過濾已熟練）
            charUnpractisedPool = charPool.filter(item => !masteredChars.has(item.thai_word));
        }
        const pool = charUnpractisedPool.splice(0, Math.min(ROUND_SIZE, charUnpractisedPool.length));
        startRound(pool);
    } else if (currentLesson === 3 || currentLesson === 4) {
        if (comboUnpractisedPool.length === 0) {
            // 池清空 → 重建完整池並過濾已熟練的（保持子音序列順序）
            const fullPool = buildFullComboPool(currentLesson);
            comboPoolTotal = fullPool.length;
            comboUnpractisedPool = fullPool.filter(item => !comboMasteredSet.has(item.thai_word));
            // 若全部熟練 → 由 endRound 處理跳課，這裡若仍空則回填全池
            if (comboUnpractisedPool.length === 0) {
                comboMasteredSet.clear();
                comboUnpractisedPool = fullPool;
            }
        }
        const pool = comboUnpractisedPool.splice(0, Math.min(ROUND_SIZE, comboUnpractisedPool.length));
        startRound(pool);
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
    if (currentLesson !== 5) {
        if (currentLesson === 1 || currentLesson === 2) {
            // ── 課程 1-2：序列 + 錯題回填 + 全熟練後跳課 ──
            const failedThisRound = [];
            wordResults.forEach(({ word, hasError }) => {
                if (hasError) {
                    masteredChars.delete(word.thai_word);
                    failedThisRound.push(word);
                } else {
                    masteredChars.add(word.thai_word);
                }
            });
            // 全部 charPool 都無誤完成 → 跳下一課
            if (masteredChars.size >= charPool.length) {
                masteredChars.clear();
                charUnpractisedPool = [];
                currentLesson++;
                const sel = document.getElementById('lesson-select');
                if (sel) sel.value = String(currentLesson);
                setTimeout(() => startSession(), 900);
                return;
            }
            // 下一輪：失敗的（保持序列順序在前）+ 從待練池補足
            const needed = ROUND_SIZE - failedThisRound.length;
            const supplement = needed > 0
                ? charUnpractisedPool.splice(0, Math.min(needed, charUnpractisedPool.length))
                : [];
            let nextPool = [...failedThisRound, ...supplement];
            if (nextPool.length === 0) {
                // 待練池與失敗都空但未全熟練 → 重建過濾池再取
                charUnpractisedPool = charPool.filter(item => !masteredChars.has(item.thai_word));
                nextPool = charUnpractisedPool.splice(0, Math.min(ROUND_SIZE, charUnpractisedPool.length));
            }
            startRound(nextPool);
            return;
        }
        if (currentLesson >= 3) {
            // 課程 3-4：追蹤每個組合的熟練度
            wordResults.forEach(({ word, hasError }) => {
                if (!hasError) {
                    comboMasteredSet.add(word.thai_word);
                } else {
                    comboMasteredSet.delete(word.thai_word);
                }
            });
            // 全部組合都無誤完成 → 跳下一課
            if (comboMasteredSet.size >= comboPoolTotal) {
                comboMasteredSet.clear();
                comboUnpractisedPool = [];
                currentLesson++;
                const sel = document.getElementById('lesson-select');
                if (sel) sel.value = String(currentLesson);
                setTimeout(() => startSession(), 900);
                return;
            }
            // 失敗組合不立即重試，等池清空時 startCharRound 重建（過濾已熟練）會自動讓未熟練的依序回來
        }
        // 課程 3-4：繼續下一輪（startCharRound 會在池空時自動重建）
        startCharRound();
        return;
    }
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

    if (masteredSet.size >= total) {
        masteredSet = new Set();
        unpractisedPool = [...words.slice(0, total)];
        shuffleArray(unpractisedPool);
        saveProgress();
        startRound(unpractisedPool.splice(0, Math.min(ROUND_SIZE, unpractisedPool.length)));
        return;
    }

    saveProgress();

    if (failedThisRound.length === 0) {
        if (unpractisedPool.length === 0) { startSession(); return; }
        startRound(unpractisedPool.splice(0, Math.min(ROUND_SIZE, unpractisedPool.length)));
    } else {
        const needed = ROUND_SIZE - failedThisRound.length;
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
    const remainingLabel = document.getElementById('stat-remaining-label');
    if (currentLesson === 5) {
        statWpm.innerText = unpractisedPool.length;
        if (remainingLabel) remainingLabel.innerText = '剩餘';
    } else if (currentLesson <= 2) {
        statWpm.innerText = charUnpractisedPool.length;
        if (remainingLabel) remainingLabel.innerText = '剩餘';
    } else {
        statWpm.innerText = comboUnpractisedPool.length;
        if (remainingLabel) remainingLabel.innerText = '剩餘組合';
    }
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

    // statWpm 由 updateRoundProgress 依課程設定，此處不覆蓋
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
            state.isFinished = true;
            updateStats();
            if (currentLesson !== 5) {
                // 字符課程：播音確認 → 800ms 後進下一題
                // 熟練度與跳課判斷統一交由 endRound 處理（整輪結算）
                playLessonAudio().then(() => {
                    setTimeout(() => advanceSession(), 800);
                });
            } else {
                // 單字課程：播字元音 → 1秒後播整字音訊 → 2秒後進下一字
                playCharAudio(targetChar).then(() => {
                    setTimeout(() => {
                        playAudio(state.word.id);
                        setTimeout(() => advanceSession(), 2000);
                    }, 1000);
                });
            }
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
        if (currentLesson !== 5) {
            translationDisplay.innerText = state.word.chinese;
        } else {
            translationDisplay.innerText = `${state.word.chinese} / ${state.word.english}`;
        }
    }

    renderText();
    hiddenInput.value = '';
    hiddenInput.focus();

    // 字符課程：初始化時先播放音訊，再等使用者輸入
    if (currentLesson !== 5) {
        playLessonAudio();
    }
}

document.addEventListener('click', (e) => {
    if (e.target.closest('#lesson-select')) return;
    hiddenInput.focus();
});
window.addEventListener('keydown', handleKeyDown);
resetBtn.addEventListener('click', () => {
    resetBtn.style.transform = 'scale(0.95)';
    setTimeout(() => resetBtn.style.transform = '', 100);
    startSession();
});

// ── 初始化字符快取
initLCC();

// ── 課程選單事件
const lessonSelect = document.getElementById('lesson-select');
if (lessonSelect) {
    lessonSelect.value = String(currentLesson);
    lessonSelect.addEventListener('change', () => {
        state.isFinished = true;
        currentLesson = Number(lessonSelect.value);
        startSession();
    });
}

renderKeyboard();
loadWords().then(() => {
    buildCharAudioMap();
    startSession();
});
