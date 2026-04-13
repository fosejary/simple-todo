const ko = {
  // Tab names
  tabs: {
    today: '오늘',
    category: '카테고리',
    calendar: '캘린더',
    settings: '설정',
  },

  // Today tab
  today: {
    greeting: {
      morning: '좋은 아침이에요',
      afternoon: '좋은 오후예요',
      evening: '좋은 저녁이에요',
      night: '편안한 밤이에요',
    },
    sectionActive: '오늘 할 일',
    sectionCompleted: '완료됨',
    emptyTitle: '오늘은 어떤 일을 할까요?',
    emptyDesc: '아래에서 할 일을 추가해보세요',
    searchPlaceholder: '할일 검색...',
    searchResults: '전체 검색 결과',
    searchCount: '({{count}}개)',
  },

  // QuickAddBar
  quickAdd: {
    placeholder: '할 일을 입력하세요...',
  },

  // TodoItem
  todo: {
    memoPlaceholder: '메모 추가...',
    subtaskPlaceholder: '세부항목 추가...',
    detailButton: '마감일 \u00B7 카테고리 \u00B7 색상',
    deleteConfirmTitle: '할일 삭제',
    deleteConfirmMessage: '이 할일을 삭제할까요?',
  },

  // TodoDetailSheet
  detail: {
    titlePlaceholder: '할일 제목',
    dueDate: '마감일',
    category: '카테고리',
    recurrence: '반복',
    color: '색상',
    delete: '삭제',
    none: '없음',
    today: '오늘',
    tomorrow: '내일',
    calendar: '달력',
    daily: '매일',
    weekly: '매주',
    monthly: '매월',
    add: '추가',
    categoryNamePlaceholder: '카테고리 이름',
  },

  // Category tab
  category: {
    title: '카테고리',
    activeCount: '{{count}}개 진행',
    completedCount: '{{count}} 완료',
    summary: '{{active}}개 진행 \u00B7 {{completed}}개 완료',
    detailSummary: '{{active}}개 진행 중 \u00B7 {{completed}}개 완료',
    uncategorized: '미분류',
    uncategorizedInProgress: '{{count}}개 진행 중',
    uncategorizedEmpty: '미분류 할일이 없어요',
    addCategory: '카테고리 추가',
    emptyTitle: '카테고리를 만들어보세요',
    emptyDesc: '할일을 카테고리별로 정리할 수 있어요',
    deleteConfirmTitle: '카테고리 삭제',
    deleteConfirmMessage: '"{{name}}"을(를) 삭제할까요?',
    noTodosTitle: '할일이 없어요',
    noTodosDesc: '아래에서 이 카테고리에 할일을 추가하세요',
    addTodoPlaceholder: '{{name}}에 추가...',
    uncategorizedAddPlaceholder: '미분류 할일 추가...',
  },

  // CategoryEditor
  categoryEditor: {
    new: '새 카테고리',
    edit: '카테고리 수정',
    namePlaceholder: '카테고리 이름',
    icon: '아이콘',
    color: '색상',
    save: '저장',
  },

  // Calendar
  calendar: {
    title: '캘린더',
    emptyTitle: '할일이 없습니다',
    emptyDesc: '이 날짜에 등록된 할일이 없어요',
    addPlaceholder: '이 날짜에 할일 추가...',
    dayLabels: ['일', '월', '화', '수', '목', '금', '토'],
  },

  // Settings
  settings: {
    title: '설정',
    sectionGeneral: '일반',
    sectionData: '데이터',
    sectionInfo: '정보',
    theme: '테마',
    themeLight: '라이트',
    themeDark: '다크',
    themeSystem: '시스템 설정',
    dataReset: '데이터 초기화',
    dataResetConfirm: '모든 데이터가 삭제됩니다. 정말 초기화할까요?',
    dataResetTitle: '데이터 초기화',
    dataResetDetail: '모든 할일, 카테고리, 통계 데이터가 삭제됩니다.',
    dataResetFinalConfirm: '정말 초기화할까요?',
    dataResetFinalDetail: '마지막 확인입니다.',
    dataResetButton: '초기화',
    appVersion: '앱 버전',
  },

  // Splash
  splash: {
    tagline: '오늘에 집중하세요',
  },

  // Streak
  streak: {
    days: '일째',
  },

  // Common
  common: {
    cancel: '취소',
    delete: '삭제',
    confirm: '확인',
  },

  // Date formats (for date-fns)
  dateFormat: {
    monthYear: 'yyyy년 M월',
    monthDayWeekday: 'M월 d일 EEEE',
  },
} as const;

export default ko;

/** Recursively widen literal string / readonly-array types to string / string[]. */
type Widen<T> = T extends readonly string[]
  ? string[]
  : T extends string
    ? string
    : T extends Record<string, unknown>
      ? { [K in keyof T]: Widen<T[K]> }
      : T;

export type TranslationKeys = Widen<typeof ko>;
