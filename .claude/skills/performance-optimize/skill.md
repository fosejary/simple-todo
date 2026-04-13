---
name: performance-optimize
description: "React Native(Expo) 앱의 성능을 최적화하는 스킬. 번들 크기, 렌더링, 리스트 가상화, 이미지, 네트워크, 앱 시작 시간을 최적화한다. 앱 성능 최적화, 속도 개선, 메모리 최적화 시 반드시 이 스킬을 사용."
---

# Performance Optimization Skill

React Native (Expo) 앱의 성능을 체계적으로 최적화한다.

## 최적화 프로세스

### 1. 번들 크기 최적화
- 큰 패키지 식별: `npx expo-doctor`로 의존성 검증
- 불필요한 패키지 제거
- 조건부 import (dynamic import) 적용
- 아이콘 라이브러리: 전체 import 대신 개별 import
  ```typescript
  // Bad: import { MaterialIcons } from '@expo/vector-icons';
  // Good: import MaterialIcons from '@expo/vector-icons/MaterialIcons';
  ```

### 2. 렌더링 최적화
- 불필요한 리렌더 제거:
  ```typescript
  // React.memo로 순수 컴포넌트 래핑
  const ItemCard = React.memo(({ item }: { item: Item }) => { ... });

  // useCallback으로 콜백 안정화
  const handlePress = useCallback((id: string) => { ... }, []);

  // useMemo로 계산 결과 캐싱
  const sortedItems = useMemo(() => items.sort(...), [items]);
  ```
- Zustand 셀렉터 최적화: 필요한 값만 구독
  ```typescript
  // Bad: const store = useStore();
  // Good: const count = useStore(s => s.count);
  ```

### 3. 리스트 가상화
- FlatList → FlashList 교체 (대용량 리스트):
  ```bash
  npx expo install @shopify/flash-list
  ```
- `estimatedItemSize` 설정
- `keyExtractor` 반드시 지정
- 무한 스크롤: `onEndReached` + 페이지네이션

### 4. 이미지 최적화
```bash
npx expo install expo-image
```
- `expo-image`로 교체 (자동 캐싱, 블러 해시 지원)
- placeholder 제공 (블러 해시 또는 저해상도 이미지)
- 적절한 크기 리사이징 (contentFit: 'cover')
- WebP 포맷 권장

### 5. 네트워크 최적화
- Supabase 쿼리 최적화:
  - `.select('필요한_컬럼만')` — `*` 대신 명시적 컬럼
  - 페이지네이션: `.range(from, to)`
  - 인덱스 활용: 자주 필터링/정렬하는 컬럼에 인덱스
- 결과 캐싱: Zustand에 캐시 + stale-while-revalidate 패턴
- 배치 요청: 여러 쿼리를 `Promise.all()`로 병렬 실행

### 6. 앱 시작 시간
- Splash Screen 유지하면서 초기 데이터 로딩
- 인증 상태 확인을 빠르게 (AsyncStorage → 캐시된 세션)
- 무거운 초기화를 지연 로딩으로 분리

## 측정 방법
- React Native Performance Monitor (개발 중)
- `console.time` / `console.timeEnd`로 구간 측정
- Expo의 `expo-dev-client`로 프로파일링

## 출력
1. 프로젝트 코드에 직접 수정
2. `_workspace/09_performance_report.md`에 최적화 항목별 전/후 분석
