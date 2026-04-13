# 개발 요약: SimpleTodo MVP

생성일: 2026-04-06

---

## 구현된 기능

### 핵심 화면 (6개)

| # | 화면 | 파일 | 상태 |
|---|------|------|------|
| 1 | 스플래시 | `app/index.tsx` | 완료 - FadeIn 애니메이션 + 1초 후 자동 전환 |
| 2 | 오늘 (메인) | `app/(tabs)/today.tsx` | 완료 - DailyFocus 카드, 할일 목록, 완료 섹션, 빠른 추가 |
| 3 | 할일 상세/편집 | `components/organisms/TodoDetailSheet.tsx` | 완료 - Bottom Sheet, 인라인 편집, 속성 변경, 자동 저장 |
| 4 | 전체 할일 | `app/(tabs)/all.tsx` | 완료 - 카테고리 필터, 섹션별 정렬, 검색 |
| 5 | 통계 | `app/(tabs)/stats.tsx` | 완료 - 스트릭, 주간 차트, 월간 요약, 카테고리별 |
| 6 | 설정 | `app/(tabs)/settings.tsx` | 완료 - 테마, 알림, 데이터, 동기화 설정 |

### 핵심 기능

- [x] 할일 CRUD (추가, 완료 토글, 수정, 삭제)
- [x] "오늘의 3가지" 집중 모드 (DailyFocusCard)
- [x] 카테고리 관리 (추가, 필터링)
- [x] 우선순위 (높음/중간/낮음, 색상 코드)
- [x] 스트릭 추적 (현재/최고 기록)
- [x] 주간/월간 통계
- [x] 완료 애니메이션 + 햅틱 피드백
- [x] 축하 오버레이 (Confetti)
- [x] 라이트/다크 테마 (시스템 연동)
- [x] 데이터 영속성 (AsyncStorage + Zustand persist)
- [x] Supabase 클라이언트 설정 (선택적 클라우드 동기화)

### 디자인 시스템

- [x] 색상 토큰 (라이트/다크)
- [x] 타이포그래피 스케일 (7단계)
- [x] 간격 시스템 (4px 기반, 7단계)
- [x] 모서리 반경 (6단계)
- [x] 그림자/Elevation (5단계)
- [x] 애니메이션 토큰 (duration/easing)

---

## 기술 스택

| 영역 | 기술 | 버전 |
|------|------|------|
| 프레임워크 | Expo (managed) | SDK 54 |
| 언어 | TypeScript | 5.9 |
| 라우팅 | Expo Router | 6.x |
| 상태관리 | Zustand | 5.x |
| 백엔드 | Supabase JS | 2.x |
| 영속성 | AsyncStorage | 2.2 |
| 바텀시트 | @gorhom/bottom-sheet | 5.x |
| 애니메이션 | react-native-reanimated | 4.x |
| 제스처 | react-native-gesture-handler | 2.x |
| 아이콘 | @expo/vector-icons (MaterialIcons) | 15.x |
| 날짜 | date-fns | 4.x |
| 햅틱 | expo-haptics | 15.x |

---

## 프로젝트 구조

```
SimpleTodo/
├── app/                          # Expo Router
│   ├── _layout.tsx               # 루트 레이아웃 (GestureHandler, StatusBar)
│   ├── index.tsx                 # 스플래시 화면
│   └── (tabs)/
│       ├── _layout.tsx           # 탭 네비게이션 (4탭)
│       ├── today.tsx             # 오늘 (메인)
│       ├── all.tsx               # 전체 할일
│       ├── stats.tsx             # 통계
│       └── settings.tsx          # 설정
├── components/
│   ├── atoms/                    # CheckBox, PriorityDot, CategoryChip, StreakBadge, ProgressDots
│   ├── molecules/                # TodoItem, QuickAddBar, SectionHeader, EmptyState, StatCard, PropertyRow
│   ├── organisms/                # DailyFocusCard, TodoDetailSheet, CelebrationOverlay, WeeklyChart
│   └── layout/                   # ScreenContainer
├── stores/
│   ├── todoStore.ts              # 할일, 카테고리, 포커스, 스트릭, 통계
│   ├── settingsStore.ts          # 앱 설정
│   └── authStore.ts              # 인증 상태
├── lib/
│   ├── supabase.ts               # Supabase 클라이언트
│   └── types.ts                  # 타입 정의
├── hooks/
│   └── useTheme.ts               # 테마 훅
├── constants/
│   └── theme.ts                  # 디자인 토큰
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # DB 스키마 + RLS
├── app.json                      # Expo 설정
├── eas.json                      # EAS Build 설정
├── tsconfig.json                 # TypeScript 설정
├── package.json                  # 의존성
└── .env.example                  # 환경변수 템플릿
```

---

## 실행 방법

### 1. 프로젝트 설치

```bash
cd SimpleTodo
npm install
```

### 2. 환경 변수 설정 (선택 - 클라우드 동기화 시)

```bash
cp .env.example .env
# .env 파일에 Supabase 프로젝트 URL과 anon key 입력
```

> 환경 변수 없이도 로컬 전용으로 완전히 동작합니다.

### 3. 개발 서버 시작

```bash
npx expo start
```

- Android: `a` 키로 Android 에뮬레이터/기기에서 실행
- iOS: `i` 키로 iOS 시뮬레이터에서 실행
- Expo Go 앱으로 QR 코드 스캔

### 4. Supabase 설정 (선택)

1. [supabase.com](https://supabase.com)에서 새 프로젝트 생성
2. SQL Editor에서 `supabase/migrations/001_initial_schema.sql` 실행
3. `.env`에 프로젝트 URL과 anon key 입력

---

## 빌드 명령어

### Preview APK (테스트용)

```bash
npx eas build --profile preview --platform android
```

### Production AAB (Play Store 배포용)

```bash
npx eas build --profile production --platform android
```

### Play Store 제출

```bash
npx eas submit --platform android
```

---

## 알려진 제한 사항

1. **날짜/시간 피커**: MVP에서는 간소화된 토글 방식. 향후 `@react-native-community/datetimepicker` 통합 예정
2. **반복 설정**: 데이터 모델은 준비되어 있으나 UI 미구현 (Phase 2)
3. **스와이프 동작**: 설계에는 포함되었으나, MVP에서는 탭/버튼 기반 인터랙션으로 대체
4. **알림**: 설정 UI는 구현되었으나 실제 푸시 알림 발송은 미구현 (expo-notifications 통합 필요)
5. **클라우드 동기화**: Supabase 클라이언트 설정 완료, 실제 sync 로직은 Phase 2
6. **데이터 내보내기**: 설정 UI 존재, 실제 CSV/JSON 내보내기 미구현
7. **Alert.prompt**: Android에서는 기본 카테고리 3개(업무/개인/건강) 선택으로 대체

---

## ASO 연동 정보 (aso-optimizer용)

- **앱 이름**: SimpleTodo (심플투두)
- **패키지명**: com.simpletodo.app
- **주요 기능**: 오늘의 3가지 집중 모드, 빠른 할일 추가, 스트릭 추적, 통계 대시보드, 다크 모드
- **스크린샷용 핵심 화면**: 오늘(메인), 오늘의 3가지 카드, 통계 차트, 다크 모드
- **차별화 포인트**: 제로 온보딩(회원가입 없이 바로 사용), 감성적 완료 애니메이션, 무료 통계
