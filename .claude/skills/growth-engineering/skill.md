---
name: growth-engineering
description: "모바일 앱의 성장 기반을 구축하는 스킬. Firebase Analytics 계측, 핵심 퍼널 정의, 온보딩 최적화, 리텐션 기능(리마인더, 스트릭), A/B 테스트(Remote Config), 레퍼럴/공유를 구현한다. 그로스, 분석 계측, 리텐션, 온보딩, A/B 테스트 구현 시 반드시 이 스킬을 사용."
---

# Growth Engineering Skill

앱의 성장 기반을 구축한다. 데이터 기반 의사결정을 위한 분석 계측과 사용자 유지를 위한 리텐션 기능을 구현한다.

## 그로스 프로세스

### 1. 분석 계측 (Firebase Analytics)
```bash
npx expo install expo-firebase-analytics
```

핵심 이벤트만 추적한다 (이벤트 남발 금지):

| 이벤트 카테고리 | 이벤트 예시 | 목적 |
|---------------|-----------|------|
| 인증 | sign_up, login | 가입 퍼널 |
| 핵심 기능 | {feature}_start, {feature}_complete | 기능 사용률 |
| 전환 | purchase_start, purchase_complete | 수익 퍼널 |
| 리텐션 | app_open, session_duration | 재방문률 |

이벤트 헬퍼 유틸리티:
```typescript
// lib/analytics.ts
import * as Analytics from 'expo-firebase-analytics';

export const track = {
  screen: (name: string) => Analytics.logEvent('screen_view', { screen_name: name }),
  action: (name: string, params?: Record<string, any>) => Analytics.logEvent(name, params),
  funnel: (step: string, funnel: string) => Analytics.logEvent('funnel_step', { step, funnel }),
};
```

### 2. 핵심 퍼널 정의
앱의 핵심 가치 전달 퍼널을 정의한다:
```
설치 → 가입 → 온보딩 완료 → 핵심 기능 첫 사용 → 반복 사용 → 구매
```
각 단계에 이벤트를 배치하여 드롭오프 측정.

### 3. 온보딩 최적화
- 3-4 단계 이내의 간결한 온보딩
- 각 단계에서 핵심 가치를 시각적으로 전달
- 건너뛰기 옵션 제공
- 온보딩 완료 여부를 AsyncStorage에 저장
- 온보딩 완료율을 이벤트로 추적

### 4. 리텐션 기능

**로컬 리마인더:**
```bash
npx expo install expo-notifications
```
- 사용자가 선택한 시간에 로컬 알림
- 알림 내용은 격려/가치 제공 중심 (스팸 금지)

**스트릭/연속 기록:**
- Supabase에 일일 활동 기록 테이블
- 연속 사용 일수 계산 및 표시
- 마일스톤 축하 UI (7일, 30일, 100일)

**일일 목표:**
- 사용자 설정 가능한 일일 목표
- 진행률 시각화 (프로그레스 바, 원형 차트)

### 5. A/B 테스트 인프라
```bash
npx expo install @react-native-firebase/remote-config
```
- Firebase Remote Config로 기능 플래그 관리
- 온보딩 변형, 가격 실험 등에 활용
- 설정 가이드 제공 (Firebase Console 설정은 사용자 담당)

### 6. 레퍼럴/공유
- `expo-sharing`으로 앱 내 콘텐츠 공유
- 딥링크 기반 레퍼럴 추적 (production-engineer의 딥링크 활용)
- Supabase에 레퍼럴 추적 테이블

## 프라이버시
- 앱 첫 실행 시 분석 동의 요청
- 동의 거부 시 분석 이벤트 비활성화
- 개인정보처리방침에 수집 항목 명시

## 출력
1. 프로젝트 코드에 직접 추가
2. `_workspace/10_growth_report.md`에 이벤트 맵 + 설정 가이드
