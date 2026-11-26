import React from 'react';
import { format } from 'date-fns';
import i18n from '@/i18n';
import { getDateLocale } from '@/i18n/dateLocale';
import { todoRowTint } from '@/constants/theme';
import { useTodoStore, whenTodosHydrated } from '@/stores/todoStore';
import { TodoWidget, type TodoWidgetProps } from './TodoWidget';

/**
 * Build the widget from the store. In a headless widget task the store
 * rehydrates from AsyncStorage first; in the app it is already live.
 */
export async function buildWidgetElement(): Promise<React.JSX.Element> {
  await whenTodosHydrated();
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayTodos = useTodoStore
    .getState()
    .todos.filter((t) => t.due_date === today && !t.is_deleted)
    .sort((a, b) => {
      if (a.is_completed !== b.is_completed) return a.is_completed ? 1 : -1;
      return a.sort_order - b.sort_order;
    });

  const props: TodoWidgetProps = {
    todos: todayTodos.map((t) => ({
      id: t.id,
      title: t.title,
      is_completed: t.is_completed,
      tint: todoRowTint(t.color, false) as TodoWidgetProps['todos'][number]['tint'],
    })),
    dateLabel: format(new Date(), i18n.t('dateFormat.monthDayWeekday'), { locale: getDateLocale() }),
    doneCount: todayTodos.filter((t) => t.is_completed).length,
    totalCount: todayTodos.length,
    strings: {
      empty: i18n.t('widget.empty'),
      tapToAdd: i18n.t('widget.tapToAdd'),
      more: i18n.t('widget.more'),
      untitled: i18n.t('widget.untitled'),
    },
  };
  return <TodoWidget {...props} />;
}
