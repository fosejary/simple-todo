---
name: rn-supabase-dev
description: "React Native(Expo) + Supabase로 MVP 앱을 구현하는 개발 스킬. 프로젝트 초기화, 컴포넌트 구현, Supabase 연동, 네비게이션, 상태 관리를 포함한다. React Native 개발, Supabase 연동, 모바일 앱 구현 시 반드시 이 스킬을 사용."
---

# React Native + Supabase Development Skill

디자인 스펙을 기반으로 React Native (Expo) + Supabase MVP를 구현한다.

## 기술 스택

| 영역 | 기술 | 이유 |
|------|------|------|
| 프레임워크 | Expo (managed) | 빠른 개발, OTA 업데이트, EAS Build |
| 언어 | TypeScript | 타입 안전성, 1인 개발 버그 최소화 |
| 백엔드 | Supabase | Auth + DB + Storage + Realtime 올인원 |
| 라우팅 | Expo Router | 파일 기반 라우팅, 딥링크 자동 지원 |
| 상태관리 | Zustand | 가볍고 간단, 보일러플레이트 최소 |
| UI 라이브러리 | React Native Paper | Material Design 3 기반 |
| 폼 | React Hook Form + Zod | 타입 안전 폼 검증 |

## 프로젝트 구조

```
{app-name}/
├── app/                    # Expo Router 파일 기반 라우팅
│   ├── (auth)/            # 인증 전 화면
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/            # 탭 네비게이션
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   └── profile.tsx
│   ├── _layout.tsx        # 루트 레이아웃
│   └── index.tsx          # 엔트리 (리다이렉트)
├── components/
│   ├── ui/               # 기본 UI 컴포넌트
│   └── features/         # 기능별 컴포넌트
├── lib/
│   ├── supabase.ts       # Supabase 클라이언트
│   └── types.ts          # DB 타입 (Supabase 생성)
├── hooks/                # 커스텀 훅
├── stores/               # Zustand 스토어
├── constants/            # 상수 (colors, config)
├── supabase/
│   └── migrations/       # SQL 마이그레이션
├── app.json
├── package.json
├── tsconfig.json
└── .env.example          # 환경변수 템플릿
```

## 구현 순서

### 1. 프로젝트 초기화
```bash
npx create-expo-app {app-name} -t expo-template-blank-typescript
cd {app-name}
npx expo install expo-router expo-linking expo-constants
npx expo install @supabase/supabase-js @react-native-async-storage/async-storage
npx expo install react-native-paper react-native-safe-area-context
npx expo install zustand react-hook-form @hookform/resolvers zod
```

### 2. Supabase 설정
- `lib/supabase.ts`에 클라이언트 초기화 (AsyncStorage 기반 세션)
- 환경변수: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `.env.example` 생성 (실제 키 없이 플레이스홀더)

### 3. 인증 구현
- Supabase Auth (이메일/비밀번호)
- Zustand 스토어로 세션 관리
- `_layout.tsx`에서 인증 상태 기반 리다이렉트

### 4. 데이터베이스 연동
- 디자인 스펙의 데이터 모델에 따라 `supabase/migrations/` SQL 작성
- RLS 정책 포함
- CRUD 커스텀 훅 (`hooks/use{Entity}.ts`)

### 5. 화면 구현
- 디자인 스펙 순서대로: 레이아웃 → 컴포넌트 → 데이터 바인딩 → 인터랙션
- React Native Paper 컴포넌트 활용
- 디자인 토큰을 `constants/theme.ts`로 중앙화

### 6. 빌드 설정
- `eas.json`: preview + production 프로필
- `app.json`: Android 패키지명, 버전, 아이콘, 스플래시

## Supabase 핵심 패턴

### 클라이언트 초기화
```typescript
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
```

### 인증 스토어 패턴
```typescript
import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';

interface AuthStore {
  session: Session | null;
  loading: boolean;
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  session: null,
  loading: true,
  initialize: async () => {
    const { data } = await supabase.auth.getSession();
    set({ session: data.session, loading: false });
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session });
    });
  },
  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  },
  signOut: async () => {
    await supabase.auth.signOut();
  },
}));
```

### CRUD 훅 패턴
```typescript
export function useItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setItems(data);
      setLoading(false);
    };
    fetch();
  }, []);

  return { items, loading };
}
```

## 산출물
1. 프로젝트 루트에 완전한 React Native 프로젝트 코드
2. `_workspace/04_dev_summary.md`:
   - 구현된 기능 목록
   - 실행 방법 (`npx expo start`)
   - Supabase 환경 설정 가이드
   - 빌드 명령어 (`eas build`)
   - 알려진 제한 사항
