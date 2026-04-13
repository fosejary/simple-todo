---
name: product-factory
description: "MVP를 완성된 프로덕트로 전환하는 오케스트레이터. MVP 감사 → 기능 추가 + 프로덕션 강화 + 성능 최적화 + 그로스 (병렬) → QA 검증 → 릴리스 준비 전 과정을 수행한다. MVP를 프로덕트로 강화하고 싶을 때, 프로덕션 준비, 기능 확장, 앱 완성, 출시 준비, '프로덕트로 만들어줘', '앱 완성해줘', '프로덕션 강화해줘' 등의 요청에 반드시 이 스킬을 사용."
---

# Product Factory — MVP에서 완성된 프로덕트로

MVP 코드베이스를 감사하고, 기능 추가 + 프로덕션 강화 + 성능 최적화 + 그로스를 병렬 수행한 뒤, QA 검증을 거쳐 릴리스 가능한 프로덕트를 만드는 오케스트레이터.

## 실행 모드: 파이프라인 + 팬아웃 (팀 재구성)

Phase 1은 서브 에이전트(감사), Phase 2는 에이전트 팀(4명 병렬), Phase 3은 서브 에이전트(QA)로 실행한다.

## 에이전트 구성

| 에이전트 | 타입 | 역할 | 스킬 | Phase |
|---------|------|------|------|-------|
| mvp-auditor | mvp-auditor | MVP 감사 | mvp-audit | 1 |
| feature-engineer | feature-engineer | 기능 추가 | feature-expansion | 2 |
| production-engineer | production-engineer | 프로덕션 강화 | production-hardening | 2 |
| performance-engineer | performance-engineer | 성능 최적화 | performance-optimize | 2 |
| growth-engineer | growth-engineer | 그로스 기능 | growth-engineering | 2 |
| qa-engineer | qa-engineer | QA 검증 | qa-testing | 3 |

## 전제 조건

이 하네스는 MVP Factory(`mvp-factory`)가 생성한 산출물이 존재한다고 가정한다:
- 프로젝트 루트에 React Native (Expo) 코드
- `_workspace/00_input.md` ~ `_workspace/05_aso_listing.md`

`_workspace/`가 없는 프로젝트에도 사용 가능하지만, 감사 범위가 코드 분석에 한정된다.

## 워크플로우

### Phase 0: 준비
1. 사용자 입력 분석 — 추가 기능 요구사항, 강화 우선순위 파악
2. 기존 `_workspace/` 존재 여부 확인
3. `_workspace/00_product_input.md`에 Product Factory 입력 저장:
   ```markdown
   # Product Factory Input
   - 추가 기능 요구사항: {requirements}
   - 우선순위: {priorities}
   - 생성일: {date}
   ```

### Phase 1: MVP 감사 (서브 에이전트)

**실행 방식:** 순차 — 감사 결과가 Phase 2 전체의 작업 범위를 결정

```
Agent(
  description: "MVP 코드베이스 감사",
  prompt: "프로젝트 루트의 React Native 코드와 _workspace/ 파일들을 분석하라. .claude/skills/mvp-audit/skill.md를 Read로 읽고 감사 프로세스를 따르라. _workspace/00_product_input.md에 사용자 추가 요구사항이 있으면 Phase 2 재평가에 반영하라. 결과를 _workspace/06_audit_report.md에 저장하라.",
  subagent_type: "mvp-auditor",
  model: "opus"
)
```

**산출물:**
| 파일 | 내용 |
|------|------|
| `_workspace/06_audit_report.md` | 감사 보고서 + 우선순위 매트릭스 + 에이전트별 작업 할당 |

### Phase 2: 병렬 강화 (에이전트 팀)

**실행 방식:** 팬아웃 — 4명이 동시 작업, 발견 공유 및 충돌 조율

1. 팀 생성:
   ```
   TeamCreate(
     team_name: "product-team",
     members: [
       {
         name: "feature-engineer",
         agent_type: "feature-engineer",
         model: "opus",
         prompt: "_workspace/06_audit_report.md를 읽고 할당된 기능 추가 작업을 수행하라. .claude/skills/feature-expansion/skill.md를 Read로 읽고 프로세스를 따르라. 새 기능 추가 시 production-engineer에게 SendMessage로 알려 에러 핸들링/보안 적용을 요청하라. performance-engineer에게는 무거운 UI 추가 시 알리고, growth-engineer에게는 트래킹 포인트를 공유하라. 결과를 _workspace/07_feature_report.md에 저장하라."
       },
       {
         name: "production-engineer",
         agent_type: "production-engineer",
         model: "opus",
         prompt: "_workspace/06_audit_report.md를 읽고 할당된 프로덕션 강화 작업을 수행하라. .claude/skills/production-hardening/skill.md를 Read로 읽고 프로세스를 따르라. feature-engineer가 추가한 새 기능에도 에러 핸들링과 보안을 적용하라. 결과를 _workspace/08_production_report.md에 저장하라."
       },
       {
         name: "performance-engineer",
         agent_type: "performance-engineer",
         model: "opus",
         prompt: "_workspace/06_audit_report.md를 읽고 할당된 성능 최적화 작업을 수행하라. .claude/skills/performance-optimize/skill.md를 Read로 읽고 프로세스를 따르라. feature-engineer가 추가한 화면도 성능 검증하라. 결과를 _workspace/09_performance_report.md에 저장하라."
       },
       {
         name: "growth-engineer",
         agent_type: "growth-engineer",
         model: "opus",
         prompt: "_workspace/06_audit_report.md와 _workspace/01_research_market.md를 읽고 그로스 기능을 구현하라. .claude/skills/growth-engineering/skill.md를 Read로 읽고 프로세스를 따르라. feature-engineer가 공유한 새 기능의 트래킹 이벤트도 추가하라. 결과를 _workspace/10_growth_report.md에 저장하라."
       }
     ]
   )
   ```

2. 작업 등록:
   ```
   TaskCreate(tasks: [
     { title: "Phase 2 기능 구현", description: "감사 보고서의 기능 추가 항목 구현", assignee: "feature-engineer" },
     { title: "보안 강화", description: "RLS, 입력 검증, 인증 보안 강화", assignee: "production-engineer" },
     { title: "에러 핸들링", description: "글로벌 에러 바운더리, Supabase 에러 처리", assignee: "production-engineer" },
     { title: "크래시 리포팅", description: "Sentry 또는 Crashlytics 설정", assignee: "production-engineer" },
     { title: "결제/푸시 설정", description: "결제 연동 + 푸시 알림 설정 코드 + 가이드", assignee: "production-engineer" },
     { title: "렌더링 최적화", description: "memo, 리렌더 제거, 리스트 가상화", assignee: "performance-engineer" },
     { title: "번들/네트워크 최적화", description: "번들 크기, 이미지, 쿼리 최적화", assignee: "performance-engineer" },
     { title: "분석 계측", description: "Firebase Analytics 이벤트 설정", assignee: "growth-engineer" },
     { title: "리텐션 기능", description: "리마인더, 스트릭, 온보딩 최적화", assignee: "growth-engineer" }
   ])
   ```

3. 팀원들이 자체 조율하며 병렬 작업 수행

**팀원 간 통신 규칙:**
- feature-engineer → production-engineer: 새 API/DB 변경 시 SendMessage (에러 핸들링+보안 적용 요청)
- feature-engineer → performance-engineer: 무거운 기능 추가 시 SendMessage (최적화 요청)
- feature-engineer → growth-engineer: 새 기능 완성 시 SendMessage (트래킹 이벤트 요청)
- production-engineer ↔ growth-engineer: 푸시 알림 + 리텐션 메시지 전략 조율
- production-engineer ↔ performance-engineer: 캐싱/오프라인 전략 중복 방지

4. 모든 팀원 완료 시 산출물 확인
5. 팀 정리

**산출물:**
| 파일 | 내용 |
|------|------|
| `_workspace/07_feature_report.md` | 추가된 기능 보고서 |
| `_workspace/08_production_report.md` | 프로덕션 강화 보고서 |
| `_workspace/09_performance_report.md` | 성능 최적화 보고서 |
| `_workspace/10_growth_report.md` | 그로스 엔지니어링 보고서 |

### Phase 3: QA 검증 (서브 에이전트)

**실행 방식:** 순차 — Phase 2 결과 전체를 검증

```
Agent(
  description: "통합 정합성 QA 검증",
  prompt: "프로젝트 코드 전체와 _workspace/06~10 보고서를 읽고 통합 정합성을 검증하라. .claude/skills/qa-testing/skill.md를 Read로 읽고 검증 프로세스를 따르라. 특히 경계면 교차 비교(Supabase 쿼리↔타입, 라우트 경로↔네비게이션, 스토어↔컴포넌트)를 철저히 수행하라. 발견한 버그는 직접 수정하고, 테스트 코드를 __tests__/에 추가하라. 결과를 _workspace/11_qa_report.md에 저장하라.",
  subagent_type: "qa-engineer",
  model: "opus"
)
```

**산출물:**
| 파일 | 내용 |
|------|------|
| `__tests__/` | 테스트 코드 |
| `_workspace/11_qa_report.md` | QA 검증 보고서 + 릴리스 판정 |

### Phase 4: 릴리스 준비 + 종합 보고

1. 모든 Phase의 산출물을 Read로 수집
2. QA 판정 확인:
   - **릴리스 가능** → Phase 4 진행
   - **조건부** → 미해결 P1 항목 목록 제시, 사용자 판단 요청
   - **불가** → P0 버그 목록 제시, 수정 후 QA 재실행 권고
3. `_workspace/PRODUCT_SUMMARY.md`에 종합 보고서 생성:
   ```markdown
   # Product Factory 결과 요약

   ## 프로덕트 개요
   - 앱 이름:
   - 원래 MVP 범위:
   - 추가된 기능:

   ## 감사 → 해결 매트릭스
   | 감사 항목 | 우선순위 | 담당 | 해결 여부 |
   |----------|---------|------|----------|

   ## 추가된 기능 (Feature)
   (07_feature_report 핵심 요약)

   ## 프로덕션 강화 (Production)
   (08_production_report 핵심 요약)

   ## 성능 최적화 (Performance)
   (09_performance_report 핵심 요약)

   ## 그로스 기능 (Growth)
   (10_growth_report 핵심 요약)

   ## QA 결과
   (11_qa_report 핵심 요약)

   ## 사용자 설정 필요 항목
   - [ ] Supabase 프로젝트 환경변수
   - [ ] Firebase 프로젝트 설정
   - [ ] Google Play Console 설정
   - [ ] 결제 상품 등록
   - [ ] 푸시 알림 키 설정

   ## 빌드 & 출시
   1. eas build --platform android
   2. eas submit --platform android

   ## 다음 단계
   (추가 개선 권장 사항)
   ```
4. 사용자에게 결과 요약 보고

## 데이터 흐름

```
[MVP 코드 + _workspace/]
        |
   Phase 1 (서브 에이전트)
   mvp-auditor
        |
   06_audit_report.md
        |
+--- Phase 2 (에이전트 팀 4명) ---+
| feature  <-> production          |
| engineer     engineer            |
|    ^            ^                |
|    |            |                |
|    v            v                |
| growth   <-> performance         |
| engineer     engineer            |
|    |            |                |
| 07_feature  08_production        |
| 09_perf     10_growth            |
+----------------------------------+
        |
   Phase 3 (서브 에이전트)
   qa-engineer
        |
   11_qa_report.md + __tests__/
        |
   Phase 4 (리더)
   PRODUCT_SUMMARY.md
```

## 에러 핸들링

| 상황 | 전략 |
|------|------|
| Phase 1 감사 실패 | 1회 재시도. 재실패 시 코드 레벨 분석만으로 기본 감사 보고서 생성 |
| Phase 2 팀원 1명 실패 | 나머지 팀원 결과로 진행, QA에서 해당 영역 미검증 명시 |
| Phase 2 팀원 간 코드 충돌 | 마지막 수정 기준, QA에서 충돌 영역 검증 |
| Phase 3 QA 불가 판정 | P0 버그 목록과 수정 제안을 사용자에게 보고, 수정 후 QA 재실행 권고 |
| _workspace/ 미존재 | Phase 1에서 코드만으로 감사, Phase 2에서 사용자 요구사항 기반으로 작업 |

## 테스트 시나리오

### 정상 흐름
1. 사용자: "이 MVP를 프로덕트로 완성해줘. 소셜 로그인이랑 다크모드도 추가해줘"
2. Phase 0: 입력 파싱, 00_product_input.md 생성
3. Phase 1: mvp-auditor가 코드 + _workspace 분석 → 감사 보고서 생성
4. Phase 2: 4명 팀 구성 → 병렬 작업 (기능 추가 + 보안 + 성능 + 그로스)
5. Phase 3: qa-engineer가 전체 검증 → "릴리스 가능" 판정
6. Phase 4: PRODUCT_SUMMARY.md 생성
7. 예상 산출물: 강화된 프로젝트 코드 + 테스트 코드 + _workspace/ 보고서 6개

### 에러 흐름
1. Phase 2에서 performance-engineer가 최적화 중 에러로 중지
2. 나머지 3명(feature, production, growth) 결과로 Phase 3 진행
3. qa-engineer가 성능 관련 검증을 "미검증"으로 표기
4. PRODUCT_SUMMARY.md에 "성능 최적화 미완료" 명시
5. 사용자에게 수동 성능 검토 권고

### 부분 실행
사용자가 특정 Phase만 요청할 수 있다:
- "감사만 해줘" → Phase 0 + Phase 1만 실행
- "QA만 돌려줘" → Phase 3만 실행
- "기능만 추가해줘" → feature-engineer만 서브 에이전트로 실행
