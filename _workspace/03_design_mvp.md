# MVP 디자인: SimpleTodo (심플투두)
생성일: 2026-04-06

---

## 앱 컨셉

### 앱 이름 후보
| 순위 | 이름 | ASO 키워드 적합성 | 비고 |
|------|------|-------------------|------|
| 1 | **심플투두 (SimpleTodo)** | "심플" + "투두" 핵심 키워드 | 직관적, 기억하기 쉬움, 미니멀 이미지 |
| 2 | **오늘할일** | "오늘" + "할일" 검색어 | 핵심 기능을 이름으로 전달, 한국어 검색 최적 |
| 3 | **하루세개** | 차별화 키워드 | "오늘의 3가지" 컨셉 직접 반영, 독특함 |

**최종 선택**: 심플투두 (SimpleTodo) -- 글로벌 확장성 + 한국어 검색 모두 커버

### 핵심 가치 제안
> **"열면 바로 쓴다. 오늘 할 일에만 집중한다."**
>
> 복잡한 설정, 회원가입, 튜토리얼 없이 앱을 열자마자 오늘의 할일을 입력하고 하나씩 완료하는 경험.
> "오늘의 3가지" 집중 모드로 인지 부하를 최소화하고, 완료할 때마다 감성적 피드백으로 성취감을 극대화한다.

### 타겟 사용자 페르소나

**주 페르소나: 김지원 (29세, 마케팅 대리)**
- Notion으로 업무 관리를 시도했지만 세팅에 지쳐 포기
- 카카오톡 "나에게 보내기"로 할일을 메모하지만 묻혀서 잊어버림
- 원하는 것: 열면 바로 쓸 수 있고, 오늘 해야 할 것만 깔끔하게 보여주는 앱
- 싫어하는 것: 복잡한 UI, 강제 회원가입, 느린 로딩, 무거운 앱

**부 페르소나: 이준호 (24세, 대학생)**
- 과제 마감일과 개인 할일을 한곳에서 관리하고 싶음
- 투두메이트를 쓰지만 소셜 기능이 부담스러울 때가 있음
- 원하는 것: 가볍고 빠르며, 완료했을 때 보상감이 있는 앱

---

## 핵심 사용자 플로우

### 플로우 1: 제로 온보딩 -> 첫 할일 입력 (Day 0)

```
[앱 설치/실행]
     |
     v
[스플래시 (0.8초)]
     |
     v
[오늘 화면 (빈 상태)] ------> 비어있을 때 안내 문구 표시:
     |                         "오늘 할 일을 추가해보세요"
     v                         + 입력 필드 자동 포커스
[FAB(+) 탭 또는 입력 필드 탭]
     |
     v
[할일 입력 (인라인)]
     |
     v
[Enter/완료 -> 할일 추가됨]
     |
     v
[계속 추가 또는 사용 시작]
```

**핵심 원칙**: 앱 최초 실행부터 첫 할일 입력까지 5초 이내. 회원가입/온보딩 화면 없음. 로컬 저장 우선.

### 플로우 2: 일일 핵심 루프 (매일 반복)

```
[앱 실행 / 위젯 확인]
     |
     v
[오늘 화면] --- "오늘의 3가지" 하이라이트 영역
     |
     +---> [할일 추가] (FAB 또는 인라인 입력)
     |
     +---> [할일 완료] (체크 탭 / 우 스와이프)
     |          |
     |          v
     |     [완료 애니메이션 + 햅틱]
     |          |
     |          v
     |     [일일 진행률 업데이트]
     |          |
     |          v
     |     (3개 모두 완료 시)
     |          |
     |          v
     |     [축하 애니메이션 + 스트릭 카운트]
     |
     +---> [할일 편집] (탭 -> 상세 바텀시트)
     |
     +---> [할일 삭제] (좌 스와이프)
     |
     +---> [할일 미루기] (좌 스와이프 -> 내일로)
```

### 플로우 3: 계정 연동 (선택적, Day N)

```
[설정 화면]
     |
     v
[클라우드 동기화 섹션]
     |
     v
[Google/Apple/이메일 로그인]
     |
     v
[Supabase Auth 처리]
     |
     v
[로컬 데이터 -> 클라우드 업로드]
     |
     v
[동기화 완료 확인]
```

---

## 화면 목록

총 **6개 화면** (MVP 범위)

| # | 화면명 | 유형 | 우선순위 |
|---|--------|------|---------|
| 1 | 스플래시 | Stack | P0 |
| 2 | 오늘 (메인) | Tab - 오늘 | P0 |
| 3 | 할일 상세 / 편집 | Bottom Sheet | P0 |
| 4 | 전체 할일 | Tab - 전체 | P0 |
| 5 | 통계 | Tab - 통계 | P1 |
| 6 | 설정 | Tab - 설정 | P1 |

---

### Screen 1: 스플래시

**목적**: 앱 브랜딩 표시 + 초기 데이터 로딩

**텍스트 와이어프레임**:
```
+----------------------------------+
|                                  |
|                                  |
|                                  |
|          [앱 아이콘]              |
|         SimpleTodo               |
|    "오늘에 집중하세요"             |
|                                  |
|                                  |
|                                  |
+----------------------------------+
```

**주요 컴포넌트**:
- AppIcon: 체크마크 모티프 앱 아이콘 (72x72dp)
- AppName: "SimpleTodo" 텍스트 (heading, primary color)
- Tagline: "오늘에 집중하세요" (body, secondary text color)
- FadeIn 애니메이션 (reanimated)

**사용자 액션**: 없음 (자동 전환)

**동작 로직**:
1. 로컬 저장소에서 데이터 로딩 (AsyncStorage/SQLite)
2. 인증 상태 확인 (Supabase session)
3. 0.8~1.2초 후 오늘 화면으로 자동 전환
4. 첫 실행 여부 플래그 확인 (isFirstLaunch)

**네비게이션**: 0.8초 후 -> Screen 2 (오늘)

---

### Screen 2: 오늘 (메인 화면) -- 핵심 화면

**목적**: 오늘 할 일의 입력, 확인, 완료를 한 화면에서 처리. 앱의 핵심 경험.

**텍스트 와이어프레임**:
```
+----------------------------------+
| SimpleTodo            [날짜 표시] |
|   4월 6일 일요일                  |
+----------------------------------+
|                                  |
| [오늘의 3가지] ==================|
| | ★ 1. 프로젝트 기획서 작성     ||
| | ★ 2. 팀 미팅 준비             ||
| | ★ 3. 운동 30분                ||
| |================================||
| | 진행률: ●●○ 1/3 완료          ||
| +================================+
|                                  |
| -- 오늘 할 일 -------------------|
| ☐ 장보기                    ⋮   |
| ☐ 이메일 답장               ⋮   |
| ☑ ~~점심 예약~~ (완료)      ⋮   |
|                                  |
| -- 완료됨 (1) -------- [접기] ---|
| ☑ ~~점심 예약~~                  |
|                                  |
|                                  |
| +------------------------------+ |
| | 할 일을 입력하세요...    [추가]| |
| +------------------------------+ |
|                                  |
+--[오늘]--[전체]--[통계]--[설정]--+
```

**주요 컴포넌트**:

1. **HeaderSection**
   - 앱 이름 (좌측, subheading)
   - 오늘 날짜 표시 (한국어 형식: "4월 6일 일요일")
   - 스트릭 배지 (연속 달성 일수, 우측 상단)

2. **DailyFocusCard** ("오늘의 3가지" 영역)
   - 카드 형태 (elevated surface, border-radius: 16)
   - 별(★) 아이콘으로 포커스 항목 표시
   - 최대 3개 할일 표시
   - 진행률 인디케이터 (원형 점 또는 프로그레스 바)
   - 빈 슬롯이 있으면 "+ 오늘의 할 일 추가" 안내
   - 탭하여 기존 할일에서 선택하거나 신규 추가

3. **TodoList** (일반 할일 섹션)
   - SectionHeader: "오늘 할 일" (caption)
   - TodoItem 리스트 (FlatList, 가상화)
     - CheckBox (좌측): 탭 시 완료 토글
     - TodoTitle (중앙): 할일 텍스트
     - MoreButton (우측): 3-dot 메뉴 (편집/삭제/미루기)
   - 스와이프 지원:
     - 우 스와이프: 완료 (초록색 배경 + 체크 아이콘)
     - 좌 스와이프: 삭제 또는 내일로 미루기 (빨간/주황 배경)

4. **CompletedSection** (완료된 항목)
   - 접기/펼치기 토글
   - 완료된 항목은 취소선 + 회색 텍스트
   - 기본적으로 접힌 상태

5. **QuickAddBar** (빠른 입력 바 -- 하단 고정)
   - TextInput: "할 일을 입력하세요..." 플레이스홀더
   - AddButton: "추가" 버튼 (또는 전송 아이콘)
   - 키보드 올라올 때 바텀 네비 위에 고정
   - Enter 키로 즉시 추가 가능

6. **BottomTabBar** (하단 네비게이션)
   - 4개 탭: 오늘 / 전체 / 통계 / 설정
   - 활성 탭 하이라이트 (primary color)

**사용자 액션**:
| 액션 | 동작 | 피드백 |
|------|------|--------|
| 입력 바에 텍스트 입력 + 추가 | 할일 생성 (오늘 날짜 자동 설정) | 리스트에 항목 추가 애니메이션 |
| 체크박스 탭 | 할일 완료/해제 토글 | 체크 애니메이션 + 햅틱 (중간 강도) |
| 오늘의 3가지 모두 완료 | 축하 이벤트 트리거 | 전체 화면 축하 애니메이션 (confetti) + 강한 햅틱 |
| 할일 항목 탭 | 상세/편집 바텀시트 열기 | 바텀시트 슬라이드업 |
| 우 스와이프 | 할일 완료 | 초록 배경 드러남 + 완료 처리 |
| 좌 스와이프 | 삭제 확인 또는 내일로 미루기 | 빨간/주황 배경 드러남 |
| DailyFocusCard 빈 슬롯 탭 | 포커스 할일 선택/추가 | 기존 목록에서 선택 피커 |
| 완료 섹션 접기/펼치기 | 완료된 항목 표시/숨기기 | 아코디언 애니메이션 |

**빈 상태 (Empty State)**:
```
+----------------------------------+
|                                  |
|         [체크 일러스트]           |
|                                  |
|    오늘은 어떤 일을 할까요?       |
|                                  |
|    아래에서 할 일을 추가해보세요   |
|           ↓                      |
|                                  |
| +------------------------------+ |
| | 할 일을 입력하세요...    [추가]| |
| +------------------------------+ |
+----------------------------------+
```

**데이터 바인딩**:
- `todos` WHERE `date = today` AND `is_deleted = false` ORDER BY `is_completed ASC, is_focus DESC, created_at ASC`
- `daily_focus` WHERE `date = today` (최대 3개)
- `streak_count` (연속 달성 일수)
- `today_completion_rate` (오늘 완료율)

---

### Screen 3: 할일 상세 / 편집 (Bottom Sheet)

**목적**: 할일의 세부 정보를 확인하고 편집. 별도 화면 이동 없이 바텀시트로 처리하여 맥락 유지.

**텍스트 와이어프레임**:
```
+----------------------------------+
|          [드래그 핸들]            |
+----------------------------------+
| ☐ 프로젝트 기획서 작성           |
|    (제목 - 인라인 편집 가능)      |
+----------------------------------+
| 📋 메모                          |
| [마케팅 팀 요청사항 반영...]      |
+----------------------------------+
| 📅 마감일        2026.04.07 (내일)|
| 🔔 알림          오후 2:00       |
| 🔁 반복          매주 월요일     |
| 🏷️ 카테고리      업무            |
| ⚡ 우선순위      높음 (빨강)     |
| ★  오늘 집중     ON              |
+----------------------------------+
| 🗑️ [삭제]                        |
+----------------------------------+
```

**주요 컴포넌트**:

1. **DragHandle**: 바텀시트 드래그 핸들 (회색 바)
2. **TitleInput**: 할일 제목 (인라인 편집, heading 사이즈)
3. **MemoInput**: 메모/상세 내용 (multiline, 접기 가능)
4. **PropertyRow** (반복 사용되는 속성 행):
   - Icon + Label + Value + ChevronRight
   - 탭 시 각 속성에 맞는 피커 표시
5. **DatePicker**: 날짜 선택 (한국어 로케일)
6. **TimePicker**: 시간 선택 (알림 시간)
7. **RecurrencePicker**: 반복 패턴 선택 (매일/매주/매월/사용자 정의)
8. **CategoryPicker**: 카테고리 선택/생성
9. **PrioritySelector**: 3단계 우선순위 (높음-빨강/중간-주황/낮음-파랑)
10. **FocusToggle**: "오늘의 3가지" 포함 토글
11. **DeleteButton**: 삭제 버튼 (error color, 확인 다이얼로그)

**사용자 액션**:
| 액션 | 동작 |
|------|------|
| 제목 탭 | 인라인 편집 모드 진입 |
| 속성 행 탭 | 해당 피커/선택기 표시 |
| 바텀시트 아래로 스와이프 | 바텀시트 닫기 (변경 자동 저장) |
| 삭제 탭 | 확인 다이얼로그 -> 삭제 |

**동작 로직**:
- 모든 변경사항은 실시간 자동 저장 (debounce 300ms)
- 바텀시트 닫을 때 별도 저장 버튼 불필요
- 반복 설정 시 다음 반복 일정 자동 생성 로직

---

### Screen 4: 전체 할일

**목적**: 날짜에 상관없이 모든 할일을 카테고리/리스트 별로 관리

**텍스트 와이어프레임**:
```
+----------------------------------+
| 전체 할 일            [검색 🔍]  |
+----------------------------------+
| [전체] [업무] [개인] [+ 추가]    |
+----------------------------------+
|                                  |
| -- 예정됨 ---------------------- |
| ☐ 프로젝트 기획서 작성    04.07  |
| ☐ 팀 미팅 준비            04.07  |
| ☐ 치과 예약               04.10  |
|                                  |
| -- 기한 없음 ------------------- |
| ☐ 책 읽기                       |
| ☐ 블로그 글 쓰기                |
|                                  |
| -- 지난 할일 (2) ------ [접기] - |
| ☐ 보고서 제출             04.04  |
| ☐ 세금 납부               04.05  |
|                                  |
| -- 완료됨 (5) --------- [접기] - |
|                                  |
+--[오늘]--[전체]--[통계]--[설정]--+
```

**주요 컴포넌트**:

1. **SearchBar**: 검색 아이콘 탭 시 검색 입력 확장 (할일 제목/메모 검색)
2. **CategoryTabBar**: 가로 스크롤 카테고리 필터 칩
   - "전체" (기본 선택)
   - 사용자 생성 카테고리들
   - "+ 추가" 버튼 (새 카테고리 생성)
3. **SectionedTodoList**:
   - "예정됨": 마감일이 오늘 이후인 할일 (날짜순)
   - "기한 없음": 마감일 미설정 할일
   - "지난 할일": 마감일이 지난 미완료 할일 (경고 표시)
   - "완료됨": 완료된 할일 (접기 가능)
4. **TodoItem**: Screen 2와 동일 컴포넌트 재사용
5. **FAB**: 우하단 플로팅 추가 버튼 (이 화면에서는 FAB 표시)

**사용자 액션**:
| 액션 | 동작 |
|------|------|
| 카테고리 칩 탭 | 해당 카테고리로 필터링 |
| "+ 추가" 칩 탭 | 새 카테고리 생성 다이얼로그 |
| 검색 아이콘 탭 | 검색 바 확장 + 키보드 |
| FAB 탭 | 할일 추가 (선택된 카테고리 자동 적용) |
| 지난 할일 항목 탭 | 바텀시트 (날짜 변경 유도) |

**데이터 바인딩**:
- `todos` WHERE `is_deleted = false` AND `category = selected_category` ORDER BY 섹션별 정렬
- `categories` (사용자 생성 카테고리 목록)

---

### Screen 5: 통계

**목적**: 할일 완료 현황을 시각적으로 보여주어 성취감과 동기부여 제공. 경쟁 앱이 유료로 제공하는 기능을 무료로 차별화.

**텍스트 와이어프레임**:
```
+----------------------------------+
| 통계                             |
+----------------------------------+
|                                  |
| [스트릭 카드] =================  |
| |  🔥 연속 7일 달성!           | |
| |  최고 기록: 14일             | |
| +=================================+
|                                  |
| [이번 주] =====================  |
| |  월  화  수  목  금  토  일  | |
| |  ●   ●   ●   ◐   ○   ○   ○ | |
| |  5/5 3/3 4/4 2/4            | |
| +=================================+
|                                  |
| [월간 요약] ===================  |
| |  이번 달 완료: 47개          | |
| |  완료율: 78%                 | |
| |  가장 생산적인 요일: 화요일   | |
| +=================================+
|                                  |
| [카테고리별] =================== |
| |  업무    ████████░░  80%     | |
| |  개인    ██████░░░░  60%     | |
| |  건강    ████░░░░░░  40%     | |
| +=================================+
|                                  |
+--[오늘]--[전체]--[통계]--[설정]--+
```

**주요 컴포넌트**:

1. **StreakCard**:
   - 불꽃 아이콘 + 현재 스트릭 일수 (크게 표시)
   - 최고 기록 표시
   - Surface 카드 (elevated)

2. **WeeklyChart**:
   - 7일간 원형 진행률 (완료/전체)
   - 각 날짜 아래 완료 수/전체 수
   - 완료율에 따라 원 채우기: ● (100%), ◐ (50%+), ○ (미달)

3. **MonthlySummary**:
   - 이번 달 총 완료 수
   - 평균 완료율
   - 가장 생산적인 요일

4. **CategoryBreakdown**:
   - 카테고리별 수평 프로그레스 바
   - 완료율 퍼센트 표시

**사용자 액션**:
| 액션 | 동작 |
|------|------|
| 주간 차트 날짜 탭 | 해당 날짜의 할일 목록 미리보기 |
| 위로 스크롤 | 추가 통계 표시 (월별 트렌드 등) |

**데이터 바인딩**:
- `streak`: 연속 달성 일수 계산 (매일 1개 이상 완료 기준)
- `weekly_stats`: 최근 7일 완료율
- `monthly_stats`: 이번 달 통계 집계
- `category_stats`: 카테고리별 완료율

---

### Screen 6: 설정

**목적**: 앱 설정, 계정 관리, 데이터 관리

**텍스트 와이어프레임**:
```
+----------------------------------+
| 설정                             |
+----------------------------------+
|                                  |
| [계정] ========================= |
| | 클라우드 동기화         OFF  > | |
| | (로그인하면 기기 간 동기화)    | |
| +================================+
|                                  |
| [일반] ========================= |
| | 테마              시스템 설정 >| |
| | 시작 화면         오늘       > | |
| | 오늘의 집중 개수   3개       > | |
| +================================+
|                                  |
| [알림] ========================= |
| | 일일 리마인더       OFF      > | |
| | 리마인더 시간       오전 9:00> | |
| +================================+
|                                  |
| [데이터] ======================== |
| | 완료 항목 자동 삭제  30일 후 > | |
| | 데이터 내보내기              > | |
| | 데이터 초기화                > | |
| +================================+
|                                  |
| [정보] ========================= |
| | 앱 버전              1.0.0   | |
| | 개인정보 처리방침            > | |
| | 이용약관                     > | |
| | 의견 보내기                  > | |
| +================================+
|                                  |
+--[오늘]--[전체]--[통계]--[설정]--+
```

**주요 컴포넌트**:

1. **AccountSection**:
   - SyncToggle: 클라우드 동기화 on/off
   - 미로그인 시: "로그인하여 동기화" CTA
   - 로그인 시: 계정 정보 표시 + 로그아웃

2. **GeneralSection**:
   - ThemeSelector: 라이트/다크/시스템 설정 (3-way toggle)
   - StartScreenSelector: 앱 시작 화면 선택
   - FocusCountSelector: "오늘의 3가지" 개수 조정 (1~5개)

3. **NotificationSection**:
   - DailyReminderToggle: 매일 할일 리마인더
   - ReminderTimePicker: 리마인더 시간 설정

4. **DataSection**:
   - AutoDeleteSelector: 완료 항목 자동 삭제 기간
   - ExportButton: CSV/JSON 데이터 내보내기
   - ResetButton: 데이터 초기화 (확인 다이얼로그 2중)

5. **InfoSection**:
   - AppVersion: 현재 버전 표시
   - 외부 링크들 (개인정보, 이용약관, 피드백)

**사용자 액션**:
| 액션 | 동작 |
|------|------|
| 클라우드 동기화 탭 | 로그인 화면 이동 (미인증 시) / 동기화 토글 |
| 테마 탭 | 3-way 선택 다이얼로그 |
| 데이터 초기화 탭 | 2중 확인 다이얼로그 -> 초기화 |

---

## 네비게이션 구조

### 전체 구조

```
RootNavigator (Stack)
├── SplashScreen
└── MainTabNavigator (Bottom Tab)
    ├── Tab 1: TodayStack (Stack)
    │   └── TodayScreen
    │       └── TodoDetailSheet (Bottom Sheet - Modal)
    ├── Tab 2: AllTodosStack (Stack)
    │   └── AllTodosScreen
    │       └── TodoDetailSheet (Bottom Sheet - Modal)
    ├── Tab 3: StatsScreen
    └── Tab 4: SettingsStack (Stack)
        ├── SettingsScreen
        ├── LoginScreen (Push)
        └── CategoryManageScreen (Push)
```

### Expo Router 파일 구조

```
app/
├── _layout.tsx          # RootNavigator (Stack)
├── index.tsx            # SplashScreen (리다이렉트)
├── (tabs)/
│   ├── _layout.tsx      # BottomTabNavigator
│   ├── today.tsx        # 오늘 화면 (Tab 1)
│   ├── all.tsx          # 전체 할일 (Tab 2)
│   ├── stats.tsx        # 통계 (Tab 3)
│   └── settings.tsx     # 설정 (Tab 4)
├── login.tsx            # 로그인 (Modal Stack)
└── components/
    └── TodoDetailSheet.tsx  # 할일 상세 바텀시트 (공유 컴포넌트)
```

### 탭 네비게이션 구성

| 탭 | 아이콘 | 라벨 | 설명 |
|----|--------|------|------|
| 오늘 | `calendar-today` (MaterialIcons) | 오늘 | 기본 탭, 앱 시작 시 표시 |
| 전체 | `list-alt` (MaterialIcons) | 전체 | 모든 할일 관리 |
| 통계 | `bar-chart` (MaterialIcons) | 통계 | 완료 현황 |
| 설정 | `settings` (MaterialIcons) | 설정 | 앱 설정 |

### 네비게이션 선택 이유

- **Bottom Tab**: 모든 핵심 화면에 1탭 접근 가능. 벤치마킹 결과 3-5개 탭이 표준이며, 4개 탭 채택
- **Bottom Sheet (Modal)**: 할일 상세를 별도 화면 대신 바텀시트로 구현하여 맥락 전환 최소화. iOS/Android 모두에서 자연스러운 패턴
- **Stack Navigator**: 설정 하위 화면(로그인, 카테고리 관리)은 Stack으로 깊이 제공

---

## 컴포넌트 계층 구조

### 공유 컴포넌트 (Shared Components)

```
components/
├── atoms/                     # 최소 단위 컴포넌트
│   ├── CheckBox.tsx           # 완료 체크박스 (애니메이션 포함)
│   ├── PriorityDot.tsx        # 우선순위 색상 점
│   ├── CategoryChip.tsx       # 카테고리 필터 칩
│   ├── StreakBadge.tsx        # 스트릭 배지
│   └── ProgressDot.tsx        # 진행률 점 (●/◐/○)
│
├── molecules/                 # 조합 컴포넌트
│   ├── TodoItem.tsx           # 할일 항목 (체크박스 + 제목 + 스와이프)
│   ├── QuickAddBar.tsx        # 빠른 입력 바
│   ├── PropertyRow.tsx        # 속성 행 (아이콘 + 라벨 + 값)
│   ├── SectionHeader.tsx      # 섹션 헤더 (제목 + 접기 토글)
│   ├── EmptyState.tsx         # 빈 상태 표시
│   └── StatCard.tsx           # 통계 카드
│
├── organisms/                 # 복합 컴포넌트
│   ├── DailyFocusCard.tsx     # "오늘의 3가지" 카드
│   ├── TodoList.tsx           # 할일 리스트 (FlatList 래퍼)
│   ├── TodoDetailSheet.tsx    # 할일 상세 바텀시트
│   ├── WeeklyChart.tsx        # 주간 통계 차트
│   ├── CategoryBar.tsx        # 카테고리 탭 바
│   └── CelebrationOverlay.tsx # 축하 애니메이션 오버레이
│
└── layout/                    # 레이아웃 컴포넌트
    ├── ScreenContainer.tsx    # 화면 래퍼 (SafeArea + padding)
    └── BottomTabBar.tsx       # 커스텀 탭 바
```

### 컴포넌트 상세 스펙

#### CheckBox (atom)
```typescript
interface CheckBoxProps {
  checked: boolean;
  onToggle: () => void;
  priority?: 'high' | 'medium' | 'low';
  size?: number; // default 24
}
```
- 미완료: 빈 원형 (primary outline)
- 완료: 채워진 원형 + 체크마크 (primary filled)
- 전환 시 reanimated scale + opacity 애니메이션 (200ms)
- 완료 시 햅틱 피드백 (impactMedium)

#### TodoItem (molecule)
```typescript
interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onPress: (id: string) => void;
  onSwipeLeft: (id: string) => void;
  onSwipeRight: (id: string) => void;
  isFocused?: boolean;
}
```
- react-native-gesture-handler의 Swipeable 래핑
- 우 스와이프: 초록 배경 + 체크 아이콘 -> 완료
- 좌 스와이프: 빨간 배경 + 삭제 아이콘 -> 삭제 확인
- 완료 항목: 텍스트 취소선 + opacity 0.5 + 회색 텍스트

#### DailyFocusCard (organism)
```typescript
interface DailyFocusCardProps {
  focusTodos: Todo[]; // max 3
  maxFocusCount: number; // default 3
  completedCount: number;
  onAddFocus: () => void;
  onToggleFocus: (id: string) => void;
}
```
- Surface 카드 (elevation: 2)
- 빈 슬롯: 점선 테두리 + "+" 아이콘
- 모두 완료 시: 카드 배경 색상 변화 (success gradient)

#### CelebrationOverlay (organism)
```typescript
interface CelebrationOverlayProps {
  visible: boolean;
  type: 'single' | 'all_focus' | 'streak_milestone';
  streakCount?: number;
  onDismiss: () => void;
}
```
- `single`: 체크마크 ripple 효과 (작은 애니메이션)
- `all_focus`: 오늘의 3가지 모두 완료 -> confetti 파티클 + 축하 텍스트
- `streak_milestone`: 7일, 14일, 30일 등 마일스톤 -> 특별 애니메이션
- react-native-reanimated로 구현
- 자동 소멸 (2초) 또는 탭하여 닫기

---

## 디자인 토큰 (Design Tokens)

### 색상 (Colors)

Material Design 3 Dynamic Color 기반, 한국 사용자 선호 고려.

#### 라이트 테마
```
Primary:          #2563EB (파란색 계열 - 신뢰/집중)
Primary Container:#DBEAFE
On Primary:       #FFFFFF
On Primary Container: #1E40AF

Secondary:        #7C3AED (보라색 계열 - 창의/동기부여)
Secondary Container: #EDE9FE
On Secondary:     #FFFFFF

Background:       #FAFAFA
Surface:          #FFFFFF
Surface Variant:  #F3F4F6

Text Primary:     #111827 (거의 검정, 가독성)
Text Secondary:   #6B7280
Text Disabled:    #D1D5DB

Success:          #10B981 (완료/성공)
Success Container:#D1FAE5
Warning:          #F59E0B (경고/주의)
Warning Container:#FEF3C7
Error:            #EF4444 (삭제/오류)
Error Container:  #FEE2E2

Focus Star:       #F59E0B (오늘의 3가지 별 색상)
Streak Fire:      #F97316 (스트릭 불꽃 색상)

Divider:          #E5E7EB
Outline:          #D1D5DB
```

#### 다크 테마
```
Primary:          #60A5FA
Primary Container:#1E3A5F
On Primary:       #1E3A5F
On Primary Container: #DBEAFE

Secondary:        #A78BFA
Secondary Container: #3B1F6E

Background:       #111827
Surface:          #1F2937
Surface Variant:  #374151

Text Primary:     #F9FAFB
Text Secondary:   #9CA3AF
Text Disabled:    #4B5563

Success:          #34D399
Warning:          #FBBF24
Error:            #F87171

Focus Star:       #FBBF24
Streak Fire:      #FB923C

Divider:          #374151
Outline:          #4B5563
```

### 타이포그래피 (Typography)

시스템 폰트 사용 (경량 앱 목표, 커스텀 폰트 번들 회피).

```
Display:     32px / line-height 40 / weight 700  (축하 텍스트, 스트릭 숫자)
Heading:     24px / line-height 32 / weight 700  (화면 제목)
Subheading:  18px / line-height 26 / weight 600  (섹션 제목)
Body:        16px / line-height 24 / weight 400  (할일 텍스트, 일반 본문)
Body Bold:   16px / line-height 24 / weight 600  (강조 본문)
Caption:     14px / line-height 20 / weight 400  (날짜, 부가 정보)
Small:       12px / line-height 16 / weight 400  (배지, 힌트 텍스트)
```

Font Family: `System` (iOS: SF Pro, Android: Roboto)

### 간격 (Spacing)

4px 기반 간격 시스템:

```
xxs:  4px   (아이콘 내부 패딩, 미세 조정)
xs:   8px   (인접 요소 간격, 칩 내부 패딩)
sm:   12px  (관련 요소 간격)
md:   16px  (화면 좌우 패딩, 컴포넌트 간 기본 간격)
lg:   24px  (섹션 간 간격)
xl:   32px  (대 섹션 간 간격)
xxl:  48px  (화면 상단/하단 여백)
```

### 모서리 반경 (Border Radius)

```
xs:   4px   (작은 배지, 태그)
sm:   8px   (버튼, 입력 필드)
md:   12px  (카드, 칩)
lg:   16px  (DailyFocusCard, 바텀시트 상단)
xl:   24px  (FAB)
full: 9999px (원형 체크박스, 아바타)
```

### 그림자 (Elevation)

```
Level 0: none                           (플랫 요소)
Level 1: 0 1px 2px rgba(0,0,0,0.05)    (카드 기본)
Level 2: 0 4px 6px rgba(0,0,0,0.07)    (DailyFocusCard, 활성 카드)
Level 3: 0 10px 15px rgba(0,0,0,0.10)  (바텀시트, FAB)
Level 4: 0 20px 25px rgba(0,0,0,0.15)  (모달, 오버레이)
```

### 애니메이션 (Animation Tokens)

```
Duration:
  instant:  100ms  (체크 토글)
  fast:     200ms  (리스트 항목 추가/삭제)
  normal:   300ms  (바텀시트 열기/닫기, 화면 전환)
  slow:     500ms  (축하 애니메이션 시작)
  celebration: 2000ms  (축하 전체 재생 시간)

Easing:
  standard:    Easing.bezier(0.4, 0, 0.2, 1)   (일반 전환)
  decelerate:  Easing.bezier(0, 0, 0.2, 1)     (진입 애니메이션)
  accelerate:  Easing.bezier(0.4, 0, 1, 1)     (퇴장 애니메이션)
  bounce:      Easing.bezier(0.34, 1.56, 0.64, 1)  (체크 완료 바운스)
```

---

## 데이터 모델 (Supabase)

### ERD 개요

```
users (Supabase Auth)
  |
  |-- 1:N --> todos
  |             |-- N:1 --> categories
  |
  |-- 1:N --> categories
  |
  |-- 1:N --> daily_focus
  |
  |-- 1:1 --> user_settings
  |
  |-- 1:N --> streaks
```

### 테이블 정의

#### 1. todos

할일의 핵심 테이블.

```sql
CREATE TABLE todos (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  memo          TEXT DEFAULT '',
  is_completed  BOOLEAN DEFAULT FALSE,
  completed_at  TIMESTAMPTZ,
  due_date      DATE,
  due_time      TIME,
  priority      SMALLINT DEFAULT 0 CHECK (priority IN (0, 1, 2)),
                -- 0: 낮음, 1: 중간, 2: 높음
  category_id   UUID REFERENCES categories(id) ON DELETE SET NULL,
  recurrence    JSONB DEFAULT NULL,
                -- { "type": "daily"|"weekly"|"monthly"|"custom",
                --   "interval": 1,
                --   "days_of_week": [1,3,5],  -- 월,수,금
                --   "end_date": "2026-12-31" }
  is_deleted    BOOLEAN DEFAULT FALSE,
  sort_order    INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_todos_user_date ON todos(user_id, due_date) WHERE is_deleted = FALSE;
CREATE INDEX idx_todos_user_completed ON todos(user_id, is_completed, due_date) WHERE is_deleted = FALSE;
CREATE INDEX idx_todos_user_category ON todos(user_id, category_id) WHERE is_deleted = FALSE;
CREATE INDEX idx_todos_updated ON todos(updated_at);
```

#### 2. categories

할일 분류 카테고리.

```sql
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  color       TEXT DEFAULT '#2563EB',  -- hex color
  icon        TEXT DEFAULT 'folder',    -- MaterialIcon name
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- 인덱스
CREATE INDEX idx_categories_user ON categories(user_id);
```

#### 3. daily_focus

"오늘의 3가지" 포커스 선택 기록.

```sql
CREATE TABLE daily_focus (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  todo_id     UUID REFERENCES todos(id) ON DELETE CASCADE,
  focus_date  DATE NOT NULL DEFAULT CURRENT_DATE,
  slot_order  SMALLINT NOT NULL CHECK (slot_order BETWEEN 1 AND 5),
                -- 최대 5개 슬롯 (설정에서 조정 가능)
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, focus_date, slot_order),
  UNIQUE(user_id, focus_date, todo_id)
);

-- 인덱스
CREATE INDEX idx_daily_focus_user_date ON daily_focus(user_id, focus_date);
```

#### 4. user_settings

사용자별 앱 설정.

```sql
CREATE TABLE user_settings (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  theme                 TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  daily_focus_count     SMALLINT DEFAULT 3 CHECK (daily_focus_count BETWEEN 1 AND 5),
  daily_reminder        BOOLEAN DEFAULT FALSE,
  reminder_time         TIME DEFAULT '09:00',
  auto_delete_days      INTEGER DEFAULT 30,  -- 완료 항목 자동 삭제 (일수, 0=비활성)
  start_screen          TEXT DEFAULT 'today' CHECK (start_screen IN ('today', 'all')),
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);
```

#### 5. streaks

스트릭(연속 달성) 기록.

```sql
CREATE TABLE streaks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  streak_date     DATE NOT NULL,
  todos_completed INTEGER DEFAULT 0,
  todos_total     INTEGER DEFAULT 0,
  focus_completed INTEGER DEFAULT 0,
  focus_total     INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, streak_date)
);

-- 인덱스
CREATE INDEX idx_streaks_user_date ON streaks(user_id, streak_date DESC);
```

### RLS (Row Level Security) 정책

모든 테이블에 RLS를 활성화하여 사용자가 자신의 데이터만 접근 가능하도록 제한.

```sql
-- todos
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own todos"
  ON todos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own todos"
  ON todos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own todos"
  ON todos FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own todos"
  ON todos FOR DELETE
  USING (auth.uid() = user_id);

-- categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own categories"
  ON categories FOR ALL
  USING (auth.uid() = user_id);

-- daily_focus
ALTER TABLE daily_focus ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own daily_focus"
  ON daily_focus FOR ALL
  USING (auth.uid() = user_id);

-- user_settings
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own settings"
  ON user_settings FOR ALL
  USING (auth.uid() = user_id);

-- streaks
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own streaks"
  ON streaks FOR ALL
  USING (auth.uid() = user_id);
```

### 로컬 저장소 스키마 (SQLite / AsyncStorage)

오프라인 우선 설계. 인증 전에는 로컬 전용, 인증 후 Supabase와 동기화.

```
AsyncStorage Keys:
  @simpletodo/todos          -> JSON array of Todo objects
  @simpletodo/categories     -> JSON array of Category objects
  @simpletodo/daily_focus    -> JSON object { [date]: Todo[] }
  @simpletodo/settings       -> JSON object (UserSettings)
  @simpletodo/streaks        -> JSON object { [date]: StreakData }
  @simpletodo/is_first_launch -> boolean
  @simpletodo/last_sync      -> ISO datetime string
```

향후 대량 데이터 처리가 필요하면 expo-sqlite로 마이그레이션 고려.

### 동기화 전략

```
1. 오프라인 우선 (Local-first)
   - 모든 CRUD는 로컬에서 즉시 처리
   - UI는 로컬 데이터를 바로 반영

2. 배경 동기화 (인증 사용자만)
   - 앱 포그라운드 진입 시 풀 동기화 (pull)
   - 로컬 변경 발생 시 debounce 3초 후 푸시 (push)
   - updated_at 타임스탬프 기반 충돌 해결 (Last-Write-Wins)

3. 충돌 해결
   - 동일 todo에 대해 로컬 vs 리모트 updated_at 비교
   - 더 최신 타임스탬프의 데이터를 채택
   - 삭제(is_deleted=true)는 항상 우선 적용 (soft delete)
```

---

## 상태 관리 (State Management)

### Zustand Store 구조

```typescript
// stores/todoStore.ts
interface TodoStore {
  // State
  todos: Todo[];
  categories: Category[];
  dailyFocus: Record<string, string[]>; // { "2026-04-06": [todoId1, todoId2, todoId3] }
  isLoading: boolean;

  // Actions
  addTodo: (todo: Partial<Todo>) => void;
  toggleTodo: (id: string) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  setDailyFocus: (date: string, todoIds: string[]) => void;

  // Selectors (derived)
  getTodayTodos: () => Todo[];
  getFocusTodos: (date: string) => Todo[];
  getTodosByCategory: (categoryId: string) => Todo[];
  getOverdueTodos: () => Todo[];
}

// stores/statsStore.ts
interface StatsStore {
  streaks: StreakData[];
  currentStreak: number;
  bestStreak: number;

  calculateStreak: () => void;
  getWeeklyStats: () => WeeklyStat[];
  getMonthlyStats: () => MonthlyStat;
  getCategoryStats: () => CategoryStat[];
}

// stores/settingsStore.ts
interface SettingsStore {
  theme: 'light' | 'dark' | 'system';
  dailyFocusCount: number;
  dailyReminder: boolean;
  reminderTime: string;
  autoDeleteDays: number;

  updateSetting: (key: string, value: any) => void;
}

// stores/authStore.ts
interface AuthStore {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;

  signIn: (provider: 'google' | 'apple' | 'email') => Promise<void>;
  signOut: () => Promise<void>;
  syncData: () => Promise<void>;
}
```

---

## 마이크로 인터랙션 상세

### 1. 체크 완료 애니메이션

```
[탭/스와이프]
  -> 체크박스: scale(0 -> 1.2 -> 1.0), opacity(0 -> 1)
  -> 체크마크: drawPath 애니메이션 (200ms)
  -> 텍스트: 취소선 왼->오 애니메이션 (300ms)
  -> 햅틱: impactMedium
  -> 항목: 0.5초 후 완료 섹션으로 이동 (layout animation)
```

### 2. 오늘의 3가지 모두 완료

```
[마지막 포커스 항목 완료 시]
  -> 0.3초 대기
  -> CelebrationOverlay 표시
  -> Confetti 파티클 (50개, 다양한 색상)
  -> "모두 완료!" 텍스트 (scale 0 -> 1, bounce easing)
  -> 스트릭 카운터 +1 애니메이션
  -> 햅틱: notificationSuccess
  -> 2초 후 자동 소멸 또는 탭으로 닫기
```

### 3. 할일 추가

```
[입력 완료]
  -> 새 항목: translateY(20 -> 0), opacity(0 -> 1), 200ms
  -> 리스트: layoutAnimation으로 자연스러운 밀림
  -> 입력 필드: 자동 클리어, 포커스 유지
```

### 4. 스와이프 삭제

```
[좌 스와이프 50% 이상]
  -> 빨간 배경 드러남 + 휴지통 아이콘
  -> 놓으면: 항목 좌로 사라짐 (translateX -> -screenWidth)
  -> 0.3초 후 하단 Snackbar: "삭제되었습니다 [되돌리기]"
  -> 되돌리기 3초 내 탭: 항목 복원 애니메이션
```

---

## Phase 2 고려 사항

### Phase 1.5 (출시 후 1개월 내)

| 기능 | 우선순위 | 예상 기간 | 근거 |
|------|---------|----------|------|
| Android 홈 위젯 | 높음 | 3-5일 | 벤치마킹 호평 4위, 리텐션 핵심 |
| 하위 작업 (서브태스크) | 높음 | 2일 | 경쟁 앱 50% 이상 제공 |
| 태그/라벨 | 중간 | 1.5일 | 크로스 카테고리 분류 니즈 |
| 월간 통계 확장 | 중간 | 2일 | 프로 전환 유도 |

### Phase 2 (출시 후 2-4개월)

| 기능 | 우선순위 | 예상 기간 | 근거 |
|------|---------|----------|------|
| 캘린더 뷰 | 높음 | 5일 | 기능 요청 빈도 높음 |
| 포모도로 타이머 | 중간 | 3일 | TickTick 차별화 요소, 생산성 도구 결합 |
| 습관 트래커 | 중간 | 5일 | 시장 트렌드 #2, 투두+습관 융합 |
| 자연어 입력 (한국어) | 중간 | 7일 | 시장 기회 #2, 기술적 난이도 높음 |
| 프로 구독 (결제) | 높음 | 5일 | 수익화 시작 |
| 테마 커스터마이징 (프로) | 중간 | 3일 | 프로 기능, 개인화 |

### Phase 3 (출시 후 4-6개월)

| 기능 | 우선순위 | 예상 기간 | 근거 |
|------|---------|----------|------|
| 소셜 기능 (친구 할일 공유) | 중간 | 10일 | 투두메이트 검증, MZ 타겟 |
| 카카오톡 공유 | 중간 | 3일 | 한국형 소셜 동기부여 |
| 칸반 보드 뷰 | 낮음 | 5일 | 프로 사용자용 |
| AI 우선순위 제안 | 낮음 | 7일 | AI 트렌드, 프로 기능 |
| 위치 기반 리마인더 | 낮음 | 5일 | 기능 요청 중간 빈도 |
| 다국어 지원 (영어, 일본어) | 낮음 | 5일 | 글로벌 확장 |

### 기술 부채 관리

| 항목 | 시기 | 설명 |
|------|------|------|
| AsyncStorage -> SQLite 마이그레이션 | 할일 1000개 초과 시 | 대량 데이터 성능 |
| 동기화 엔진 고도화 | Phase 2 | 충돌 해결 개선, 부분 동기화 |
| 테스트 코드 | Phase 2 시작 전 | Jest + Testing Library 기반 핵심 로직 테스트 |
| 접근성 (a11y) | Phase 2 | 스크린 리더, 큰 텍스트 지원 |
| 성능 모니터링 | 출시 시 | Sentry, Firebase Analytics 계측 |

---

## 구현 우선순위 요약

### Sprint 1 (1-2주): 핵심 루프

```
Day 1-2:  프로젝트 셋업 (Expo, 네비게이션, 디자인 토큰)
Day 3-4:  TodoItem, CheckBox, QuickAddBar 컴포넌트
Day 5-6:  오늘 화면 (Screen 2) -- 할일 CRUD + 로컬 저장
Day 7-8:  DailyFocusCard ("오늘의 3가지")
Day 9-10: 완료 애니메이션 + 햅틱 + 축하 오버레이
Day 11:   할일 상세 바텀시트 (Screen 3)
Day 12:   스와이프 제스처 + 삭제/미루기
Day 13-14: 전체 할일 화면 (Screen 4) + 카테고리
```

### Sprint 2 (3-4주): 확장 + 차별화

```
Day 15-16: 통계 화면 (Screen 5) -- 스트릭, 주간 차트
Day 17-18: 설정 화면 (Screen 6) -- 테마, 알림
Day 19-20: Supabase Auth (Google/Apple 로그인)
Day 21-22: 클라우드 동기화
Day 23:    다크 모드
Day 24:    반복 할일 로직
Day 25-26: 리마인더/로컬 알림
Day 27-28: QA, 버그 수정, 성능 최적화
```

---

*본 문서는 mvp-design 스킬에 의해 생성되었습니다.*
*입력: 01_research_market.md, 02_benchmark_apps.md*
*다음 단계: rn-supabase-dev 스킬에게 React Native 구현 전달*
