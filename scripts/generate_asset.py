#!/usr/bin/env python3
"""
SimpleTodo App Asset Generator
Generates app icons, splash screens, and Play Store assets using Gemini API.
"""

import os
import sys
import json
import time
from pathlib import Path
from google import genai
from google.genai import types

PROJECT_ROOT = Path(__file__).resolve().parent.parent
ASSETS_DIR = PROJECT_ROOT / "assets"
STORE_DIR = ASSETS_DIR / "store"

# Design Tokens
PRIMARY_COLOR = "#2563EB"
SECONDARY_COLOR = "#7C3AED"
PRIMARY_CONTAINER = "#DBEAFE"
BACKGROUND = "#FAFAFA"
APP_NAME = "SimpleTodo"
APP_NAME_KR = "심플투두"
TAGLINE = "오늘 할 일에만 집중하세요"

# Ensure directories exist
ASSETS_DIR.mkdir(parents=True, exist_ok=True)
STORE_DIR.mkdir(parents=True, exist_ok=True)


def get_client():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("ERROR: GEMINI_API_KEY environment variable is not set.")
        print("Run: export GEMINI_API_KEY=your-api-key")
        sys.exit(1)
    return genai.Client(api_key=api_key)


def generate_image(client, prompt: str, output_path: str, max_retries: int = 3) -> str | None:
    """Generate an image using Gemini API and save to file."""
    for attempt in range(1, max_retries + 1):
        try:
            print(f"\n[Attempt {attempt}/{max_retries}] Generating: {output_path}")
            print(f"  Prompt: {prompt[:120]}...")
            response = client.models.generate_content(
                model="gemini-2.5-flash-image",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_modalities=["image", "text"],
                ),
            )
            # Extract image from response
            for part in response.candidates[0].content.parts:
                if part.inline_data is not None:
                    image_data = part.inline_data.data
                    with open(output_path, "wb") as f:
                        f.write(image_data)
                    size_kb = len(image_data) / 1024
                    print(f"  OK: Saved {output_path} ({size_kb:.1f} KB)")
                    return output_path
            print(f"  WARN: No image in response (attempt {attempt})")
        except Exception as e:
            print(f"  ERROR (attempt {attempt}): {e}")
        if attempt < max_retries:
            wait = 5 * attempt
            print(f"  Retrying in {wait}s...")
            time.sleep(wait)
    print(f"  FAILED: Could not generate {output_path} after {max_retries} attempts")
    return None


# ============================================================
# Asset Prompts
# ============================================================

PROMPTS = {
    "icon": {
        "path": str(ASSETS_DIR / "icon.png"),
        "prompt": (
            "Create a minimal, flat-design mobile app icon for a to-do list app called 'SimpleTodo'. "
            "The icon features a simple white checkmark symbol inside a rounded square. "
            "Background: solid blue color #2563EB. "
            "The checkmark is clean, bold, slightly rounded at the ends, centered on the canvas. "
            "Style: flat design, no gradients, no shadows, no text, no 3D effects. "
            "Modern, clean, professional. Single solid blue background with white checkmark. "
            "Output: square 1024x1024 pixels, PNG format, no rounded corners on the outer edge."
        ),
    },
    "adaptive-icon": {
        "path": str(ASSETS_DIR / "adaptive-icon.png"),
        "prompt": (
            "Create an adaptive icon foreground layer for an Android app. "
            "The design is a bold white checkmark symbol centered in the middle 66% of the canvas (safe zone). "
            "The checkmark is clean, geometric, slightly rounded at the ends, thick stroke. "
            "Background: completely transparent (use a solid light blue #DBEAFE as background placeholder so the checkmark is visible). "
            "No text, no extra decorations. Only the checkmark symbol in the center safe area. "
            "Style: flat, minimal, modern. "
            "Output: square 1024x1024 pixels, PNG format."
        ),
    },
    "splash": {
        "path": str(ASSETS_DIR / "splash.png"),
        "prompt": (
            "Create a mobile app splash screen. "
            "Background: solid blue color #2563EB filling the entire canvas. "
            "Center: a large white checkmark symbol (same style as the app icon) positioned in the center of the screen. "
            "Below the checkmark, the text 'SimpleTodo' in clean white sans-serif font, medium weight. "
            "Style: minimal, clean, modern, plenty of whitespace around the center elements. "
            "No gradients, no decorative elements, no patterns. Just the solid blue background, white checkmark, and app name. "
            "Output: 1284x2778 pixels (portrait mobile screen), PNG format."
        ),
    },
    "feature-graphic": {
        "path": str(STORE_DIR / "feature-graphic.png"),
        "prompt": (
            "Create a Google Play Store feature graphic banner. "
            "Background: gradient from blue #2563EB on the left to purple #7C3AED on the right. "
            "Left side: large bold white text 'SimpleTodo' as the app title, with smaller white text below: "
            "'Focus on today's tasks' as the tagline. "
            "Right side: a large white checkmark icon (matching the app icon style). "
            "Style: clean, professional, modern, minimal. "
            "Text is clear and legible, within safe margins (at least 24px from all edges). "
            "No phone mockups, no screenshots. Just the text and icon on the gradient background. "
            "Output: exactly 1024x500 pixels, landscape, PNG format."
        ),
    },
    "screenshot-1": {
        "path": str(STORE_DIR / "screenshot-1.png"),
        "prompt": (
            "Create a Play Store screenshot mockup for a to-do list app. "
            "Top 25%: caption area with solid blue #2563EB background, centered bold white text: "
            "'Open and Start Writing' in large font, and below it smaller text: 'No sign-up, no setup'. "
            "Bottom 75%: a modern Android phone mockup (thin bezels, rounded corners) centered, "
            "displaying a clean to-do list screen with: "
            "- A header showing 'Today' with date "
            "- An empty state with a friendly illustration and text 'Add your first task' "
            "- A floating action button (+) at bottom right "
            "- Clean white background, blue accent colors #2563EB "
            "Phone frame: dark/black. Background behind phone: light gray #F3F4F6. "
            "Style: clean, professional app store screenshot. "
            "Output: 1080x1920 pixels, portrait, PNG format."
        ),
    },
    "screenshot-2": {
        "path": str(STORE_DIR / "screenshot-2.png"),
        "prompt": (
            "Create a Play Store screenshot mockup for a to-do list app. "
            "Top 25%: caption area with solid blue #2563EB background, centered bold white text: "
            "'Today\\'s Top 3' in large font, and below it smaller text: 'Focus on what matters most'. "
            "Bottom 75%: a modern Android phone mockup (thin bezels) centered, "
            "displaying a to-do list with 3 highlighted priority tasks at the top (with star icons in yellow #F59E0B), "
            "followed by 2 regular tasks below. "
            "Each task has a circle checkbox on the left and task text. "
            "Progress bar at top showing '0/3 completed'. "
            "Clean white background, blue accent colors #2563EB. "
            "Phone frame: dark/black. Background behind phone: light gray #F3F4F6. "
            "Style: clean, professional app store screenshot. "
            "Output: 1080x1920 pixels, portrait, PNG format."
        ),
    },
    "screenshot-3": {
        "path": str(STORE_DIR / "screenshot-3.png"),
        "prompt": (
            "Create a Play Store screenshot mockup for a to-do list app. "
            "Top 25%: caption area with solid blue #2563EB background, centered bold white text: "
            "'Satisfying Completion' in large font, and below it smaller text: 'Celebrate every achievement'. "
            "Bottom 75%: a modern Android phone mockup (thin bezels) centered, "
            "displaying a to-do list where 2 out of 3 focus tasks are checked off with strikethrough text and green checkmarks #10B981, "
            "and 1 task remaining. A circular progress indicator shows 2/3 complete. "
            "A subtle confetti animation effect visible on screen. "
            "Clean white background, blue and green accent colors. "
            "Phone frame: dark/black. Background behind phone: light gray #F3F4F6. "
            "Style: clean, professional app store screenshot. "
            "Output: 1080x1920 pixels, portrait, PNG format."
        ),
    },
    "screenshot-4": {
        "path": str(STORE_DIR / "screenshot-4.png"),
        "prompt": (
            "Create a Play Store screenshot mockup for a to-do list app. "
            "Top 25%: caption area with solid blue #2563EB background, centered bold white text: "
            "'Build Your Streak' in large font, and below it smaller text: 'Stay consistent every day'. "
            "Bottom 75%: a modern Android phone mockup (thin bezels) centered, "
            "displaying a weekly streak view with: "
            "- A large '7 Day Streak' counter with a fire emoji icon in orange #F97316 "
            "- A row of 7 day circles (Mon-Sun), 5 filled in blue #2563EB showing completed days, today highlighted "
            "- A motivational message 'Keep it going!' "
            "Clean white background, blue and orange accent colors. "
            "Phone frame: dark/black. Background behind phone: light gray #F3F4F6. "
            "Style: clean, professional app store screenshot. "
            "Output: 1080x1920 pixels, portrait, PNG format."
        ),
    },
}


def main():
    if len(sys.argv) > 1:
        # Generate a single specific asset
        asset_name = sys.argv[1]
        if asset_name not in PROMPTS:
            print(f"Unknown asset: {asset_name}")
            print(f"Available: {', '.join(PROMPTS.keys())}")
            sys.exit(1)
        client = get_client()
        info = PROMPTS[asset_name]
        result = generate_image(client, info["prompt"], info["path"])
        sys.exit(0 if result else 1)
    else:
        # Generate all assets
        client = get_client()
        results = {}
        total = len(PROMPTS)
        for idx, (name, info) in enumerate(PROMPTS.items(), 1):
            print(f"\n{'='*60}")
            print(f"[{idx}/{total}] Generating: {name}")
            print(f"{'='*60}")
            result = generate_image(client, info["prompt"], info["path"])
            results[name] = "OK" if result else "FAILED"
            # Small delay between API calls to avoid rate limiting
            if idx < total:
                time.sleep(3)

        print(f"\n{'='*60}")
        print("SUMMARY")
        print(f"{'='*60}")
        for name, status in results.items():
            print(f"  {name}: {status}")

        failed = sum(1 for s in results.values() if s == "FAILED")
        if failed:
            print(f"\n{failed}/{total} assets failed.")
            sys.exit(1)
        else:
            print(f"\nAll {total} assets generated successfully!")
            sys.exit(0)


if __name__ == "__main__":
    main()
