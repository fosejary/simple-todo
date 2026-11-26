import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { randomUUID } from 'expo-crypto';
import { format } from 'date-fns';
import { Todo, SubTask, Category, StreakData } from '@/lib/types';
import { nextOccurrence } from '@/lib/recurrence';
import { updateTodoWidget } from '@/widgets/updateWidget';

export interface ImportItem {
  title: string;
  completed?: boolean;
}

interface TodoStore {
  // State
  todos: Todo[];
  categories: Category[];
  streaks: Record<string, StreakData>;
  isFirstLaunch: boolean;

  // Todo Actions
  addTodo: (todo: Partial<Todo>) => string;
  /** Returns the id of the next occurrence created for a recurring todo, if any. */
  toggleTodo: (id: string) => string | null;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  restoreTodo: (id: string) => void;
  moveTodosToDate: (ids: string[], date: string) => void;
  /** Recurring todo: move this one to its next occurrence without completing it. */
  skipOccurrence: (id: string) => string | null;
  /** Persist a manual order for the given todos (e.g. after a drag). */
  reorderTodos: (orderedIds: string[]) => void;
  importTodos: (items: ImportItem[], opts: { due_date: string | null }) => number;
  replaceAll: (data: { todos: Todo[]; categories: Category[]; streaks: Record<string, StreakData> }) => void;

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
const nowIso = () => new Date().toISOString();
const nextSortOrder = (todos: Todo[]) =>
  todos.reduce((max, t) => Math.max(max, t.sort_order), -1) + 1;

export const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => {
      /** An open copy of a recurring todo already waits on `date`. */
      const hasOccurrenceOn = (todo: Todo, date: string) =>
        get().todos.some(
          (t) =>
            !t.is_deleted &&
            t.id !== todo.id &&
            t.title === todo.title &&
            t.due_date === date &&
            t.recurrence?.type === todo.recurrence?.type
        );

      const patch = (id: string, updates: Partial<Todo>) =>
        set((state) => ({
          todos: state.todos.map((t) => (t.id === id ? { ...t, ...updates, updated_at: nowIso() } : t)),
        }));

      return {
        todos: [],
        categories: [],
        streaks: {},
        isFirstLaunch: true,

        // --- Todo Actions ---

        addTodo: (partial) => {
          const id = randomUUID();
          const now = nowIso();
          const todo: Todo = {
            id,
            user_id: null,
            title: partial.title || '',
            memo: partial.memo || '',
            is_completed: !!partial.is_completed,
            completed_at: partial.is_completed ? now : null,
            // `null` means "no date"; omitted means today.
            due_date: partial.due_date !== undefined ? partial.due_date : todayStr(),
            due_time: partial.due_time || null,
            priority: partial.priority || 0,
            color: partial.color || null,
            category_id: partial.category_id || null,
            recurrence: partial.recurrence || null,
            is_deleted: false,
            sort_order: nextSortOrder(get().todos),
            subtasks: [],
            snooze_until: null,
            created_at: now,
            updated_at: now,
          };
          set((state) => ({ todos: [...state.todos, todo] }));
          return id;
        },

        toggleTodo: (id) => {
          const todo = get().todos.find((t) => t.id === id);
          if (!todo) return null;
          const completing = !todo.is_completed;
          const now = nowIso();
          patch(id, {
            is_completed: completing,
            completed_at: completing ? now : null,
            snooze_until: null,
          });

          let spawnedId: string | null = null;
          if (completing && todo.recurrence) {
            const nextDue = nextOccurrence(todo.due_date, todo.recurrence);
            // Un-checking and re-checking must not stack duplicate next occurrences.
            if (!hasOccurrenceOn(todo, nextDue)) {
              spawnedId = get().addTodo({
                title: todo.title,
                due_date: nextDue,
                due_time: todo.due_time,
                priority: todo.priority,
                category_id: todo.category_id,
                color: todo.color,
                memo: todo.memo,
                recurrence: todo.recurrence,
              });
              for (const st of todo.subtasks ?? []) {
                get().addSubtask(spawnedId, st.title);
              }
            }
          }
          get().updateStreak(todayStr());
          return spawnedId;
        },

        updateTodo: (id, updates) => {
          // A new date or time replaces any pending snooze.
          const resetSnooze =
            ('due_date' in updates || 'due_time' in updates) && !('snooze_until' in updates)
              ? { snooze_until: null }
              : {};
          patch(id, { ...updates, ...resetSnooze });
        },

        deleteTodo: (id) => patch(id, { is_deleted: true }),

        restoreTodo: (id) => patch(id, { is_deleted: false }),

        moveTodosToDate: (ids, date) => {
          const idSet = new Set(ids);
          const now = nowIso();
          set((state) => ({
            todos: state.todos.map((t) =>
              idSet.has(t.id) ? { ...t, due_date: date, snooze_until: null, updated_at: now } : t
            ),
          }));
        },

        skipOccurrence: (id) => {
          const todo = get().todos.find((t) => t.id === id);
          if (!todo?.recurrence) return null;
          const nextDue = nextOccurrence(todo.due_date ?? todayStr(), todo.recurrence);
          if (hasOccurrenceOn(todo, nextDue)) {
            patch(id, { is_deleted: true });
          } else {
            patch(id, { due_date: nextDue, snooze_until: null });
          }
          return nextDue;
        },

        reorderTodos: (orderedIds) => {
          const byId = new Map(get().todos.map((t) => [t.id, t]));
          // Reuse the group's existing slots so items outside the group keep their place.
          const slots = orderedIds
            .map((id) => byId.get(id)?.sort_order)
            .filter((n): n is number => n !== undefined)
            .sort((a, b) => a - b);
          if (slots.length !== orderedIds.length) return;
          const next = new Map(orderedIds.map((id, i) => [id, slots[i]]));
          const now = nowIso();
          set((state) => ({
            todos: state.todos.map((t) =>
              next.has(t.id) && next.get(t.id) !== t.sort_order
                ? { ...t, sort_order: next.get(t.id)!, updated_at: now }
                : t
            ),
          }));
        },

        importTodos: (items, opts) => {
          let count = 0;
          for (const item of items) {
            const title = item.title.trim();
            if (!title) continue;
            get().addTodo({ title, due_date: opts.due_date, is_completed: !!item.completed });
            count++;
          }
          return count;
        },

        replaceAll: ({ todos, categories, streaks }) => {
          set({ todos, categories, streaks });
        },

        // --- Subtask Actions ---

        addSubtask: (todoId, title) => {
          const id = randomUUID();
          const todo = get().todos.find((t) => t.id === todoId);
          if (!todo) return id;
          const subtask: SubTask = {
            id,
            title,
            is_completed: false,
            sort_order: (todo.subtasks || []).length,
            created_at: nowIso(),
          };
          patch(todoId, { subtasks: [...(todo.subtasks || []), subtask] });
          return id;
        },

        toggleSubtask: (todoId, subtaskId) => {
          const todo = get().todos.find((t) => t.id === todoId);
          if (!todo) return;
          patch(todoId, {
            subtasks: (todo.subtasks || []).map((st) =>
              st.id === subtaskId ? { ...st, is_completed: !st.is_completed } : st
            ),
          });
        },

        deleteSubtask: (todoId, subtaskId) => {
          const todo = get().todos.find((t) => t.id === todoId);
          if (!todo) return;
          patch(todoId, { subtasks: (todo.subtasks || []).filter((st) => st.id !== subtaskId) });
        },

        updateSubtask: (todoId, subtaskId, title) => {
          const todo = get().todos.find((t) => t.id === todoId);
          if (!todo) return;
          patch(todoId, {
            subtasks: (todo.subtasks || []).map((st) => (st.id === subtaskId ? { ...st, title } : st)),
          });
        },

        reorderSubtasks: (todoId, subtaskIds) => {
          const todo = get().todos.find((t) => t.id === todoId);
          if (!todo) return;
          const subtasks = (todo.subtasks || [])
            .slice()
            .sort((a, b) => subtaskIds.indexOf(a.id) - subtaskIds.indexOf(b.id))
            .map((st, idx) => ({ ...st, sort_order: idx }));
          patch(todoId, { subtasks });
        },

        // --- Category Actions ---

        addCategory: (name, color = '#5677CF', icon = 'folder') => {
          const id = randomUUID();
          const now = nowIso();
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
          const now = nowIso();
          set((state) => ({
            categories: state.categories.map((c) =>
              c.id === id ? { ...c, ...updates, updated_at: now } : c
            ),
          }));
        },

        deleteCategory: (id) => {
          set((state) => ({
            categories: state.categories.filter((c) => c.id !== id),
            todos: state.todos.map((t) => (t.category_id === id ? { ...t, category_id: null } : t)),
          }));
        },

        // --- Streak Actions ---

        updateStreak: (date) => {
          const todos = get().todos.filter((t) => t.due_date === date && !t.is_deleted);
          const streakData: StreakData = {
            date,
            todos_completed: todos.filter((t) => t.is_completed).length,
            todos_total: todos.length,
          };
          set((state) => ({ streaks: { ...state.streaks, [date]: streakData } }));
        },

        // --- First Launch ---

        setFirstLaunchDone: () => {
          set({ isFirstLaunch: false });
        },
      };
    },
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

/** Resolves once persisted todos are loaded (also usable from headless tasks). */
export function whenTodosHydrated(): Promise<void> {
  if (useTodoStore.persist.hasHydrated()) return Promise.resolve();
  return new Promise((resolve) => {
    const unsub = useTodoStore.persist.onFinishHydration(() => {
      unsub();
      resolve();
    });
  });
}

// Keep the Android home screen widget in sync. The widget reads AsyncStorage,
// which zustand/persist writes to, so refresh shortly after each change.
useTodoStore.subscribe((state, prevState) => {
  if (state.todos !== prevState.todos) {
    setTimeout(() => {
      updateTodoWidget();
    }, 500);
  }
});
