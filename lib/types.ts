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
  due_time: string | null; // HH:mm
  priority: 0 | 1 | 2; // kept for backward compat, unused in UI
  color: string | null; // pastel hex color
  category_id: string | null;
  recurrence: Recurrence | null;
  is_deleted: boolean;
  sort_order: number;
  subtasks: SubTask[];
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

// Category auto-assign color palette
export const CATEGORY_COLORS = [
  '#2563EB', '#7C3AED', '#10B981', '#F59E0B', '#EF4444',
  '#EC4899', '#06B6D4', '#8B5CF6', '#F97316', '#14B8A6',
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

