"""將 audio/cons_<cp>.mp3 匯入 thai_words.db 的 cons_audio 表。

DB 路徑預設為主專案目錄的 thai_words.db（由 server.py 讀取）。
建立 cons_audio(char TEXT PRIMARY KEY, audio BLOB) 表並 upsert 全部 44 個。

執行：python import_cons_audio.py
"""
import os
import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stderr.reconfigure(encoding='utf-8', errors='replace')

# 主專案 DB 路徑（向上兩層至 .claude/worktrees/<name>/.. = 主專案）
HERE = os.path.dirname(os.path.abspath(__file__))
MAIN_PROJECT = os.path.normpath(os.path.join(HERE, '..', '..', '..'))
DB_PATH = os.path.join(MAIN_PROJECT, 'thai_words.db')

if not os.path.exists(DB_PATH):
    print(f'[ERROR] 找不到 DB：{DB_PATH}')
    sys.exit(1)

AUDIO_DIR = os.path.join(HERE, 'audio')

# 44 個子音（依傳統順序，與 add_consonant_audio.py 一致）
CONSONANTS = [
    'ก','ข','ฃ','ค','ฅ','ฆ','ง',
    'จ','ฉ','ช','ซ','ฌ','ญ',
    'ฎ','ฏ','ฐ','ฑ','ฒ','ณ',
    'ด','ต','ถ','ท','ธ','น',
    'บ','ป','ผ','ฝ','พ','ฟ','ภ','ม',
    'ย','ร','ล','ว',
    'ศ','ษ','ส','ห','ฬ',
    'อ','ฮ',
]
assert len(CONSONANTS) == 44

conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

cur.execute('''
    CREATE TABLE IF NOT EXISTS cons_audio (
        char  TEXT PRIMARY KEY,
        audio BLOB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
''')

inserted = 0
updated = 0
missing = []

for char in CONSONANTS:
    cp = f'{ord(char):04x}'
    filepath = os.path.join(AUDIO_DIR, f'cons_{cp}.mp3')
    if not os.path.exists(filepath):
        missing.append((char, filepath))
        continue
    with open(filepath, 'rb') as f:
        data = f.read()
    cur.execute('SELECT 1 FROM cons_audio WHERE char=?', (char,))
    exists = cur.fetchone() is not None
    cur.execute(
        'INSERT INTO cons_audio(char, audio) VALUES(?, ?) '
        'ON CONFLICT(char) DO UPDATE SET audio=excluded.audio, created_at=CURRENT_TIMESTAMP',
        (char, data),
    )
    if exists:
        updated += 1
    else:
        inserted += 1
    print(f'[OK] {char} (cp={cp}) → {len(data)} bytes')

conn.commit()

cur.execute('SELECT COUNT(*) FROM cons_audio')
total = cur.fetchone()[0]
conn.close()

print(f'\n=== 完成 ===')
print(f'新增 {inserted} / 更新 {updated} / 缺 mp3 {len(missing)}')
print(f'cons_audio 表總筆數：{total}')
print(f'DB：{DB_PATH}')

if missing:
    print('\n缺少的 mp3：')
    for c, p in missing:
        print(f'  {c} → {p}')
