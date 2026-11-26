"""Compose Sunlist Play Store assets from real app captures.

Inputs   assets/store/sunlist/raw/<lang>/{1-today,2-detail,3-calendar,4-categories,5-dark}.png
         (1030x2230 captures of the running app, one seeded set per language)
Outputs  assets/store/sunlist/<lang>/screenshot-1..5.png   1080x1920 phone screenshots
         assets/store/sunlist/<lang>/feature-graphic.png    1024x500
         assets/store/sunlist/icon-512.png                  512x512 store icon
         assets/widget-preview.png                          widget picker preview

Usage: python3 scripts/compose_store_assets.py
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "assets" / "store" / "sunlist" / "raw"
OUT = ROOT / "assets" / "store" / "sunlist"
FONTS = ROOT / "assets" / "fonts"
JA_BOLD = "/System/Library/Fonts/ヒラギノ角ゴシック W6.ttc"
JA_REG = "/System/Library/Fonts/ヒラギノ角ゴシック W3.ttc"

CREAM, INK, SECOND = (247, 246, 243), (26, 26, 24), (85, 82, 76)
NIGHT, NIGHT_INK = (18, 18, 17), (239, 237, 232)
SUN, TRACK, HORIZON = (238, 143, 31), (226, 219, 206), (205, 198, 186)

LANGS = ["en", "ko", "ja", "es"]
SHOTS = ["1-today", "2-detail", "3-calendar", "4-categories", "5-dark"]
CAPTIONS = {
    "en": ["Watch the sun cross your day", "Reminders, repeats and subtasks in one place",
           "Plan any day on the calendar", "Keep work, home and errands apart", "Easy on the eyes at night"],
    "ko": ["할 일을 끝낼수록 해가 하루를 건너가요", "알림, 반복, 세부 항목을 한 곳에서",
           "캘린더에서 어느 날이든 계획해요", "업무, 개인, 장보기를 나눠서 정리", "밤에는 눈이 편한 다크 모드"],
    "ja": ["タスクを終えるたび、太陽が一日を進む", "通知・繰り返し・サブタスクをひとつの画面で",
           "カレンダーでどの日も計画", "仕事・プライベート・買い物を分けて整理", "夜も目にやさしいダークモード"],
    "es": ["Cada tarea hecha mueve el sol de tu día", "Recordatorios, repeticiones y subtareas en un solo lugar",
           "Planifica cualquier día en el calendario", "Separa trabajo, casa y recados", "Modo oscuro para la noche"],
}
TAGLINES = {
    "en": "To-do list, reminders & widget",
    "ko": "오늘 할 일 목록 · 알림 · 위젯",
    "ja": "ToDoリスト・リマインダー・ウィジェット",
    "es": "Lista de tareas, recordatorios y widget",
}


def font(lang: str, size: int, bold=True) -> ImageFont.FreeTypeFont:
    if lang == "ja":
        return ImageFont.truetype(JA_BOLD if bold else JA_REG, size)
    return ImageFont.truetype(str(FONTS / ("GothicA1-SemiBold.ttf" if bold else "GothicA1-Regular.ttf")), size)


def wrap(draw, text, fnt, max_w):
    """Greedy wrap on spaces; CJK without spaces wraps per character."""
    units = text.split(" ") if " " in text else list(text)
    sep = " " if " " in text else ""
    lines, cur = [], ""
    for u in units:
        cand = (cur + sep + u) if cur else u
        if draw.textlength(cand, font=fnt) <= max_w:
            cur = cand
        else:
            lines.append(cur)
            cur = u
    if cur:
        lines.append(cur)
    return lines


def rounded(im: Image.Image, r: int) -> Image.Image:
    mask = Image.new("L", im.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, im.width - 1, im.height - 1), r, fill=255)
    out = im.convert("RGBA")
    out.putalpha(mask)
    return out


def screenshot(lang: str, i: int):
    dark = SHOTS[i] == "5-dark"
    W, H = 1080, 1920
    bg = NIGHT if dark else CREAM
    fg = NIGHT_INK if dark else INK
    canvas = Image.new("RGB", (W, H), bg)
    d = ImageDraw.Draw(canvas)

    fnt = font(lang, 66)
    lines = wrap(d, CAPTIONS[lang][i], fnt, 900)
    lh = 86
    top = 150 - (len(lines) - 1) * lh // 2
    for n, line in enumerate(lines):
        w = d.textlength(line, font=fnt)
        d.text(((W - w) / 2, top + n * lh), line, font=fnt, fill=fg)

    shot = Image.open(RAW / lang / f"{SHOTS[i]}.png").convert("RGB")
    sw = 840
    shot = shot.resize((sw, round(shot.height * sw / shot.width)), Image.LANCZOS)
    phone = rounded(shot, 56)
    x, y = (W - sw) // 2, 400
    # soft neutral shadow
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle((x, y + 18, x + sw, y + phone.height + 18), 56,
                                             fill=(0, 0, 0, 90 if dark else 40))
    shadow = shadow.filter(ImageFilter.GaussianBlur(28))
    canvas.paste(shadow, (0, 0), shadow)
    canvas.paste(phone, (x, y), phone)
    ImageDraw.Draw(canvas).rounded_rectangle((x, y, x + sw - 1, y + phone.height), 56,
                                             outline=(60, 58, 54) if dark else (222, 217, 208), width=3)
    dest = OUT / lang / f"screenshot-{i + 1}.png"
    dest.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(dest)


def sun_mark(d: ImageDraw.ImageDraw, cx, base_y, R, track_w):
    mid = R - track_w / 2
    d.line((cx - R - 60, base_y, cx + R + 60, base_y), fill=HORIZON, width=6)
    box = (cx - R, base_y - R, cx + R, base_y + R)
    d.arc(box, 180, 360, fill=TRACK, width=track_w)
    d.arc(box, 180, 270, fill=SUN, width=track_w)
    cap = track_w / 2
    d.ellipse((cx - mid - cap, base_y - cap, cx - mid + cap, base_y + cap), fill=SUN)
    d.ellipse((cx + mid - cap, base_y - cap, cx + mid + cap, base_y + cap), fill=TRACK)
    sr = R * 0.42
    sx, sy = cx, base_y - mid
    halo = sr * 1.45
    d.ellipse((sx - halo, sy - halo, sx + halo, sy + halo), fill=(250, 226, 196))
    d.ellipse((sx - sr, sy - sr, sx + sr, sy + sr), fill=SUN)
    pts = [(sx - sr * 0.42, sy + sr * 0.02), (sx - sr * 0.10, sy + sr * 0.34), (sx + sr * 0.46, sy - sr * 0.30)]
    cw = sr * 0.22
    d.line(pts, fill=INK, width=int(cw), joint="curve")
    for px, py in pts:
        d.ellipse((px - cw / 2, py - cw / 2, px + cw / 2, py + cw / 2), fill=INK)


def feature_graphic(lang: str):
    k = 2
    W, H = 1024 * k, 500 * k
    im = Image.new("RGB", (W, H), CREAM)
    d = ImageDraw.Draw(im)
    sun_mark(d, 790 * k, 440 * k, 190 * k, 24 * k)
    word = ImageFont.truetype(str(FONTS / "GowunDodum-Regular.ttf"), 132 * k)
    d.text((72 * k, 150 * k), "Sunlist", font=word, fill=INK)
    tag = font(lang, (26 if lang == 'ja' else 30) * k, bold=False)
    lines = wrap(d, TAGLINES[lang], tag, 520 * k)
    for n, line in enumerate(lines):
        d.text((78 * k, (318 + n * 42) * k), line, font=tag, fill=SECOND)
    im.resize((1024, 500), Image.LANCZOS).save(OUT / lang / "feature-graphic.png")


def widget_preview():
    k = 2
    W, H = 500 * k, 240 * k
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((0, 0, W - 1, H - 1), 40 * k, fill=(255, 255, 255, 255))
    f_b, f_r = font("en", 30 * k), font("en", 28 * k, bold=False)
    d.text((32 * k, 26 * k), "Wednesday, Nov 25", font=f_b, fill=INK)
    d.text((W - 92 * k, 28 * k), "2/5", font=font("en", 26 * k), fill=(165, 90, 8))
    d.rounded_rectangle((32 * k, 74 * k, W - 32 * k, 82 * k), 4 * k, fill=(233, 228, 218))
    d.rounded_rectangle((32 * k, 74 * k, 32 * k + (W - 64 * k) * 2 // 5, 82 * k), 4 * k, fill=SUN)
    rows = [("Draft quarterly report", False, None), ("Grocery run", False, (255, 246, 220)),
            ("Morning stretch, 10 min", True, None)]
    y = 98 * k
    for title, done, tint in rows:
        if tint:
            d.rounded_rectangle((20 * k, y - 4 * k, W - 20 * k, y + 40 * k), 18 * k, fill=tint)
        cx, cy, r = 50 * k, y + 18 * k, 13 * k
        if done:
            d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=SUN)
            d.line([(cx - 6 * k, cy), (cx - 1 * k, cy + 5 * k), (cx + 7 * k, cy - 5 * k)], fill=INK, width=4 * k)
        else:
            d.ellipse((cx - r, cy - r, cx + r, cy + r), outline=(196, 191, 181), width=4 * k)
        d.text((80 * k, y + 2 * k), title, font=f_r, fill=(119, 115, 108) if done else INK)
        y += 46 * k
    im.resize((500, 240), Image.LANCZOS).save(ROOT / "assets" / "widget-preview.png")


def main():
    for lang in LANGS:
        for i in range(len(SHOTS)):
            screenshot(lang, i)
        feature_graphic(lang)
    Image.open(ROOT / "assets" / "icon.png").convert("RGB").resize((512, 512), Image.LANCZOS).save(OUT / "icon-512.png")
    widget_preview()
    print("done:", ", ".join(LANGS))


if __name__ == "__main__":
    main()
