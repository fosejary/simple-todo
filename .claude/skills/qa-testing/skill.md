---
name: qa-testing
description: "React Native + Supabase 앱의 통합 정합성을 검증하고 테스트 코드를 작성하는 스킬. 경계면 교차 비교, Supabase RLS 검증, 라우팅 정합성, 데이터 흐름 추적, 단위/통합 테스트를 수행한다. QA, 테스트, 코드 검증, 버그 탐지, 품질 보증 시 반드시 이 스킬을 사용."
---

# QA Testing Skill

React Native + Supabase 앱의 통합 정합성을 검증하고 테스트 코드를 작성한다.

## 검증 프로세스

### 1. 경계면 교차 비교

**"양쪽 동시 읽기" 원칙** — 한쪽만 읽으면 경계면 버그를 못 잡는다.

#### Supabase 쿼리 ↔ 타입 정의
```
검증 단계:
1. hooks/ 내 모든 supabase.from('table').select() 호출 수집
2. 각 쿼리의 테이블명이 supabase/migrations/ SQL과 일치하는지 확인
3. .select('col1, col2') 컬럼명이 실제 테이블 컬럼과 일치하는지 확인
4. 결과를 받는 TypeScript 타입의 필드명과 쿼리 결과가 일치하는지 확인
5. 옵셔널 컬럼(nullable)이 타입에 ? 또는 | null로 표현되었는지 확인
```

#### Expo Router 경로 ↔ 네비게이션 코드
```
검증 단계:
1. app/ 디렉토리의 파일 구조에서 URL 패턴 추출
   - (group) → URL에서 제거
   - [param] → 동적 세그먼트
2. 코드 내 모든 router.push(), <Link href>, router.replace() 수집
3. 각 네비게이션 대상이 실제 존재하는 라우트인지 확인
4. 동적 세그먼트 [id]에 올바른 값이 전달되는지 확인
```

#### Zustand 스토어 ↔ 컴포넌트 셀렉터
```
검증 단계:
1. stores/ 내 모든 스토어의 state shape 추출
2. 컴포넌트에서 useStore(s => s.xxx)의 xxx가 실제 존재하는지 확인
3. 액션 호출 시 전달하는 파라미터 타입이 스토어 정의와 일치하는지 확인
```

### 2. Supabase RLS 검증
```
검증 단계:
1. migrations/ SQL에서 모든 RLS 정책 추출
2. 각 테이블에 대해 SELECT/INSERT/UPDATE/DELETE별 정책 존재 여부 확인
3. 정책의 USING/WITH CHECK 조건이 인증 컨텍스트(auth.uid())를 올바르게 참조하는지 확인
4. user 테이블 자신의 데이터만 접근 가능한지 확인
5. 관계 테이블(FK)의 RLS가 부모 테이블 권한과 일관되는지 확인
```

### 3. 데이터 흐름 완전성
```
DB 스키마 → Supabase 쿼리 → 커스텀 훅 → Zustand 스토어 → 컴포넌트 렌더링
```
각 단계 사이에 빈 구간(dead link)이 없는지 추적한다:
- 테이블은 있지만 쿼리하는 훅이 없는 경우
- 훅은 있지만 컴포넌트에서 사용하지 않는 경우
- 스토어에 저장하지만 렌더링에 사용하지 않는 상태

### 4. 테스트 코드 작성

**Jest + React Native Testing Library:**
```bash
npx expo install jest @testing-library/react-native
```

우선순위:
1. 커스텀 훅 테스트 (Supabase 모킹)
2. 핵심 비즈니스 로직 단위 테스트
3. 주요 화면 렌더링 테스트 (스냅샷 or 요소 존재 확인)
4. 네비게이션 흐름 통합 테스트

### 5. 최종 판정

| 판정 | 기준 |
|------|------|
| 릴리스 가능 | P0 버그 0개, P1 버그 2개 이하, 핵심 경계면 모두 통과 |
| 조건부 | P0 버그 0개, P1 버그 3개 이상 (수정 후 릴리스) |
| 불가 | P0 버그 1개 이상 (반드시 수정 필요) |

## 출력
1. 테스트 코드를 `__tests__/` 디렉토리에 추가
2. `_workspace/11_qa_report.md`에 검증 보고서
