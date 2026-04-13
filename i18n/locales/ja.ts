import type { TranslationKeys } from './ko';

const ja: TranslationKeys = {
  tabs: {
    today: '今日',
    category: 'カテゴリ',
    calendar: 'カレンダー',
    settings: '設定',
  },

  today: {
    greeting: {
      morning: 'おはようございます',
      afternoon: 'こんにちは',
      evening: 'こんばんは',
      night: 'おやすみなさい',
    },
    sectionActive: '今日のタスク',
    sectionCompleted: '完了',
    emptyTitle: '今日は何をしますか?',
    emptyDesc: '下からタスクを追加しましょう',
    searchPlaceholder: 'タスクを検索...',
    searchResults: '検索結果',
    searchCount: '({{count}}件)',
  },

  quickAdd: {
    placeholder: 'タスクを入力...',
  },

  todo: {
    memoPlaceholder: 'メモを追加...',
    subtaskPlaceholder: 'サブタスクを追加...',
    detailButton: '期限 \u00B7 カテゴリ \u00B7 色',
    deleteConfirmTitle: 'タスクの削除',
    deleteConfirmMessage: 'このタスクを削除しますか?',
  },

  detail: {
    titlePlaceholder: 'タスクのタイトル',
    dueDate: '期限',
    category: 'カテゴリ',
    recurrence: '繰り返し',
    color: '色',
    delete: '削除',
    none: 'なし',
    today: '今日',
    tomorrow: '明日',
    calendar: 'カレンダー',
    daily: '毎日',
    weekly: '毎週',
    monthly: '毎月',
    add: '追加',
    categoryNamePlaceholder: 'カテゴリ名',
  },

  category: {
    title: 'カテゴリ',
    activeCount: '{{count}}件 進行中',
    completedCount: '{{count}}件 完了',
    summary: '{{active}}件 進行中 \u00B7 {{completed}}件 完了',
    detailSummary: '{{active}}件 進行中 \u00B7 {{completed}}件 完了',
    uncategorized: '未分類',
    uncategorizedInProgress: '{{count}}件 進行中',
    uncategorizedEmpty: '未分類のタスクはありません',
    addCategory: 'カテゴリを追加',
    emptyTitle: 'カテゴリを作りましょう',
    emptyDesc: 'カテゴリ別にタスクを整理できます',
    deleteConfirmTitle: 'カテゴリの削除',
    deleteConfirmMessage: '「{{name}}」を削除しますか?',
    noTodosTitle: 'タスクはありません',
    noTodosDesc: '下からこのカテゴリにタスクを追加してください',
    addTodoPlaceholder: '{{name}}に追加...',
    uncategorizedAddPlaceholder: '未分類タスクを追加...',
  },

  categoryEditor: {
    new: '新しいカテゴリ',
    edit: 'カテゴリを編集',
    namePlaceholder: 'カテゴリ名',
    icon: 'アイコン',
    color: '色',
    save: '保存',
  },

  calendar: {
    title: 'カレンダー',
    emptyTitle: 'タスクはありません',
    emptyDesc: 'この日のタスクはありません',
    addPlaceholder: 'この日にタスクを追加...',
    dayLabels: ['日', '月', '火', '水', '木', '金', '土'],
  },

  settings: {
    title: '設定',
    sectionGeneral: '一般',
    sectionData: 'データ',
    sectionInfo: '情報',
    theme: 'テーマ',
    themeLight: 'ライト',
    themeDark: 'ダーク',
    themeSystem: 'システム設定',
    dataReset: 'データの初期化',
    dataResetConfirm: 'すべてのデータが削除されます。本当にリセットしますか?',
    dataResetTitle: 'データの初期化',
    dataResetDetail: 'すべてのタスク、カテゴリ、統計データが削除されます。',
    dataResetFinalConfirm: '本当にリセットしますか?',
    dataResetFinalDetail: '最後の確認です。',
    dataResetButton: 'リセット',
    appVersion: 'アプリバージョン',
  },

  splash: {
    tagline: '今日に集中しよう',
  },

  streak: {
    days: '日目',
  },

  common: {
    cancel: 'キャンセル',
    delete: '削除',
    confirm: '確認',
  },

  dateFormat: {
    monthYear: 'yyyy年 M月',
    monthDayWeekday: 'M月 d日 EEEE',
  },
} as const;

export default ja;
