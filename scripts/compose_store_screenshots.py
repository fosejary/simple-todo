#!/usr/bin/env python3
"""
Compose Play Store phone screenshots (1080x1920) from raw Expo-web captures.

Takes 6 raw screenshots (412x915) from assets/store/raw/ and composites each
onto a 1080x1920 canvas with a brand-gradient background, a two-line marketing
caption, and a subtle phone frame around the app screenshot.
"""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
RAW_DIR = ROOT / "assets" / "store" / "raw"
OUT_DIR = ROOT / "assets" / "store"

CANVAS_W, CANVAS_H = 1080, 1920
BG_TOP = (37, 99, 235)      # #2563EB brand blue
BG_BOTTOM = (30, 58, 138)   # #1E3A8A deeper blue

CAPTION_AREA_H = 420        # top area for caption
FRAME_PAD = 24              # padding inside phone body around screenshot
FRAME_RADIUS = 72           # rounded corners of the phone body
SCREEN_RADIUS = 44          # inner screenshot rounding
FRAME_BG = (255, 255, 255)  # phone body color
FRAME_BOTTOM_MARGIN = 80    # bottom breathing room

FONT_PATH = "/System/Library/Fonts/AppleSDGothicNeo.ttc"

# (raw filename, headline, sub-headline)
SHOTS = [
    ("01-today.png",          "오늘만, 딱 오늘만",          "집중해야 할 일이 한눈에"),
    ("02-detail-sheet.png",   "큰 일도 작게 쪼개서",         "서브태스크로 끝까지 완료"),
    ("03-categories.png",     "내 삶을 카테고리로",          "업무·운동·공부를 깔끔하게"),
    ("04-category-detail.png","원하는 분류만 골라보기",      "카테고리별로 집중 모드"),
    ("05-calendar.png",       "매일의 성취를 한눈에",         "캘린더로 쌓이는 기록"),
    ("06-completed.png",      "체크하는 그 쾌감",            "14일 연속, 리듬을 유지하세요"),
]


def make_background() -> Image.Image:
    bg = Image.new("RGB", (CANVAS_W, CANVAS_H), BG_TOP)
    px = bg.load()
    for y in range(CANVAS_H):
        t = y / (CANVAS_H - 1)
        r = int(BG_TOP[0] * (1 - t) + BG_BOTTOM[0] * t)
        g = int(BG_TOP[1] * (1 - t) + BG_BOTTOM[1] * t)
        b = int(BG_TOP[2] * (1 - t) + BG_BOTTOM[2] * t)
        for x in range(CANVAS_W):
            px[x, y] = (r, g, b)
    return bg


def load_font(size: int, bold: bool = True) -> ImageFont.FreeTypeFont:
    # Apple SD Gothic Neo.ttc faces: 0=Thin, ..., pick 8=Bold (approx), fall back.
    for idx in ([8, 6, 4, 0] if bold else [4, 2, 0]):
        try:
            return ImageFont.truetype(FONT_PATH, size, index=idx)
        except Exception:
            continue
    return ImageFont.load_default()


def rounded_mask(size: tuple[int, int], radius: int) -> Image.Image:
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size[0] - 1, size[1] - 1), radius=radius, fill=255)
    return mask


def draw_caption(canvas: Image.Image, headline: str, sub: str):
    draw = ImageDraw.Draw(canvas)
    headline_font = load_font(76, bold=True)
    sub_font = load_font(40, bold=False)

    hw = draw.textlength(headline, font=headline_font)
    sw = draw.textlength(sub, font=sub_font)

    hy = 110
    sy = hy + 96

    draw.text(((CANVAS_W - hw) / 2, hy), headline, font=headline_font, fill=(255, 255, 255))
    draw.text(((CANVAS_W - sw) / 2, sy), sub, font=sub_font, fill=(219, 234, 254))  # #DBEAFE


def compose_one(raw_path: Path, headline: str, sub: str, out_path: Path):
    canvas = make_background()
    draw_caption(canvas, headline, sub)

    # Load raw and compute largest screenshot that fits below the caption
    raw = Image.open(raw_path).convert("RGBA")
    max_screen_h = CANVAS_H - CAPTION_AREA_H - FRAME_BOTTOM_MARGIN - 2 * FRAME_PAD
    max_screen_w = CANVAS_W - 2 * FRAME_PAD - 120  # keep ≥60px side breathing room

    raw_ratio = raw.width / raw.height
    # Fit by height first
    new_h = max_screen_h
    new_w = int(new_h * raw_ratio)
    if new_w > max_screen_w:
        new_w = max_screen_w
        new_h = int(new_w / raw_ratio)

    raw_resized = raw.resize((new_w, new_h), Image.LANCZOS)
    raw_resized.putalpha(rounded_mask((new_w, new_h), SCREEN_RADIUS))

    # Phone body hugs the screenshot
    frame_w = new_w + 2 * FRAME_PAD
    frame_h = new_h + 2 * FRAME_PAD
    frame_x0 = (CANVAS_W - frame_w) // 2
    frame_y0 = CAPTION_AREA_H + (max_screen_h + 2 * FRAME_PAD - frame_h) // 2

    # Soft shadow under the frame
    shadow = Image.new("RGBA", (CANVAS_W, CANVAS_H), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow)
    sdraw.rounded_rectangle(
        (frame_x0 + 8, frame_y0 + 22, frame_x0 + frame_w + 8, frame_y0 + frame_h + 32),
        radius=FRAME_RADIUS,
        fill=(0, 0, 0, 120),
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(radius=32))
    canvas_rgba = canvas.convert("RGBA")
    canvas_rgba.alpha_composite(shadow)

    # Phone body (white rounded rect)
    body = Image.new("RGBA", (frame_w, frame_h), FRAME_BG + (255,))
    body.putalpha(rounded_mask((frame_w, frame_h), FRAME_RADIUS))
    canvas_rgba.alpha_composite(body, (frame_x0, frame_y0))

    # Place screenshot inside
    canvas_rgba.alpha_composite(raw_resized, (frame_x0 + FRAME_PAD, frame_y0 + FRAME_PAD))

    canvas_rgba.convert("RGB").save(out_path, "PNG", optimize=True)
    print(f"  -> {out_path.relative_to(ROOT)}  frame={frame_w}x{frame_h} inner={new_w}x{new_h}")


FG_W, FG_H = 1024, 500
FG_GRAD_LEFT = (37, 99, 235)    # #2563EB
FG_GRAD_RIGHT = (124, 58, 237)  # #7C3AED


def compose_feature_graphic(raw_today: Path, out_path: Path):
    # Diagonal-ish gradient left->right
    bg = Image.new("RGB", (FG_W, FG_H), FG_GRAD_LEFT)
    px = bg.load()
    for x in range(FG_W):
        t = x / (FG_W - 1)
        r = int(FG_GRAD_LEFT[0] * (1 - t) + FG_GRAD_RIGHT[0] * t)
        g = int(FG_GRAD_LEFT[1] * (1 - t) + FG_GRAD_RIGHT[1] * t)
        b = int(FG_GRAD_LEFT[2] * (1 - t) + FG_GRAD_RIGHT[2] * t)
        for y in range(FG_H):
            px[x, y] = (r, g, b)

    canvas = bg.convert("RGBA")
    draw = ImageDraw.Draw(canvas)

    # Left text block
    title_font = load_font(108, bold=True)
    tagline_font = load_font(44, bold=False)
    sub_font = load_font(34, bold=False)

    title = "SimpleTodo"
    tagline = "오늘 할 일에만 집중하세요"
    sub = "할 일 · 서브태스크 · 카테고리 · 캘린더"

    text_x = 72
    title_y = 120
    draw.text((text_x, title_y), title, font=title_font, fill=(255, 255, 255))
    draw.text((text_x + 4, title_y + 132), tagline, font=tagline_font, fill=(255, 255, 255, 240))
    draw.text((text_x + 4, title_y + 196), sub, font=sub_font, fill=(219, 234, 254))

    # Right side: small phone preview of the Today screen
    raw = Image.open(raw_today).convert("RGBA")
    preview_h = 460
    ratio = raw.width / raw.height
    preview_w = int(preview_h * ratio)
    raw_resized = raw.resize((preview_w, preview_h), Image.LANCZOS)
    raw_resized.putalpha(rounded_mask((preview_w, preview_h), 28))

    frame_pad = 12
    body_w = preview_w + 2 * frame_pad
    body_h = preview_h + 2 * frame_pad
    body_x = FG_W - body_w - 70
    body_y = (FG_H - body_h) // 2

    # Shadow
    shadow = Image.new("RGBA", (FG_W, FG_H), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle(
        (body_x + 6, body_y + 16, body_x + body_w + 6, body_y + body_h + 24),
        radius=42,
        fill=(0, 0, 0, 130),
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(radius=24))
    canvas.alpha_composite(shadow)

    body = Image.new("RGBA", (body_w, body_h), (255, 255, 255, 255))
    body.putalpha(rounded_mask((body_w, body_h), 42))
    canvas.alpha_composite(body, (body_x, body_y))
    canvas.alpha_composite(raw_resized, (body_x + frame_pad, body_y + frame_pad))

    # Decorative checkmark badge top-left (brand accent)
    badge_size = 96
    badge_x, badge_y = 72, 50
    badge = Image.new("RGBA", (badge_size, badge_size), (0, 0, 0, 0))
    bdraw = ImageDraw.Draw(badge)
    bdraw.rounded_rectangle((0, 0, badge_size - 1, badge_size - 1),
                            radius=24, fill=(255, 255, 255, 50))
    # Check mark
    bdraw.line([(24, 50), (42, 68), (72, 30)], fill=(255, 255, 255, 255), width=8)
    canvas.alpha_composite(badge, (badge_x, badge_y))

    canvas.convert("RGB").save(out_path, "PNG", optimize=True)
    print(f"  -> {out_path.relative_to(ROOT)}  ({FG_W}x{FG_H})")


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for i, (fname, headline, sub) in enumerate(SHOTS, start=1):
        raw = RAW_DIR / fname
        if not raw.exists():
            print(f"SKIP: missing {raw}")
            continue
        out = OUT_DIR / f"screenshot-{i}.png"
        print(f"[{i}/{len(SHOTS)}] {headline} | {sub}")
        compose_one(raw, headline, sub, out)

    raw_today = RAW_DIR / "01-today.png"
    if raw_today.exists():
        print("\n[feature graphic]")
        compose_feature_graphic(raw_today, OUT_DIR / "feature-graphic.png")
    print("\nDone.")


if __name__ == "__main__":
    main()
