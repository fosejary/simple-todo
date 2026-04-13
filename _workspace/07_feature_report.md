# 기능 확장 보고서

## 추가된 기능 목록

### 기능 1: 서브태스크 (세부항목/체크리스트)

할일(Todo) 하나에 여러 서브태스크를 추가하여 세부 진행 상황을 관리할 수 있는 기능.

#### 추가된 파일

| 파일 | 설명 |
|------|------|
| `components/atoms/SubtaskProgress.tsx` | 서브태스크 진행률 표시 atom (아이콘 + "2/5" 텍스트) |
| `components/molecules/SubtaskSection.tsx` | TodoDetailSheet 내 서브태스크 관리 섹션 (추가/토글/삭제 + 프로그레스바) |
| `supabase/migrations/002_subtasks.sql` | Supabase subtasks 테이블 + RLS 정책 마이그레이션 |

#### 수정된 파일

| 파일 | 변경 내용 |
|------|-----------|
| `lib/types.ts` | `SubTask` 인터페이스 추가, `Todo` 인터페이스에 `subtasks: SubTask[]` 필드 추가 |
| `stores/todoStore.ts` | `SubTask` import, 5개 서브태스크 액션 추가 (addSubtask, toggleSubtask, deleteSubtask, updateSubtask, reorderSubtasks), addTodo에 `subtasks: []` 기본값 |
| `components/organisms/TodoDetailSheet.tsx` | SubtaskSection import 및 PropertyRow(오늘 집중) 아래에 서브태스크 섹션 렌더링 추가 |
| `components/molecules/TodoItem.tsx` | SubtaskProgress import 및 meta 영역에 서브태스크 진행률 표시 추가 |
| `components/organisms/DailyFocusCard.tsx` | SubtaskProgress import 및 포커스 할일 제목 옆에 진행률 표시 추가 |

#### DB 변경사항

- **subtasks 테이블 신규 생성** (002_subtasks.sql)
  - `id` (UUID PK), `todo_id` (FK -> todos), `user_id` (FK -> auth.users), `title`, `is_completed`, `sort_order`, `created_at`
  - 인덱스: todo_id, user_id, (todo_id, sort_order)
  - RLS: 사용자 본인 데이터만 CRUD 가능
- **참고**: 현재 MVP는 로컬 Zustand persist (AsyncStorage) 사용. subtasks는 Todo 객체 내 배열로 저장됨. Supabase 연동 시 별도 테이블로 분리하여 사용.

#### 테스트 방법

1. **서브태스크 추가**: 할일 탭 -> 상세 바텀시트 열기 -> "세부항목 추가..." 입력 필드에 텍스트 입력 후 Enter
2. **서브태스크 완료 토글**: 서브태스크 좌측 체크박스 탭 -> 완료 시 취소선 + 하단으로 이동
3. **서브태스크 삭제**: 서브태스크 우측 X 버튼 탭
4. **진행률 표시 (TodoItem)**: 서브태스크가 있는 할일 -> 목록에서 제목 우측 meta 영역에 "2/5" 형태로 표시
5. **진행률 표시 (DailyFocusCard)**: 서브태스크가 있는 포커스 할일 -> 제목 우측에 진행률 표시
6. **프로그레스바**: 바텀시트 서브태스크 섹션 상단에 완료율 프로그레스바 표시
7. **기존 기능 정상 동작 확인**: 서브태스크 없는 할일의 동작이 변경 없이 정상 작동하는지 확인

## 미구현 기능 (사유)

- **서브태스크 드래그 순서 변경**: `reorderSubtasks` 스토어 액션은 구현됨. UI 드래그 핸들은 Phase 2 UX 개선 시 react-native-draggable-flatlist 등으로 구현 예정.
- **서브태스크 제목 인라인 수정**: `updateSubtask` 스토어 액션은 구현됨. UI에서의 인라인 편집은 후속 UX 개선 시 추가 예정.

## 데이터 모델 변경 이력

| 일자 | 변경 | 마이그레이션 |
|------|------|-------------|
| 2026-04-06 | SubTask 인터페이스 추가, Todo.subtasks 필드 추가, subtasks 테이블 생성 | 002_subtasks.sql |
