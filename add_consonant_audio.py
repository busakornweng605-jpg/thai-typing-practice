"""下載 44 個泰文子音字母誦讀音訊（如 ก ไก่, ญ หญิง, ษ ฤๅษี）。

格式：「{子音}อ {名稱}」例如「กอ ไก่」「ยอ หญิง」「สอ ฤๅษี」
存放：audio/cons_<codepoint>.mp3（如 audio/cons_0e01.mp3 對應 ก）
不修改 words.json，避免與單字 ID 命名衝突。

執行：python add_consonant_audio.py
"""
import os
import sys
import time
import urllib.parse
import urllib.request

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stderr.reconfigure(encoding='utf-8', errors='replace')

# 44 個子音 → (字母誦讀名稱, 名稱詞)
# 字母誦讀名稱保留原字符 + อ，讓 Google TTS 自動發出 "kɔɔ"、"yɔɔ" 等音
CONSONANT_DATA = [
    ('ก', 'ไก่'),    ('ข', 'ไข่'),    ('ฃ', 'ขวด'),
    ('ค', 'ควาย'),   ('ฅ', 'คน'),     ('ฆ', 'ระฆัง'),
    ('ง', 'งู'),
    ('จ', 'จาน'),    ('ฉ', 'ฉิ่ง'),  ('ช', 'ช้าง'),
    ('ซ', 'โซ่'),    ('ฌ', 'เฌอ'),    ('ญ', 'หญิง'),
    ('ฎ', 'ชฎา'),    ('ฏ', 'ปฏัก'),
    ('ฐ', 'ฐาน'),    ('ฑ', 'มณโฑ'),   ('ฒ', 'ผู้เฒ่า'),
    ('ณ', 'เณร'),
    ('ด', 'เด็ก'),   ('ต', 'เต่า'),
    ('ถ', 'ถุง'),    ('ท', 'ทหาร'),   ('ธ', 'ธง'),
    ('น', 'หนู'),
    ('บ', 'ใบไม้'),  ('ป', 'ปลา'),
    ('ผ', 'ผึ้ง'),   ('ฝ', 'ฝา'),
    ('พ', 'พาน'),    ('ฟ', 'ฟัน'),    ('ภ', 'สำเภา'),
    ('ม', 'ม้า'),
    ('ย', 'ยักษ์'),  ('ร', 'เรือ'),   ('ล', 'ลิง'),
    ('ว', 'แหวน'),
    ('ศ', 'ศาลา'),   ('ษ', 'ฤๅษี'),   ('ส', 'เสือ'),
    ('ห', 'หีบ'),    ('ฬ', 'จุฬา'),
    ('อ', 'อ่าง'),   ('ฮ', 'นกฮูก'),
]

assert len(CONSONANT_DATA) == 44, f'應為 44 個子音，實為 {len(CONSONANT_DATA)}'

# 部分子音的標準發音與字符不同（如 ญ→ยอ），用查表覆蓋
# 鍵：子音字符；值：用於 TTS 的「字母誦讀名」（替代預設的 char+อ）
CONS_NAME_OVERRIDE = {
    'ฃ': 'ขอ',   # 廢除字符，發音同 ข
    'ฅ': 'คอ',   # 廢除字符，發音同 ค
    'ฆ': 'คอ',
    'ฌ': 'ชอ',
    'ญ': 'ยอ',   # 用為起首子音時發 y
    'ฎ': 'ดอ',
    'ฏ': 'ตอ',
    'ฐ': 'ถอ',
    'ฑ': 'ทอ',
    'ฒ': 'ทอ',
    'ณ': 'นอ',
    'ธ': 'ทอ',
    'ภ': 'พอ',
    'ศ': 'สอ',
    'ษ': 'สอ',
    'ฬ': 'ลอ',
}

def cons_recitation_name(char: str) -> str:
    """產生子音字母誦讀名（如 'กอ', 'ยอ', 'สอ'）"""
    if char in CONS_NAME_OVERRIDE:
        return CONS_NAME_OVERRIDE[char]
    return char + 'อ'

AUDIO_DIR = 'audio'
os.makedirs(AUDIO_DIR, exist_ok=True)

ok = 0
fail = 0
skip = 0

for char, name in CONSONANT_DATA:
    cp = f'{ord(char):04x}'
    filepath = os.path.join(AUDIO_DIR, f'cons_{cp}.mp3')
    if os.path.exists(filepath):
        print(f'[SKIP] {char}.{name} 已存在 → {filepath}')
        skip += 1
        continue

    cons_name = cons_recitation_name(char)
    tts_text = f'{cons_name} {name}'  # 例如 "กอ ไก่", "ยอ หญิง", "สอ ฤๅษี"

    url = (
        'https://translate.googleapis.com/translate_tts'
        f'?ie=UTF-8&q={urllib.parse.quote(tts_text)}&tl=th&client=tw-ob'
    )
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
        with open(filepath, 'wb') as f:
            f.write(data)
        print(f'[OK]   {char}.{name} ({tts_text}) → {filepath} ({len(data)} bytes)')
        ok += 1
    except Exception as e:
        print(f'[FAIL] {char}.{name} → {e}')
        fail += 1
    time.sleep(0.3)

print(f'\n=== 完成 === 成功 {ok} / 略過 {skip} / 失敗 {fail}（共 {len(CONSONANT_DATA)}）')
