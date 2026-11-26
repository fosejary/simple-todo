// Core data types matching Supabase schema

export interface SubTask {
  id: string;
  title: string;
  is_completed: boolean;
  sort_order: number;
  created_at: string;
}

export interface Todo {
  id: string;
  user_id: string | null;
  title: string;
  memo: string;
  is_completed: boolean;
  completed_at: string | null;
  due_date: string | null; // YYYY-MM-DD
  due_time: string | null; // HH:mm — reminder time on due_date
  priority: 0 | 1 | 2; // 0 = normal, 1+ = important (starred)
  color: string | null; // pastel hex color
  category_id: string | null;
  recurrence: Recurrence | null;
  is_deleted: boolean;
  sort_order: number;
  subtasks: SubTask[];
  /** ISO time a snoozed reminder should fire again ("10분 뒤"). */
  snooze_until?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Recurrence {
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  interval: number;
  days_of_week?: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  end_date?: string;
}

export interface Category {
  id: string;
  user_id: string | null;
  name: string;
  color: string;
  icon: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
}

export interface StreakData {
  date: string; // YYYY-MM-DD
  todos_completed: number;
  todos_total: number;
}

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'system',
};

// Pastel color palette for todos (compact: 5 colors + null)
export const PASTEL_COLORS = [
  null,       // no color (default)
  '#FFD1DC', // pink
  '#FFF3B0', // yellow
  '#D4EDDA', // green
  '#CCE5FF', // blue
  '#E8DAEF', // lavender
] as const;

// Category auto-assign color palette (toned to sit inside the warm-neutral UI)
export const CATEGORY_COLORS = [
  '#5677CF', '#D0627F', '#3E9A74', '#8466C9', '#D99A2B',
  '#2F9BB3', '#C8613A', '#7A8B3A', '#B05FA8', '#5E6E85',
] as const;

// Icon palette for categories (MaterialIcons names)
export const CATEGORY_ICONS = [
  // Work & Productivity
  'work', 'assignment', 'trending-up', 'computer', 'edit-note',
  // Home & Life
  'home', 'shopping-cart', 'restaurant', 'people', 'cleaning-services',
  // Health & Fitness
  'fitness-center', 'directions-run', 'self-improvement', 'favorite', 'local-hospital',
  // Education & Growth
  'menu-book', 'school', 'draw', 'psychology', 'lightbulb',
  // Hobbies
  'palette', 'music-note', 'sports-esports', 'camera-alt', 'eco',
  // Finance & Travel
  'account-balance-wallet', 'flight', 'directions-car', 'savings', 'gps-fixed',
  // Social & Misc
  'pets', 'star', 'card-giftcard', 'notifications', 'auto-awesome',
] as const;

