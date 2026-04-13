import type { TranslationKeys } from './ko';

const es: TranslationKeys = {
  tabs: {
    today: 'Hoy',
    category: 'Categoria',
    calendar: 'Calendario',
    settings: 'Ajustes',
  },

  today: {
    greeting: {
      morning: 'Buenos dias',
      afternoon: 'Buenas tardes',
      evening: 'Buenas noches',
      night: 'Buenas noches',
    },
    sectionActive: 'Tareas de hoy',
    sectionCompleted: 'Completado',
    emptyTitle: 'Que haras hoy?',
    emptyDesc: 'Anade una tarea abajo',
    searchPlaceholder: 'Buscar tareas...',
    searchResults: 'Resultados de busqueda',
    searchCount: '({{count}})',
  },

  quickAdd: {
    placeholder: 'Anadir tarea...',
  },

  todo: {
    memoPlaceholder: 'Anadir nota...',
    subtaskPlaceholder: 'Anadir subtarea...',
    detailButton: 'Fecha \u00B7 Categoria \u00B7 Color',
    deleteConfirmTitle: 'Eliminar tarea',
    deleteConfirmMessage: 'Eliminar esta tarea?',
  },

  detail: {
    titlePlaceholder: 'Titulo de la tarea',
    dueDate: 'Fecha limite',
    category: 'Categoria',
    recurrence: 'Repetir',
    color: 'Color',
    delete: 'Eliminar',
    none: 'Ninguno',
    today: 'Hoy',
    tomorrow: 'Manana',
    calendar: 'Calendario',
    daily: 'Diario',
    weekly: 'Semanal',
    monthly: 'Mensual',
    add: 'Anadir',
    categoryNamePlaceholder: 'Nombre de categoria',
  },

  category: {
    title: 'Categorias',
    activeCount: '{{count}} activas',
    completedCount: '{{count}} completadas',
    summary: '{{active}} activas \u00B7 {{completed}} completadas',
    detailSummary: '{{active}} activas \u00B7 {{completed}} completadas',
    uncategorized: 'Sin categoria',
    uncategorizedInProgress: '{{count}} en progreso',
    uncategorizedEmpty: 'No hay tareas sin categoria',
    addCategory: 'Anadir categoria',
    emptyTitle: 'Crea una categoria',
    emptyDesc: 'Organiza tareas por categoria',
    deleteConfirmTitle: 'Eliminar categoria',
    deleteConfirmMessage: 'Eliminar "{{name}}"?',
    noTodosTitle: 'Sin tareas',
    noTodosDesc: 'Anade una tarea a esta categoria abajo',
    addTodoPlaceholder: 'Anadir a {{name}}...',
    uncategorizedAddPlaceholder: 'Anadir tarea sin categoria...',
  },

  categoryEditor: {
    new: 'Nueva categoria',
    edit: 'Editar categoria',
    namePlaceholder: 'Nombre de categoria',
    icon: 'Icono',
    color: 'Color',
    save: 'Guardar',
  },

  calendar: {
    title: 'Calendario',
    emptyTitle: 'Sin tareas',
    emptyDesc: 'No hay tareas para esta fecha',
    addPlaceholder: 'Anadir tarea para esta fecha...',
    dayLabels: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
  },

  settings: {
    title: 'Ajustes',
    sectionGeneral: 'General',
    sectionData: 'Datos',
    sectionInfo: 'Informacion',
    theme: 'Tema',
    themeLight: 'Claro',
    themeDark: 'Oscuro',
    themeSystem: 'Sistema',
    dataReset: 'Restablecer datos',
    dataResetConfirm: 'Se eliminaran todos los datos. Estas seguro?',
    dataResetTitle: 'Restablecer datos',
    dataResetDetail: 'Se eliminaran todas las tareas, categorias y estadisticas.',
    dataResetFinalConfirm: 'Estas seguro?',
    dataResetFinalDetail: 'Ultima confirmacion.',
    dataResetButton: 'Restablecer',
    appVersion: 'Version de la app',
  },

  splash: {
    tagline: 'Concentrate en hoy',
  },

  streak: {
    days: 'dias',
  },

  common: {
    cancel: 'Cancelar',
    delete: 'Eliminar',
    confirm: 'Confirmar',
  },

  dateFormat: {
    monthYear: 'MMMM yyyy',
    monthDayWeekday: "EEEE, d 'de' MMMM",
  },
} as const;

export default es;
