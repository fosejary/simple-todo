# ASO 네이밍: SimpleTodo v1.1.0 이름·스토어 제목 제안

작성일: 2026-11-25
대상: `com.zeroninelab.simpletodo.app` (현재 v1.0.0, 곧 v1.1.0 "하루의 빛")
선행 문서: `05_aso_listing.md`(MVP 리스팅), `11_feature_research.md`(경쟁 앱, MS To Do 종료)

> **조사 방법과 한계**
> - Google Play 검색 결과는 2026-11-25에 로그인 없이 `hl`/`gl` 파라미터를 바꿔 가며 수집했다(ko-KR, en-US, ja-JP, es-ES, es-MX). 개인화와 지역에 따라 순위가 달라질 수 있다.
> - Play는 검색량을 공개하지 않는다. 그래서 키워드 근거는 **상위 앱들이 실제로 제목에 쓰는 표현**과 **그 검색어의 결과 구성**으로 대신했다. 숫자로 된 검색량 추정치는 넣지 않았다.
> - 상표는 웹 검색으로 확인한 범위만 적었다. 법률 검토가 아니므로 최종 결정 전에 KIPRIS(한국)에서 9류·42류를 직접 검색해 보기를 권한다.

---

## 0. 결론

**추천: v1.1.0과 함께 브랜드를 "하루빛"(라틴 표기 "Harubit")으로 바꾸고, 제목 뒤쪽에 언어별 검색어를 붙인다.**

| 언어 | 스토어 제목 (추천) | 런처 이름 |
|---|---|---|
| ko | 하루빛: 오늘 할 일 목록 & 위젯 (19자) | 하루빛 |
| en | Harubit: To Do List & Widget (28자) | Harubit |
| ja | Harubit: ToDoリスト・タスク管理 (22자) | Harubit |
| es | Harubit: Lista de tareas (24자) | Harubit |

**이유**
1. **지금 바꾸는 비용이 가장 낮다.** 현재 리스팅은 다운로드 10+이고 평점이 표시되지 않는다(리뷰가 거의 없음). 지킬 인지도가 없다. 반면 MS To Do 이주 수요는 2027-06-30까지 이어진다. 그 사람들이 "그 앱 이름이 뭐였지?" 하고 다시 찾을 수 있는 이름이 필요하다.
2. **"SimpleTodo"는 내 것이 될 수 없는 이름이다.** Play에 "Simple Todo / Simple To Do List" 계열 앱이 10개 이상 있다(8장). 한국에도 심플두, 심플잇, "심플 할 일 & 작업 관리"(10만+)가 있고, App Store에는 다른 개발자의 "심플 투두"가 있다. 스페인어에서 "todo"는 "모든 것"이라는 뜻이라, 자동 번역된 현재 제목 "Todo simple"은 "모든 게 간단"으로 읽힌다.
3. **"하루빛"은 v1.1.0 디자인 그대로의 이름이다.** 해가 하늘을 건너가는 진행 아크, 해 아이콘, 크림 바탕과 같은 이야기를 한다. Play(KR/US/JP)와 웹에서 같은 이름의 앱이나 브랜드를 찾지 못했다.
4. **Play 검색 순위를 움직이는 것은 브랜드가 아니라 제목 뒤쪽의 키워드다.** 그래서 브랜드는 짧고 고유하게 두고, "할 일 목록 / To Do List / ToDoリスト / Lista de tareas"를 붙인다.

**이름보다 먼저 고쳐야 할 것:** 지금 리스팅에는 **영어 등록정보가 없다**(en-US에서 한국어 제목이 그대로 보인다). 일본어·스페인어 제목은 "Simple Todo - Daily Task", "Todo simple - Daily Task"로 **자동 번역된 것으로 보이고, 현지 검색어가 하나도 없다.** 브랜드를 유지하더라도 이 네 언어의 제목과 짧은 설명은 직접 입력해야 한다.

---

## 1. 현재 상태 (2026-11-25 Play 페이지 확인)

| 항목 | 값 |
|---|---|
| ko 제목 | 심플투두(Simple Todo) - 오늘 할일 관리 |
| en-US 제목 | (ko 제목이 그대로 노출됨. 영어 등록정보가 없는 것으로 보임. Play Console에서 확인) |
| ja-JP 제목 | Simple Todo - Daily Task (자동 번역으로 보임) |
| es-ES / es-MX 제목 | Todo simple - Daily Task (자동 번역으로 보임) |
| ko 짧은 설명 | 가입 없이 바로 시작하는 가장 심플한 할 일 앱. 서브태스크와 카테고리로 오늘에 집중하세요. |
| 다운로드 / 평점 | 10+ / 평점 표시 없음 |
| 최근 업데이트 | 2026-05-28 |
| 개발자명 | 제로나인랩(ZERONINE LAB). 모든 언어에서 한글로 보인다 |

**검색 노출 (ko-KR):** "심플투두"를 정확히 치면 1위다. "할일", "투두", "할 일 목록", "오늘 할일", "체크리스트", "할일 위젯", "투두리스트", "할일 알림"에서는 **상위 30위 밖**이다. en-US의 "simpletodo", "to do list", ja의 "ToDo", es의 "lista de tareas"에서도 보이지 않는다.

**현재 리스팅의 정책 위험 요소** (자세한 내용은 9장)
- 짧은 설명의 "가장 심플한": 최상급 표현
- 긴 설명의 "Todoist, Notion 같은 앱이 너무 복잡하게 느껴지는 분": 다른 앱 이름
- 긴 설명 끝의 "지금 무료로 다운로드하세요": 가격 표현

---

## 2. 브랜드 이름: 유지할까, 바꿀까

### 2.1 선택지 비교

| | A. 하루빛 / Harubit (추천) | B. 써니두 / Sunnydo | C. 심플투두 / SimpleTodo 유지 | D. 오늘해 (보류) |
|---|---|---|---|---|
| 뜻 | 하루의 빛. v1.1.0 디자인 이름과 같다 | sunny + do. 해와 할 일 | 단순한 투두 | "오늘 해(sun)" + "오늘 해(do)". 뜻이 세 겹 |
| Play 같은 이름 | 없음 (KR/US/JP) | 없음 (KR/US) | **10개 이상** | **있음**: "오늘해 - 태양광 발전소 관리 모니터링" (iOS·Android) |
| 웹·상표 | 같은 이름 없음. Harubit은 개인 Scratch 계정 1건 | 미국 상표 SUNNYDO 등록(28류 완구, 소프트웨어 아님). 음료 SunnyD가 연상됨. 예전 iOS 할 일 앱 "SunDo"가 해 콘셉트였음 | 기술적 표현이라 상표 등록이 어렵다(일반론) | 태양광 앱 운영사의 상표 출원 여부 확인 필요 |
| 4개 언어 | ko는 한글, 나머지는 Harubit. 라틴 표기는 뜻 없는 조어(Todoist처럼) | 하나의 표기로 4개 언어에서 통함 | en·ja는 통함. es는 "todo = 모든 것"이라 어색 | ko 전용. 로마자 표기가 어려워 해외용 이름이 따로 필요 |
| 할 일 앱으로 읽히는가 | 약함. 제목 뒤 키워드로 보완 | 보통 ("두") | 강함 | 강함 ("해") |
| 톤 | 차분함. 크림·잉크 디자인과 맞음 | 밝고 귀여움. 디자인보다 가벼움 | 중립 | 담백함 |
| 런처 길이 | 3자 / 7자 | 3자 / 7자 | 4자 / 10자 (일부 런처에서 잘릴 수 있음) | 3자 |
| 바꾸는 비용 | 중간 (3장) | 중간 | 없음 | 중간 + 해외용 이름 필요 |

### 2.2 A안(하루빛)의 약점과 대응
- **할 일 앱으로 바로 읽히지 않는다**: 일기나 감성 앱처럼 보일 수 있다. 제목의 "할 일 목록"과 해+체크 아이콘이 이 역할을 맡는다.
- **"하루~"로 시작하는 앱이 많다**: 하루하루, 하루토마토, 하루 한장 등. 그래도 "하루빛"이라는 정확한 이름은 비어 있다.
- **빛/빚**: 말로 들으면 [하루빋]이라 "빚"과 소리가 같다. 글로 쓰면 문제없고, 이름에서는 "빛"으로 읽는 것이 자연스럽다.
- **"-bit"가 코인 거래소처럼 보일 수 있다**: 국내에서 Upbit, Korbit이 연상된다. 한국 스토어와 런처에는 한글 "하루빛"을 쓰므로 영향이 작다.

### 2.3 C안(유지)을 고른다면
- 비용이 들지 않는다. 대신 1장의 "이름보다 먼저 고칠 것"은 반드시 해야 한다.
- ko 런처는 "심플투두"로 현지화한다(5장 방식).
- 제목은 4장 끝의 "유지안 제목"을 쓴다.

### 2.4 검토했다가 뺀 이름

| 이름 | 뺀 이유 |
|---|---|
| 해냄 | 같은 분야 앱 2개: "해냄 - 목표관리 습관 루틴 기록 플래너", "해냄 – 하루 한 줄 일기" |
| 해냈다 | 같은 이름의 앱은 없지만 위 "해냄"과 너무 비슷함 |
| SunArc | "SunArc: Solar & Lunar Widget", "SunArc: Sun path & shadow map" |
| DayArc | "DayArc: Daily Routine & Habits" (같은 분야) |
| Daylit / Daylight | "Daylit - Daily Planner", "Daylight: Visual Daily Planner" 등 10개 이상 |
| Sunup | SunUp 계열 앱 6개 이상 |
| Haru | Haru 계열 앱 다수 |
| Dayglow | "Dayglow Daily Routine Planner" 등 |
| 해쨍, 해뜸, Sunlist, Daysol | 같은 이름은 없음. 다만 뜻 전달이나 4개 언어 확장성이 A·B보다 약해서 예비로만 둠 |

---

## 3. 이름을 바꾸면 영향받는 것

### 3.1 바꿔야 하는 것

| 대상 | 위치 | 할 일 |
|---|---|---|
| 홈 화면 이름 | `app.json` `expo.name` | 기본값을 "Harubit"으로 바꾸고, ko는 `expo.locales`로 "하루빛"을 덮어쓴다(5장) |
| 스플래시 워드마크 | `assets/splash.png`. `scripts/generate_adaptive_icon.py`에서 `text = "SimpleTodo"`(107행)로 그려 넣음 | 다시 생성해야 한다. 이미지 한 장을 모든 언어가 같이 쓰므로 **해 마크만 두거나 "Harubit"으로** 쓰는 것을 권한다 |
| 위젯 선택 화면 이름 | `app.json` 위젯 `label: "SimpleTodo - 오늘 할일"`, `description` | 플러그인이 label을 매니페스트에 문자열 그대로 쓴다(`react-native-android-widget/app.plugin.js` 106행). 언어별로 다르게 하려면 `@string/app_name`을 넣어 보고 실기기에서 확인해야 한다(검증 필요) |
| 앱 안의 문구 | `i18n/locales/{ko,en,ja,es}.ts`의 `detail.notificationsOffDesc`, `settings.backupInvalidDetail`, `settings.exportDialogTitle` (4개 언어 × 3개 = 12곳) | 특히 알림 안내 문구는 "휴대폰 설정에서 ○○ 알림을 허용"이라고 안내한다. 시스템 설정에 보이는 런처 이름과 **언어별로 정확히 같아야** 사용자가 찾을 수 있다 |
| 백업 파일 이름 | `lib/backup.ts:43` `SimpleTodo-backup-*.json` | 바꿔도 되고 안 바꿔도 된다(보이는 이름일 뿐) |
| 개인정보처리방침 | `website/privacy-policy.html`. `<title>`과 4개 언어 첫 문단에 "SimpleTodo" | 이름을 바꾸고 "(구 SimpleTodo)"를 함께 적는다. **URL은 그대로 둔다** (Play Console과 앱 설정 화면이 이 URL을 가리킨다) |
| 개발자 홈페이지 | `website/index.html` (title, h1, meta description) | 이름을 바꾼다 |
| AdMob 앱 이름 | AdMob 콘솔 | 콘솔에서 보이는 라벨일 뿐이라 선택 사항이다. 앱 ID(`~8015568499`), 광고 단위, `app-ads.txt`(게시자 ID 기준)는 **영향 없음** |
| 스토어 에셋 | 피처 그래픽, 스크린샷, 512 아이콘 | 어차피 옛 파랑 디자인이라 다시 만들어야 한다. 새 이름으로 한 번에 만든다 |
| 기존 리뷰·평점 | 패키지 기준으로 유지됨 | 사라지지 않는다. 지금은 사실상 없다. 기존 사용자 약 10명을 위해 출시 노트에 "심플투두가 하루빛으로 이름을 바꿨어요"를 적는다 |

### 3.2 바꾸면 안 되는 것 (데이터·위젯이 깨짐)
- 패키지 `com.zeroninelab.simpletodo.app`, EAS `slug`/`projectId`
- 딥링크 scheme `simpletodo`
- 저장 키 `@simpletodo/todos`, `@simpletodo/settings`: 바꾸면 기존 할 일이 사라진다
- 백업 형식 `FORMAT = 'simpletodo-backup'` (`lib/backup.ts`): 바꾸면 이전 백업 파일을 복원할 수 없다
- 위젯 이름 `SimpleTodoWidget` (`widgets/*`, `app.json`): 바꾸면 홈 화면에 이미 놓인 위젯이 깨진다

---

## 4. 스토어 제목 후보 (30자 이하, 글자 수는 Python `len()`으로 확인)

원칙: `브랜드: 검색어 구` 형태로 쓰고, 검색어 구는 최대 2개까지만 넣는다. 쉼표로 단어를 늘어놓지 않는다. 경쟁 앱 중 "할 일 목록, 일정 관리, 작업, 일일 플래너, 달력" 같은 제목이 정책상 피해야 할 "단어 나열" 유형이다. 30자는 상한일 뿐 채워야 하는 목표가 아니다.

### 한국어 (ko-KR)
| # | 제목 | 자수 | 주 키워드 | 이유 |
|---|---|---|---|---|
| K1 (추천) | 하루빛: 오늘 할 일 목록 & 위젯 | 19 | 할 일 목록, 오늘 할 일, 위젯 | 상위 할 일 앱들(TickTick, 투두메이트, Taskito, Todoist "할일 목록")이 가장 많이 쓰는 표현이 "할 일 목록"이다. "오늘 할 일"은 앱의 포지션이자 지금 제목("오늘 할일 관리")과 이어진다. "할일 위젯" 검색 결과에는 위젯 전용 앱이 많고, v1.1.0에서 위젯에서 바로 체크할 수 있게 된다 |
| K2 | 하루빛: 할 일 체크리스트와 알림 | 18 | 체크리스트, 알림 | v1.1.0의 대표 기능이 시간 알림이다. "체크리스트" 검색 1위는 메모 성격의 앱(심플잇)이라 대형 할 일 앱과 덜 겹친다 |
| K3 | 하루빛 - 투두리스트 & 할 일 위젯 | 20 | 투두리스트, 투두, 할 일 위젯 | "투두"·"투두리스트" 검색 결과는 12개뿐이라 상대적으로 덜 붐빈다 |

### 영어 (en-US, 새로 추가)
| # | 제목 | 자수 | 주 키워드 | 이유 |
|---|---|---|---|---|
| E1 (추천) | Harubit: To Do List & Widget | 28 | to do list, widget | "to do list" 상위 앱 대부분이 이 표현을 쓴다. 위젯은 차별점이다 |
| E2 | Harubit: Todo List & Reminders | 30 | todo list, reminders | 알림 기능을 앞세운다. "todo" 표기도 함께 잡는다 |
| E3 | Harubit: Simple To-Do List | 26 | simple to do list | "simpletodo" 검색 결과 12개가 모두 Simple To Do 계열이다. 수요는 있으니, 예전 이름이 노리던 "simple" 검색어를 키워드로 남긴다 |

### 일본어 (ja-JP, 자동 번역 대체)
| # | 제목 | 자수 | 주 키워드 | 이유 |
|---|---|---|---|---|
| J1 (추천) | Harubit: ToDoリスト・タスク管理 | 22 | ToDoリスト, タスク管理 | Google ToDo リスト, Todoist, TickTick, Tasks.org가 쓰는 두 가지 대표 검색어 |
| J2 | Harubit: やることリスト＆リマインダー | 23 | やることリスト, リマインダー | "やることリスト" 검색 상위 앱들이 쓰는 표현이다. 알림 기능을 앞세운다 |
| J3 | Harubit: シンプルなToDoリスト | 21 | シンプル, ToDoリスト | 일본 스토어에서는 "シンプル"이 자주 쓰이는 수식어다("ToDoリスト - シンプルなタスク管理", "シンプルToDo"). 성격 설명이라 순위 주장에 해당하지 않는다 |

### 스페인어 (es-ES, es-419, 자동 번역 대체)
| # | 제목 | 자수 | 주 키워드 | 이유 |
|---|---|---|---|---|
| S1 (추천, 두 지역 공통) | Harubit: Lista de tareas | 24 | lista de tareas | es-ES는 물론 es-MX "lista de pendientes" 검색에서도 상위는 "Lista de tareas" 앱들이 차지한다 |
| S2 | Harubit: Tareas, recordatorios | 30 | tareas, recordatorios | "recordatorios" 검색 1위 앱이 "Lista de tareas: Recordatorios"다. 알림 기능을 앞세운다 |
| S3 (es-419 대안) | Harubit: Lista de pendientes | 28 | lista de pendientes | 중남미식 표현이다. 다만 MX 검색 결과도 "tareas"가 우세해서 S1보다 근거가 약하다 |

> Play Console에는 es-ES, es-419, es-US 등록정보가 따로 있다. 최소한 es-ES와 es-419에 S1을 넣는다.

### 유지안(C)을 고를 때의 제목
| 언어 | 제목 | 자수 |
|---|---|---|
| ko | 심플투두: 오늘 할 일 목록 & 위젯 | 20 |
| en | SimpleTodo: To Do List Widget | 29 |
| ja | SimpleTodo: ToDoリスト・タスク管理 | 25 |
| es | SimpleTodo: Lista de tareas | 27 |

B안(써니두/Sunnydo)이라면 같은 구조에 브랜드만 바꾼다. 예: "써니두: 오늘 할 일 목록 & 위젯"(19), "Sunnydo: To Do List & Widget"(28), "Sunnydo: ToDoリスト・タスク管理"(22), "Sunnydo: Lista de tareas"(24).

**A/B 테스트:** 스토어 등록정보 실험은 아이콘, 그래픽, 스크린샷, 짧은 설명, 전체 설명을 대상으로 하고 **제목은 대상이 아니다**(서드파티 가이드 기준, 콘솔에서 확인 필요). 제목은 K1 → K2처럼 4주 간격으로 바꿔 가며 Play Console 획득 보고서의 검색 유입을 비교한다.

---

## 5. 홈 화면 런처 이름

| 언어 | 런처 이름 | 길이 |
|---|---|---|
| ko | 하루빛 | 3자 |
| en / ja / es | Harubit | 7자 |

- **언어별로 다르게 하는 것을 권한다.** 한국어 사용자에게는 한글, 나머지에는 라틴 표기를 보여 준다. 일본어도 가타카나 대신 Harubit으로 두어 스토어 제목과 맞춘다.
- **구현 방법 (코드 수정은 이 문서 범위 밖):** `expo.name`을 "Harubit"으로 두면 이것이 기본값(values/)이 되어 ko 이외의 모든 언어에 쓰인다. `expo.locales`에 `{"ko": "./locales/ko.json"}`을 넣고, 그 파일을 `{"android": {"app_name": "하루빛"}}`로 만든다. Expo SDK 54의 `@expo/config-plugins/build/android/Locales.js`가 이 설정을 `values-b+ko/strings.xml`로 만들어 주므로 CNG(prebuild) 방식과 충돌하지 않는다.
- 3장에 적었듯, 앱 안의 "○○ 알림을 허용해 주세요" 문구도 언어별 런처 이름과 같게 맞춰야 한다.
- 유지안이라면 ko "심플투두", 나머지 "SimpleTodo"로 둔다(10자라 5열 그리드나 큰 글꼴에서 잘릴 수 있다).

---

## 6. 짧은 설명 (80자 이하, 브랜드명은 넣지 않아 어느 안에도 쓸 수 있음)

| 언어 | 짧은 설명 | 자수 |
|---|---|---|
| ko | 오늘 할 일을 끝낼수록 해가 하늘을 건너가요. 시간 알림, 요일 반복, 위젯에서 바로 체크. 가입 없이 폰에만 저장. | 65 |
| en | Check off today's tasks as the sun crosses the sky. Reminders, widget, no login. | 80 |
| ja | 今日のタスクを終えるたび、太陽が空を進みます。時間の通知、曜日リピート、ウィジェットでチェック。登録不要。 | 53 |
| es | Marca tus tareas y el sol cruza el cielo. Recordatorios, widget y sin registro. | 79 |

- 첫 문장은 진행 아크(차별점)를 말하고, 두 번째 문장은 v1.1.0 기능 키워드(알림, 반복, 위젯), 마지막은 가입 없음이다.
- "무료", "가장", "최고", 순위 표현은 넣지 않았다. 하루 1회 전면 광고를 넣을 예정이므로 "광고 없음" 같은 표현도 쓰지 않는다.
- 등록정보 실험용 B안(ko): "가입 없이 바로 쓰는 오늘 할 일 목록. 시간 알림과 요일 반복, 홈 화면 위젯에서 바로 체크해요." (55자)

---

## 7. 언어별 핵심 키워드

근거: 2026-11-25 Play 검색 결과 상위 앱들의 제목. "제목"은 제목에 넣을 1~2개, "설명"은 짧은 설명과 긴 설명에서 자연스러운 문장으로 쓸 것이다.

### 한국어
| 구분 | 키워드 |
|---|---|
| 제목 | 할 일 목록, 오늘 할 일, 위젯 (대안: 체크리스트, 투두리스트, 알림) |
| 설명 | 할일(붙여 쓴 형태), 투두, 할일 위젯, 할일 알림, 미리 알림, 리마인더, 요일 반복, 반복 할 일, 체크리스트, 일정 관리, 캘린더, 플래너, 백업, 가져오기, 다크 모드, 루틴 |
| 주의 | **습관**: 습관 트래커가 아니므로(11번 문서 X3) 제목에는 넣지 않는다. 설명에서 "매주 월·수·금 운동 같은 루틴"처럼 실제 기능으로만 쓴다. **일정 관리**: 검색 상위가 캘린더 앱(네이버, 구글, 삼성)이라 보조로만 쓴다. **디데이**: 아직 없는 기능이라 쓰지 않는다 |
| 금지 | 마이크로소프트 투두, MS 투두, To Do 대체, 투두메이트, Todoist, TickTick, Notion 등 다른 앱 이름 |

"할일"과 "할 일"을 Play가 같은 말로 보는지는 확인하지 못했다. 제목에는 표준 띄어쓰기 "할 일"을 쓰고, 긴 설명에 "할일 앱", "할일 위젯"을 문장 속에 한두 번 넣는다.

### 영어
| 구분 | 키워드 |
|---|---|
| 제목 | to do list, widget (대안: reminders, simple to do list) |
| 설명 | to-do, todo, tasks, task list, checklist, reminders, recurring tasks, daily planner, home screen widget, offline, no account, backup, import |

### 일본어
| 구분 | 키워드 |
|---|---|
| 제목 | ToDoリスト, タスク管理 (대안: やることリスト, リマインダー, シンプル) |
| 설명 | やることリスト, チェックリスト, リマインダー, 通知, ウィジェット, 繰り返し, 曜日, オフライン, 登録不要, バックアップ |

### 스페인어
| 구분 | 키워드 |
|---|---|
| 제목 | lista de tareas (대안: recordatorios, lista de pendientes(es-419)) |
| 설명 | tareas, recordatorios, checklist, lista de verificación, widget, organizador, agenda, tareas repetitivas, sin cuenta, sin conexión, copia de seguridad |

**MS To Do 이주 수요를 정책 안에서 잡는 방법:** 다른 앱 이름은 쓰지 않고 기능으로 말한다. 예: "다른 앱에서 쓰던 목록을 붙여 넣으면 바로 할 일이 돼요"(텍스트 가져오기), "계정 없이 폰에만 저장돼요".

---

## 8. 이름 충돌 확인

### 8.1 "Simple Todo" 계열 (Google Play)
en-US에서 "simpletodo"를 검색하면 결과 12개가 모두 Simple To Do 계열이고, 우리 앱은 없다. 웹 검색으로 찾은 것까지 합쳐 **같거나 거의 같은 이름이 아래 18개**다(전수 조사가 아니므로 실제로는 더 많을 수 있다).

| 제목 | 패키지 |
|---|---|
| ToDo: Simple ToDo List | com.enoiu.todo |
| Simple Todo: Reminders & Notes | com.felcmg.simpletodo |
| Simple Todo & Task Manager (ko 제목 "심플 할 일 & 작업 관리", 10만+) | app.nifu.simpletodo |
| Simple To Do List: Daily Tasks | com.komorebi.simpletodo |
| Simple To Do List & Checklist | com.woohoosoftware.simpletodolist |
| Simple ToDo | net.west_hino.simple_todo |
| Simple To Do List | io.paraga.todolist |
| Simple To Do List | com.simple.todolist |
| Simple Todo App - Get it Done! | com.naniinnovations.simple_todo_app |
| Simple Todo List - Task List m | com.clogica.simpletodolist |
| Todo One - A Simple ToDo App | com.rawjet.todo |
| Simple TODO | com.blackpearl.simpletodo |
| Simple todo | com.brainstudio.simpletodo |
| simple todo | com.samnagaraj.simpletodo |
| Simple Todo | xyz.simonmb.simpletodo |
| Simple Todo List | com.simpleTodo |
| Simple ToDo List | com.osmkoc.simpletodo |
| Simple Todo | com.guzion.simpletodo |

### 8.2 한국어 "심플투두" 주변 (ko-KR "심플투두" 검색, 우리 앱 1위)
| 제목 | 패키지 / 출처 |
|---|---|
| 심플두 - 오늘 할 일, 단순하지만 빠짐없이 | com.kairos.simpledo (이름과 콘셉트 모두 매우 비슷) |
| 심플잇 - 체크리스트·메모·디데이·일기·할 일 | com.simpli.simpletodo |
| 심플 할 일 & 작업 관리 | app.nifu.simpletodo |
| 심플 투두 - 매일 습관, 할일 관리 (iOS, 다른 개발자) | App Store id6497228942 |

iOS에 내놓을 계획이 있다면(`app.json`에 iOS 번들 ID가 있음) App Store에서 "심플 투두"와 바로 부딪힌다.

### 8.3 새 이름 후보
| 후보 | Play 결과 | 웹 결과 |
|---|---|---|
| 하루빛 | ko-KR: 같은 이름 없음 (상위는 일출·블루라이트 앱) | 같은 이름의 앱·브랜드 없음 |
| Harubit | en-US/ko/ja: 같은 이름 없음 | 개인 Scratch 계정 1건 |
| 써니두 / Sunnydo | 같은 이름 없음 | 미국 상표 SUNNYDO 등록번호 6205223 (28류 완구, 중국 개인), 예전 iOS 할 일 앱 "SunDo" |
| 오늘해 | **"오늘해 - 태양광 발전소 관리 모니터링"** (com.todaysunPackage.todaysun) | 같은 앱의 iOS 버전 (JKCORE) |
| 해냄 | com.haenaemkpi.app, me.mannayou.donelist | |
| SunArc | at.manfred.sunarcwidget, com.minimalapps.sun | |
| DayArc | com.dayarc.app | |
| Daylit | com.daylit.planner (+ Daylight 계열 10개 이상) | |

---

## 9. 정책 점검 (Google Play 메타데이터 정책 기준)

정책 요약: 제목 30자 이하. 제목·아이콘·개발자명에 이모지, 이모티콘, 반복 특수문자를 쓰지 않는다. 브랜드가 아닌 전체 대문자를 쓰지 않는다. 순위·성과 표현("#1", "App of the year", "Popular"), 가격·프로모션 표현("free for limited time" 등), Play 프로그램 표현("Editor's choice", "New")을 쓰지 않는다. 설명에서는 반복되거나 관련 없는 키워드, 출처 없는 사용자 후기, 앱·브랜드 비교, 단어 나열을 피한다.

| 항목 | 판단 | 조치 |
|---|---|---|
| 4장의 모든 추천 제목 | 문제 없음. 이모지·순위·가격 표현 없음, 검색어 구 2개 이하 | 그대로 사용 |
| "Simple / 심플 / シンプル" (E3, J3) | 문제 없음. 성격을 설명하는 말이다 | "가장", "제일" 같은 최상급과 함께 쓰지 않는다 |
| "To Do List" | 문제 없음. 업계 공통 명사구다 | "To Do"를 고유명처럼 쓰거나 "To Do에서 옮겨 오세요"라고 쓰면 **금지** |
| **현재 짧은 설명 "가장 심플한 할 일 앱"** | **애매**. 최상급이고 검증할 수 없는 주장 | v1.1.0에서 6장 문구로 바꾼다 |
| **현재 긴 설명 "Todoist, Notion 같은 앱이…"** | **위반 소지**. 다른 앱 이름이고 정책이 흔한 위반으로 드는 "앱·브랜드 비교"에 해당 | 삭제. "복잡한 할 일 앱에 지친 분"으로 바꾼다 |
| 현재 긴 설명 "지금 무료로 다운로드하세요" | **애매**. 설명에서 명시적으로 금지된 것은 아니지만 이번 작업 기준(가격 주장 금지)에 걸린다 | 삭제. "오늘 할 일 하나부터 체크해 보세요"로 바꾼다 |
| 브랜드 D안 "오늘해" | **애매 (상표)**. 같은 이름의 앱이 있음 | KIPRIS에서 9류 출원 여부를 확인하기 전에는 쓰지 않는다 |
| 브랜드 B안 "Sunnydo" | 낮음. 상표 분류가 다름(28류 완구) | 영어권 웹 검색에서 완구 브랜드와 섞이는 점만 감수 |
| 데이터 보안 섹션 "수집된 데이터 없음" | **이름과는 별개의 위험** | AdMob SDK는 광고 ID 같은 기기 식별자를 수집하므로 데이터 보안 양식을 다시 확인할 것을 권한다. 전면 광고를 넣기 전에 점검한다 |

---

## 10. 출시 순서 제안

1. 브랜드를 결정한다(A/B/C). D안을 원하면 KIPRIS를 먼저 확인한다.
2. **v1.1.0 빌드에 함께 넣는다**: 런처 이름(`expo.name` + `expo.locales`), 스플래시 재생성, i18n 문구 12곳, 위젯 label. 3.2장의 식별자는 건드리지 않는다.
3. **Play Console**: ko 제목과 짧은 설명을 바꾸고, **en-US를 새로 추가**하고, ja-JP, es-ES, es-419를 직접 입력해서 자동 번역을 대체한다. 긴 설명에서 다른 앱 이름, "가장", "무료"를 뺀다.
4. 스토어 에셋(피처 그래픽, 스크린샷, 512 아이콘)을 새 브랜드와 "하루의 빛" 디자인으로 다시 만든다. 1번 스크린샷 캡션 예: "할 일을 끝낼수록 해가 건너가요".
5. `website/index.html`, `website/privacy-policy.html`의 이름을 바꾸고 "(구 SimpleTodo)"를 함께 적는다. URL은 유지한다. AdMob 앱 이름도 바꾼다(선택).
6. 출시 노트 첫 줄: "심플투두가 '하루빛'으로 이름을 바꿨어요. 할 일은 그대로 남아 있어요."
7. 출시 후 4주가 지나면 Play Console 획득 보고서에서 검색어별 유입을 보고 K1과 K2를 비교한다. 짧은 설명은 등록정보 실험으로 A/B를 돌린다.

---

## 출처

**Google Play 정책·도구**
- 메타데이터 정책: https://support.google.com/googleplay/android-developer/answer/9898842
- 스토어 등록정보 실험: https://support.google.com/googleplay/android-developer/answer/6227309 , https://www.apptweak.com/en/aso-blog/store-listing-experiments-a-guide-to-play-store-a-b-testing

**현재 리스팅 (2026-11-25)**
- https://play.google.com/store/apps/details?id=com.zeroninelab.simpletodo.app (hl=ko/en/ja/es, gl=KR/US/JP/ES/MX로 확인)

**Play 검색 결과 (2026-11-25, 형식: `https://play.google.com/store/search?q=<검색어>&c=apps&hl=<언어>&gl=<국가>`)**
- ko-KR: 할일, 투두, 할 일 목록, 체크리스트, 할일 위젯, 일정 관리, 투두리스트, 오늘 할일, 심플투두, simple todo, 할일 알림, 오늘해, 해냄, 하루빛, 하루해, 해뜸, 해냈다, 해쨍, 써니두, 하루볕
- en-US: to do list, todo, daily planner, to do widget, simple todo, simpletodo, sunarc, dayarc, sunup, daylit, haru, dayglow, sunnydo, sunlist, daysol, harubit
- ja-JP: ToDo, タスク管理, やることリスト, ToDoリスト ウィジェット, シンプル ToDo
- es-ES / es-MX: lista de tareas, lista de pendientes, recordatorios, tareas simple

**같은 이름의 앱 (개별 페이지)**
- https://play.google.com/store/apps/details?id=com.blackpearl.simpletodo
- https://play.google.com/store/apps/details?id=com.brainstudio.simpletodo
- https://play.google.com/store/apps/details?id=com.samnagaraj.simpletodo
- https://play.google.com/store/apps/details?id=xyz.simonmb.simpletodo
- https://play.google.com/store/apps/details?id=com.felcmg.simpletodo
- https://play.google.com/store/apps/details?id=com.simpleTodo
- https://play.google.com/store/apps/details?id=app.nifu.simpletodo
- https://play.google.com/store/apps/details?id=com.osmkoc.simpletodo
- https://play.google.com/store/apps/details?id=com.guzion.simpletodo
- https://play.google.com/store/apps/details?id=net.west_hino.simple_todo
- https://play.google.com/store/apps/details?id=com.kairos.simpledo
- https://play.google.com/store/apps/details?id=com.simpli.simpletodo
- App Store "심플 투두 - 매일 습관, 할일 관리": https://apps.apple.com/us/app/%EC%8B%AC%ED%94%8C-%ED%88%AC%EB%91%90-%EB%A7%A4%EC%9D%BC-%EC%8A%B5%EA%B4%80-%ED%95%A0%EC%9D%BC-%EA%B4%80%EB%A6%AC/id6497228942

**후보 이름 충돌**
- 오늘해 (태양광): https://play.google.com/store/apps/details?id=com.todaysunPackage.todaysun , https://apps.apple.com/kr/app/id6737214550
- 해냄: https://play.google.com/store/apps/details?id=com.haenaemkpi.app , https://play.google.com/store/apps/details?id=me.mannayou.donelist
- SunArc: https://play.google.com/store/apps/details?id=at.manfred.sunarcwidget , https://play.google.com/store/apps/details?id=com.minimalapps.sun
- DayArc: https://play.google.com/store/apps/details?id=com.dayarc.app
- Daylit: https://play.google.com/store/apps/details?id=com.daylit.planner
- SUNNYDO 미국 상표: https://trademark.justia.com/889/04/sunnydo-88904415.html
- SunDo (예전 iOS 할 일 앱): https://www.goodreads.com/author_blog_posts/7686743-app-review-sundo
- Harubit (Scratch 계정): https://scratch.mit.edu/users/Harubit

**코드 근거 (로컬)**
- 런처 이름 현지화: `node_modules/@expo/config-plugins/build/android/Locales.js` (`values-b+<lang>/strings.xml` 생성)
- 위젯 label 처리: `node_modules/react-native-android-widget/app.plugin.js` 106행
- 스플래시 워드마크: `scripts/generate_adaptive_icon.py` 107행
- 브랜드명이 들어간 문구: `i18n/locales/*.ts`, `lib/backup.ts`, `app.json`, `website/*.html`

---

## 글로벌 기준 재검토 (v2)

작성일: 2026-11-25 (같은 날 추가)
**전제 변경:** 한국 시장 중심 앱이 아니라 **글로벌 앱**이다. 그래서 위 0장의 "하루빛/Harubit" 추천은 **철회**한다. 한국어 단어라 해외 사용자에게는 뜻이 전해지지 않기 때문이다.
**위 내용 중 그대로 유효한 것:** 1장(현재 리스팅 상태), 3.2장(바꾸면 안 되는 식별자), 7장(언어별 키워드), 9장(현재 리스팅의 정책 문제).

**v2 조건**
- 영어 사용자가 처음 듣고 뜻을 짐작하고 철자를 칠 수 있을 것
- 일본어·스페인어·한국어로 발음하기 쉬울 것
- 12자 이하
- 할 일 앱이라는 것이 전달되면 가점, "하루의 빛" 디자인과 맞으면 가점

**제외한 이름 (다시 쓰지 않음):** SunArc, DayArc, Daylit/Daylight, Sunup, Haru, Dayglow, 해냄, 오늘해, Sunnydo/써니두

### v2-0. 결론

**추천: "Sunlist"를 모든 언어에서 같은 표기로 쓴다. 런처 이름도 모든 언어에서 Sunlist로 둔다.**

| 언어 | 스토어 제목 | 자수 |
|---|---|---|
| en-US | Sunlist: To Do List & Widget | 28 |
| ja-JP | Sunlist: ToDoリスト・タスク管理 | 22 |
| es-419 / es-ES | Sunlist: Lista de tareas | 24 |
| ko-KR | Sunlist: 오늘 할 일 목록 & 위젯 | 23 |

짧은 설명 (en): "Check off today's tasks as the sun crosses the sky. Reminders, widget, no login." (80자)

**이유**
1. **뜻이 바로 보인다.** sun + list. "list"가 들어 있어 할 일 앱이라는 것을 짐작할 수 있고, "sun"은 v1.1.0의 해 아크와 해 체크 아이콘을 그대로 가리킨다. 해가 하늘을 건너가는 동안 목록을 지워 나간다는 이야기가 이름 하나에 담긴다.
2. **철자와 발음이 쉽다.** 두 개의 짧은 영어 단어라 처음 듣고도 칠 수 있다. 일본어 サンリスト, 한국어 선리스트로 읽기 쉽고, 스페인어 화자도 "sun"과 "list"는 대부분 아는 영어 단어다. 7자라 런처에서 잘리지 않는다.
3. **같은 이름이 없다.** Play US/KR/JP/ES에서 같은 이름의 앱이 없었다. 웹과 미국 상표 집계 사이트에서도 Sunlist라는 앱, 회사, 상표를 찾지 못했다.
4. **한 가지 표기로 끝난다.** 런처, 스플래시 워드마크, 위젯 이름, 앱 안 문구를 언어별로 나눌 필요가 없다. 지금은 위젯 이름이 한국어 "SimpleTodo - 오늘 할일" 하나로 모든 언어에 보이는데, 이 문제도 같이 풀린다.

**주의할 점: "Superlist"와 철자가 비슷하다.** Superlist는 Wunderlist를 만든 팀의 할 일 앱이다(App Store id1547585270). 웹 검색 엔진이 "Sunlist"를 Superlist의 오타로 추천하기도 했다. 뜻(sun과 super)과 글자 수(7과 9)가 다르고 아이콘·색도 달라 혼동 위험은 **중간보다 낮다**고 본다. 그래도 같은 분류(9류)라 출시 전에 USPTO, WIPO Global Brand Database, KIPRIS에서 "SUNLIST"를 직접 검색할 것을 권한다.

### v2-1. 후보 비교 (충돌이 없는 5개)

| | **Sunlist** (추천) | Dawnlist | Noonlist | Glowlist | Sunnylist |
|---|---|---|---|---|---|
| 처음 들었을 때의 뜻 | 해 + 목록 | 새벽 + 목록. 아침에 계획한다 | 정오 + 목록. 아크 꼭대기의 해 | 빛남 + 목록 | 맑음 + 목록 |
| 영어 철자 | 쉬움 | 쉬움 ("aw") | 쉬움 | 쉬움 | 쉬움 |
| ja / es / ko 발음 | サンリスト / sun-list / 선리스트 | ドーンリスト / "aw"가 스페인어에서 낯섦 / 던리스트 | ヌーンリスト / nun-list / 눈리스트 (한국어 "눈"으로 들림) | グローリスト / glou-list / 글로우리스트 | サニーリスト / sun-ny-list / 써니리스트 |
| 길이 | 7 | 8 | 8 | 8 | 9 |
| 할 일 앱으로 읽히는가 | 강함 (list) | 강함 | 강함 | 강함 | 강함 |
| 디자인과 맞는가 | 매우 잘 맞음 (해 아크) | 보통 (아침에만 해당) | 잘 맞음 (꼭대기의 해) | 보통 (빛) | 잘 맞음 (해) |
| 약점 | Superlist와 철자가 비슷함 | iOS "Dawny – To Do & Reset"과 비슷함. iOS "Dawn - Minimal Calendar" 있음 | "점심 목록"으로 오해할 수 있음 | "glow"가 스킨케어를 연상시킴. GLOW 계열 상표 다수 | Superlist와 같은 9자에 "Su…list" 모양. SUNNY 상표(9·42류, 다른 소프트웨어)가 있음 |

**예비 후보 (충돌은 없지만 뜻이 약함):** Sunnote, Sundot.
- Sunnote: "note"라서 메모 앱으로 읽힌다. 같은 이름의 미국 상표가 30류(식품)에 있다.
- Sundot: 뜻이 모호하다. SUNDOTS 미국 상표가 17류(고무 제품)로 출원 중이다.

### v2-2. 후보별 스토어 제목·런처·짧은 설명

공통 원칙: `브랜드: 검색어 구`. 위 4장의 키워드 근거(상위 앱 제목)를 그대로 쓴다.
ja/es/ko 짧은 설명은 위 6장의 문구가 브랜드명 없이 쓰여 있어 어느 후보에도 그대로 쓸 수 있다.

**Sunlist (추천)**
| 언어 | 제목 (추천) | 자수 | 대안 제목 | 자수 |
|---|---|---|---|---|
| en | Sunlist: To Do List & Widget | 28 | Sunlist: Todo List & Reminders | 30 |
| ja | Sunlist: ToDoリスト・タスク管理 | 22 | Sunlist: やることリスト＆リマインダー | 23 |
| es | Sunlist: Lista de tareas | 24 | Sunlist: Tareas, recordatorios | 30 |
| ko | Sunlist: 오늘 할 일 목록 & 위젯 | 23 | Sunlist: 할 일 체크리스트와 알림 | 22 |
- 런처: 모든 언어에서 **Sunlist**
- 짧은 설명 (en): Check off today's tasks as the sun crosses the sky. Reminders, widget, no login. (80)

**Dawnlist**
| en | ja | es | ko |
|---|---|---|---|
| Dawnlist: To Do List & Widget (29) | Dawnlist: ToDoリスト・タスク管理 (23) | Dawnlist: Lista de tareas (25) | Dawnlist: 오늘 할 일 목록 & 위젯 (24) |
- 런처: 모든 언어에서 Dawnlist
- 짧은 설명 (en): Plan at dawn, done by dusk. A to-do list with reminders, repeats and a widget. (78)

**Noonlist**
| en | ja | es | ko |
|---|---|---|---|
| Noonlist: To Do List & Widget (29) | Noonlist: ToDoリスト・タスク管理 (23) | Noonlist: Lista de tareas (25) | Noonlist: 오늘 할 일 목록 & 위젯 (24) |
- 런처: 모든 언어에서 Noonlist
- 짧은 설명 (en): Your day as one sun arc: check off tasks, get reminders, tick from the widget. (78)

**Glowlist**
| en | ja | es | ko |
|---|---|---|---|
| Glowlist: To Do List & Widget (29) | Glowlist: ToDoリスト・タスク管理 (23) | Glowlist: Lista de tareas (25) | Glowlist: 오늘 할 일 목록 & 위젯 (24) |
- 런처: 모든 언어에서 Glowlist
- 짧은 설명 (en): Every task you finish makes your day glow. Reminders, repeats, widget, no login. (80)

**Sunnylist**
| en | ja | es | ko |
|---|---|---|---|
| Sunnylist: To Do List & Widget (30) | Sunnylist: ToDoリスト・タスク管理 (24) | Sunnylist: Lista de tareas (26) | Sunnylist: 오늘 할 일 목록 & 위젯 (25) |
- 런처: 모든 언어에서 Sunnylist
- 짧은 설명 (en): 81자라 한도를 넘는다. 줄인 안: "A sunny to-do list: check off today's tasks, get reminders, tick from widget." (77자). 출시 전에 다시 센다.

**모든 후보에 해당하는 정책 점검:** 이모지, 순위·가격 표현, 다른 앱 이름, 단어 나열이 없다. "To Do List"는 업계 공통 명사구로 썼다.
- "no login"과 "no sign-up"은 사실이다(계정 없음).
- "free"는 넣지 않았다. 광고가 들어가고, 이번 작업 기준상 가격 주장을 쓰지 않기로 했기 때문이다.

### v2-3. 런처 이름: 모든 언어에서 같은 라틴 표기를 권한다

- **한 브랜드를 한 가지 표기로 쓰면** 입소문, 리뷰 언급, 웹 검색이 한곳에 모인다. 한국·일본 런처에도 Todoist, TickTick처럼 라틴 표기 앱 이름은 흔하다(관찰 기반 판단).
- **구현이 단순해진다.** `expo.name = "Sunlist"`만 바꾸면 된다. v1에서 쓰려던 `expo.locales`의 `app_name` 덮어쓰기는 필요 없다.
- **스플래시 워드마크는 "Sunlist" 한 장**으로 모든 언어에 쓸 수 있다(`scripts/generate_adaptive_icon.py`의 text만 바꿔서 다시 생성).
- **위젯 이름**(`app.json` 위젯 `label`)은 "Sunlist"로 둔다. 언어별로 나눌 필요가 없어진다.
- **위젯 설명**(`description`)은 지금 한국어 한 문장뿐이라 해외 사용자에게도 한국어로 보인다. 기본값을 영어로 바꾸고, ko/ja/es는 `expo.locales`의 android 키 `widget_simpletodowidget_description`으로 덮어쓰는 방법을 검토한다. 플러그인이 이 키로 strings.xml을 만들기 때문인데, 덮어쓰기가 실제로 먹히는지는 확인이 필요하다.
- 앱 안 문구 12곳(v1 3.1장)에서 "SimpleTodo"를 모두 "Sunlist"로 바꾼다. 언어별로 다를 필요가 없다.
- **현지 문자 표기는 설명에서 한 번만.** 입소문으로 이름을 들은 사람이 현지 문자로 검색할 때를 대비해 긴 설명에 "Sunlist(선리스트)", "Sunlist（サンリスト）"를 한 번씩 자연스럽게 적는다. 반복하면 키워드 남용이 된다.

### v2-4. 리스팅 우선순위 (글로벌 기준)

| 순위 | 작업 | 이유 |
|---|---|---|
| 0 | **기본 언어를 ko-KR에서 en-US로 바꾼다** (Play Console 스토어 설정) | 지금은 번역이 없는 모든 지역에서 한국어 제목이 보인다(en-US에서 확인됨). 기본 언어를 영어로 바꾸면 독일어, 포르투갈어 등 번역이 없는 지역도 영어 리스팅으로 대체된다. 앱도 지원하지 않는 기기 언어에서는 영어로 뜬다(`i18n/index.ts`의 `getDeviceLanguage`, `fallbackLng: 'en'`) |
| 1 | **en-US** 제목, 짧은 설명, 긴 설명, 스크린샷(영어 캡션) | 기본 리스팅이 되고, en-GB, en-IN 등 다른 영어권 지역도 따로 입력하지 않으면 이것을 쓴다(추론) |
| 2 | **es-419**, es-US, es-ES (같은 문구로 시작) | 스페인어권은 지역이 넓고 안드로이드 비중이 높다(일반론). 지금은 자동 번역 "Todo simple - Daily Task"가 보인다 |
| 3 | **ja-JP** | 지금은 자동 번역 제목(영어)이 보이고 일본어 검색어가 없다. 일본 스토어는 "ToDoリスト", "タスク管理"가 핵심이다 |
| 4 | **ko-KR** | 기존 리스팅을 새 브랜드로 고치는 일이다. 다른 앱 이름, "가장", "무료"를 뺀다(9장) |
| 보류 | 앱이 지원하지 않는 언어(pt, de, fr 등)의 리스팅 번역 | 앱 UI가 영어로 뜨는데 리스팅만 현지어로 쓰면 기대와 다르다. 앱 번역을 추가할 때 같이 한다 |

스크린샷 캡션도 같은 순서(en부터)로 만든다. 등록정보 실험(짧은 설명 A/B)은 트래픽이 가장 많을 en-US에서 먼저 돌린다.

### v2-5. 이름 충돌 확인 (v2 후보)

방법: Play 검색(en-US, ko-KR, ja-JP, es-ES)에서 결과 제목과 패키지명에 후보 문자열이 들어 있는지 기계적으로 확인했다(2026-11-25). 이어서 웹 검색으로 같은 이름의 앱(App Store 포함), 회사, 상표를 찾았다. 상표는 Justia 같은 미국 상표 집계 사이트 기준이라 정식 등록부 확인이 아니다.

| 후보 | Play 4개국 | 웹·상표 | 판정 |
|---|---|---|---|
| **Sunlist** | 같은 이름 없음 | 앱·회사·상표 없음. 할 일 앱 Superlist와 철자 유사 | **채택 (추천)** |
| Dawnlist | 같은 이름 없음 | 같은 이름 없음. 비슷한 것: iOS "Dawny – To Do & Reset", "Dawn - Minimal Calendar" | 채택 (대안) |
| Noonlist | 같은 이름 없음 | 같은 이름 없음. NOON 계열 상표 다수(이커머스, 조명), NOONLIGHT(캐나다 9류) | 채택 (대안) |
| Glowlist | 같은 이름 없음 | 같은 이름 없음. GLOW 계열(Glow App Limited 등), "THE GLOW UP APP"(습관 앱 출원) | 채택 (대안) |
| Sunnylist | 같은 이름 없음 | 같은 이름 없음. SUNNY 상표(Sunny, LLC, 9·42류, 관계 관리 소프트웨어) | 채택 (대안) |
| Sunnote | 같은 이름 없음 | 앱 없음. SUNNOTE 미국 상표(30류 식품) | 예비 |
| Sundot | 같은 이름 없음 | 앱 없음. SUNDOTS 출원(17류) | 예비 |
| Tasklight | 같은 이름 없음. 다만 뒤집은 "LightTask"(com.light_task.app)가 있음 | **iOS "TaskLight"** (할 일, 계정 없음, 로컬 저장으로 포지션까지 같음) | 제외 |
| Lightlist | 같은 이름 없음 | **iOS "lightlist on the go"** (체크리스트·장보기 목록) | 제외 |
| Brightlist | 같은 이름 없음 | **Shopify 앱 "Brightlist"(작업 관리)**, BRIGHTLIST 상표 출원(2024), iOS "Bright List" | 제외 |
| Daypath | 같은 이름 없음 | **iOS "DayPath Widget"**, **목표·할 일 앱 "Daypath"** (daypathapp.com) | 제외 |
| Daytick | "DayTick" 6개 이상 | | 제외 |
| Doneday | "DoneDay Habit Tracker" (com.terakendev.doneday) | | 제외 |
| Daydone | "DayDone - 今日だけに集中するTodo", "Day Planner Organizer -DayDone" 등 | | 제외 |
| Tickday | "TickDay – Countdown & Reminder" 등 | | 제외 |
| Suntask | "SunTask" (suntask.aplilpx) | | 제외 |
| Sunlit | 20개 이상 ("Sunlit - Journal & Mood Log" 등) | | 제외 |
| Daymark | 30개 이상 (할 일·습관·디데이 앱 다수) | | 제외 |
| Daybeam | "Daybeam: Light Puzzle" | | 제외 |
| Amberlist | "Amber List" (es) | | 제외 |
| Daylist | Play "Daylist: Grocery Shopping List", iOS "Daylist: List Maker & Widget", Spotify "daylist" 기능 | | 제외 |

### v2-6. v1 대비 바뀌는 작업

- **v1 3.1장의 목록은 그대로 적용한다.** 이름만 "Sunlist"로 바꾼다. 다만 런처 현지화(`expo.locales`의 `app_name`)와 언어별 스플래시 고민은 필요 없어진다.
- **v1 3.2장의 "바꾸면 안 되는 것"은 그대로다:** 패키지, scheme, `@simpletodo/*` 저장 키, `simpletodo-backup` 형식, `SimpleTodoWidget`.
- 출시 노트 (en): "SimpleTodo is now Sunlist. Same app, same tasks, a new look."
- 출시 노트 (ko): "심플투두가 Sunlist로 이름을 바꿨어요. 할 일은 그대로 남아 있어요."
- 개인정보처리방침과 홈페이지에는 "Sunlist (formerly SimpleTodo)"라고 적고 URL은 유지한다.

### v2 출처

**Play 검색 (2026-11-25, 형식: `https://play.google.com/store/search?q=<후보>&c=apps&hl=<en|ko|ja|es>&gl=<US|KR|JP|ES>`)**
- 후보: Sunlist, Tasklight, Doneday, Brightlist, Daytick, Suntask, Glowlist, Lightlist, Sunlit, Daypath, Daybeam, Sundot, Tickday, Daydone, Sunnote, LightTask, Dawnlist, Daymark, Amberlist, Sunnylist, Noonlist

**웹·상표**
- Superlist (App Store): https://apps.apple.com/us/app/superlist-tasks-lists/id1547585270
- TaskLight (iOS): https://apps.apple.com/us/app/tasklight/id6740737143
- lightlist on the go (iOS): https://apps.apple.com/us/app/-/id1591791713
- Brightlist (Shopify): https://apps.shopify.com/brightlist
- BRIGHTLIST 출원 (Rothbright, Inc.): https://trademark.justia.com/owners/rothbright-inc-5754942
- Bright List (iOS): https://apps.apple.com/app/id6754126136
- DayPath Widget (iOS): https://apps.apple.com/ca/app/daypath-widget/id6757925543
- Daypath (Product Hunt): https://www.producthunt.com/products/daypath?page=2
- Dawny – To Do & Reset (iOS): https://apps.apple.com/app/id6762262959
- Dawn - Minimal Calendar (iOS): https://apps.apple.com/ca/app/id1509374383?l=en-ca
- Daylist: List Maker & Widget (iOS): https://apps.apple.com/us/app/id6450943422
- SUNNY 상표 등 (Sunny Saves Inc.): https://trademark.justia.com/owners/sunny-saves-inc-5961815
- NOON 상표: https://trademark.justia.com/793/22/noon-79322489.html
- NOONLIGHT (캐나다 출원): https://trademarkelite.com/canada/trademark/trademark-detail/2290441/NOONLIGHT
- Glow App Limited 상표: https://trademarks.justia.com/owners/glow-app-limited-4684255
- THE GLOW UP APP 출원: https://trademarks.justia.com/987/58/the-glow-up-98758971.html
- SUNNOTE 상표: https://markinton.com/trademark/sunnote-98890785
- SUNDOTS 출원: https://gleanmark.com/trademark/uspto-99781042
- "Sunlist"로 검색한 상표 집계 결과 (같은 이름 없음, 비슷한 상표 SUNZAPP·SUNLIGHT 등): https://trademark.justia.com/868/01/sunzapp-86801049.html , https://trademarks.justia.com/998/01/sunlight-99801653.html

**코드 근거 (로컬)**
- 앱 언어 대체값: `i18n/index.ts` (`getDeviceLanguage`, `fallbackLng: 'en'`)
- 위젯 label과 description 처리: `node_modules/react-native-android-widget/app.plugin.js` 106행, 135~143행
