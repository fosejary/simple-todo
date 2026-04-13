import type { TranslationKeys } from './ko';

const en: TranslationKeys = {
  tabs: {
    today: 'Today',
    category: 'Category',
    calendar: 'Calendar',
    settings: 'Settings',
  },

  today: {
    greeting: {
      morning: 'Good morning',
      afternoon: 'Good afternoon',
      evening: 'Good evening',
      night: 'Good night',
    },
    sectionActive: "Today's tasks",
    sectionCompleted: 'Completed',
    emptyTitle: 'What will you do today?',
    emptyDesc: 'Add a task below',
    searchPlaceholder: 'Search tasks...',
    searchResults: 'Search results',
    searchCount: '({{count}})',
  },

  quickAdd: {
    placeholder: 'Add a task...',
  },

  todo: {
    memoPlaceholder: 'Add a note...',
    subtaskPlaceholder: 'Add subtask...',
    detailButton: 'Due \u00B7 Category \u00B7 Color',
    deleteConfirmTitle: 'Delete task',
    deleteConfirmMessage: 'Delete this task?',
  },

  detail: {
    titlePlaceholder: 'Task title',
    dueDate: 'Due date',
    category: 'Category',
    recurrence: 'Repeat',
    color: 'Color',
    delete: 'Delete',
    none: 'None',
    today: 'Today',
    tomorrow: 'Tomorrow',
    calendar: 'Calendar',
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    add: 'Add',
    categoryNamePlaceholder: 'Category name',
  },

  category: {
    title: 'Categories',
    activeCount: '{{count}} active',
    completedCount: '{{count}} done',
    summary: '{{active}} active \u00B7 {{completed}} done',
    detailSummary: '{{active}} active \u00B7 {{completed}} completed',
    uncategorized: 'Uncategorized',
    uncategorizedInProgress: '{{count}} in progress',
    uncategorizedEmpty: 'No uncategorized tasks',
    addCategory: 'Add category',
    emptyTitle: 'Create a category',
    emptyDesc: 'Organize tasks by category',
    deleteConfirmTitle: 'Delete category',
    deleteConfirmMessage: 'Delete "{{name}}"?',
    noTodosTitle: 'No tasks yet',
    noTodosDesc: 'Add a task to this category below',
    addTodoPlaceholder: 'Add to {{name}}...',
    uncategorizedAddPlaceholder: 'Add uncategorized task...',
  },

  categoryEditor: {
    new: 'New category',
    edit: 'Edit category',
    namePlaceholder: 'Category name',
    icon: 'Icon',
    color: 'Color',
    save: 'Save',
  },

  calendar: {
    title: 'Calendar',
    emptyTitle: 'No tasks',
    emptyDesc: 'No tasks for this date',
    addPlaceholder: 'Add task for this date...',
    dayLabels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  },

  settings: {
    title: 'Settings',
    sectionGeneral: 'General',
    sectionData: 'Data',
    sectionInfo: 'Info',
    theme: 'Theme',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeSystem: 'System',
    dataReset: 'Reset data',
    dataResetConfirm: 'All data will be deleted. Are you sure?',
    dataResetTitle: 'Reset data',
    dataResetDetail: 'All tasks, categories, and stats will be deleted.',
    dataResetFinalConfirm: 'Are you sure?',
    dataResetFinalDetail: 'This is the final confirmation.',
    dataResetButton: 'Reset',
    appVersion: 'App version',
  },

  splash: {
    tagline: 'Focus on today',
  },

  streak: {
    days: 'days',
  },

  common: {
    cancel: 'Cancel',
    delete: 'Delete',
    confirm: 'OK',
  },

  dateFormat: {
    monthYear: 'MMMM yyyy',
    monthDayWeekday: 'EEEE, MMMM d',
  },
} as const;

export default en;
