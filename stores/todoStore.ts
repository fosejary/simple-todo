import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { randomUUID } from 'expo-crypto';
import { Todo, SubTask, Category, StreakData } from '@/lib/types';
import { format, parseISO, addDays, addWeeks, addMonths } from 'date-fns';
import { updateTodoWidget } from '@/widgets/updateWidget';

interface TodoStore {
  // State
  todos: Todo[];
  categories: Category[];
  streaks: Record<string, StreakData>;
  isFirstLaunch: boolean;

  // Todo Actions
  addTodo: (todo: Partial<Todo>) => string;
  toggleTodo: (id: string) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  moveTodoUp: (id: string) => void;
  moveTodoDown: (id: string) => void;

  // Subtask Actions
  addSubtask: (todoId: string, title: string) => string;
  toggleSubtask: (todoId: string, subtaskId: string) => void;
  deleteSubtask: (todoId: string, subtaskId: string) => void;
  updateSubtask: (todoId: string, subtaskId: string, title: string) => void;
  reorderSubtasks: (todoId: string, subtaskIds: string[]) => void;

  // Category Actions
  addCategory: (name: string, color?: string, icon?: string) => string;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Streak Actions
  updateStreak: (date: string) => void;

  // First Launch
  setFirstLaunchDone: () => void;
}

const todayStr = () => format(new Date(), 'yyyy-MM-dd');

export const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      todos: [],
      categories: [],
      streaks: {},
      isFirstLaunch: true,

      // --- Todo Actions ---

      addTodo: (partial) => {
        const id = randomUUID();
        const now = new Date().toISOString();
        const todo: Todo = {
          id,
          user_id: null,
          title: partial.title || '',
          memo: partial.memo || '',
          is_completed: false,
          completed_at: null,
          due_date: partial.due_date || todayStr(),
          due_time: partial.due_time || null,
          priority: partial.priority || 0,
          color: partial.color || null,
          category_id: partial.category_id || null,
          recurrence: partial.recurrence || null,
          is_deleted: false,
          sort_order: get().todos.length,
          subtasks: [],
          created_at: now,
          updated_at: now,
        };
        set((state) => ({ todos: [...state.todos, todo] }));
        return id;
      },

      toggleTodo: (id) => {
        const todo = get().todos.find((t) => t.id === id);
        if (!todo) return;
        const wasCompleted = todo.is_completed;
        const now = new Date().toISOString();
        set((state) => ({
          todos: state.todos.map((t) =>
            t.id === id
              ? {
                  ...t,
                  is_completed: !t.is_completed,
                  completed_at: !t.is_completed ? now : null,
                  updated_at: now,
                }
              : t
          ),
        }));
        // If completing (not uncompleting) and has recurrence, create the next occurrence
        if (!wasCompleted && todo.recurrence) {
          const baseDate = todo.due_date
            ? parseISO(todo.due_date)
            : new Date();
          let nextDate: Date;
          switch (todo.recurrence.type) {
            case 'daily':
              nextDate = addDays(baseDate, todo.recurrence.interval);
              break;
            case 'weekly':
              nextDate = addWeeks(baseDate, todo.recurrence.interval);
              break;
            case 'monthly':
              nextDate = addMonths(baseDate, todo.recurrence.interval);
              break;
            default:
              nextDate = addDays(baseDate, 1);
              break;
          }
          const newId = get().addTodo({
            title: todo.title,
            due_date: format(nextDate, 'yyyy-MM-dd'),
            category_id: todo.category_id,
            color: todo.color,
            memo: todo.memo,
            recurrence: todo.recurrence,
          });
          // Copy subtasks (reset to uncompleted)
          if (todo.subtasks && todo.subtasks.length > 0) {
            for (const st of todo.subtasks) {
              get().addSubtask(newId, st.title);
            }
          }
        }
        // Update streak
        get().updateStreak(todayStr());
      },

      updateTodo: (id, updates) => {
        const now = new Date().toISOString();
        set((state) => ({
          todos: state.todos.map((t) =>
            t.id === id ? { ...t, ...updates, updated_at: now } : t
          ),
        }));
      },

      deleteTodo: (id) => {
        const now = new Date().toISOString();
        set((state) => ({
          todos: state.todos.map((t) =>
            t.id === id ? { ...t, is_deleted: true, updated_at: now } : t
          ),
        }));
      },

      moveTodoUp: (id) => {
        const todos = get().todos;
        const todo = todos.find((t) => t.id === id);
        if (!todo) return;
        // Find sibling todos with the same due_date, not deleted, not completed
        const siblings = todos
          .filter(
            (t) =>
              !t.is_deleted &&
              !t.is_completed &&
              t.due_date === todo.due_date
          )
          .sort((a, b) => a.sort_order - b.sort_order);
        const idx = siblings.findIndex((t) => t.id === id);
        if (idx <= 0) return; // already at top
        const above = siblings[idx - 1];
        const now = new Date().toISOString();
        // Swap sort_order values
        set((state) => ({
          todos: state.todos.map((t) => {
            if (t.id === id) return { ...t, sort_order: above.sort_order, updated_at: now };
            if (t.id === above.id) return { ...t, sort_order: todo.sort_order, updated_at: now };
            return t;
          }),
        }));
      },

      moveTodoDown: (id) => {
        const todos = get().todos;
        const todo = todos.find((t) => t.id === id);
        if (!todo) return;
        // Find sibling todos with the same due_date, not deleted, not completed
        const siblings = todos
          .filter(
            (t) =>
              !t.is_deleted &&
              !t.is_completed &&
              t.due_date === todo.due_date
          )
          .sort((a, b) => a.sort_order - b.sort_order);
        const idx = siblings.findIndex((t) => t.id === id);
        if (idx < 0 || idx >= siblings.length - 1) return; // already at bottom
        const below = siblings[idx + 1];
        const now = new Date().toISOString();
        // Swap sort_order values
        set((state) => ({
          todos: state.todos.map((t) => {
            if (t.id === id) return { ...t, sort_order: below.sort_order, updated_at: now };
            if (t.id === below.id) return { ...t, sort_order: todo.sort_order, updated_at: now };
            return t;
          }),
        }));
      },

      // --- Subtask Actions ---

      addSubtask: (todoId, title) => {
        const id = randomUUID();
        const now = new Date().toISOString();
        const todo = get().todos.find((t) => t.id === todoId);
        if (!todo) return id;

        const subtask: SubTask = {
          id,
          title,
          is_completed: false,
          sort_order: (todo.subtasks || []).length,
          created_at: now,
        };

        set((state) => ({
          todos: state.todos.map((t) =>
            t.id === todoId
              ? {
                  ...t,
                  subtasks: [...(t.subtasks || []), subtask],
                  updated_at: now,
                }
              : t
          ),
        }));
        return id;
      },

      toggleSubtask: (todoId, subtaskId) => {
        const now = new Date().toISOString();
        set((state) => ({
          todos: state.todos.map((t) =>
            t.id === todoId
              ? {
                  ...t,
                  subtasks: (t.subtasks || []).map((st) =>
                    st.id === subtaskId
                      ? { ...st, is_completed: !st.is_completed }
                      : st
                  ),
                  updated_at: now,
                }
              : t
          ),
        }));
      },

      deleteSubtask: (todoId, subtaskId) => {
        const now = new Date().toISOString();
        set((state) => ({
          todos: state.todos.map((t) =>
            t.id === todoId
              ? {
                  ...t,
                  subtasks: (t.subtasks || []).filter(
                    (st) => st.id !== subtaskId
                  ),
                  updated_at: now,
                }
              : t
          ),
        }));
      },

      updateSubtask: (todoId, subtaskId, title) => {
        const now = new Date().toISOString();
        set((state) => ({
          todos: state.todos.map((t) =>
            t.id === todoId
              ? {
                  ...t,
                  subtasks: (t.subtasks || []).map((st) =>
                    st.id === subtaskId ? { ...st, title } : st
                  ),
                  updated_at: now,
                }
              : t
          ),
        }));
      },

      reorderSubtasks: (todoId, subtaskIds) => {
        const now = new Date().toISOString();
        set((state) => ({
          todos: state.todos.map((t) => {
            if (t.id !== todoId) return t;
            const subtasks = (t.subtasks || [])
              .slice()
              .sort(
                (a, b) =>
                  subtaskIds.indexOf(a.id) - subtaskIds.indexOf(b.id)
              )
              .map((st, idx) => ({ ...st, sort_order: idx }));
            return { ...t, subtasks, updated_at: now };
          }),
        }));
      },

      // --- Category Actions ---

      addCategory: (name, color = '#2563EB', icon = 'folder') => {
        const id = randomUUID();
        const now = new Date().toISOString();
        const category: Category = {
          id,
          user_id: null,
          name,
          color,
          icon,
          sort_order: get().categories.length,
          created_at: now,
          updated_at: now,
        };
        set((state) => ({ categories: [...state.categories, category] }));
        return id;
      },

      updateCategory: (id, updates) => {
        const now = new Date().toISOString();
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...updates, updated_at: now } : c
          ),
        }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
          todos: state.todos.map((t) =>
            t.category_id === id ? { ...t, category_id: null } : t
          ),
        }));
      },

      // --- Streak Actions ---

      updateStreak: (date) => {
        const todos = get().todos.filter(
          (t) => t.due_date === date && !t.is_deleted
        );

        const streakData: StreakData = {
          date,
          todos_completed: todos.filter((t) => t.is_completed).length,
          todos_total: todos.length,
        };

        set((state) => ({
          streaks: { ...state.streaks, [date]: streakData },
        }));
      },

      // --- First Launch ---

      setFirstLaunchDone: () => {
        set({ isFirstLaunch: false });
      },

    }),
    {
      name: '@simpletodo/todos',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => {
        return (state) => {
          if (!state) return;
          const now = Date.now();
          const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
          state.todos = state.todos.filter((t) => {
            if (!t.is_deleted) return true;
            const updatedAt = new Date(t.updated_at).getTime();
            return now - updatedAt < SEVEN_DAYS_MS;
          });
        };
      },
    }
  )
);

// Subscribe to todo changes and update the Android home screen widget.
// The widget reads from AsyncStorage, which zustand/persist writes to,
// so we just need to trigger a re-render after the persist completes.
useTodoStore.subscribe(
  (state, prevState) => {
    if (state.todos !== prevState.todos) {
      // Small delay to ensure AsyncStorage persist has flushed
      setTimeout(() => {
        updateTodoWidget();
      }, 500);
    }
  }
);
