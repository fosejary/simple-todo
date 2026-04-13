---
name: mvp-factory
description: "안드로이드 앱 카테고리를 입력받아 리서치, 벤치마킹, 디자인, 개발(React Native + Supabase), ASO까지 전 과정을 자동으로 수행하여 MVP를 생성하는 오케스트레이터. 앱 카테고리를 지정하여 MVP를 만들고 싶을 때, 앱 아이디어를 빠르게 구현하고 싶을 때, 1인 스타트업 앱 개발 전체 파이프라인을 실행할 때 반드시 이 스킬을 사용. '앱 만들어줘', 'MVP 만들어줘', '카테고리 분석해서 앱 개발', '빠르게 출시' 등의 요청에도 트리거."
---

# MVP Factory — 앱 카테고리에서 출시 가능한 MVP까지

앱 카테고리를 입력받아 리서치 → 벤치마킹 → 디자인 → 개발 → 에셋 생성 → ASO 전 과정을 수행하여 출시 가능한 MVP를 생성하는 오케스트레이터.

## 실행 모드: 파이프라인 + 팬아웃 (팀 재구성)

Phase 1은 에이전트 팀(팬아웃), Phase 2-5는 서브 에이전트(순차 파이프라인)로 실행한다.

## 에이전트 구성

| 에이전트 | 타입 | 역할 | 스킬 | Phase |
|---------|------|------|------|-------|
| market-researcher | market-researcher | 시장 리서치 | market-research | 1 |
| app-benchmarker | app-benchmarker | 경쟁 앱 벤치마킹 | app-benchmark | 1 |
| mvp-designer | mvp-designer | UI/UX 설계 | mvp-design | 2 |
| rn-developer | rn-developer | RN + Supabase 구현 | rn-supabase-dev | 3 |
| asset-designer | asset-designer | 앱 아이콘, 스플래시, 스토어 에셋 | asset-creation | 4 |
| aso-optimizer | aso-optimizer | Play Store ASO | aso-optimize | 5 |

## 워크플로우

### Phase 0: 준비
1. 사용자 입력 분석 — 앱 카테고리, 추가 요구사항 파악
2. 프로젝트 루트에 `_workspace/` 디렉토리 생성
3. `_workspace/00_input.md`에 입력 정보 저장:
   ```markdown
   # MVP Factory Input
   - 카테고리: {category}
   - 추가 요구사항: {requirements}
   - 생성일: {date}
   ```

### Phase 1: 리서치 & 벤치마킹 (에이전트 팀)

**실행 방식:** 팬아웃 — 2명이 동시 조사, 발견 공유

1. 팀 생성:
   ```
   TeamCreate(
     team_name: "research-team",
     members: [
       {
         name: "market-researcher",
         agent_type: "market-researcher",
         model: "opus",
         prompt: "_workspace/00_input.md를 읽고 해당 카테고리의 시장을 조사하라. .claude/skills/market-research/skill.md를 Skill 도구로 로드하거나 Read로 읽고 프로세스를 따르라. 결과를 _workspace/01_research_market.md에 저장하라. app-benchmarker에게 주목할 앱이나 트렌드를 발견하면 SendMessage로 공유하라."
       },
       {
         name: "app-benchmarker",
         agent_type: "app-benchmarker",
         model: "opus",
         prompt: "_workspace/00_input.md를 읽고 해당 카테고리의 경쟁 앱을 벤치마킹하라. .claude/skills/app-benchmark/skill.md를 Skill 도구로 로드하거나 Read로 읽고 프로세스를 따르라. 결과를 _workspace/02_benchmark_apps.md에 저장하라. market-researcher에게 시장 관련 인사이트를 발견하면 SendMessage로 공유하라."
       }
     ]
   )
   ```

2. 작업 등록:
   ```
   TaskCreate(tasks: [
     { title: "시장 리서치", description: "카테고리 시장 분석 및 MVP 진입 전략 도출", assignee: "market-researcher" },
     { title: "앱 벤치마킹", description: "경쟁 앱 분석 및 MVP 기능 우선순위 도출", assignee: "app-benchmarker" }
   ])
   ```

3. 팀원들이 자체 조율하며 조사 수행 (리더는 모니터링)
4. 두 팀원 모두 완료 시 산출물 확인
5. 팀 정리

**산출물:**
| 파일 | 내용 |
|------|------|
| `_workspace/01_research_market.md` | 시장 리서치 보고서 |
| `_workspace/02_benchmark_apps.md` | 앱 벤치마킹 보고서 |

### Phase 2: MVP 디자인 (서브 에이전트)

**실행 방식:** 순차 — Phase 1 결과에 의존

```
Agent(
  description: "MVP UI/UX 설계",
  prompt: "_workspace/01_research_market.md와 _workspace/02_benchmark_apps.md를 읽고 MVP를 설계하라. .claude/skills/mvp-design/skill.md를 Read로 읽고 프로세스를 따르라. 결과를 _workspace/03_design_mvp.md에 저장하라.",
  subagent_type: "mvp-designer",
  model: "opus"
)
```

**산출물:**
| 파일 | 내용 |
|------|------|
| `_workspace/03_design_mvp.md` | MVP 디자인 스펙 |

### Phase 3: 개발 (서브 에이전트)

**실행 방식:** 순차 — Phase 2 결과에 의존

```
Agent(
  description: "React Native MVP 구현",
  prompt: "_workspace/03_design_mvp.md를 읽고 React Native + Supabase MVP를 구현하라. .claude/skills/rn-supabase-dev/skill.md를 Read로 읽고 기술 스택과 구조를 따르라. 코드는 프로젝트 루트에 생성하고, 구현 요약은 _workspace/04_dev_summary.md에 저장하라.",
  subagent_type: "rn-developer",
  model: "opus"
)
```

**산출물:**
| 파일 | 내용 |
|------|------|
| 프로젝트 루트 | React Native 프로젝트 코드 |
| `_workspace/04_dev_summary.md` | 구현 요약, 실행 방법, 환경 설정 |

### Phase 4: 에셋 생성 (서브 에이전트)

**실행 방식:** 순차 — Phase 2, 3 결과에 의존

```
Agent(
  description: "앱 아이콘, 스플래시, 스토어 에셋 생성",
  prompt: "_workspace/03_design_mvp.md에서 디자인 토큰(색상, 앱 이름)을 읽고 앱 에셋을 생성하라. .claude/skills/asset-creation/skill.md를 Read로 읽고 프로세스를 따르라. Gemini API(gemini-3-pro-image-preview)를 사용하여 이미지를 생성하라. scripts/generate_asset.py 스크립트를 생성하고 실행하여 앱 아이콘(1024x1024), 적응형 아이콘, 스플래시 스크린, 피처 그래픽(1024x500), 스크린샷 프레임(1080x1920, 4장 이상)을 생성하라. app.json의 아이콘/스플래시 경로도 업데이트하라. 결과를 _workspace/04.5_asset_report.md에 저장하라.",
  subagent_type: "asset-designer",
  model: "opus"
)
```

**산출물:**
| 파일 | 내용 |
|------|------|
| `assets/icon.png` | 앱 아이콘 (1024x1024) |
| `assets/adaptive-icon.png` | 적응형 아이콘 전경 (1024x1024) |
| `assets/splash.png` | 스플래시 스크린 (1284x2778) |
| `assets/store/feature-graphic.png` | 피처 그래픽 (1024x500) |
| `assets/store/screenshot-{N}.png` | 스크린샷 프레임 (1080x1920) |
| `_workspace/04.5_asset_report.md` | 에셋 생성 보고서 |

### Phase 5: ASO 최적화 (서브 에이전트)

**실행 방식:** 순차 — Phase 1, 3, 4 결과에 의존

```
Agent(
  description: "Play Store ASO 최적화",
  prompt: "_workspace/02_benchmark_apps.md와 _workspace/04_dev_summary.md를 읽고 ASO 최적화 리스팅을 작성하라. _workspace/04.5_asset_report.md에서 생성된 에셋 목록도 확인하라. .claude/skills/aso-optimize/skill.md를 Read로 읽고 프로세스를 따르라. 결과를 _workspace/05_aso_listing.md에 저장하라.",
  subagent_type: "aso-optimizer",
  model: "opus"
)
```

**산출물:**
| 파일 | 내용 |
|------|------|
| `_workspace/05_aso_listing.md` | ASO 최적화 리스팅 |

### Phase 6: 종합 보고

1. 모든 Phase의 산출물을 Read로 수집
2. `_workspace/SUMMARY.md`에 종합 보고서 생성:
   ```markdown
   # MVP Factory 결과 요약

   ## 앱 개요
   - 앱 이름:
   - 카테고리:
   - 핵심 가치:

   ## 시장 기회
   (01_research 핵심 요약)

   ## 구현된 기능
   (04_dev_summary 핵심 요약)

   ## 실행 방법
   1. Supabase 프로젝트 생성
   2. 환경변수 설정
   3. npx expo start

   ## 생성된 에셋
   (04.5_asset 핵심 요약)

   ## ASO 리스팅 요약
   (05_aso 핵심 요약)

   ## 다음 단계 (Phase 2 로드맵)
   (03_design의 Phase 2 항목)
   ```
3. 사용자에게 결과 요약 보고

## 데이터 흐름

```
[사용자 입력: 카테고리]
        |
   00_input.md
        |
+--- Phase 1 (에이전트 팀) ---+
| market-researcher <-> app-benchmarker |
|       |                    |          |
| 01_research.md    02_benchmark.md     |
+---------------------------------------+
        |
   Phase 2 (서브 에이전트)
   mvp-designer
        |
   03_design.md
        |
   Phase 3 (서브 에이전트)
   rn-developer
        |
   04_dev_summary.md + 프로젝트 코드
        |
   Phase 4 (서브 에이전트)
   asset-designer
        |
   assets/ (아이콘, 스플래시, 스토어 에셋)
        |
   Phase 5 (서브 에이전트)
   aso-optimizer
        |
   05_aso_listing.md
        |
   Phase 6 (리더)
   SUMMARY.md
```

## 에러 핸들링

| 상황 | 전략 |
|------|------|
| Phase 1 팀원 1명 실패 | 남은 팀원 결과로 Phase 2 진행, 부족한 정보는 designer가 보완 |
| Phase 1 팀 전체 실패 | 사용자에게 카테고리 재확인 요청 |
| Phase 2 디자인 실패 | 1회 재시도. 재실패 시 기본 5화면 템플릿으로 진행 |
| Phase 3 개발 중 에러 | 에러 분석 후 수정 시도 (최대 3회). 해결 불가 시 부분 구현 |
| Phase 4 에셋 생성 실패 | Gemini API 키 미설정 시 사용자에게 안내. API 에러 시 프롬프트 단순화 후 재시도 |
| Phase 5 ASO 실패 | 1회 재시도. 재실패 시 기본 리스팅 생성 |
| 이전 Phase 산출물 품질 낮음 | 현재 Phase 에이전트가 자체 판단으로 보완 |

## 테스트 시나리오

### 정상 흐름
1. 사용자: "습관 추적(Habit Tracker) 카테고리로 MVP 만들어줘"
2. Phase 0: 입력 파싱, _workspace/ 생성
3. Phase 1: research-team 구성 → 시장 리서치 + 앱 벤치마킹 병렬 수행
4. Phase 2: mvp-designer가 5-7개 화면 설계
5. Phase 3: rn-developer가 Expo + Supabase MVP 구현
6. Phase 4: asset-designer가 아이콘, 스플래시, 스토어 에셋 생성
7. Phase 5: aso-optimizer가 Play Store 리스팅 작성
8. Phase 6: SUMMARY.md 생성
9. 예상 산출물: 프로젝트 코드 + assets/ + _workspace/ 파일 7개

### 에러 흐름
1. Phase 1에서 app-benchmarker가 웹 검색 실패로 중지
2. market-researcher 결과만으로 Phase 2 진행
3. mvp-designer가 카테고리 일반 지식으로 벤치마킹 데이터 보완
4. 이후 Phase 정상 진행
5. SUMMARY.md에 "벤치마킹 데이터 일부 미수집" 명시

### 부분 실행
사용자가 특정 Phase만 요청할 수도 있다:
- "리서치만 해줘" → Phase 0 + Phase 1만 실행
- "이 디자인으로 개발해줘" → Phase 3부터 실행 (기존 _workspace/ 파일 활용)
- "에셋만 만들어줘" → Phase 4만 실행
- "ASO만 최적화해줘" → Phase 5만 실행
