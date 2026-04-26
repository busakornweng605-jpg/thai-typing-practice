import os
import sys
import time
import urllib.request
import urllib.parse

# 強制使用 UTF-8 輸出，避免 Windows cp950 編碼錯誤
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stderr.reconfigure(encoding='utf-8', errors='replace')

AUDIO_DIR = "audio"
os.makedirs(AUDIO_DIR, exist_ok=True)

# Kedmanee 鍵盤上所有泰文字元（子音、母音、聲調符號）
# 只包含 Unicode 範圍 U+0E00–U+0E7F 的泰文字元
THAI_CHARS = [
    # Row 1 lower
    'ๅ', 'ภ', 'ถ', 'ุ', 'ึ', 'ค', 'ต', 'จ', 'ข', 'ช',
    # Row 1 upper
    'ู', '๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙',
    # Row 2 lower
    'ๆ', 'ไ', 'ำ', 'พ', 'ะ', 'ั', 'ี', 'ร', 'น', 'ย', 'บ', 'ล', 'ฃ',
    # Row 2 upper
    'ฎ', 'ฑ', 'ธ', 'ํ', '๊', 'ณ', 'ฯ', 'ญ', 'ฐ', 'ฅ',
    # Row 3 lower (home row)
    'ฟ', 'ห', 'ก', 'ด', 'เ', '้', '่', 'า', 'ส', 'ว', 'ง',
    # Row 3 upper
    'ฤ', 'ฆ', 'ฏ', 'โ', 'ฌ', '็', '๋', 'ษ', 'ศ', 'ซ',
    # Row 4 lower
    'ผ', 'ป', 'แ', 'อ', 'ิ', 'ื', 'ท', 'ม', 'ใ', 'ฝ',
    # Row 4 upper
    'ฉ', 'ฮ', 'ฺ', '์', 'ฒ', 'ฬ', 'ฦ',
]

# 去重
THAI_CHARS = list(dict.fromkeys(THAI_CHARS))

def download_char_audio(char):
    cp = f"{ord(char):04x}"
    filepath = os.path.join(AUDIO_DIR, f"char_{cp}.mp3")
    if os.path.exists(filepath):
        print(f"[SKIP] U+{cp.upper()} {char} 已存在")
        return True
    url = f"https://translate.googleapis.com/translate_tts?ie=UTF-8&q={urllib.parse.quote(char)}&tl=th&client=tw-ob"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = resp.read()
        with open(filepath, "wb") as f:
            f.write(data)
        print(f"[OK]   U+{cp.upper()} {char} → char_{cp}.mp3 ({len(data)} bytes)")
        return True
    except Exception as e:
        print(f"[FAIL] U+{cp.upper()} {char} → {e}")
        return False

print(f"準備下載 {len(THAI_CHARS)} 個泰文字元音訊...")
success = 0
for char in THAI_CHARS:
    if download_char_audio(char):
        success += 1
    time.sleep(0.3)  # 避免過於頻繁請求

print(f"\n完成：{success}/{len(THAI_CHARS)} 個字元音訊已下載到 {AUDIO_DIR}/")
