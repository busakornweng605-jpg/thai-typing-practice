import os
import shutil
import sqlite3


ROOT = os.path.dirname(os.path.abspath(__file__))
PUBLIC_DIR = os.path.join(ROOT, "public")
DB_PATH = os.path.join(ROOT, "thai_words.db")

STATIC_FILES = [
    "index.html",
    "app.js",
    "style.css",
    "words.json",
    "泰文鍵盤練習.ico",
    "泰文鍵盤練習.png",
]


def safe_reset_dir(path):
    target = os.path.abspath(path)
    root = os.path.abspath(ROOT)
    if not target.startswith(root + os.sep):
        raise RuntimeError(f"拒絕刪除專案外目錄：{target}")
    if os.path.exists(target):
        shutil.rmtree(target)
    os.makedirs(target, exist_ok=True)


def copy_file(name):
    src = os.path.join(ROOT, name)
    if os.path.exists(src):
        shutil.copy2(src, os.path.join(PUBLIC_DIR, name))


def copy_audio_dir():
    src = os.path.join(ROOT, "audio")
    dst = os.path.join(PUBLIC_DIR, "audio")
    if os.path.exists(src):
        shutil.copytree(src, dst)
    else:
        os.makedirs(dst, exist_ok=True)
    return dst


def combo_audio_name(text):
    return "_".join(f"{ord(ch):04x}" for ch in text)


def export_combo_audio(audio_dir):
    if not os.path.exists(DB_PATH):
        return 0
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    try:
        rows = cur.execute("SELECT text, audio FROM tts_audio").fetchall()
    except sqlite3.OperationalError:
        rows = []
    conn.close()

    count = 0
    for text, audio in rows:
        if not text or not audio:
            continue
        path = os.path.join(audio_dir, f"combo_{combo_audio_name(text)}.mp3")
        with open(path, "wb") as f:
            f.write(bytes(audio))
        count += 1
    return count


def main():
    safe_reset_dir(PUBLIC_DIR)
    for name in STATIC_FILES:
        copy_file(name)
    audio_dir = copy_audio_dir()
    combo_count = export_combo_audio(audio_dir)
    with open(os.path.join(PUBLIC_DIR, ".nojekyll"), "w", encoding="utf-8") as f:
        f.write("")
    print(f"已建立 GitHub Pages 靜態輸出：{PUBLIC_DIR}")
    print(f"已匯出課程三/四 combo 音訊：{combo_count} 筆")


if __name__ == "__main__":
    main()
