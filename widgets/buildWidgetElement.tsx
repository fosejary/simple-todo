import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TodoWidget, type TodoWidgetProps } from './TodoWidget';
import type { Todo } from '@/lib/types';

const STORAGE_KEY = '@simpletodo/todos';

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'] as const;

function buildDateLabel(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayName = DAY_NAMES[date.getDay()];
  return `${month}월 ${day}일 ${dayName}요일`;
}

function todayStr(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

async function readTodosFromStorage(): Promise<Todo[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);

    if (
      parsed !== null &&
      typeof parsed === 'object' &&
      'state' in (parsed as Record<string, unknown>)
    ) {
      const state = (parsed as { state: { todos?: unknown } }).state;
      if (state && Array.isArray(state.todos)) {
        return state.todos as Todo[];
      }
    }

    if (Array.isArray(parsed)) {
      return parsed as Todo[];
    }

    return [];
  } catch {
    return [];
  }
}

async function buildWidgetProps(): Promise<TodoWidgetProps> {
  const allTodos = await readTodosFromStorage();
  const today = todayStr();

  const todayTodos = allTodos.filter(
    (t) => t.due_date === today && !t.is_deleted
  );

  const sorted = [...todayTodos].sort((a, b) => {
    if (a.is_completed !== b.is_completed) {
      return a.is_completed ? 1 : -1;
    }
    return a.sort_order - b.sort_order;
  });

  return {
    todos: sorted.map((t) => ({
      id: t.id,
      title: t.title,
      is_completed: t.is_completed,
      color: t.color,
    })),
    dateLabel: buildDateLabel(new Date()),
  };
}

/**
 * Build the TodoWidget JSX element with fresh data from AsyncStorage.
 * Used by both the task handler and the requestWidgetUpdate call.
 */
export async function buildWidgetElement(): Promise<React.JSX.Element> {
  const widgetProps = await buildWidgetProps();
  return <TodoWidget {...widgetProps} />;
}
