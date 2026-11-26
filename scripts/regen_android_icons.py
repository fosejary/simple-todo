"""Regenerate Android native launcher resources from the new brand icon.

The committed android/ folder is prebuilt, so the APK/AAB uses these webp
resources, NOT assets/*.png. We must regenerate them whenever the icon changes.

- ic_launcher_foreground.webp : adaptive foreground (transparent) per density
- ic_launcher.webp            : legacy square launcher icon (full-bleed) per density
- ic_launcher_round.webp       : legacy round launcher icon (circle-masked) per density

Background of the adaptive icon is @color/iconBackground (#2563EB) — unchanged.
"""
from PIL import Image, ImageDraw

RES = "android/app/src/main/res"

# density -> (foreground px [108dp], legacy launcher px [48dp])
DENSITIES = {
    "mdpi": (108, 48),
    "hdpi": (162, 72),
    "xhdpi": (216, 96),
    "xxhdpi": (324, 144),
    "xxxhdpi": (432, 192),
}

BRAND_BLUE = (37, 99, 235, 255)


def main():
    fg_src = Image.open("assets/adaptive-icon.png").convert("RGBA")   # transparent foreground
    icon_src = Image.open("assets/icon.png").convert("RGBA")          # full-bleed square

    for dens, (fg_px, leg_px) in DENSITIES.items():
        # Adaptive foreground (keep transparency)
        fg = fg_src.resize((fg_px, fg_px), Image.LANCZOS)
        fg.save(f"{RES}/mipmap-{dens}/ic_launcher_foreground.webp", "WEBP", lossless=True, quality=100)

        # Legacy square icon (full bleed)
        leg = icon_src.resize((leg_px, leg_px), Image.LANCZOS)
        leg.save(f"{RES}/mipmap-{dens}/ic_launcher.webp", "WEBP", lossless=True, quality=100)

        # Legacy round icon (circle mask)
        mask = Image.new("L", (leg_px, leg_px), 0)
        ImageDraw.Draw(mask).ellipse((0, 0, leg_px, leg_px), fill=255)
        rnd = leg.copy()
        rnd.putalpha(mask)
        rnd.save(f"{RES}/mipmap-{dens}/ic_launcher_round.webp", "WEBP", lossless=True, quality=100)

        print(f"{dens}: fg {fg_px}px, launcher/round {leg_px}px")


if __name__ == "__main__":
    main()
