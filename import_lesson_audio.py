import argparse
import os
import sqlite3
import time
import urllib.parse
import urllib.request


DB_PATH = "thai_words.db"
AUDIO_DIR = "audio"
CONSONANTS = "กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮ"


def read_mp3(path):
    if not os.path.exists(path):
        return None
    with open(path, "rb") as f:
        return f.read()


def upsert_audio(cur, table, char, audio):
    cur.execute(
        f"""
        CREATE TABLE IF NOT EXISTS {table} (
            char TEXT PRIMARY KEY,
            audio BLOB NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    cur.execute(
        f"INSERT INTO {table}(char, audio) VALUES(?, ?) "
        "ON CONFLICT(char) DO UPDATE SET audio=excluded.audio, created_at=CURRENT_TIMESTAMP",
        (char, audio),
    )


def import_cons_audio(cur):
    count = 0
    missing = []
    for char in CONSONANTS:
        cp = f"{ord(char):04x}"
        audio = read_mp3(os.path.join(AUDIO_DIR, f"cons_{cp}.mp3"))
        if not audio:
            missing.append(char)
            continue
        upsert_audio(cur, "cons_audio", char, audio)
        count += 1
    return count, missing


def import_char_audio(cur):
    count = 0
    missing = []
    for filename in sorted(os.listdir(AUDIO_DIR)):
        if not filename.startswith("char_") or not filename.endswith(".mp3"):
            continue
        cp = filename[5:-4]
        try:
            char = chr(int(cp, 16))
        except ValueError:
            continue
        audio = read_mp3(os.path.join(AUDIO_DIR, filename))
        if not audio:
            missing.append(filename)
            continue
        upsert_audio(cur, "char_audio", char, audio)
        count += 1
    return count, missing


def fetch_google_tts(text):
    url = (
        "https://translate.googleapis.com/translate_tts"
        f"?ie=UTF-8&q={urllib.parse.quote(text)}&tl=th&client=tw-ob"
    )
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=12) as resp:
        return resp.read()


def import_tts_audio(cur, texts, delay):
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS tts_audio (
            text TEXT PRIMARY KEY,
            audio BLOB NOT NULL,
            source TEXT DEFAULT 'google_tts',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    inserted = 0
    skipped = 0
    failed = []
    for text in texts:
        exists = cur.execute("SELECT 1 FROM tts_audio WHERE text=?", (text,)).fetchone()
        if exists:
            skipped += 1
            continue
        try:
            audio = fetch_google_tts(text)
        except Exception as exc:
            failed.append((text, str(exc)))
            continue
        cur.execute(
            "INSERT INTO tts_audio(text, audio) VALUES(?, ?) "
            "ON CONFLICT(text) DO UPDATE SET audio=excluded.audio, created_at=CURRENT_TIMESTAMP",
            (text, audio),
        )
        inserted += 1
        if delay:
            time.sleep(delay)
    return inserted, skipped, failed


def lesson_combo_texts():
    vowels = [
        "ๅ", "ุ", "ู", "ึ", "ไ", "ำ", "ะ", "ั", "ํ", "ี",
        "ฤ", "โ", "เ", "้", "า", "แ", "ิ", "ฺ", "ื", "ใ",
    ]
    tones = ["๊", "็", "่", "๋", "์"]
    lesson3 = [c + v for v in vowels for c in CONSONANTS]
    lesson4 = [c + v + t for t in tones for v in vowels for c in CONSONANTS]
    return lesson3 + lesson4


def combo_audio_name(text):
    return "_".join(f"{ord(ch):04x}" for ch in text)


def export_combo_files(cur):
    os.makedirs(AUDIO_DIR, exist_ok=True)
    try:
        rows = cur.execute("SELECT text, audio FROM tts_audio").fetchall()
    except sqlite3.OperationalError:
        return 0
    count = 0
    for text, audio in rows:
        if not text or not audio:
            continue
        path = os.path.join(AUDIO_DIR, f"combo_{combo_audio_name(text)}.mp3")
        with open(path, "wb") as f:
            f.write(bytes(audio))
        count += 1
    return count


def main():
    parser = argparse.ArgumentParser(description="Import lesson audio into thai_words.db.")
    parser.add_argument("--with-combos", action="store_true", help="Fetch and store lesson 3-4 Google TTS audio.")
    parser.add_argument("--export-combo-files", action="store_true", help="Export tts_audio rows to audio/combo_*.mp3.")
    parser.add_argument("--delay", type=float, default=0.08, help="Delay between Google TTS requests.")
    args = parser.parse_args()

    if not os.path.exists(DB_PATH):
        raise SystemExit(f"找不到 {DB_PATH}")

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    cons_count, cons_missing = import_cons_audio(cur)
    char_count, char_missing = import_char_audio(cur)
    conn.commit()

    print(f"課程一 cons_audio：{cons_count} 筆，缺 {len(cons_missing)} 筆")
    print(f"課程二 char_audio：{char_count} 筆，缺 {len(char_missing)} 筆")

    if args.with_combos:
        texts = lesson_combo_texts()
        inserted, skipped, failed = import_tts_audio(cur, texts, args.delay)
        conn.commit()
        print(f"課程三/四 tts_audio：新增 {inserted} 筆，已存在 {skipped} 筆，失敗 {len(failed)} 筆")
        if failed:
            print("前 10 筆失敗：")
            for text, err in failed[:10]:
                print(f"  {text}: {err}")
    else:
        print("課程三/四：未預先抓取。使用 API 模式播放時會自動寫入 tts_audio。")

    if args.export_combo_files:
        combo_files = export_combo_files(cur)
        print(f"匯出課程三/四 combo_*.mp3：{combo_files} 筆")

    conn.close()


if __name__ == "__main__":
    main()
