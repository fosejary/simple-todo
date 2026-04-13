---
name: mvp-design
description: "리서치/벤치마킹 결과를 기반으로 React Native MVP의 UI/UX를 설계하는 스킬. 사용자 플로우, 화면 스펙, 컴포넌트 구조, 데이터 모델을 정의한다. 앱 디자인, 화면 설계, 와이어프레임, 데이터 모델 설계 시 사용."
---

# MVP Design Skill

리서치와 벤치마킹 결과를 바탕으로 React Native MVP의 UI/UX를 설계한다.

## 설계 프로세스

### 1. 입력 분석
- `_workspace/01_research_market.md`에서 타겟 사용자, 페인포인트, 진입 전략 추출
- `_workspace/02_benchmark_apps.md`에서 MVP 기능 리스트, UI 패턴, 차별화 포인트 추출

### 2. 앱 컨셉 정의
- 앱 이름 후보 3개 (ASO 고려 — 짧고 기억하기 쉬운 이름)
- 핵심 가치 제안 (한 문장)
- 타겟 사용자 페르소나 요약

### 3. 사용자 플로우 설계
- 핵심 플로우 1-2개만 정의 (MVP 범위)
- 텍스트 기반 플로우 다이어그램:
  ```
  온보딩 → 메인 → 핵심기능 → 결과/피드백
  ```
- 각 단계의 사용자 목표와 액션 정의

### 4. 화면 설계
화면 수는 5-7개로 제한한다 (MVP 원칙):
- 스플래시/온보딩
- 인증 (Supabase Auth)
- 메인 화면
- 핵심 기능 화면 1-2개
- 설정/프로필

각 화면에 대해 정의:
- 목적과 사용자 액션
- 주요 컴포넌트 (리스트, 카드, 폼, 버튼 등)
- 텍스트 기반 와이어프레임 (컴포넌트 배치)
- 데이터 바인딩 (어떤 데이터가 표시되는지)

### 5. 네비게이션 구조
- Expo Router 기반 파일 구조
- Tab Navigator / Stack Navigator 선택과 이유
- 화면 간 전환 흐름

### 6. 디자인 토큰
Material Design 3 기반으로 정의:
```
Colors: primary, secondary, background, surface, text, error
Typography: heading(24px), subheading(18px), body(16px), caption(12px)
Spacing: 4, 8, 12, 16, 24, 32
Border Radius: 4, 8, 12, 16
```

### 7. 데이터 모델
Supabase 테이블 스키마를 정의:
- 테이블명, 컬럼, 타입, 제약조건
- RLS(Row Level Security) 정책 개요
- 테이블 간 관계 (FK)
- 인덱스 제안

## 출력

`_workspace/03_design_mvp.md`에 위 모든 섹션을 포함하여 저장한다.

## 품질 기준
- 모든 화면이 React Native Paper 컴포넌트로 구현 가능해야 한다
- 데이터 모델이 Supabase에서 직접 생성 가능한 SQL로 표현 가능해야 한다
- Phase 2로 미룬 기능 목록을 반드시 포함한다
