import { useCallback } from 'react';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { addDays, format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useTodoStore } from '@/stores/todoStore';
import { showToast } from '@/stores/toastStore';

const haptic = (style: Haptics.ImpactFeedbackStyle) => {
  if (Platform.OS !== 'web') Haptics.impactAsync(style).catch(() => {});
};

/**
 * Todo mutations that the UI triggers directly. Each destructive or
 * state-changing action shows an undo toast instead of a confirm dialog.
 */
export function useTodoActions() {
  const { t } = useTranslation();
  const toggleTodo = useTodoStore((s) => s.toggleTodo);
  const deleteTodo = useTodoStore((s) => s.deleteTodo);
  const restoreTodo = useTodoStore((s) => s.restoreTodo);
  const moveTodosToDate = useTodoStore((s) => s.moveTodosToDate);

  const toggle = useCallback(
    (id: string) => {
      const todo = useTodoStore.getState().todos.find((x) => x.id === id);
      if (!todo) return;
      const completing = !todo.is_completed;
      haptic(completing ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light);
      const spawnedId = toggleTodo(id);
      if (!completing) return;
      showToast({
        message: t('toast.completed'),
        actionLabel: t('toast.undo'),
        onAction: () => {
          toggleTodo(id);
          if (spawnedId) deleteTodo(spawnedId);
        },
      });
    },
    [t, toggleTodo, deleteTodo]
  );

  const remove = useCallback(
    (id: string) => {
      haptic(Haptics.ImpactFeedbackStyle.Light);
      deleteTodo(id);
      showToast({
        message: t('toast.deleted'),
        actionLabel: t('toast.undo'),
        onAction: () => restoreTodo(id),
      });
    },
    [t, deleteTodo, restoreTodo]
  );

  const moveTo = useCallback(
    (ids: string[], date: string, message: string) => {
      if (ids.length === 0) return;
      const todos = useTodoStore.getState().todos;
      const previous = ids.map((id) => ({
        id,
        date: todos.find((x) => x.id === id)?.due_date ?? null,
      }));
      haptic(Haptics.ImpactFeedbackStyle.Light);
      moveTodosToDate(ids, date);
      showToast({
        message,
        actionLabel: t('toast.undo'),
        onAction: () => {
          const { updateTodo } = useTodoStore.getState();
          previous.forEach((p) => updateTodo(p.id, { due_date: p.date }));
        },
      });
    },
    [t, moveTodosToDate]
  );

  const postponeToTomorrow = useCallback(
    (id: string) => {
      const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');
      moveTo([id], tomorrow, t('toast.postponed'));
    },
    [moveTo, t]
  );

  const moveToToday = useCallback(
    (ids: string[]) => {
      const today = format(new Date(), 'yyyy-MM-dd');
      moveTo(ids, today, t('toast.movedToToday', { count: ids.length }));
    },
    [moveTo, t]
  );

  /** Recurring todo: jump to the next occurrence without completing this one. */
  const skip = useCallback(
    (id: string) => {
      const before = useTodoStore.getState().todos.find((x) => x.id === id);
      if (!before?.recurrence) return;
      haptic(Haptics.ImpactFeedbackStyle.Light);
      useTodoStore.getState().skipOccurrence(id);
      showToast({
        message: t('toast.skipped'),
        actionLabel: t('toast.undo'),
        onAction: () => {
          const { updateTodo } = useTodoStore.getState();
          updateTodo(id, { due_date: before.due_date, is_deleted: false });
        },
      });
    },
    [t]
  );

  return { toggle, remove, postponeToTomorrow, moveToToday, skip };
}
