import sqlite3
import json
import os
import sys

DB_PATH = "thai_words.db"
WORDS_JSON = "words.json"
AUDIO_DIR = "audio"

if not os.path.exists(DB_PATH):
    print(f"錯誤：找不到 {DB_PATH}")
    sys.exit(1)

os.makedirs(AUDIO_DIR, exist_ok=True)

conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

cur.execute(
    "SELECT id, rank, thai_word, kbd_seq, chinese, english FROM thai_words ORDER BY rank"
)
rows = cur.fetchall()

words = []
for id_, rank, thai_word, kbd_seq, chinese, english in rows:
    seq = kbd_seq[1:-1] if kbd_seq and kbd_seq.startswith("【") else (kbd_seq or "")
    words.append({
        "id": id_,
        "rank": rank,
        "thai_word": thai_word,
        "kbd_seq": seq,
        "chinese": chinese,
        "english": english
    })

with open(WORDS_JSON, "w", encoding="utf-8") as f:
    json.dump(words, f, ensure_ascii=False, separators=(",", ":"))

print(f"匯出 {len(words)} 個單字到 {WORDS_JSON}")

cur.execute("SELECT id, audio FROM thai_words WHERE audio IS NOT NULL")
audio_count = 0
for id_, audio_blob in cur:
    if audio_blob and audio_blob != b"none":
        path = os.path.join(AUDIO_DIR, f"{id_}.mp3")
        with open(path, "wb") as f:
            f.write(bytes(audio_blob))
        audio_count += 1

conn.close()
print(f"匯出 {audio_count} 個音訊檔到 {AUDIO_DIR}/")
