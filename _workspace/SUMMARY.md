# MVP Factory 결과 요약 — SimpleTodo (심플투두)

생성일: 2026-04-06

---

## 앱 개요

- **앱 이름**: SimpleTodo (심플투두)
- **카테고리**: 생산성 (Productivity) — 할일 관리 (Todo List)
- **패키지명**: com.simpletodo.app
- **핵심 가치**: "열면 바로 쓴다. 오늘 할 일에만 집중한다."
- **차별화**: 제로 온보딩, "오늘의 3가지" 집중 모드, 감성적 완료 경험, 무료 통계

---

## 시장 기회

- **글로벌 시장**: Task Management Software 약 45~50억 USD, CAGR 13~16%
- **한국 Todo 앱 세그먼트**: 약 300~500억 원 추정
- **타겟 사용자**: 25~35세 직장인 (Notion 피로층, "카카오톡 나에게 보내기"로 할일 관리하는 사용자)
- **진입 전략**: "설정 제로" 미니멀 Todo + 한국어 네이티브 + 경쟁 앱이 유료로 제공하는 기능(리마인더, 통계)을 무료로 제공
- **수익 모델**: 프리미엄(Freemium) — 월 2,900~3,900원, 연 24,900~33,900원

---

## 구현된 기능

### 화면 (6개)
| 화면 | 설명 |
|------|------|
| 스플래시 | FadeIn 애니메이션, 1초 후 자동 전환 |
| 오늘 (메인) | "오늘의 3가지" 집중 카드, 빠른 추가, 할일 목록, 완료 섹션 |
| 할일 상세/편집 | Bottom Sheet — 마감일, 알림, 카테고리, 우선순위 |
| 전체 할일 | 카테고리 필터, 검색, 섹션별 정렬 |
| 통계 | 스트릭, 주간 차트, 월간 요약, 카테고리별 분석 |
| 설정 | 테마(라이트/다크), 알림, 데이터 관리 |

### 핵심 기능
- 할일 CRUD + "오늘의 3가지" 집중 모드
- 완료 애니메이션 + 햅틱 피드백 + Confetti 축하
- 스트릭 추적 + 주간/월간 통계 (무료 차별화)
- 라이트/다크 테마 (시스템 연동)
- 로컬 저장 (AsyncStorage + Zustand) — 오프라인 완전 동작
- Supabase 클라우드 동기화 준비 완료

### 기술 스택
- Expo SDK 54 + TypeScript + Expo Router
- Zustand (상태관리) + AsyncStorage (영속성)
- Supabase (인증/DB/동기화)
- react-native-reanimated (애니메이션) + expo-haptics

### 프로젝트 구조
- **30개 TypeScript 파일**, Atomic Design 컴포넌트 구조
- atoms → molecules → organisms → screens 4계층

---

## 실행 방법

```bash
# 1. 의존성 설치
cd SimpleTodo
npm install

# 2. 개발 서버 시작
npx expo start

# 3. (선택) Supabase 클라우드 동기화
cp .env.example .env
# .env에 EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY 입력
# SQL Editor에서 supabase/migrations/001_initial_schema.sql 실행
```

---

## 생성된 에셋 (8개)

| 에셋 | 파일 | 크기 |
|------|------|------|
| 앱 아이콘 | `assets/icon.png` | 1024x1024 |
| 적응형 아이콘 | `assets/adaptive-icon.png` | 1024x1024 |
| 스플래시 스크린 | `assets/splash.png` | 1284x2778 |
| 피처 그래픽 | `assets/store/feature-graphic.png` | 1024x500 |
| 스크린샷 1~4 | `assets/store/screenshot-{1-4}.png` | 1080x1920 |

- 디자인 컨셉: 파란색(#2563EB) 브랜드 + 흰색 체크마크, 미니멀 플랫 스타일
- Gemini API (gemini-2.5-flash-image)로 생성, Pillow로 리사이즈

---

## ASO 리스팅 요약

| 항목 | 한국어 | 영어 |
|------|--------|------|
| **제목** | 심플투두 - 오늘 할일 관리 | SimpleTodo - Daily Task Planner |
| **짧은 설명** | (80자 최적화 완료) | (80자 최적화 완료) |
| **긴 설명** | 1,100자 키워드 최적화 | 2,000자 키워드 최적화 |

- 키워드 전략: Head 4개 + Mid-tail 6개 + Long-tail 10개
- 스크린샷 8장 전략 (현재 4장 완료, 4장 추가 프롬프트 포함)
- 카테고리: 생산성 (1차), 도구 (2차)

---

## 다음 단계 (Phase 2 로드맵)

### Phase 1.5 — 핵심 보완
| 기능 | 예상 기간 |
|------|----------|
| Android 홈 위젯 | 5일 |
| 서브태스크 | 3일 |
| 반복 할일 | 3일 |
| 태그/라벨 | 2일 |
| 실제 푸시 알림 (expo-notifications) | 3일 |

### Phase 2 — 차별화 기능
| 기능 | 예상 기간 |
|------|----------|
| 캘린더 뷰 | 5일 |
| 포모도로 타이머 | 5일 |
| 습관 트래커 융합 | 7일 |
| Pro 구독 (테마, 고급 통계) | 5일 |
| 클라우드 동기화 완성 | 5일 |

### Phase 3 — 성장
| 기능 | 예상 기간 |
|------|----------|
| 소셜 기능 (할일 공유) | 10일 |
| 카카오톡 공유 | 3일 |
| AI 우선순위 제안 | 7일 |
| 다국어 지원 | 5일 |

---

## 산출물 목록

| 파일 | 내용 |
|------|------|
| `_workspace/00_input.md` | 입력 정보 |
| `_workspace/01_research_market.md` | 시장 리서치 보고서 |
| `_workspace/02_benchmark_apps.md` | 앱 벤치마킹 보고서 |
| `_workspace/03_design_mvp.md` | MVP 디자인 스펙 (1,254줄) |
| `_workspace/04_dev_summary.md` | 개발 요약 |
| `_workspace/04.5_asset_report.md` | 에셋 생성 보고서 |
| `_workspace/05_aso_listing.md` | ASO 최적화 리스팅 |
| `_workspace/SUMMARY.md` | 종합 보고서 (본 문서) |
| 프로젝트 루트 | React Native 프로젝트 코드 (30개 파일) |
| `assets/` | 앱 아이콘, 스플래시, 스토어 에셋 (8개) |
| `scripts/generate_asset.py` | 에셋 생성 스크립트 |
