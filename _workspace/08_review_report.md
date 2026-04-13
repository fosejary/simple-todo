# SimpleTodo 종합 점검 보고서

생성일: 2026-04-08

---

## 요약

| 구분 | 건수 |
|------|------|
| 버그 수정 (Critical) | 1건 |
| 죽은 코드 정리 (Cleanup) | 9건 |
| 기능 개선 (Enhancement) | 7건 |
| 신규 기능 (Feature) | 5건 |
| TypeScript 빌드 | 에러 0건 |

---

## Part 1. 버그 수정 (Critical)

### BUG-1. settings.tsx의 Alert가 웹에서 동작 안 함
- **위치**: app/(tabs)/settings.tsx — 카테고리 이름 변경(Alert.prompt), 카테고리 삭제(Alert.alert), 데이터 초기화(Alert.alert 2중), 클라우드 동기화 안내(Alert.alert)
- **문제**: TodoDetailSheet의 삭제만 Platform.OS 분기 처리했고, settings.tsx의 모든 Alert는 웹 분기 없음
- **영향**: 웹에서 카테고리 삭제, 이름 변경, 데이터 초기화 불가
- **수정**: Platform.OS === 'web'일 때 window.confirm / window.prompt 사용

---

## Part 2. 죽은 코드 정리 (Cleanup)

### DEAD-1. 사용하지 않는 컴포넌트 파일 7개
| 파일 | 이유 |
|------|------|
| `components/organisms/DailyFocusCard.tsx` | "오늘의 3가지" 제거됨 |
| `components/organisms/WeeklyChart.tsx` | 통계 → 캘린더로 교체됨 |
| `components/organisms/CelebrationOverlay.tsx` | 트리거 코드 없음 (아래 DEAD-2) |
| `components/atoms/PriorityDot.tsx` | 우선순위 → 색상으로 교체됨 |
| `components/atoms/ProgressDots.tsx` | DailyFocusCard 전용이었음 |
| `components/atoms/SubtaskProgress.tsx` | TodoItem에서 직접 표시로 교체됨 |
| `components/molecules/StatCard.tsx` | 통계 화면 제거됨 |

### DEAD-2. today.tsx의 CelebrationOverlay 잔존
- celebrationType 상태 + CelebrationOverlay 렌더링이 남아있으나, setCelebrationType을 호출하는 코드가 없음
- import와 관련 상태/JSX 제거 필요

### DEAD-3. todoStore의 죽은 Focus 액션/셀렉터
- `setDailyFocus`, `addToFocus`, `removeFromFocus` — 어디서도 호출하지 않음
- `getFocusTodos`, `dailyFocus` 상태 — "오늘의 3가지" 제거됨
- 셀렉터 메서드들(`getTodayTodos`, `getUpcomingTodos` 등) — 화면에서 useMemo로 대체됨, store에만 남아있음

### DEAD-4. settingsStore의 dailyFocusCount
- 설정 UI에서 제거했지만 타입/기본값에 잔존

### DEAD-5. CheckBox의 priority prop
- 우선순위 기능 제거됨. priority=0(기본값)만 전달되어 의미 없음
- PRIORITY_COLORS import도 불필요

### DEAD-6. package.json 불필요 패키지
- `react-native-haptics` — expo-haptics만 사용

### DEAD-7. SubtaskSection.tsx 바텀시트 전용 컴포넌트
- 바텀시트 상세 탭 제거 후 어디서도 import 안 함

---

## Part 3. 기능 개선 (Enhancement)

### ENH-1. 마감일 선택이 오늘/내일 토글로만 가능
- **현재**: 바텀시트에서 마감일 탭 → 오늘 ↔ 내일 토글
- **문제**: 특정 날짜를 지정할 수 없음
- **개선**: 날짜 선택 옵션 확장 (오늘/내일/이번 주/다음 주/직접 입력)

### ENH-2. 캘린더에서 할일 추가 불가
- **현재**: 캘린더에서 날짜 선택 시 해당 날짜 할일만 조회
- **문제**: 추가하려면 "오늘" 탭으로 이동해야 함
- **개선**: 캘린더 하단에 QuickAddBar 추가 (선택한 날짜의 due_date로 자동 설정)

### ENH-3. 카테고리 추가 시 색상 고정(파란색)
- **현재**: addCategory의 기본 color가 '#2563EB'
- **문제**: 카테고리가 여러 개면 전부 같은 색
- **개선**: 카테고리 추가 시 자동으로 다른 색상 할당 (팔레트 순환), 또는 색상 선택 UI

### ENH-4. 할일 검색 기능 없음
- **현재**: "전체" 탭이 카테고리별로 바뀌면서 검색 기능이 사라짐
- **문제**: 할일이 많아지면 찾기 어려움
- **개선**: 헤더에 검색 아이콘 → 전체 할일 대상 검색

### ENH-5. 설정의 "일일 리마인더", "완료 항목 자동 삭제"는 UI만 존재
- 실제 푸시 알림 발송 로직 미구현 (expo-notifications 연동 필요)
- 자동 삭제 로직 미구현 (앱 시작 시 autoDeleteDays 초과 할일 삭제)
- MVP에서 구현하지 않을 경우 UI를 숨기거나 "준비 중" 표시 권장

### ENH-6. 설정 정보 링크 빈 onPress
- 개인정보 처리방침, 이용약관, 의견 보내기 — `onPress={() => {}}`
- Play Store 출시 전 실제 URL 연결 필수

### ENH-7. 다크 모드 미검증
- 테마 토큰은 정의되어 있으나, 일부 하드코딩 색상(#FFFFFF 등)이 다크 모드에서 문제 가능
- 전체 화면 다크 모드 테스트 필요

---

## Part 4. 신규 기능 제안 (Feature)

### FEAT-1. 할일 드래그 정렬
- **가치**: 할일 순서를 사용자가 직접 변경
- **구현**: react-native-draggable-flatlist 또는 long-press → drag
- **난이도**: 중

### FEAT-2. 스와이프 제스처
- **가치**: 좌 스와이프 삭제, 우 스와이프 완료 — 빠른 조작
- **구현**: react-native-gesture-handler의 Swipeable
- **난이도**: 중

### FEAT-3. 반복 할일
- **가치**: 매일/매주/매월 반복되는 할일 자동 생성
- **현재**: Todo.recurrence 타입은 정의되어 있으나 UI/로직 미구현
- **난이도**: 중~상

### FEAT-4. 할일 메모/노트
- **가치**: 할일에 상세 메모 첨부
- **현재**: Todo.memo 필드가 있으나 편집 UI가 제거됨 (바텀시트 상세 탭 제거 시)
- **개선**: TodoItem 펼침 패널에 메모 입력 필드 추가, 또는 바텀시트에 메모 섹션 복원
- **난이도**: 하

### FEAT-5. 완료 통계 대시보드
- **가치**: 주간/월간 완료율, 카테고리별 분석, 스트릭 시각화
- **현재**: 통계 탭이 캘린더로 교체되면서 통계 기능이 사라짐
- **개선**: 설정 또는 별도 화면에 통계 요약 추가
- **난이도**: 중

---

## Part 5. 우선순위 매트릭스

### 즉시 수정 (릴리스 차단)
| # | 항목 | 난이도 |
|---|------|--------|
| 1 | BUG-1: settings Alert 웹 호환 | 하 |
| 2 | DEAD-1~7: 죽은 코드/파일 정리 | 하 |
| 3 | ENH-6: 정보 링크 URL 연결 | 하 |

### 릴리스 후 우선 (1~2주)
| # | 항목 | 난이도 |
|---|------|--------|
| 4 | ENH-1: 마감일 선택 확장 | 하 |
| 5 | ENH-2: 캘린더 할일 추가 | 하 |
| 6 | ENH-3: 카테고리 자동 색상 | 하 |
| 7 | ENH-4: 검색 기능 | 중 |
| 8 | FEAT-4: 메모 편집 복원 | 하 |
| 9 | ENH-7: 다크 모드 검증 | 하 |

### 향후 로드맵 (Phase 2)
| # | 항목 | 난이도 |
|---|------|--------|
| 10 | FEAT-1: 드래그 정렬 | 중 |
| 11 | FEAT-2: 스와이프 제스처 | 중 |
| 12 | FEAT-3: 반복 할일 | 중~상 |
| 13 | FEAT-5: 통계 대시보드 | 중 |
| 14 | ENH-5: 알림/자동삭제 실제 구현 | 중 |
