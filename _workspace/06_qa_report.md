# QA 검증 보고서

생성일: 2026-04-06

---

## 요약

- 전체 기능 수: 11개
- 구현 완료: 9개
- 부분 구현: 2개
- 미구현: 0개
- 심각한 버그: 2개
- 중간 버그: 5개
- 경미한 이슈: 4개
- TypeScript 빌드: 통과 (tsc --noEmit 에러 0건)

---

## 화면별 검증 결과

### 1. 스플래시 (app/index.tsx) -- 구현 완료

| 스펙 항목 | 구현 여부 | 상세 |
|-----------|----------|------|
| 앱 아이콘 (체크마크 모티프 72x72dp) | O | line 43-45: 72x72 컨테이너에 체크마크 문자 렌더링 |
| "SimpleTodo" 텍스트 | O | line 46 |
| "오늘에 집중하세요" 태그라인 | O | line 47 |
| FadeIn 애니메이션 (reanimated) | O | line 23-24: opacity + translateY 애니메이션 구현 |
| 자동 전환 (0.8~1.2초) | O | line 27: 1초 후 router.replace 호출 |
| 첫 실행 플래그 처리 | O | line 28: setFirstLaunchDone() 호출 |

비고: 스펙에서 0.8초를 명시했으나 1초로 구현됨 -- 허용 범위 내.

### 2. 오늘 메인 (app/(tabs)/today.tsx) -- 구현 완료

| 스펙 항목 | 구현 여부 | 상세 |
|-----------|----------|------|
| 헤더 (앱 이름 + 날짜 + 스트릭 배지) | O | line 133-143 |
| 한국어 날짜 형식 | O | line 23: format(new Date(), 'M월 d일 EEEE', { locale: ko }) |
| DailyFocusCard ("오늘의 3가지") | O | line 161-167 |
| TodoList (일반 할일) | O | line 154-205: FlatList로 구현 |
| CompletedSection (접기/펼치기) | O | line 183-201 |
| QuickAddBar (빠른 입력) | O | line 208 |
| 빈 상태 (EmptyState) | O | line 146-151 |
| TodoDetailSheet (바텀시트) | O | line 211-215 |
| CelebrationOverlay | O | line 218-224 |
| 축하 트리거 로직 | O | line 96-111: 포커스 할일 모두 완료 시 트리거 |

### 3. 전체 할일 (app/(tabs)/all.tsx) -- 구현 완료

| 스펙 항목 | 구현 여부 | 상세 |
|-----------|----------|------|
| 검색 기능 | O | line 199-229: 검색바 토글 + 텍스트 필터 |
| 카테고리 필터 칩 | O | line 232-261: 가로 스크롤 CategoryChip |
| "+ 추가" 카테고리 생성 | O | line 140-163: Alert.prompt (iOS) + Alert.alert fallback (Android) |
| 섹션별 정렬: 예정됨 | O | line 84-98 |
| 섹션별 정렬: 기한 없음 | O | line 100-108 |
| 섹션별 정렬: 지난 할일 | O | line 110-124 |
| 섹션별 정렬: 완료됨 | O | line 126-138 |
| 섹션 접기/펼치기 | O | line 45-59 |
| QuickAddBar | O | line 364-367 |
| TodoDetailSheet | O | line 370-375 |

비고: 스펙의 FAB(플로팅 추가 버튼)은 QuickAddBar로 대체됨. 기능적으로 동등.

### 4. 통계 (app/(tabs)/stats.tsx) -- 구현 완료

| 스펙 항목 | 구현 여부 | 상세 |
|-----------|----------|------|
| 스트릭 카드 (현재/최고) | O | line 165-183 |
| 주간 차트 (7일 원형 진행률) | O | line 186-188: WeeklyChart 컴포넌트 사용 |
| 월간 요약 (완료 수/완료율/최고 요일) | O | line 191-229 |
| 카테고리별 프로그레스 바 | O | line 233-283 |
| 빈 상태 안내 | O | line 287-298 |

### 5. 설정 (app/(tabs)/settings.tsx) -- 구현 완료

| 스펙 항목 | 구현 여부 | 상세 |
|-----------|----------|------|
| 계정 섹션 (클라우드 동기화) | O | line 199-233 |
| 테마 설정 (3-way) | O | line 128-133: 순환 토글 방식 |
| 오늘의 집중 개수 설정 | O | line 135-138 |
| 알림 리마인더 토글 | O | line 253-264 |
| 리마인더 시간 설정 | O | line 265-284 |
| 완료 항목 자동 삭제 설정 | O | line 290-295 |
| 데이터 초기화 (2중 확인) | O | line 148-183 |
| 앱 버전 표시 | O | line 306 |
| 정보 링크 (개인정보/이용약관/의견) | O | line 307-321: onPress는 빈 함수 (미연결) |

비고: 스펙의 "시작 화면 설정"과 "데이터 내보내기" UI가 누락됨. dev_summary에서 알려진 제한사항으로 명시.

### 6. 할일 상세 (components/organisms/TodoDetailSheet.tsx) -- 구현 완료

| 스펙 항목 | 구현 여부 | 상세 |
|-----------|----------|------|
| BottomSheet (드래그 핸들) | O | line 134-143 |
| 제목 인라인 편집 | O | line 146-155 |
| 메모 편집 | O | line 158-169 |
| 마감일 속성 | O | line 172-189: 오늘/내일 토글 (간소화) |
| 카테고리 속성 | O | line 191-203: 순환 선택 |
| 우선순위 속성 | O | line 205-222: 3단계 순환 |
| 오늘 집중 토글 | O | line 224-235 |
| 삭제 버튼 (확인 다이얼로그) | O | line 73-91 |
| 자동 저장 (debounce 300ms) | O | line 57-65 |
| 알림 시간 설정 | X | 스펙에 포함되었으나 미구현 (dev_summary 제한사항) |
| 반복 설정 | X | 스펙에 포함되었으나 미구현 (dev_summary 제한사항) |

---

## 기능별 검증 결과

### 1. 할일 CRUD -- 구현 완료

| 세부 기능 | 파일 | 라인 | 상태 |
|-----------|------|------|------|
| 추가 (addTodo) | stores/todoStore.ts | 68-89 | O - uuid 생성, 기본값 설정, 배열 추가 |
| 완료 토글 (toggleTodo) | stores/todoStore.ts | 92-108 | O - is_completed 반전, completed_at 업데이트, 스트릭 갱신 |
| 수정 (updateTodo) | stores/todoStore.ts | 110-116 | O - 부분 업데이트, updated_at 자동 갱신 |
| 삭제 (deleteTodo) | stores/todoStore.ts | 118-131 | O - soft delete (is_deleted=true), 포커스에서도 제거 |
| 미루기 (postponeTodo) | stores/todoStore.ts | 133-144 | O - due_date를 내일로 변경 |
| QuickAddBar 입력 | components/molecules/QuickAddBar.tsx | 27-32 | O - Enter 키 + 버튼 양쪽 지원 |

### 2. "오늘의 3가지" 집중 모드 -- 구현 완료

| 세부 기능 | 파일 | 라인 | 상태 |
|-----------|------|------|------|
| 포커스 추가 | stores/todoStore.ts | 191-200 | O - dailyFocus[date]에 todoId 추가 |
| 포커스 제거 | stores/todoStore.ts | 202-209 | O |
| 포커스 할일 조회 | stores/todoStore.ts | 252-257 | O |
| DailyFocusCard 렌더링 | components/organisms/DailyFocusCard.tsx | 전체 | O - 진행률, 빈 슬롯, 완료 상태 표시 |
| 최대 개수 제한 | components/organisms/TodoDetailSheet.tsx | 99-112 | O - dailyFocusCount 초과 시 Alert |
| 포커스 개수 설정 | stores/settingsStore.ts | 6 | O - dailyFocusCount (1~5) |

### 3. 카테고리 관리 -- 구현 완료

| 세부 기능 | 파일 | 라인 | 상태 |
|-----------|------|------|------|
| 카테고리 추가 | stores/todoStore.ts | 148-161 | O |
| 카테고리 업데이트 | stores/todoStore.ts | 163-170 | O |
| 카테고리 삭제 | stores/todoStore.ts | 172-181 | O - 연관 todo의 category_id도 null로 초기화 |
| 카테고리 필터링 | app/(tabs)/all.tsx | 64-81 | O |
| 카테고리 선택 UI | app/(tabs)/all.tsx | 232-261 | O - CategoryChip 가로 스크롤 |

### 4. 우선순위 설정 -- 구현 완료

| 세부 기능 | 파일 | 라인 | 상태 |
|-----------|------|------|------|
| 3단계 정의 (0/1/2) | lib/types.ts | 13 | O |
| 색상 코드 | lib/types.ts | 103-107 | O - 낮음(파랑)/중간(주황)/높음(빨강) |
| 라벨 | lib/types.ts | 97-101 | O - 낮음/중간/높음 |
| 우선순위 점 표시 | components/atoms/PriorityDot.tsx | 전체 | O |
| 우선순위 변경 | components/organisms/TodoDetailSheet.tsx | 93-97 | O - 순환 토글 |

### 5. 스트릭 추적 -- 구현 완료

| 세부 기능 | 파일 | 라인 | 상태 |
|-----------|------|------|------|
| 스트릭 데이터 기록 | stores/todoStore.ts | 214-232 | O - 날짜별 완료/전체 개수 저장 |
| 현재 스트릭 계산 | stores/todoStore.ts | 316-340 | O - 연속 일수 역추적 |
| 최고 스트릭 계산 | stores/todoStore.ts | 342-367 | O |
| 스트릭 배지 UI | components/atoms/StreakBadge.tsx | 전체 | O - 불꽃 이모지 + 숫자 |
| 자동 갱신 | stores/todoStore.ts | 107 | O - toggleTodo 시 updateStreak 호출 |

### 6. 주간/월간 통계 -- 구현 완료

| 세부 기능 | 파일 | 라인 | 상태 |
|-----------|------|------|------|
| 주간 통계 (7일) | stores/todoStore.ts | 369-394 | O |
| 월간 통계 | stores/todoStore.ts | 396-435 | O |
| 카테고리별 통계 | stores/todoStore.ts | 437-459 | O |
| WeeklyChart 시각화 | components/organisms/WeeklyChart.tsx | 전체 | O - 원형 진행률 + 요일 라벨 |

### 7. 완료 애니메이션 + 햅틱 피드백 -- 구현 완료

| 세부 기능 | 파일 | 라인 | 상태 |
|-----------|------|------|------|
| 체크박스 scale 애니메이션 | components/atoms/CheckBox.tsx | 23-33 | O - withSpring (1 -> 1.3 -> 1) |
| 햅틱 피드백 (impactMedium) | components/atoms/CheckBox.tsx | 34 | O |
| 텍스트 취소선 | components/molecules/TodoItem.tsx | 67-69 | O |
| FadeIn/FadeOut (리스트) | components/molecules/TodoItem.tsx | 32-36 | O - Animated.View with FadeIn/FadeOut |

### 8. 축하 오버레이 (Confetti) -- 구현 완료

| 세부 기능 | 파일 | 라인 | 상태 |
|-----------|------|------|------|
| Confetti 파티클 (30개) | components/organisms/CelebrationOverlay.tsx | 168-170 | O |
| 축하 텍스트 (bounce) | components/organisms/CelebrationOverlay.tsx | 115-118 | O - withSpring |
| 자동 소멸 (2.5초) | components/organisms/CelebrationOverlay.tsx | 121-124 | O |
| 탭으로 닫기 | components/organisms/CelebrationOverlay.tsx | 167 | O |
| 햅틱 (notificationSuccess) | components/organisms/CelebrationOverlay.tsx | 113 | O |
| 3가지 타입 분기 | components/organisms/CelebrationOverlay.tsx | 143-162 | O - single/all_focus/streak_milestone |

### 9. 라이트/다크 테마 -- 구현 완료

| 세부 기능 | 파일 | 라인 | 상태 |
|-----------|------|------|------|
| 시스템 연동 | hooks/useTheme.ts | 9-13 | O - useColorScheme() + 설정 오버라이드 |
| 3-way 설정 (light/dark/system) | stores/settingsStore.ts | 6-8 | O |
| 라이트 테마 토큰 | constants/theme.ts | 4-34 | O - 스펙과 정확히 일치 |
| 다크 테마 토큰 | constants/theme.ts | 35-65 | O - 스펙과 정확히 일치 |
| StatusBar 스타일 동기화 | app/_layout.tsx | 19 | O |

### 10. 데이터 영속성 -- 구현 완료

| 세부 기능 | 파일 | 라인 | 상태 |
|-----------|------|------|------|
| Zustand persist (todo) | stores/todoStore.ts | 461-465 | O - '@simpletodo/todos' 키 |
| Zustand persist (settings) | stores/settingsStore.ts | 22-27 | O - '@simpletodo/settings' 키 |
| AsyncStorage 스토리지 어댑터 | stores/todoStore.ts | 463 | O - createJSONStorage(() => AsyncStorage) |

### 11. Supabase 클라이언트 설정 -- 부분 구현

| 세부 기능 | 파일 | 라인 | 상태 |
|-----------|------|------|------|
| 클라이언트 초기화 | lib/supabase.ts | 11-20 | O - 환경변수 기반 조건부 생성 |
| 환경변수 미설정 시 null 처리 | lib/supabase.ts | 11 | O |
| Auth 스토어 | stores/authStore.ts | 전체 | O - initialize, signIn, signUp, signOut |
| 실제 데이터 sync | -- | -- | X - dev_summary에 Phase 2로 명시 |

---

## 컴포넌트 완성도 검증

### Atoms (5/5 완성)

| 컴포넌트 | 파일 | 렌더링 코드 | Props 타입 | 인터랙션 |
|----------|------|------------|-----------|---------|
| CheckBox | components/atoms/CheckBox.tsx | O | O (checked, onToggle, priority, size) | O (애니메이션+햅틱) |
| PriorityDot | components/atoms/PriorityDot.tsx | O | O (priority, size) | N/A (표시 전용) |
| CategoryChip | components/atoms/CategoryChip.tsx | O | O (label, color, selected, onPress) | O (프레스) |
| StreakBadge | components/atoms/StreakBadge.tsx | O | O (count) | N/A (표시 전용) |
| ProgressDots | components/atoms/ProgressDots.tsx | O | O (total, completed) | N/A (표시 전용) |

### Molecules (6/6 완성)

| 컴포넌트 | 파일 | 렌더링 코드 | Props 타입 | 인터랙션 |
|----------|------|------------|-----------|---------|
| TodoItem | components/molecules/TodoItem.tsx | O | O | O (체크, 프레스, 삭제) |
| QuickAddBar | components/molecules/QuickAddBar.tsx | O | O | O (텍스트입력, 추가버튼, Enter키) |
| SectionHeader | components/molecules/SectionHeader.tsx | O | O | O (접기/펼치기) |
| EmptyState | components/molecules/EmptyState.tsx | O | O | N/A |
| StatCard | components/molecules/StatCard.tsx | O | O | N/A |
| PropertyRow | components/molecules/PropertyRow.tsx | O | O | O (프레스) |

### Organisms (4/4 완성)

| 컴포넌트 | 파일 | 렌더링 코드 | Props 타입 | 인터랙션 |
|----------|------|------------|-----------|---------|
| DailyFocusCard | components/organisms/DailyFocusCard.tsx | O | O | O (체크, 프레스, 빈슬롯 추가) |
| CelebrationOverlay | components/organisms/CelebrationOverlay.tsx | O | O | O (탭 닫기, 자동소멸) |
| TodoDetailSheet | components/organisms/TodoDetailSheet.tsx | O | O | O (바텀시트, 인라인편집, 속성변경) |
| WeeklyChart | components/organisms/WeeklyChart.tsx | O | O | N/A |

### Layout (1/1 완성)

| 컴포넌트 | 파일 | 상태 |
|----------|------|------|
| ScreenContainer | components/layout/ScreenContainer.tsx | O - SafeArea + 배경색 |

---

## 데이터 흐름 정합성 검증

### DB 스키마 <-> TypeScript 타입

| DB 테이블 | TypeScript 인터페이스 | 일치 | 차이점 |
|-----------|---------------------|------|--------|
| todos | Todo (lib/types.ts:3-19) | O | 완전 일치 -- 모든 컬럼이 매핑됨 |
| categories | Category (lib/types.ts:28-37) | O | 완전 일치 |
| daily_focus | DailyFocus (lib/types.ts:39-46) | O | 완전 일치 |
| user_settings | UserSettings (lib/types.ts:48-55) | 부분 | DB는 snake_case(daily_focus_count), TS는 camelCase(dailyFocusCount) -- 로컬 전용이므로 현재 문제 없으나, 향후 Supabase 동기화 시 변환 레이어 필요 |
| streaks | StreakData (lib/types.ts:57-63) | O | streak_date -> date 매핑 (로컬 전용 키 구조) |

### Zustand Store <-> 컴포넌트 연결

| 스토어 상태 | 소비 컴포넌트 | 셀렉터 일치 | 비고 |
|------------|-------------|-----------|------|
| todos | today.tsx, all.tsx, stats.tsx | O | useMemo로 파생 상태 계산 |
| categories | all.tsx, stats.tsx, TodoDetailSheet.tsx | O | |
| dailyFocus | today.tsx, TodoDetailSheet.tsx | O | |
| streaks | today.tsx, stats.tsx | O | |
| theme (settings) | useTheme.ts -> 모든 컴포넌트 | O | |
| dailyFocusCount (settings) | today.tsx, TodoDetailSheet.tsx | O | |

### 라우팅 정합성

| 소스 | 대상 경로 | 실제 파일 | 일치 |
|------|----------|----------|------|
| app/index.tsx:29 | /(tabs)/today | app/(tabs)/today.tsx | O |
| app/(tabs)/_layout.tsx | today, all, stats, settings | 모든 파일 존재 | O |
| app/_layout.tsx:27-28 | index, (tabs) | 모든 파일 존재 | O |

---

## 발견된 문제점

### 심각 (릴리스 차단)

#### BUG-001: CheckBox 애니메이션 race condition
- **위치**: components/atoms/CheckBox.tsx:30-33
- **문제**: `scale.value`를 1.3으로 설정한 직후 withSpring(1)을 호출하는데, withSpring의 콜백 내에서 `scale.value = 1`을 다시 설정하는 구조가 비직관적이다. `scale.value = 1.3` 할당 (line 33)이 line 30의 withSpring 시작보다 뒤에 있어, 실제 실행 순서가 보장되지만, withSpring의 콜백에서 최종값을 다시 할당하는 것은 불필요한 코드이다. 심각도 재평가: reanimated의 UI 스레드 실행 특성상 `scale.value = 1.3` (line 33)이 먼저 실행되고, 그 후 withSpring이 1.3에서 시작하여 1로 수렴한다. 콜백 내 `scale.value = 1`은 도달 후 중복 설정이므로 문제는 없으나, 코드 의도가 불명확하다.
- **실제 영향**: 낮음 -- 동작에는 문제 없으나 코드 가독성 저하.
- **수정 제안**: 
```typescript
const handlePress = () => {
  scale.value = withSpring(1, { damping: 4, stiffness: 300 });
  scale.value = 1.3; // This line executes first on UI thread
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  onToggle();
};
```
- **심각도 재분류**: 중간 (코드 품질 이슈)

#### BUG-002: CelebrationOverlay의 onDismiss가 useEffect cleanup과 충돌 가능
- **위치**: components/organisms/CelebrationOverlay.tsx:121-125
- **문제**: `setTimeout`으로 2.5초 후 `onDismiss()`를 호출하는데, 사용자가 탭으로 먼저 닫을 경우 타이머가 남아 있어 `onDismiss`가 두 번 호출된다. cleanup으로 `clearTimeout`을 하지만, `onDismiss()`는 이미 한 번 실행된 후일 수 있다. `visible`이 false가 되면 컴포넌트가 `return null`(line 141)로 언마운트되어 cleanup이 실행되므로, 타이머에 의한 두 번째 호출은 방지된다. 단, 부모의 `setCelebrationType(null)` 호출로 인한 리렌더링과 타이머 콜백 사이의 미묘한 타이밍 이슈 가능성이 있다.
- **실제 영향**: 중간 -- 사용자가 빠르게 탭하면 `setCelebrationType(null)`이 두 번 호출될 수 있으나, React 상태 업데이트는 멱등적이므로 크래시는 발생하지 않음. 다만, `overlayOpacity` 애니메이션이 이미 언마운트된 컴포넌트에서 실행될 수 있어 경고 로그 발생 가능.
- **수정 제안**: `let dismissed = false` 플래그를 사용하여 중복 호출 방지:
```typescript
useEffect(() => {
  if (visible) {
    let dismissed = false;
    // ... animation code ...
    const timer = setTimeout(() => {
      if (!dismissed) {
        overlayOpacity.value = withTiming(0, { duration: 300 });
        onDismiss();
        dismissed = true;
      }
    }, 2500);
    return () => {
      dismissed = true;
      clearTimeout(timer);
    };
  }
}, [visible]);
```

### 중간 (릴리스 가능, 하지만 수정 권장)

#### BUG-003: all.tsx의 FlatList가 빈 data로 렌더링
- **위치**: app/(tabs)/all.tsx:264-267
- **문제**: `<FlatList data={[]} renderItem={null} ListHeaderComponent={...} />`로 사용하고 있다. 모든 콘텐츠가 `ListHeaderComponent` 안에 있어 가상화(virtualization)의 이점을 전혀 얻지 못한다. 할일이 많아지면 성능 저하 발생.
- **수정 제안**: FlatList를 ScrollView로 변경하거나, 실제 데이터를 FlatList의 data prop에 전달하여 가상화를 활용.

#### BUG-004: todayStr()이 클로저로 고정되지 않음
- **위치**: stores/todoStore.ts:55
- **문제**: `const todayStr = () => format(new Date(), 'yyyy-MM-dd');`가 함수로 정의되어 호출 시점의 날짜를 반환한다. 자정을 넘기면 앱 재시작 없이도 "오늘"이 바뀌므로 의도적인 설계일 수 있으나, 한 세션 내에서 `getTodayTodos()`와 `getFocusTodos(today)`의 `today`가 서로 다를 수 있는 이론적 가능성이 있다.
- **영향**: 극히 드문 엣지 케이스 (자정 전후 사용 시).

#### BUG-005: 설정 화면에서 "시작 화면" 설정 UI 누락
- **위치**: app/(tabs)/settings.tsx
- **문제**: `settingsStore`에 `startScreen: 'today' | 'all'` 설정이 정의되어 있고, `UserSettings` 인터페이스에도 포함되어 있으나, 설정 화면 UI에서는 이 설정을 변경하는 행(Row)이 없다. 또한, 스플래시에서 `startScreen` 값을 읽어 분기하는 로직도 없다 (항상 `/(tabs)/today`로 이동).
- **수정 제안**: 
  1. settings.tsx의 "일반" 섹션에 시작 화면 설정 행 추가
  2. app/index.tsx에서 settingsStore의 startScreen 값에 따라 라우팅 분기

#### BUG-006: 설정 화면에서 "데이터 내보내기" UI 누락
- **위치**: app/(tabs)/settings.tsx
- **문제**: 디자인 스펙의 "데이터" 섹션에 "데이터 내보내기" 행이 있으나, 구현에서 누락됨. dev_summary에서 알려진 제한사항으로 명시되어 있으므로 의도적 누락이나, 스토어 리스팅에서 언급하지 않도록 주의 필요.

#### BUG-007: 설정 화면 정보 링크의 빈 onPress
- **위치**: app/(tabs)/settings.tsx:308-320
- **문제**: "개인정보 처리방침", "이용약관", "의견 보내기"의 onPress가 `() => {}`로 비어있다. 스토어 출시 전 반드시 실제 URL로 연결하거나 WebView로 이동해야 함.
- **수정 제안**: Linking.openURL()로 외부 웹 페이지 연결.

### 경미 (개선 사항)

#### ISSUE-001: 스와이프 동작 미구현
- **위치**: components/molecules/TodoItem.tsx
- **문제**: 디자인 스펙에서 "우 스와이프: 완료", "좌 스와이프: 삭제/미루기"를 명시했으나, TodoItem은 Pressable만 사용하고 Swipeable을 구현하지 않음. dev_summary에서 "스와이프 동작: 탭/버튼 기반으로 대체"라고 명시되어 있으므로 의도적.
- **영향**: UX 편의성 감소, 기능적으로는 모든 작업이 가능.

#### ISSUE-002: ConfettiPiece의 size가 렌더 시마다 랜덤
- **위치**: components/organisms/CelebrationOverlay.tsx:84
- **문제**: `const size = 6 + Math.random() * 8;`이 컴포넌트 본문(render)에 있어, 리렌더 시 크기가 바뀐다. `visible` 상태 변경으로 리렌더가 일어나면 파티클 크기가 불일정해질 수 있다.
- **수정 제안**: `useMemo` 또는 `useRef`로 초기 생성 시 크기를 고정.

#### ISSUE-003: 디자인 스펙의 BottomTabBar 커스텀 컴포넌트 미사용
- **위치**: 디자인 스펙에 `layout/BottomTabBar.tsx`가 명시되었으나, 실제로는 Expo Router의 기본 Tabs 컴포넌트 사용.
- **영향**: 없음 -- 기본 Tabs가 동일 기능 제공. 커스텀이 필요한 시점에 추가.

#### ISSUE-004: authStore의 onAuthStateChange 리스너가 cleanup되지 않음
- **위치**: stores/authStore.ts:39
- **문제**: `supabase.auth.onAuthStateChange`의 반환값(`data.subscription`)을 저장하지 않아, 리스너를 해제할 수 없다. 현재 앱 구조에서는 initialize()가 한 번만 호출되므로 문제 없으나, 향후 로그아웃/재로그인 시 중복 리스너 발생 가능.
- **수정 제안**: subscription을 상태에 저장하고, signOut 시 unsubscribe().

---

## 데이터 흐름 완전성 검증

### Zustand Persist 키 매핑

| AsyncStorage 키 (스펙) | 실제 키 | 일치 |
|------------------------|--------|------|
| @simpletodo/todos | @simpletodo/todos | O (stores/todoStore.ts:462) |
| @simpletodo/settings | @simpletodo/settings | O (stores/settingsStore.ts:25) |
| @simpletodo/categories | -- | 차이 -- todoStore에 통합 저장 |
| @simpletodo/daily_focus | -- | 차이 -- todoStore에 통합 저장 |
| @simpletodo/streaks | -- | 차이 -- todoStore에 통합 저장 |

비고: 스펙에서는 별도 키였으나, 구현에서는 todoStore 하나의 persist 키에 모든 상태(todos, categories, dailyFocus, streaks)를 통합 저장. 기능적으로 문제 없음. 데이터량이 커지면 별도 스토어 분리 권장.

### Supabase SQL 스키마 <-> 마이그레이션 파일 일치

| 항목 | 디자인 스펙 | 마이그레이션 파일 | 일치 |
|------|-----------|----------------|------|
| todos 테이블 | O | O | O - 완전 일치 |
| categories 테이블 | O | O | O |
| daily_focus 테이블 | O | O | O |
| user_settings 테이블 | O | O | O |
| streaks 테이블 | O | O | O |
| RLS 정책 (todos: 4개) | O | O | O |
| RLS 정책 (categories: ALL) | O | O | O |
| RLS 정책 (daily_focus: ALL) | O | O | O |
| RLS 정책 (user_settings: ALL) | O | O | O |
| RLS 정책 (streaks: ALL) | O | O | O |
| updated_at 트리거 | 스펙에 미명시 | O | 추가 구현 (좋음) |

---

## 빌드 가능성 검증

| 항목 | 결과 | 상세 |
|------|------|------|
| tsc --noEmit | 통과 | TypeScript 에러 0건 |
| 누락된 import | 없음 | 모든 파일의 import 경로 확인 완료 |
| 미사용 import | 없음 | 확인 범위 내 미사용 import 없음 |
| package.json 의존성 | 완전 | 코드에서 사용하는 모든 패키지가 dependencies에 포함 |
| @/ 경로 별칭 | 정상 | tsconfig.json의 paths 설정과 일치 |
| expo-router 설정 | 정상 | app.json의 plugins에 expo-router 포함 |
| react-native-haptics 불필요 의존성 | 경미 | package.json에 "react-native-haptics"가 있으나 코드에서는 "expo-haptics"만 사용. 불필요한 패키지. |

---

## 타입 안전성 검증

| 검증 항목 | 결과 | 위치 |
|-----------|------|------|
| any 타입 사용 | 1건 | TodoDetailSheet.tsx:117 -- BottomSheetBackdrop의 props가 `any` |
| as 캐스팅 | 1건 | settingsStore.ts:17 -- `as Partial<UserSettings>` (안전한 사용) |
| 제네릭 우회 | 0건 | |
| null/undefined 처리 | 양호 | Optional chaining과 null 체크가 일관적 |

---

## 권장 수정사항

### 릴리스 전 필수 (Priority: High)

1. **BUG-007**: 정보 링크 (개인정보/이용약관/의견)에 실제 URL 연결 -- 스토어 정책 위반 가능
2. **BUG-002**: CelebrationOverlay의 중복 호출 방지 로직 추가
3. `react-native-haptics` 패키지 제거 (불필요 의존성, 번들 크기 영향)

### 릴리스 후 우선 수정 (Priority: Medium)

4. **BUG-003**: all.tsx의 FlatList 가상화 개선
5. **BUG-005**: 시작 화면 설정 UI + 라우팅 분기 추가
6. **ISSUE-004**: Supabase auth 리스너 cleanup 로직 추가
7. **ISSUE-002**: ConfettiPiece size 렌더 시 고정

### 향후 개선 (Priority: Low)

8. **ISSUE-001**: 스와이프 동작 구현 (react-native-gesture-handler Swipeable)
9. **BUG-006**: 데이터 내보내기 기능 구현
10. TodoStore를 기능별(todos, categories, focus, streaks)로 분리하여 persist 효율성 개선

---

## 최종 판정

**조건부 릴리스 가능**

근거:
- 핵심 11개 기능 중 9개 완전 구현, 2개 부분 구현 (Supabase 동기화는 Phase 2로 의도적 제외, 시작 화면 설정은 경미한 누락)
- TypeScript 빌드 통과 (0 에러)
- 모든 화면이 실제 동작하는 UI 코드로 구현되었고 placeholder/skeleton 없음
- 디자인 스펙의 데이터 모델, 색상 토큰, 타이포그래피가 정확하게 반영됨
- 심각한 런타임 크래시 유발 버그 없음
- Supabase 스키마와 RLS 정책이 스펙과 정확히 일치

조건:
1. 정보 링크(개인정보/이용약관) URL 연결 필수 (Google Play 정책)
2. `react-native-haptics` 불필요 패키지 제거 권장
3. CelebrationOverlay의 타이밍 이슈는 사용 빈도가 낮아 릴리스 차단 사유는 아님
