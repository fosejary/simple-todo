"""Subset the bundled Korean fonts to keep the app small.

Keeps Basic Latin + Latin-1, common punctuation/symbols, Hangul compatibility
jamo, and the 2,350 KS X 1001 Hangul syllables (the everyday set). Any glyph
outside the subset falls back to the system font at render time.

Usage: python3 scripts/subset_fonts.py
"""
from pathlib import Path

from fontTools import subset

ROOT = Path(__file__).resolve().parent.parent
GF = ROOT / "node_modules" / "@expo-google-fonts"
OUT = ROOT / "assets" / "fonts"

SOURCES = {
    "GothicA1-Regular.ttf": GF / "gothic-a1/400Regular/GothicA1_400Regular.ttf",
    "GothicA1-Medium.ttf": GF / "gothic-a1/500Medium/GothicA1_500Medium.ttf",
    "GothicA1-SemiBold.ttf": GF / "gothic-a1/600SemiBold/GothicA1_600SemiBold.ttf",
    "GowunDodum-Regular.ttf": GF / "gowun-dodum/400Regular/GowunDodum_400Regular.ttf",
}


def ksx1001_hangul() -> list[int]:
    out = []
    for cp in range(0xAC00, 0xD7A4):
        try:
            if len(chr(cp).encode("euc_kr")) == 2:
                out.append(cp)
        except UnicodeEncodeError:
            pass
    return out


def unicodes() -> list[int]:
    ranges = [
        (0x0020, 0x007E),  # Basic Latin
        (0x00A0, 0x00FF),  # Latin-1 supplement
        (0x2010, 0x206F),  # General punctuation
        (0x2190, 0x2199),  # Arrows
        (0x2460, 0x2473),  # Circled numbers
        (0x3000, 0x303F),  # CJK symbols & punctuation
        (0x3131, 0x318E),  # Hangul compatibility jamo
        (0xFF01, 0xFF5E),  # Full-width forms
    ]
    cps = [cp for lo, hi in ranges for cp in range(lo, hi + 1)]
    return cps + ksx1001_hangul()


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    cps = unicodes()
    for name, src in SOURCES.items():
        options = subset.Options()
        options.layout_features = ["*"]
        options.name_IDs = ["*"]
        options.notdef_outline = True
        font = subset.load_font(str(src), options)
        sub = subset.Subsetter(options)
        sub.populate(unicodes=cps)
        sub.subset(font)
        dest = OUT / name
        subset.save_font(font, str(dest), options)
        print(f"{name}: {src.stat().st_size // 1024} KB -> {dest.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
