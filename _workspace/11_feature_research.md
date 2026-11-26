# SimpleTodo 업데이트 기능 리서치 (2026-11)

생성일: 2026-11-25
대상: SimpleTodo v1.x (Expo/RN, 로컬 저장 AsyncStorage + AdMob 배너, ko/en/ja/es)
선행 문서: `02_benchmark_apps.md`(2026-04, 학습 데이터 기반), `09_userA_review.md`, `10_userB_review.md`

> **조사 방법과 한계**
> - 웹 검색 + 각 앱 공식 변경 내역/헬프센터 + 기술 매체 기사 + Google Play 상세 페이지(2026-11-25 수집)를 사용했다.
> - Play 스토어 리뷰는 각 앱 상세 페이지에 공개된 "관련성 높은 리뷰" 3건씩만 확보했다(리뷰 대량 수집은 이번 세션에서 허용되지 않음). 투두메이트는 App Store 리뷰 요약으로 보강했다. 리뷰 근거는 **경향 확인용**이며 통계적 대표성은 없다.
> - TickTick 가격(US$35.99 vs 49.99/년)처럼 출처끼리 엇갈리는 수치는 본문에 "미확인"으로 표기했다.

---

## 0. 한 줄 결론

**"놓치지 않게 + 손이 덜 가게"** 가 이번 업데이트의 축이다. SimpleTodo에는 아직 **알림이 하나도 없고**, 반복은 요일을 못 고르고, 위젯은 체크하려면 앱을 열어야 하며, 데이터는 한 기기에만 있다. 경쟁 앱들이 2025~2026년에 AI·뷰·통합으로 무거워지는 동안 사용자 불만은 여전히 "알림을 놓친다", "반복이 쌓인다", "유료 벽", "갑자기 복잡해졌다"에 몰려 있다. 그리고 **Microsoft To Do 종료 발표(2026-11-18)** 로 "무료·단순한 투두"를 찾는 사람이 앞으로 7개월간 시장에 쏟아진다.

---

## 1. 2026-04 벤치마크 이후 바뀐 점

| 앱 | 2025~2026 주요 변화 | SimpleTodo에 주는 의미 |
|---|---|---|
| **Microsoft To Do** | **2026-11-18 종료 발표. 2027-06-30에 전 플랫폼 앱 종료.** 개인 계정에는 대체 서비스가 없고 MS는 "다른 앱을 고르라"고 안내. 종료 전에 내보내기 도구를 준다고 했지만 형식은 미공개. 기존 작업이 Planner로 자동 이전되지 않음 | 4월 문서에서는 "생태계 락인용 완전 무료라 따라할 수 없음"으로 봤던 경쟁자가 사라진다. **무료·단순·My Day형 앱을 찾는 이주 수요**가 생긴다. Todoist 한국어 리뷰(2026-11-21)에 이미 "MS 투두가 서비스 종료한다고 해서 넘어왔다"는 글이 있다 |
| **Todoist** | 마감(Deadline) 필드 분리(2025-01, Pro 전용, 7일 전부터 카운트다운) · **Pro 가격 인상 월 $5→$7**(2025-12-10) · AI 음성 입력 Ramble(2025-11 베타, 2026-01 정식, 무료는 월 10회) · Quick Add 개편 + **여러 할 일 한 번에 입력**(2026-10) · 무료 플랜에 정시 알림 긴급도 설정(2026-10) · **컬러 테마 전 플랜 무료화**(2026-11-19) · 위젯에 Ramble 버튼 | 가격 인상 때문에 대안을 찾는 사람이 늘었다(Android Authority 2026-01). "테마 = 유료"라는 수익화 공식이 깨졌다 |
| **TickTick** | 8.0(2026-01-15): 미완료 작업을 훑고 오늘 할 일을 고르는 **추천 작업(Suggested Tasks)**, 연간 히트맵, 목록 배경 · 고급 반복(매월 마지막 날 등) · 카운트다운 노트 · Telegram 연동 · 작은 글꼴 옵션 | 기능은 계속 늘지만 "속도·완성도" 불만이 나온다(Techpresso 2026-10). 오늘 계획 기능은 SimpleTodo의 "지난 할 일 → 모두 오늘로"와 겹친다 |
| **Google Tasks** | 마감일(2025, 시간 없이 날짜만) · 목록별 **미완료 개수 배지**(2025-03, 끌 수 없어서 불만) · Keep 리마인더 통합(2025-10) · **M3 Expressive 위젯 + 다이내믹 컬러**(2026-05~06) | "기본만 있어서 좋다"는 리뷰가 꾸준하다. 대신 오늘·내일·7일 통합 뷰가 없고 자연어 입력이 없다는 불만이 있다 |
| **Apple 미리알림** | iOS 26: AI 자동 분류 · **26.2: '긴급' 알람형 리마인더**(방해금지 모드에서도 울림, 스누즈 대신 '완료' 버튼 선택 가능) · 26.4: 긴급 스마트 목록 | 기본 앱마저 **놓치지 않는 알림**에 투자하고 있다 |
| **Things 3** | 3.22(2025-09) Liquid Glass 리디자인 · **3.23(2026-08) 반복 할 일 전면 개편**(미리 완료, 이번만 변경/규칙 변경 선택, 일괄 일시정지) · 3.24(2026-09) Siri AI, 미루기 옵션 강화, XL 위젯 | 미니멀 앱의 대표 주자도 결국 **반복 UX**에 손을 댔다 |
| **Any.do** | AI 하위 작업 생성, 자연어 파싱, WhatsApp 연동(유료), MCP 지원 | 오래된 Play 리뷰 불만이 여전히 유효하다: 유료 유도가 심하고, 첫 1분 안에 평점을 요구하고, 버튼이 작다 |
| **투두메이트(KR)** | 5.17 디데이 · 뽀모도로 · 5.19(2026-11-16) 위젯 사진 배경 · **PC 앱 프리미엄 전용 전환(2026-09) → 리뷰 반발** · 월 4,900 / 연 12,900 / 평생 16,400원 · 광고 보면 12시간 프리미엄 | 한국 사용자는 디데이·위젯 꾸미기·색상을 좋아한다. 하지만 **기존 기능 유료화("볼모 잡힌 기분")** 와 **갑작스러운 UI 재배치** 에는 강하게 반발한다 |
| **타임블럭스(KR)** | 한국 App Store 3.3점(1.9만 평가). 최근 업데이트는 버그 수정 위주 | 기능이 많은 캘린더형 앱의 안정성 리스크를 보여주는 사례 |

### Play 스토어 현황 (2026-11-25 페이지 표기 기준)

| 앱 | 평점(US/KR) | 리뷰 수 | 다운로드 표기 | 최근 업데이트 |
|---|---|---|---|---|
| Todoist | 4.6 / 4.7 | 30.8만 | 5,000만+ | 2026-11-23 |
| Google Tasks | 4.6 | 62만 | 1,000만+ | 2026-11-19 |
| Microsoft To Do | 4.6 | 48.6만 | 1,000만+ | 2026-10-22 |
| TickTick | 4.6 / 4.7 | 16.7만 | 1,000만+ | 2026-11-19 |
| Any.do | 4.4 | 50.6만 | 1,000만+ | 2026-10-25 |
| 투두메이트 | 4.3 / 4.6 | 2.26만 | 50만+ | 2026-11-16 |

---

## 2. 리뷰에서 반복되는 신호 (4월 문서에 없던 것 위주)

| # | 신호 | 근거 (날짜) | SimpleTodo 현재 상태 |
|---|---|---|---|
| R1 | **알림을 놓친다. 알람처럼 강하게 울려 달라** | Google Tasks Play 리뷰 2026-11-14 "일반 알림은 놓치기 쉽다. 시계 알람 같은 알림이 필요하다" · Apple 26.2 긴급 알람 도입 이유도 같음(9to5Mac) · TickTick 최상위 리뷰 "끈질긴 소리 알람, 유연한 스누즈" 칭찬 | **알림 없음.** `due_time` 필드만 있고 UI가 없다 |
| R2 | **알림 신뢰성과 정리** | MS To Do 리뷰: 날짜를 바꿔도 지난 알림이 안 지워짐, 알림 재설정이 번거로움 · Any.do 리뷰: 어느 순간 알림이 끊김 · Android 14부터 정확한 알람 권한이 기본 거부(안드로이드 개발자 문서) | 해당 없음(새로 만들 때 처음부터 설계해야 함) |
| R3 | **반복 할 일이 미완료로 쌓인다. 건너뛰기를 달라** | Todoist KR 리뷰 2026-10-10 "반복에 실패/건너뛰기를 추가해 달라, 지난 작업이 계속 미완료로 쌓인다" · 투두메이트 리뷰 "오늘 안 할 루틴 숨기기" · Things 3.23 반복 개편 | 매일/매주/매월만 있다. 요일 지정 불가, 완료해야만 다음 회차가 생김 → **이번에 추가한 "지난 할 일" 섹션에 반복 항목이 쌓인다** |
| R4 | **위젯이 첫 화면이다** | Google Tasks 리뷰 2026-11-13 "위젯을 홈에 두니 할 일 목록이 가장 먼저 보인다" · 투두메이트 "위젯에도 카테고리 구분" 요청, 위젯 체크 버그 수정 · Todoist KR "위젯 글꼴 크기" 요청 · MS To Do 위젯에 투명도·글꼴 옵션 | 위젯은 있지만 탭하면 앱이 열린다(`OPEN_APP`) |
| R5 | **유료 벽과 기존 기능 유료화에 대한 반감** | 투두메이트 리뷰 2026-11-13, 2026-09 "PC가 볼모로 잡힌 기분", "보상형 광고가 안 나와서 PC 연동도 못 한다" · Todoist 가격 인상 후 이탈 시도(Android Authority 2026-01-31) | 광고 배너만 있고 유료화는 없다. 구조적으로 유리한 위치 |
| R6 | **갑작스러운 UI 변경에 대한 반발** | 투두메이트 리뷰 2026-11-20 "수정/삭제 버튼이 갑자기 하단으로, 목록 2열… 이전 버전을 쓰고 싶다" · Todoist 리뷰 "새 인터페이스 1점" | 오래 업데이트를 안 한 앱이라 이번 업데이트에서 **레이아웃을 크게 흔들지 말아야** 한다 |
| R7 | **"기본만 있어서 좋다"** | Google Tasks 리뷰 2026-11-13 "아주 기본적이고 화려한 게 없어서 좋다" · Android Authority 2026-01-31 "게이미피케이션 없는 점이 좋다" | 페르소나 B의 결론과 같다 |
| R8 | **빠른 입력에서 날짜까지** | Android Authority 2026-01-31: Google Tasks로 갈아탔다가 자연어 날짜 입력이 없어서 불편 · Todoist Quick Add, 여러 줄 입력 정식화(2026-10) | 빠른 추가는 제목만 받는다(페르소나 B 지적) |
| R9 | **오늘·내일·다음 7일을 한 번에** | Android Authority 2026-09-21: Google Tasks에는 TickTick식 오늘/내일/7일 뷰가 없어서 불편 | 오늘 탭 + 캘린더만 있다. 내일 할 일을 보려면 캘린더를 열어야 한다 |
| R10 | **디데이** | 투두메이트 5.17에서 디데이 추가(사용자 요청) · Todoist Deadline 카운트다운 · TickTick 카운트다운 노트 | 없음 |

---

## 3. 제안 기능 (우선순위순)

평가 기준
- **단순함 적합도**: ◎ 화면이나 설정이 늘지 않음 / ○ 선택형(opt-in)이라 기본 화면은 그대로 / △ 기본 화면에 요소가 추가됨
- **난이도**(로컬 저장 RN 1인 개발 기준): S = 1~3일, M = 4~8일, L = 2주 이상
- **수익 영향**: 배너 노출(세션 수)과 유료화 가능성 기준

### P1. 시간 알림 (리마인더) + 알림에서 바로 완료/미루기 — **M**

- **참고**: Apple 미리알림 26.2 긴급 알람(완료 버튼), TickTick(끈질긴 알람, 유연한 스누즈), Google Tasks 리뷰, MS To Do(실패 사례: 오래된 알림이 안 지워짐), 투두메이트("원하는 시간으로 알림")
- **사용자 가치**: R1, R2. 4월 벤치마크의 호평 3위가 "안정적인 알림"이었고 페르소나 A도 "알림 미구현"을 지적했다. **현재 앱에서 가장 큰 공백**이다.
- **단순함 적합도**: ○. 상세 시트의 마감일 아래에 "시간" 한 줄만 추가한다(기본값은 '없음'). 알림은 `due_time`이 있을 때만 정시에 울린다. 알림 몇 분 전 같은 옵션은 처음에는 넣지 않는다.
- **구현 메모**
  - `expo-notifications` 추가. Android 13 이상은 POST_NOTIFICATIONS 런타임 권한을, **Android 14 이상은 SCHEDULE_EXACT_ALARM이 기본 거부**이므로 정확한 시간이 필요하면 사용자 동의를 받는다. 거부되면 몇 분 늦게 울릴 수 있다는 안내를 한다(USE_EXACT_ALARM은 알람·캘린더 앱 전용이라 쓰지 않는다).
  - 알림 ID를 할 일에 저장한다(예: `notification_id`). 완료·삭제·미루기·실행취소·반복 다음 회차 생성 시 **취소하거나 다시 예약**한다(R2 예방). 앱이 시작될 때 예약 목록 전체를 다시 맞추는 reconcile 로직을 두면 꼬여도 스스로 복구된다.
  - 알림 카테고리 액션: [완료] [10분 뒤]. 앱이 종료된 상태에서 백그라운드로 처리하는 부분은 실기기에서 검증해야 한다(필요하면 앱을 열어 처리하는 방식으로 대체).
  - 전체 화면 알람(USE_FULL_SCREEN_INTENT)은 Android 14부터 통화·알람 앱용으로 제한되므로 쓰지 않는다. 대신 중요 알림 채널(소리·진동 강하게)로 해결한다. P6과 연결된다.
- **수익 영향**: **+**. 알림을 누르면 앱이 열리므로 재방문과 배너 노출이 늘어난다. 알림은 유료로 잠그지 않는다(Todoist 무료 제한이 4월 문서의 불만 1위였다).

### P2. 반복 개선: 요일 지정 + 이번 회차 건너뛰기 — **S~M**

- **참고**: Todoist KR 리뷰(건너뛰기 요청), Things 3.23(이번만 변경/규칙 변경, 미리 완료), TickTick 고급 반복, 투두메이트 루틴
- **사용자 가치**: R3. 페르소나 A·B 모두 "월·수·금 반복 불가"를 감점했다. 이번 세션에 만든 **"지난 할 일 → 모두 오늘로"가 반복 항목과 만나면** 어제의 '매일 운동'과 오늘의 '매일 운동'이 겹칠 수 있다. 이 문제를 같이 해결해야 한다.
- **단순함 적합도**: ◎. '매주'를 고르면 요일 칩 7개가 나타나는 정도다. 새 화면은 없다.
- **구현 메모**
  - `Recurrence.days_of_week`, `type: 'custom'`은 이미 모델에 있다. 다음 날짜 계산 함수만 추가하면 된다(`todoStore.toggleTodo`의 switch 문).
  - "건너뛰기"는 현재 회차를 완료하지 않고 숨기고(soft delete 또는 `skipped` 플래그) 다음 회차를 만든다. 상세 시트와 지난 할 일 섹션의 스와이프 메뉴에 둔다.
  - "모두 오늘로" 실행 시 반복 항목은 옮기지 말고 **오늘 이후의 가장 가까운 회차로 건너뛰기** 처리해 중복을 막는다.
  - 종료일(`end_date`)과 "매월 마지막 날"은 다음 단계로 미룬다.
- **수익 영향**: 0 또는 +(루틴 사용자 리텐션).

### P3. 위젯에서 바로 체크 + 위젯 표시 옵션 — **M**

- **참고**: Google Tasks(Android 위젯 체크, M3 Expressive·다이내믹 컬러 위젯), 투두메이트(위젯 체크, 사진 배경, 카테고리 표시 요청), MS To Do(투명도·글꼴 크기), Todoist(위젯 빠른 입력 버튼)
- **사용자 가치**: R4. 위젯은 4월 문서에서도 호평 4위였고, 이미 만들어 둔 자산을 완성하는 작업이다.
- **단순함 적합도**: ◎. 앱을 열 필요 자체가 줄어든다.
- **구현 메모**
  - `react-native-android-widget`의 커스텀 `clickAction`(+ `clickActionData: {id}`)을 `WIDGET_CLICK` 헤드리스 핸들러에서 처리한다. 위젯이 이미 AsyncStorage `@simpletodo/todos`를 직접 읽고 있으므로 같은 키를 수정해서 다시 렌더링하면 된다.
  - 앱의 `toggleTodo`(반복 다음 회차 생성 포함)를 **순수 함수로 분리**해서 앱과 위젯이 같이 쓴다. 앱이 포그라운드로 돌아올 때 `persist.rehydrate()`를 호출해야 데이터가 덮어써지지 않는다. P1을 같이 하면 알림 취소도 같은 경로로 처리한다.
  - 위젯 헤더의 "+" 버튼은 앱을 열고 빠른 추가에 포커스한다(딥링크).
  - 옵션은 최소한으로: 배경 투명도, 글자 크기, 완료 항목 표시. 사진 배경은 하지 않는다.
- **수익 영향**: **단기 −, 장기 +**. 위젯에서 끝내는 사용자는 앱을 덜 열기 때문에 배너 노출이 줄 수 있다. 대신 홈 화면 위젯은 이탈을 막는 가장 강한 장치다. "+" 버튼과 P1 알림 경로로 앱 진입을 유지한다.

### P4. 백업/복원(파일) + 텍스트 가져오기 — **S~M**

- **참고**: MS To Do 종료(내보내기 형식 미정, "내보내도 다른 앱에서 가져올 수 있다는 보장은 없다"), Todoist "Import & export" 메뉴(2026-10), TickTick 리뷰("백업·가져오기·인쇄 가능" 칭찬)
- **사용자 가치**: 페르소나 B의 중기 요청 5번(초기화 전 내보내기). 로컬 전용 앱이라 휴대폰을 바꾸거나 앱을 지우면 데이터가 사라질 수 있다. **MS To Do 이주자에게 "가져와서 바로 쓴다"는 경험**을 준다.
- **단순함 적합도**: ◎. 설정의 '데이터' 섹션에 두 줄(내보내기, 가져오기)만 추가한다.
- **구현 메모**
  - `expo-file-system` + `expo-sharing`으로 JSON 내보내기(`{schema_version, todos, categories, streaks, settings}`), `expo-document-picker`로 가져오기. 가져올 때는 스키마 검증 후 **합치기/덮어쓰기**를 선택하게 한다.
  - "텍스트로 가져오기": 한 줄에 할 일 하나. 다른 앱 목록을 복사해서 붙여넣으면 된다. P5의 여러 줄 붙여넣기와 같은 코드를 쓴다.
  - MS가 내보내기 형식을 공개하면 전용 가져오기를 추가한다(2027-06 종료 전까지 기회가 있다). ASO에 "마이크로소프트 투두 대체" 키워드를 검토한다.
  - Android 자동 백업(`allowBackup`)이 켜져 있는지 확인한다. 기기를 바꿀 때 무료로 받을 수 있는 안전망이다.
- **수익 영향**: 0(이탈 방지). MS To Do 이주 유입으로 **신규 설치 +** 를 기대할 수 있다. 백업을 유료로 잠그지 않는다(R5).

### P5. 빠른 추가에서 한국어 날짜·시간 인식 + 여러 줄 붙여넣기 — **M**

- **참고**: Todoist Quick Add("매주 금요일 오후 4시에 보고서 제출"), Todoist 여러 할 일 입력(2026-10), Any.do 자연어 파싱. 반면 Google Tasks는 자연어 입력이 없어서 불만(Android Authority)
- **사용자 가치**: R8. 페르소나 B는 "빠른 추가가 제목만 받는다"고 지적했다. 상세 시트를 열지 않고 "내일 3시 치과"만으로 날짜와 시간(= P1 알림)까지 끝난다.
- **단순함 적합도**: ◎. 새 UI가 없다. 입력 중 인식된 부분을 칩으로 미리 보여 주고 탭하면 해제된다. 설정에서 끌 수 있다.
- **구현 메모**
  - `lib/parseQuickAdd.ts`에 **규칙 기반 한국어 파서**를 만든다(오늘/내일/모레/글피, N일 뒤, 이번 주·다음 주 X요일, M월 D일, 오전/오후 N시(반), 매일/매주 X요일/매월). 서버나 AI는 쓰지 않는다. 일반적인 날짜 파싱 라이브러리(chrono 계열)는 한국어 지원이 약하므로 직접 구현하고 단위 테스트를 붙인다. en/ja/es는 2단계로 미룬다.
  - 여러 줄 붙여넣기: 입력값에 줄바꿈이 있으면 "N개의 할 일로 추가할까요?"를 확인한 뒤 일괄 추가한다(난이도 S).
- **수익 영향**: 0 또는 +(스토어 소개 문구와 스크린샷에 쓰기 좋은 포인트).

### P6. '중요' 별표 1단계 (`priority` 필드 활용) — **S**

- **참고**: Google Tasks 별표, MS To Do '중요', Apple 미리알림 '긴급'(26.2)과 긴급 목록(26.4)
- **사용자 가치**: 페르소나 B는 `priority`를 "살리든지 지우든지 하라"는 유령 기능으로 봤다. Todoist·TickTick의 4단계 우선순위 대신 **켜고 끄는 별표 하나**로 살린다.
- **단순함 적합도**: ○. 할 일 행에 별 아이콘(켰을 때만 표시), 오늘 목록에서 위로 정렬, 위젯에도 표시. 시간이 있는 중요 할 일은 P1의 **강한 알림 채널**로 울린다.
- **구현 메모**: `priority: 0 | 1 | 2`를 0/1로만 쓴다(타입 호환 유지). 상세 시트 제목 옆에 별 토글을 둔다.
- **수익 영향**: 0.

### P7. 아침 요약 알림 (하루 1회, 선택) — **S** (P1 이후)

- **참고**: 투두메이트("오늘 할 일, 까먹지 않도록 알려줄게요"), MS To Do My Day 제안, TickTick 8.0 추천 작업, Google Tasks 미완료 개수 배지
- **사용자 가치**: "앱을 열어야 기억난다"는 문제를 하루 한 번의 알림으로 해결한다. 이번에 만든 "지난 할 일 → 모두 오늘로"로 가는 자연스러운 진입점이 된다.
- **단순함 적합도**: ○. 설정에 토글과 시간 한 줄. 기본값은 꺼짐이거나, 첫 알림 권한을 요청할 때 함께 제안한다.
- **구현 메모**: 로컬 알림 내용은 예약 시점에 고정된다. 따라서 앱을 열거나 할 일이 바뀔 때마다 **다음 며칠분을 개수가 들어간 문구로 다시 예약**한다(앱을 오래 안 열면 일반 문구로 대체). Google Tasks 배지처럼 **끌 수 없는 압박**이 되지 않게 한다.
- **수익 영향**: **+**(하루 1회 앱 진입 → 배너 노출).

### P8. 디데이 표시 — **S**

- **참고**: 투두메이트 디데이(5.17, 사용자 요청으로 추가), Todoist Deadline 7일 카운트다운, TickTick 카운트다운
- **사용자 가치**: R10. 한국 사용자에게 익숙한 시험·마감·기념일 사용 방식이다.
- **단순함 적합도**: ○. 별도의 '마감일' 필드를 만들지 않고 **기존 `due_date`에 "디데이로 표시" 토글**만 둔다. 켜면 목록과 위젯에 "D-3" 배지가 붙고 당일에는 "D-day"로 바뀐다.
- **구현 메모**: 표시용 플래그 하나(`show_dday`)를 추가하고 배지를 계산한다. 미래 날짜인 디데이 항목은 오늘 탭의 P10 '예정' 섹션에 함께 노출한다.
- **수익 영향**: 0 또는 +(국내 ASO 키워드 "디데이").

### P9. 길게 눌러 끌어서 순서 바꾸기 — **M**

- **참고**: Google Tasks(드래그 정렬이 스토어 설명의 핵심 기능), Todoist, TickTick
- **사용자 가치**: 페르소나 A·B 모두 지적했다. 현재는 `moveTodoUp/Down`이 스토어에만 있고 **UI에서는 순서를 바꿀 방법이 전혀 없다**.
- **단순함 적합도**: ◎. 제스처만 추가되고 화면 요소는 늘지 않는다.
- **구현 메모**: 이미 쓰고 있는 스와이프 제스처와 충돌하지 않게 "길게 누르기 → 드래그"로 구분한다. SectionList 전체를 드래그 가능하게 만드는 것은 어렵기 때문에 **같은 섹션 안에서만**(오늘 탭의 '오늘' 섹션부터) 지원한다. `react-native-draggable-flatlist` 같은 라이브러리가 Reanimated 4/RN 0.81과 호환되는지 먼저 확인해야 한다.
- **수익 영향**: 0.

### P10. 오늘 탭 하단 '예정(다음 7일)' 접힘 섹션 — **S**

- **참고**: TickTick·Todoist Upcoming, Things Upcoming. Google Tasks에는 이 뷰가 없어서 불만(Android Authority 2026-09)
- **사용자 가치**: R9. 내일 할 일을 확인하려고 캘린더 탭으로 가지 않아도 된다.
- **단순함 적합도**: △→○. 기본은 **접힌 한 줄**("예정 5개")로 두고 펼침 상태를 기억한다. 페르소나 B의 "오늘 탭은 할 일 목록이어야 한다"는 원칙을 지키는 선에서만 추가한다.
- **구현 메모**: 기존 `TodoSectionList`에 섹션 하나를 추가하고 날짜별 소제목을 단다. 이 섹션 항목에는 스와이프 "내일로" 대신 "오늘로"를 쓴다.
- **수익 영향**: 0.

### P11. 광고 제거 1회 구매 (평생) — **M**

- **참고**: 투두메이트 평생 이용권 16,400원·연 12,900원, Todoist 가격 인상과 테마 무료화, 투두메이트 보상형 광고 실패 불만
- **사용자 가치**: 광고에 민감한 미니멀 사용자에게 **구독 없는 탈출구**를 준다. 구독 피로(R5)를 피한다.
- **단순함 적합도**: ◎. 설정에 한 줄.
- **구현 메모**: Play Billing 비소모성 상품(`expo-iap` 또는 `react-native-iap`), 구매 복원, 구매 시 `BannerAd` 숨김. 서버 없이 영수증을 검증하면 우회 위험이 있지만 이 가격대에서는 감수할 만하다. 가격은 3,900~5,900원 정도를 검토한다. **핵심 기능은 절대 잠그지 않는다.**
- **수익 영향**: **직접 매출 +**. 구매자의 광고 수익은 사라지지만, 광고를 싫어해서 앱을 지우던 사용자를 매출로 바꾼다.

### P12. 표시 옵션: 스트릭 배지 숨기기 — **S**

- **참고**: Android Authority(게이미피케이션 없음 칭찬), Google Tasks(미완료 배지를 끌 수 없어 불만), 페르소나 B("보이면 스트레스, 끌 수 있어야 한다")
- **단순함 적합도**: ◎. 설정 토글 하나.
- **수익 영향**: 0.

### 요약표

| 순위 | 기능 | 참고 앱 | 근거 | 단순함 | 난이도 | 수익 |
|---|---|---|---|---|---|---|
| P1 | 시간 알림 + 알림 액션 | Apple 미리알림, TickTick, Google Tasks | R1·R2, A | ○ | M | + |
| P2 | 반복 요일 지정·건너뛰기 | Things 3.23, Todoist, TickTick | R3, A·B | ◎ | S~M | 0/+ |
| P3 | 위젯에서 바로 체크·옵션 | Google Tasks, 투두메이트, MS To Do | R4 | ◎ | M | 단기 −/장기 + |
| P4 | 백업/복원 + 텍스트 가져오기 | MS To Do 종료, Todoist, TickTick | B, MS 이주 | ◎ | S~M | 0(유입 +) |
| P5 | 한국어 날짜 인식·여러 줄 입력 | Todoist, Any.do | R8, B | ◎ | M | 0/+ |
| P6 | '중요' 별표 1단계 | Google Tasks, MS To Do, Apple | B(유령 필드) | ○ | S | 0 |
| P7 | 아침 요약 알림 | 투두메이트, MS To Do, TickTick | — | ○ | S | + |
| P8 | 디데이 표시 | 투두메이트, Todoist, TickTick | R10 | ○ | S | 0/+ |
| P9 | 길게 눌러 순서 바꾸기 | Google Tasks, Todoist | A·B | ◎ | M | 0 |
| P10 | 예정(7일) 접힘 섹션 | TickTick, Todoist, Things | R9 | △→○ | S | 0 |
| P11 | 광고 제거 1회 구매 | 투두메이트, Todoist | R5 | ◎ | M | 직접 + |
| P12 | 스트릭 숨기기 | Google Tasks, B | R7, B | ◎ | S | 0 |

---

## 4. 일부러 넣지 말아야 할 기능

| # | 기능 | 이유 |
|---|---|---|
| X1 | **AI 음성·LLM 정리** (Todoist Ramble, TickTick AI 모드, 투두메이트 AI 추천·일기, Any.do AI 하위 작업) | 서버와 API 비용이 생기는데 배너 광고 매출로는 감당할 수 없다(Todoist도 무료는 월 10회로 제한). 로컬 전용 앱의 개인정보 장점을 잃는다. 필요한 효과는 P5의 규칙 기반 파서와 키보드의 기본 음성 입력으로 대부분 얻을 수 있다 |
| X2 | **계정·클라우드 동기화·PC/웹 앱** | 공수가 L 이상이고 운영과 장애 대응 부담이 크다. 페르소나 B는 "준비 중이면 보여주지 마라"고 했다. 투두메이트 사례처럼 한 번 무료로 준 다기기 기능은 나중에 유료화하기도 어렵다. 당분간은 P4 파일 백업으로 대체한다 |
| X3 | **올인원 확장**: 뽀모도로·타이머, 습관 트래커, 일기, 친구 피드 | 투두메이트 리뷰 "상단 UI가 점점 복잡해지고 조잡해졌다", 페르소나 B의 기능 과잉 비판. 4월 문서의 Phase 2 후보(포모도로·습관)는 **철회**를 권한다. SimpleTodo의 포지션은 "TickTick의 반대편"이다 |
| X4 | **여러 뷰와 정교한 분류**: 칸반·아이젠하워·타임라인·연간 히트맵, 4단계 우선순위, 라벨·필터 | Google Tasks가 "기본만 있어서 좋다"는 평가를 받는 이유가 이것들이 없기 때문이다. 우선순위는 P6 별표 하나면 충분하다 |
| X5 | **핵심 기능 유료화, 보상형 광고로 기능 잠금** (알림·백업·위젯·테마 유료화, "광고 보면 12시간 프리미엄") | 투두메이트 "볼모 잡힌 기분", 보상형 광고가 안 나와서 기능을 못 쓰는 불만, Todoist는 테마까지 무료로 전환. 수익화는 P11 광고 제거 1회 구매 하나로 단순하게 한다 |

(참고) 위치 기반 알림과 공유/협업도 계속 보류한다. 위치 알림은 백그라운드 위치 권한 때문에 Play 심사 부담이 있고 배터리를 쓴다. 협업은 서버가 필요하다.

---

## 5. 이번 업데이트 추천 묶음

**테마: "이제 놓치지 않아요"** — 스토어 '새 기능' 문구의 헤드라인을 **알림**으로 잡는다.

| 묶음 | 기능 | 예상 공수 | 선정 이유 |
|---|---|---|---|
| 1 | **P1 시간 알림** (+ P6 '중요' 별표 → 강한 알림) | 6~9일 | 가장 큰 공백이고 리뷰 근거가 가장 강하다. 별표는 `priority` 유령 필드를 정리하면서 알림 강도를 정하는 스위치로 쓴다(S, 같은 PR) |
| 2 | **P2 반복 요일 지정·건너뛰기** | 2~4일 | 비용 대비 효과가 가장 크다. 이번에 만든 "지난 할 일" 섹션과 반복 항목이 충돌하는 문제를 함께 해결한다 |
| 3 | **P4 백업/복원 + 텍스트 가져오기** | 2~4일 | MS To Do 종료(2027-06-30)까지 이주 수요를 잡을 수 있다. 로컬 전용 앱의 데이터 불안을 해소한다. 텍스트 가져오기는 P5 여러 줄 입력의 기반이 된다 |
| 4 | **P3 위젯에서 바로 체크** | 4~6일 | 기존 위젯을 완성한다. P1·P2와 같은 순수 함수(완료 → 반복 다음 회차 → 알림 재예약)를 공유하므로 **같은 업데이트에서 하는 편이 리팩터링 비용이 적다** |

- 합계는 약 3~4주(1인 기준). 일정이 빠듯하면 4번(P3)을 다음 업데이트로 미루고 **P7 아침 요약 알림**(S, P1 인프라 재사용)으로 바꾼다.
- 다음 업데이트 후보: P5 한국어 날짜 인식, P8 디데이, P11 광고 제거 구매, P9 드래그 정렬.
- **출시 원칙(R6 교훈)**: 기존 레이아웃과 버튼 위치는 바꾸지 않는다. 새 기능은 모두 기본 꺼짐이거나 비어 있는 상태로 시작하고, 알림 권한은 처음으로 시간을 설정할 때 요청한다(앱을 켜자마자 요청하지 않는다. Any.do의 "첫 1분 평점 요구" 반감 사례).

---

## 6. 출처

**Microsoft To Do 종료**
- Windows Latest (2026-11-19): https://windowslatest.com/2026/11/19/microsoft-is-killing-to-do-and-telling-you-to-choose-another-app-after-it-reportedly-paid-up-to-200-million-for-wunderlist-and-killed-it-for-to-do
- Microsoft 지원 문서 "Moving from Microsoft To Do to Microsoft Planner": https://support.microsoft.com/en-us/planner/to-do-to-planner
- Digital Trends: https://digitaltrends.com/computing/microsoft-is-shutting-down-to-do-with-no-free-replacement-for-personal-users
- Windows Central: https://www.windowscentral.com/software-apps/microsoft-to-do-survived-years-of-neglect-but-its-now-headed-to-the-microsoft-graveyard
- Office Watch: https://office-watch.com/?p=78246
- MS To Do 안드로이드 알림 문제 해결 문서: https://support.microsoft.com/todo/troubleshoot-reminder-issues-in-microsoft-to-do-for-android
- MS To Do 안드로이드 위젯 개인화 옵션: https://techcommunity.microsoft.com/blog/to-doblog/new-personalization-options-on-microsoft-to-do-for-android/3604135

**Todoist**
- 2025 변경 내역: https://www.todoist.com/help/articles/changelog-entries-from-2025-SsEIOCtjK
- 2026 변경 내역: https://www.todoist.com/help/articles/2026-changelog
- Deadline 도입 (2025-01-07): https://www.todoist.com/help/articles/add-deadlines-to-tasks-jan-7-WFbv37eEw / https://www.todoist.com/help/todoist/features/introduction-to-deadlines-in-todoist-uMqbSLM6U
- Pro 가격 인상 (2025-12-10): https://www.todoist.com/help/articles/todoist-pro-pricing-update-in-2025-bxBvHZuJZ
- Ramble: https://www.todoist.com/help/articles/dictate-to-add-tasks-with-ramble-P1Raq7vVF / TechCrunch (2026-01-21): https://techcrunch.com/2026/01/21/todoists-app-now-lets-you-add-tasks-to-your-to-do-list-by-speaking-to-its-ai/

**TickTick**
- TickTick 8.0 (2026-01-15): https://alternativeto.net/news/2026/1/ticktick-8-0-adds-suggested-tasks-improved-yearly-monthly-views-and-customization-options
- 릴리스 노트 모음: https://releasebot.io/updates/ticktick
- 가격 논란(수치 미확인): https://toolfinder.co/news/ticktick-increases-prices / https://academy.techpresso.co/reviews/is-ticktick-worth-it

**Google Tasks**
- 마감일: https://www.androidcentral.com/apps-software/google-tasks-rolls-out-its-long-overdue-deadline-feature-but-its-still-half-baked
- 미완료 개수 배지 (2025-04): https://androidworld.nl/nieuws/google-tasks-herinnert-je-constant-aan-onvoltooide-taken/
- Expressive 위젯 (2026-05, 06): https://9to5google.com/2026/05/06/google-tasks-expressive-widget/ / https://9to5google.com/2026/06/04/google-tasks-expressive-widget/
- Android Authority "Todoist에서 Google Tasks로 갈아탔다" (2026-01-31): https://www.androidauthority.com/i-ditched-todoist-from-google-tasks-3635478/
- Android Authority "Google Tasks는 별로지만 못 끊는다" (2026-09-21): https://www.androidauthority.com/google-tasks-bad-to-do-list-app-still-use-why-3712518/

**Apple 미리알림**
- iOS 26 변경점: https://9to5mac.com/2025/06/17/heres-everything-new-in-reminders-with-ios-26/
- iOS 26.2 긴급 알람: https://9to5mac.com/2025/11/05/ios-26-2s-new-reminders-feature-is-exactly-what-ive-wanted-for-years/ / https://www.tomsguide.com/phones/iphones/ios-reminders-wii-be-impossible-to-ignore-thanks-to-this-ios-26-2-addition-and-thats-great-news-for-me

**Things 3**
- Things for OS 26 (3.22): https://culturedcode.com/things/blog/2025/09/things-for-os-26/
- 3.23 반복 개편 (2026-08-19): https://macrumors.com/2026/08/19/things-3-23-brings-long-requested-overhaul-of-repeating-to-dos
- 3.24 (2026-09): https://alternativeto.net/news/2026/9/things-3-24-arrives-with-native-siri-ai-integration-and-expanded-spotlight-search/

**Any.do**
- 기능 정리: https://zapier.com/blog/anydo-features/
- Capterra 리뷰: https://www.capterra.com/p/173614/Any-do/reviews/

**한국 앱**
- 투두메이트 App Store (5.19.0, 가격, 리뷰): https://apps.apple.com/kr/app/%ED%88%AC%EB%91%90-%EB%A9%94%EC%9D%B4%ED%8A%B8-todo-mate-%ED%95%A0-%EC%9D%BC-%EC%9C%84%EC%A0%AF-%EC%95%8C%EB%A6%BC/id1505220130
- 투두메이트 Google Play: https://play.google.com/store/apps/details?id=com.undefined.mate
- 타임블럭스 App Store: https://apps.apple.com/KR/app/id821381018

**Google Play 상세 페이지 (2026-11-25 수집, 평점·리뷰 인용)**
- https://play.google.com/store/apps/details?id=com.todoist
- https://play.google.com/store/apps/details?id=com.ticktick.task
- https://play.google.com/store/apps/details?id=com.microsoft.todos
- https://play.google.com/store/apps/details?id=com.google.android.apps.tasks
- https://play.google.com/store/apps/details?id=com.anydo

**구현 참고**
- Android 14 정확한 알람 기본 거부: https://developer.android.com/about/versions/14/changes/schedule-exact-alarms
- 알림 지연·배터리 최적화: https://www.tasks.org/docs/troubleshooting_notifications
- react-native-android-widget 클릭 처리: https://saleksovski.github.io/react-native-android-widget/docs/handling-clicks
