---
name: asset-creation
description: "앱 아이콘, 스플래시 스크린, Play Store 에셋을 Gemini 이미지 생성 API(gemini-3-pro-image-preview)로 생성하는 스킬. 적응형 아이콘, 피처 그래픽(1024x500), 스크린샷 프레임(폰 목업+캡션)을 실제 PNG 파일로 생성한다. 앱 아이콘, 스플래시, 스토어 에셋, 피처 그래픽, 스크린샷 생성 시 반드시 이 스킬을 사용."
---

# Asset Creation Skill

Gemini 이미지 생성 API(`gemini-3-pro-image-preview`)를 사용하여 앱의 비주얼 에셋을 생성한다.

## 전제 조건

- 환경변수 `GEMINI_API_KEY`가 설정되어 있어야 한다
- 미설정 시 사용자에게 안내: `export GEMINI_API_KEY=your-api-key`

## 에셋 스펙

### 1. 앱 아이콘

| 에셋 | 사이즈 | 용도 |
|------|--------|------|
| icon.png | 1024x1024 | Expo 기본 아이콘 |
| adaptive-icon.png | 1024x1024 | Android 적응형 아이콘 (전경) |

**적응형 아이콘 규칙:**
- 전경 레이어: 핵심 로고/심볼, 중앙 66% 영역(안전 영역)에 배치
- 배경: 단색 또는 그라데이션 (app.json의 `backgroundColor`로 설정)
- 원형/라운드 사각형 등 다양한 마스크에서 잘려도 깨지지 않도록 설계

**프롬프트 가이드:**
- 심볼은 단순하고 인식 가능해야 한다 (작은 사이즈에서도)
- 앱의 primary color 명시
- 텍스트 사용 최소화
- "flat design", "minimal", "app icon" 등의 스타일 키워드 포함

### 2. 스플래시 스크린

| 에셋 | 사이즈 | 용도 |
|------|--------|------|
| splash.png | 1284x2778 | Expo 스플래시 (Android/iOS 대응) |

**프롬프트 가이드:**
- 배경색: primary color 또는 white 명시
- 중앙에 앱 심볼/로고
- 깔끔하고 여백 충분한 구성

### 3. Play Store 피처 그래픽

| 에셋 | 사이즈 | 용도 |
|------|--------|------|
| feature-graphic.png | 1024x500 | Play Store 상단 배너 |

**프롬프트 가이드:**
- 앱 이름 + 핵심 가치 한 줄 카피 포함 지시
- 앱 아이콘 또는 핵심 이미지 포함
- 브랜드 컬러 배경
- 텍스트는 안전 영역 내 (상하좌우 24px 마진)

### 4. Play Store 스크린샷 프레임

| 에셋 | 사이즈 | 용도 |
|------|--------|------|
| screenshot-{N}.png | 1080x1920 | Play Store 스크린샷 (최소 4장, 권장 8장) |

**프롬프트 가이드:**
- 폰 목업 프레임 + 캡션 텍스트 조합
- 브랜드 컬러 배경
- 핵심 기능 → 차별화 기능 → 부가 기능 순서

## 생성 프로세스

### Step 1: 이미지 생성 스크립트

`scripts/generate_asset.py`를 생성하여 Gemini API를 호출한다:

```python
import os
import sys
import base64
from google import genai
from google.genai import types

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

def generate_image(prompt: str, output_path: str):
    """Gemini API로 이미지를 생성하고 파일로 저장한다."""
    response = client.models.generate_content(
        model="gemini-3-pro-image-preview",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_modalities=["image", "text"],
        ),
    )
    # 응답에서 이미지 파트 추출
    for part in response.candidates[0].content.parts:
        if part.inline_data is not None:
            image_data = part.inline_data.data
            with open(output_path, "wb") as f:
                f.write(image_data)
            print(f"Saved: {output_path}")
            return output_path
    print("No image generated")
    return None

if __name__ == "__main__":
    prompt = sys.argv[1]
    output = sys.argv[2]
    generate_image(prompt, output)
```

의존성 설치:
```bash
pip install google-genai
```

### Step 2: 에셋별 프롬프트 작성 및 생성

각 에셋에 대해 상세 프롬프트를 작성하고 스크립트를 실행한다.

**앱 아이콘 프롬프트 예시:**
```
Create a minimal, flat-design app icon for a {카테고리} app called "{앱 이름}".
Style: clean, modern, minimal flat design.
Primary color: {primary-color}.
The icon should feature a simple {심볼 설명} symbol centered on the canvas.
No text. No gradients. Solid background color.
The symbol should be clearly visible even at small sizes (48x48px).
Output: square 1024x1024 PNG with no rounded corners.
```

**피처 그래픽 프롬프트 예시:**
```
Create a Google Play Store feature graphic (1024x500) for "{앱 이름}".
Left side: large app title "{앱 이름}" in bold white text, with tagline "{핵심 가치}" below.
Right side: the app icon or a simple illustration related to {카테고리}.
Background: gradient from {primary-color} to {secondary-color}.
Style: clean, professional, modern.
Ensure text is legible and within safe margins (24px from edges).
```

**스크린샷 프레임 프롬프트 예시:**
```
Create a Play Store screenshot mockup (1080x1920) for a {카테고리} app.
Top area: caption text "{캡션}" in bold {text-color} on {background-color} background.
Center: a modern Android phone mockup displaying a {화면 설명} screen.
The phone screen shows {화면 상세 설명}.
Style: clean, minimal, professional app store screenshot.
Brand color: {primary-color}.
```

### Step 3: 실행

```bash
mkdir -p assets/store

# 앱 아이콘
python scripts/generate_asset.py "프롬프트..." assets/icon.png
python scripts/generate_asset.py "프롬프트..." assets/adaptive-icon.png

# 스플래시
python scripts/generate_asset.py "프롬프트..." assets/splash.png

# 피처 그래픽
python scripts/generate_asset.py "프롬프트..." assets/store/feature-graphic.png

# 스크린샷
python scripts/generate_asset.py "프롬프트..." assets/store/screenshot-1.png
python scripts/generate_asset.py "프롬프트..." assets/store/screenshot-2.png
python scripts/generate_asset.py "프롬프트..." assets/store/screenshot-3.png
python scripts/generate_asset.py "프롬프트..." assets/store/screenshot-4.png
```

### Step 4: Expo 프로젝트 연결

`app.json` 업데이트:
```json
{
  "expo": {
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "{primary-color}"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "{primary-color}"
      }
    }
  }
}
```

## 출력 디렉토리 구조

```
assets/
├── icon.png               # 앱 아이콘 (1024x1024)
├── adaptive-icon.png       # 적응형 아이콘 전경 (1024x1024)
├── splash.png              # 스플래시 스크린 (1284x2778)
└── store/
    ├── feature-graphic.png # 피처 그래픽 (1024x500)
    ├── screenshot-1.png    # 스크린샷 (1080x1920)
    ├── screenshot-2.png
    ├── screenshot-3.png
    └── screenshot-4.png

scripts/
└── generate_asset.py       # Gemini API 이미지 생성 스크립트 (재사용 가능)
```

## 품질 기준
- 모든 에셋이 Google Play 요구 사이즈에 근접 (Gemini 출력 → 필요 시 리사이즈)
- 적응형 아이콘의 안전 영역(66%) 내에 핵심 콘텐츠 배치
- 일관된 브랜드 아이덴티티 — 모든 에셋에서 동일한 색상/스타일 유지
- 생성 품질 부족 시 프롬프트 조정하여 최대 3회 재생성
- 사용된 프롬프트를 보고서에 기록하여 향후 재생성/수정 가능
