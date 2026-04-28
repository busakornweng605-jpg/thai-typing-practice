"""補充 44 個泰文子音名稱（如 ไก่, หนู, ใบไม้）至 words.json 與 audio/ 資料夾。

執行：python add_consonant_audio.py
若名稱已存在於 words.json 則跳過；若 mp3 已存在則跳過下載。
"""
import json
import os
import sys
import time
import urllib.parse
import urllib.request

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stderr.reconfigure(encoding='utf-8', errors='replace')

# 44 個子音 → (名稱, 拼音, 中文)
CONSONANT_INFO = [
    ('ก', 'ไก่',     'kɔ̀ɔ kài',       '雞'),
    ('ข', 'ไข่',     'khɔ̌ɔ khài',     '蛋'),
    ('ฃ', 'ขวด',    'khɔ̌ɔ khùat',    '瓶'),
    ('ค', 'ควาย',   'khɔɔ khwaai',    '水牛'),
    ('ฅ', 'คน',     'khɔɔ khon',      '人'),
    ('ฆ', 'ระฆัง',  'khɔɔ ra-khang',  '鐘'),
    ('ง', 'งู',     'ngɔɔ nguu',      '蛇'),
    ('จ', 'จาน',    'cɔɔ caan',       '盤子'),
    ('ฉ', 'ฉิ่ง',   'chɔ̌ɔ chìng',    '鈸'),
    ('ช', 'ช้าง',   'chɔɔ cháang',    '大象'),
    ('ซ', 'โซ่',    'sɔɔ sôo',        '鏈條'),
    ('ฌ', 'เฌอ',    'chɔɔ chəə',      '樹'),
    ('ญ', 'หญิง',   'yɔɔ yǐng',       '女人'),
    ('ฎ', 'ชฎา',    'dɔɔ cha-daa',    '傳統頭飾'),
    ('ฏ', 'ปฏัก',   'tɔɔ pa-tàk',     '矛'),
    ('ฐ', 'ฐาน',    'thɔ̌ɔ thǎan',    '基座'),
    ('ฑ', 'มณโฑ',   'thɔɔ mon-thoo',  '蒙托夫人'),
    ('ฒ', 'ผู้เฒ่า','thɔɔ phûu-thâo', '老人'),
    ('ณ', 'เณร',    'nɔɔ neen',       '小沙彌'),
    ('ด', 'เด็ก',   'dɔɔ dèk',        '小孩'),
    ('ต', 'เต่า',   'tɔɔ tào',        '烏龜'),
    ('ถ', 'ถุง',    'thɔ̌ɔ thǔng',    '袋子'),
    ('ท', 'ทหาร',   'thɔɔ tha-hǎan',  '軍人'),
    ('ธ', 'ธง',     'thɔɔ thong',     '旗幟'),
    ('น', 'หนู',    'nɔɔ nǔu',        '老鼠'),
    ('บ', 'ใบไม้',  'bɔɔ bai-mái',    '葉子'),
    ('ป', 'ปลา',    'pɔɔ plaa',       '魚'),
    ('ผ', 'ผึ้ง',   'phɔ̌ɔ phûeng',   '蜜蜂'),
    ('ฝ', 'ฝา',     'fɔ̌ɔ fǎa',       '蓋子'),
    ('พ', 'พาน',    'phɔɔ phaan',     '托盤'),
    ('ฟ', 'ฟัน',    'fɔɔ fan',        '牙齒'),
    ('ภ', 'สำเภา',  'phɔɔ sǎm-phao',  '帆船'),
    ('ม', 'ม้า',    'mɔɔ máa',        '馬'),
    ('ย', 'ยักษ์',  'yɔɔ yák',        '巨人'),
    ('ร', 'เรือ',   'rɔɔ rʉua',       '船'),
    ('ล', 'ลิง',    'lɔɔ ling',       '猴子'),
    ('ว', 'แหวน',   'wɔɔ wǎen',       '戒指'),
    ('ศ', 'ศาลา',   'sɔ̌ɔ sǎa-laa',   '涼亭'),
    ('ษ', 'ฤๅษี',   'sɔ̌ɔ rʉʉ-sǐi',   '隱士'),
    ('ส', 'เสือ',   'sɔ̌ɔ sʉ̌ua',     '老虎'),
    ('ห', 'หีบ',    'hɔ̌ɔ hìip',      '箱子'),
    ('ฬ', 'จุฬา',   'lɔɔ cù-laa',     '風箏'),
    ('อ', 'อ่าง',   'ɔɔ àang',        '水盆'),
    ('ฮ', 'นกฮูก',  'hɔɔ nók-hûuk',   '貓頭鷹'),
]

AUDIO_DIR = 'audio'
WORDS_FILE = 'words.json'

os.makedirs(AUDIO_DIR, exist_ok=True)

with open(WORDS_FILE, 'r', encoding='utf-8') as f:
    words = json.load(f)

thai_to_id = {w['thai_word']: w['id'] for w in words}
max_id = max(w['id'] for w in words)

added = 0
downloaded = 0
skipped = 0

for char, name, rom, meaning in CONSONANT_INFO:
    # 已在 words.json 中
    if name in thai_to_id:
        existing_id = thai_to_id[name]
        filepath = os.path.join(AUDIO_DIR, f'{existing_id}.mp3')
        if os.path.exists(filepath):
            skipped += 1
            print(f'[SKIP] {char}.{name} 已存在 (id={existing_id})')
            continue
        # words 有但 audio 沒有，補下載
        target_id = existing_id
    else:
        max_id += 1
        target_id = max_id
        words.append({
            'id': target_id,
            'rank': target_id,
            'thai_word': name,
            'kbd_seq': '',
            'chinese': meaning,
            'english': '',
        })
        added += 1

    filepath = os.path.join(AUDIO_DIR, f'{target_id}.mp3')
    if os.path.exists(filepath):
        print(f'[KEEP] {char}.{name} mp3 已存在 (id={target_id})')
        continue

    # Google TTS
    url = f'https://translate.googleapis.com/translate_tts?ie=UTF-8&q={urllib.parse.quote(name)}&tl=th&client=tw-ob'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
        with open(filepath, 'wb') as f:
            f.write(data)
        downloaded += 1
        print(f'[OK]   {char}.{name} → {filepath} ({len(data)} bytes)')
    except Exception as e:
        print(f'[FAIL] {char}.{name} → {e}')
    time.sleep(0.3)

# 寫回 words.json
with open(WORDS_FILE, 'w', encoding='utf-8') as f:
    json.dump(words, f, ensure_ascii=False, indent=2)

print(f'\n=== 完成 ===')
print(f'新增 words.json 條目：{added}')
print(f'下載 mp3：{downloaded}')
print(f'已存在略過：{skipped}')
print(f'words.json 總數：{len(words)}')
