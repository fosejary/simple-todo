---
name: production-hardening
description: "React Native + Supabase 앱을 프로덕션 수준으로 강화하는 스킬. 에러 핸들링, 보안, 크래시 리포팅, 결제, 푸시 알림, 딥링크, 오프라인 지원을 구현한다. 프로덕션 강화, 보안 강화, 결제 연동, 푸시 알림 구현 시 반드시 이 스킬을 사용."
---

# Production Hardening Skill

React Native (Expo) + Supabase 앱을 프로덕션 수준으로 강화한다.

## 강화 항목

### 1. 글로벌 에러 핸들링
```typescript
// app/_layout.tsx에 ErrorBoundary 적용
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <View style={styles.center}>
      <Text>문제가 발생했습니다</Text>
      <Button onPress={resetErrorBoundary}>다시 시도</Button>
    </View>
  );
}
```
- 모든 Supabase 쿼리에 에러 처리 추가
- 네트워크 에러 감지 및 재시도 로직
- 사용자 친화적 에러 메시지 (기술 용어 제거)

### 2. 보안 강화
- **RLS 정밀화**: 모든 테이블에 대해 CRUD별 정책 검증 및 보완
- **입력 검증**: Zod 스키마로 모든 사용자 입력 검증
- **API 키 보호**: 환경변수 관리, `.env`를 `.gitignore`에 추가 확인
- **세션 관리**: 토큰 자동 갱신, 만료 시 로그아웃 처리

### 3. 크래시 리포팅
Sentry 또는 Firebase Crashlytics 설정:
```bash
npx expo install sentry-expo
```
- 초기화 코드를 `app/_layout.tsx`에 추가
- 소스맵 업로드 설정 (EAS Build 연동)
- 사용자 식별자 연결 (Supabase user.id)

### 4. 결제 연동 (Google Play Billing)
```bash
npx expo install expo-in-app-purchases
```
- 구독/일회성 구매 설정 가이드 제공
- 구매 복원 로직
- Supabase에 구독 상태 동기화 (Edge Function 또는 webhook)
- **주의**: 실제 상품 ID는 사용자가 Play Console에서 설정

### 5. 푸시 알림 (FCM)
```bash
npx expo install expo-notifications expo-device
```
- FCM 설정 가이드 제공
- 알림 권한 요청 플로우
- 토큰 저장 (Supabase user_devices 테이블)
- 로컬 알림 (리마인더용)
- 서버 알림: Supabase Edge Function 활용

### 6. 딥링크
- `app.json`에 scheme 설정
- Expo Router의 딥링크 자동 지원 활용
- 유니버설 링크 설정 가이드

### 7. 오프라인 기본 지원
- AsyncStorage 기반 최근 데이터 캐싱
- 네트워크 상태 감지 (`@react-native-community/netinfo`)
- 오프라인 시 캐시 데이터 표시 + 동기화 대기 UI

## 구현 순서
보안(P0) → 에러 핸들링(P0) → 크래시 리포팅(P0) → 오프라인(P1) → 푸시(P1) → 딥링크(P1) → 결제(P2)

## 출력
1. 프로젝트 코드에 직접 수정/추가
2. `_workspace/08_production_report.md`에 보고서 + 사용자 설정 가이드
