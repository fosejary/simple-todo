"""Generate Sunlist brand assets — direction B "하루의 빛".

Mark: the app's own "done" check — a sun-colored disc with an ink check —
sitting at the top of the sun's arc over a horizon line.

Outputs
  assets/adaptive-icon.png   transparent foreground (background color is set in app.json)
  assets/icon.png            opaque square icon
  assets/splash.png          1284x2778 splash (mark + wordmark)
  assets/notification-icon.png  96x96 white silhouette for Android status bar
  assets/favicon.png         48x48 web favicon

Everything stays inside the central ~60% so launcher masks never clip the mark.
Usage: python3 scripts/generate_adaptive_icon.py
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets"

CREAM = (247, 246, 243, 255)  # #F7F6F3  background
INK = (26, 26, 24, 255)  # #1A1A18
SUN = (238, 143, 31, 255)  # #EE8F1F
TRACK = (226, 219, 206, 255)  # arc track on cream
HORIZON = (205, 198, 186, 255)

SIZE = 1024
SCALE = 4  # supersample for clean edges


def draw_mark(d: ImageDraw.ImageDraw, cx: float, base_y: float, R: float, s: float = 1.0, silhouette=None):
    """Arc track, sunlit half, horizon, sun disc with check. `s` scales strokes."""
    track_w = 34 * s
    horizon_w = 18 * s
    sun_r = R * 0.56
    # PIL draws an arc's stroke inside its box, so the stroke centerline sits at R - w/2.
    mid = R - track_w / 2
    box = (cx - R, base_y - R, cx + R, base_y + R)
    cap = track_w / 2
    if silhouette is None:
        d.line((cx - R - 40 * s, base_y, cx + R + 40 * s, base_y), fill=HORIZON, width=int(horizon_w))
        d.arc(box, start=180, end=360, fill=TRACK, width=int(track_w))
        d.arc(box, start=180, end=270, fill=SUN, width=int(track_w))
        # round caps at both ends of the arc
        d.ellipse((cx - mid - cap, base_y - cap, cx - mid + cap, base_y + cap), fill=SUN)
        d.ellipse((cx + mid - cap, base_y - cap, cx + mid + cap, base_y + cap), fill=TRACK)
    sx, sy = cx, base_y - mid
    fill = SUN if silhouette is None else silhouette
    d.ellipse((sx - sun_r, sy - sun_r, sx + sun_r, sy + sun_r), fill=fill)
    # check inside the sun
    check = [
        (sx - sun_r * 0.42, sy + sun_r * 0.02),
        (sx - sun_r * 0.10, sy + sun_r * 0.34),
        (sx + sun_r * 0.46, sy - sun_r * 0.30),
    ]
    cw = sun_r * 0.22
    check_fill = INK if silhouette is None else (0, 0, 0, 0)
    d.line(check, fill=check_fill, width=int(cw), joint="curve")
    for x, y in check:
        d.ellipse((x - cw / 2, y - cw / 2, x + cw / 2, y + cw / 2), fill=check_fill)


def render(size: int, bg, mark_fn) -> Image.Image:
    big = Image.new("RGBA", (size * SCALE, size * SCALE), bg)
    mark_fn(ImageDraw.Draw(big), SCALE)
    return big.resize((size, size), Image.LANCZOS)


def icon_mark(d, k):
    # Arc and sun stay inside the adaptive safe zone; only the horizon tips may be masked.
    draw_mark(d, 512 * k, 690 * k, 280 * k, s=1.1 * k)


def main():
    fg = render(SIZE, (0, 0, 0, 0), icon_mark)
    fg.save(ASSETS / "adaptive-icon.png")
    Image.alpha_composite(Image.new("RGBA", (SIZE, SIZE), CREAM), fg).save(ASSETS / "icon.png")
    Image.alpha_composite(Image.new("RGBA", (SIZE, SIZE), CREAM), fg).resize((48, 48), Image.LANCZOS).save(
        ASSETS / "favicon.png"
    )

    # Notification small icon: white sun disc with the check cut out.
    n = 96
    big = Image.new("RGBA", (n * SCALE, n * SCALE), (0, 0, 0, 0))
    d = ImageDraw.Draw(big)
    c = n * SCALE / 2
    r = n * SCALE * 0.42
    sun_r = r
    d.ellipse((c - sun_r, c - sun_r, c + sun_r, c + sun_r), fill=(255, 255, 255, 255))
    check = [(c - sun_r * 0.42, c + sun_r * 0.02), (c - sun_r * 0.10, c + sun_r * 0.34), (c + sun_r * 0.46, c - sun_r * 0.30)]
    cw = sun_r * 0.24
    d.line(check, fill=(0, 0, 0, 0), width=int(cw), joint="curve")
    for x, y in check:
        d.ellipse((x - cw / 2, y - cw / 2, x + cw / 2, y + cw / 2), fill=(0, 0, 0, 0))
    big.resize((n, n), Image.LANCZOS).save(ASSETS / "notification-icon.png")

    # Splash: mark + wordmark, centered.
    W, H = 1284, 2778
    k = 2
    splash = Image.new("RGBA", (W * k, H * k), CREAM)
    d = ImageDraw.Draw(splash)
    draw_mark(d, W * k / 2, H * k * 0.47, 150 * k, s=0.6 * k)
    font_path = ASSETS / "fonts" / "GothicA1-SemiBold.ttf"
    font = ImageFont.truetype(str(font_path), 64 * k)
    text = "Sunlist"
    tw = d.textlength(text, font=font)
    d.text(((W * k - tw) / 2, H * k * 0.47 + 70 * k), text, font=font, fill=INK)
    splash.resize((W, H), Image.LANCZOS).convert("RGB").save(ASSETS / "splash.png")

    for name in ("adaptive-icon.png", "icon.png", "splash.png", "notification-icon.png", "favicon.png"):
        print("Saved", ASSETS / name)


if __name__ == "__main__":
    main()
