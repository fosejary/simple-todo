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
    searchPlaceholder: '모든 할 일에서 검색',
    searchResults: '전체 검색 결과',
    searchCount: '({{count}}개)',
    sectionOverdue: '지난 할 일',
    moveAllToToday: '모두 오늘로',
    allDoneTitle: '오늘 할 일을 모두 끝냈어요',
    allDoneDesc: '수고했어요. 남은 하루도 편안하게 보내세요',
    progress: '{{done}}/{{total}} 완료',
    searchEmpty: '검색 결과가 없어요',
    allDoneShort: "오늘 할 일을 모두 끝냈어요",
    arcEmpty: "오늘 할 일을 적어보세요",
    remaining: "{{count}}개 남았어요",
    streak: "연속 {{count}}일째",
    remaining_one: "{{count}}개 남았어요",
    streak_one: "연속 {{count}}일째",
  },

  // QuickAddBar
  quickAdd: {
    placeholder: '할 일 추가',
  },

  // TodoItem
  todo: {
    memoPlaceholder: '메모 추가',
    subtaskPlaceholder: '세부 항목 추가',
    detailButton: '마감일 \u00B7 카테고리 \u00B7 색상',
    deleteConfirmTitle: '할 일 삭제',
    deleteConfirmMessage: '이 할 일을 삭제할까요?',
    swipeTomorrow: '내일',
    swipeSkip: "건너뛰기",
  },

  // TodoDetailSheet
  detail: {
    titlePlaceholder: '할 일 제목',
    dueDate: '마감일',
    category: '카테고리',
    recurrence: '반복',
    color: "배경색",
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
    memo: '메모',
    subtasks: '세부 항목',
    pickDate: '날짜 선택',
    noDate: '날짜 없음',
    markImportant: "중요 표시",
    unmarkImportant: "중요 해제",
    nextWeek: "다음 주",
    notificationsOff: "알림이 꺼져 있어요",
    notificationsOffDesc: "시간에 맞춰 알려드리려면 휴대폰 설정에서 Sunlist 알림을 허용해 주세요.",
    openSettings: "설정 열기",
    pickTime: "시간 고르기",
    repeatNone: "안 함",
    skipOccurrence: "이번 회차 건너뛰기",
    time: "알림 시간",
    timeNeedsDate: "날짜를 정하면 알림을 받을 수 있어요",
  },

  // Category tab
  category: {
    title: '카테고리',
    activeCount: '{{count}}개 진행',
    completedCount: '{{count}}개 완료',
    summary: '{{active}}개 진행 \u00B7 {{completed}}개 완료',
    detailSummary: '{{active}}개 진행 중 \u00B7 {{completed}}개 완료',
    uncategorized: '미분류',
    uncategorizedInProgress: '{{count}}개 진행 중',
    uncategorizedEmpty: '미분류 할 일이 없어요',
    addCategory: '카테고리 추가',
    emptyTitle: '카테고리를 만들어보세요',
    emptyDesc: '할 일을 카테고리별로 정리할 수 있어요',
    deleteConfirmTitle: '카테고리 삭제',
    deleteConfirmMessage: '"{{name}}"을(를) 삭제할까요?',
    noTodosTitle: '할 일이 없어요',
    noTodosDesc: '아래에서 이 카테고리에 할 일을 추가하세요',
    addTodoPlaceholder: '{{name}}에 추가',
    uncategorizedAddPlaceholder: '미분류에 추가',
    sectionActive: '진행 중',
    activeCount_one: '{{count}}개 진행',
    completedCount_one: '{{count}}개 완료',
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
    emptyTitle: '할 일이 없습니다',
    emptyDesc: '이 날짜에 등록된 할 일이 없어요',
    addPlaceholder: '이 날짜에 추가',
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
    dataResetDetail: '모든 할 일, 카테고리, 통계 데이터가 삭제됩니다.',
    dataResetFinalConfirm: '정말 초기화할까요?',
    dataResetFinalDetail: '마지막 확인입니다.',
    dataResetButton: '초기화',
    appVersion: '앱 버전',
    privacyPolicy: '개인정보처리방침',
    rateApp: '앱 평가하기',
    backupExport: "백업 파일 만들기",
    backupRestore: "백업에서 복원",
    backupInvalid: "백업 파일을 읽을 수 없어요",
    backupInvalidDetail: "Sunlist에서 만든 백업 파일(.json)을 골라 주세요.",
    exportDialogTitle: "Sunlist 백업 저장",
    exportFailed: "백업 파일을 만들지 못했어요",
    exportFailedDetail: "잠시 후 다시 시도해 주세요.",
    importText: "텍스트로 가져오기",
    notifications: "알림",
    notificationsBlocked: "꺼짐 · 설정에서 허용",
    notificationsOff: "꺼짐",
    notificationsOn: "켜짐",
    restoreButton: "복원",
    restoreConfirmDetail: "할 일 {{todos}}개, 카테고리 {{categories}}개 ({{date}} 백업)\n지금 이 기기의 데이터는 백업 내용으로 바뀌어요.",
    restoreConfirmTitle: "백업에서 복원할까요?",
    adPrivacy: "광고 개인정보 설정",
  },

  // Splash
  splash: {
    tagline: '오늘에 집중하세요',
  },

  // Streak
  streak: {
    days: '일째',
  },

  toast: {
    completed: '완료했어요',
    deleted: '삭제했어요',
    postponed: '내일로 옮겼어요',
    movedToToday: '{{count}}개를 오늘로 옮겼어요',
    undo: '실행 취소',
    imported: "{{count}}개를 가져왔어요",
    restored: "백업을 복원했어요",
    skipped: "다음 회차로 넘겼어요",
    movedToToday_one: '{{count}}개를 오늘로 옮겼어요',
    imported_one: "{{count}}개를 가져왔어요",
  },

  a11y: {
    markComplete: '완료로 표시',
    markIncomplete: '미완료로 표시',
    openDetail: '눌러서 상세 편집',
    toggleSubtasks: '세부 항목 펼치기',
    search: '검색',
    back: '뒤로',
    prevMonth: '이전 달',
    nextMonth: '다음 달',
    close: "닫기",
    important: "중요",
    longPressToEdit: "길게 누르면 수정",
    openDetailOrDrag: "눌러서 상세 편집, 길게 눌러 순서 바꾸기",
  },

  importText: {
    title: "텍스트로 가져오기",
    help: "한 줄에 할 일 하나씩 붙여넣으세요. 다른 앱에서 내보낸 체크리스트(- [ ], [x])도 알아봐요.",
    placeholder: "장보기\n치과 예약\n- [x] 세금계산서 발행",
    submit: "{{count}}개 가져오기",
    submitEmpty: "가져오기",
    targetNoDate: "날짜 없이",
    targetToday: "오늘 할 일로",
  },

  reminder: {
    actionComplete: "완료",
    actionSnooze: "10분 뒤",
    channelDefault: "할 일 알림",
    channelImportant: "중요한 할 일 알림",
  },

  widget: {
    empty: "오늘 할 일이 없어요",
    tapToAdd: "탭해서 추가",
    more: "+{{count}}개 더",
    untitled: "(제목 없음)",
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
    monthDay: 'M월 d일',
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
