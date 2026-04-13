import React from 'react';
import {
  FlexWidget,
  TextWidget,
} from 'react-native-android-widget';
import type { Todo } from '@/lib/types';

/**
 * Props passed from the widget task handler after reading AsyncStorage.
 */
export interface TodoWidgetProps {
  todos: Pick<Todo, 'id' | 'title' | 'is_completed' | 'color'>[];
  dateLabel: string; // e.g. "4월 6일 월요일"
}

const MAX_DISPLAY_ITEMS = 5;

// Design tokens (matching constants/theme.ts light mode)
const COLORS = {
  primary: '#2563EB' as const,
  background: '#FFFFFF' as const,
  textPrimary: '#1A1D21' as const,
  textSecondary: '#6B7280' as const,
  textTertiary: '#9CA3AF' as const,
  success: '#10B981' as const,
  divider: '#ECEEF0' as const,
  checkBorder: '#D1D5DB' as const,
  transparent: 'rgba(0, 0, 0, 0)' as const,
};

/**
 * Android Home Screen Widget for SimpleTodo.
 * Shows today's tasks (up to 5) with completion status.
 */
export function TodoWidget({ todos, dateLabel }: TodoWidgetProps) {
  const incomplete = todos.filter((t) => !t.is_completed);
  const completed = todos.filter((t) => t.is_completed);
  const display = [...incomplete, ...completed].slice(0, MAX_DISPLAY_ITEMS);
  const remaining = todos.length - display.length;

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        flexDirection: 'column',
        backgroundColor: COLORS.background,
        borderRadius: 16,
        padding: 16,
      }}
      clickAction="OPEN_APP"
    >
      {/* Header */}
      <FlexWidget
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: 'match_parent',
          marginBottom: 12,
        }}
      >
        {/* App icon placeholder */}
        <FlexWidget
          style={{
            width: 24,
            height: 24,
            backgroundColor: COLORS.primary,
            borderRadius: 6,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 8,
          }}
        >
          <TextWidget
            text="ST"
            style={{
              fontSize: 10,
              color: '#FFFFFF',
              fontWeight: '700',
            }}
          />
        </FlexWidget>

        {/* App name + date */}
        <FlexWidget
          style={{
            flexDirection: 'column',
            flex: 1,
          }}
        >
          <TextWidget
            text="SimpleTodo"
            style={{
              fontSize: 14,
              color: COLORS.textPrimary,
              fontWeight: '600',
            }}
          />
          <TextWidget
            text={dateLabel}
            style={{
              fontSize: 11,
              color: COLORS.textSecondary,
            }}
          />
        </FlexWidget>

        {/* Counter badge */}
        <FlexWidget
          style={{
            backgroundColor: incomplete.length > 0 ? COLORS.primary : COLORS.success,
            borderRadius: 10,
            paddingHorizontal: 8,
            paddingVertical: 2,
          }}
        >
          <TextWidget
            text={
              incomplete.length > 0
                ? `${completed.length}/${todos.length}`
                : 'Done!'
            }
            style={{
              fontSize: 11,
              color: '#FFFFFF',
              fontWeight: '600',
            }}
          />
        </FlexWidget>
      </FlexWidget>

      {/* Divider */}
      <FlexWidget
        style={{
          width: 'match_parent',
          height: 1,
          backgroundColor: COLORS.divider,
          marginBottom: 8,
        }}
      />

      {/* Todo List or Empty State */}
      {display.length === 0 ? (
        <FlexWidget
          style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: 'match_parent',
          }}
        >
          <TextWidget
            text="오늘 할일이 없어요"
            style={{
              fontSize: 14,
              color: COLORS.textTertiary,
            }}
          />
          <TextWidget
            text="탭하여 추가하기"
            style={{
              fontSize: 12,
              color: COLORS.primary,
              marginTop: 4,
            }}
          />
        </FlexWidget>
      ) : (
        <FlexWidget
          style={{
            flexDirection: 'column',
            width: 'match_parent',
            flex: 1,
          }}
        >
          {display.map((todo) => (
            <TodoItemRow key={todo.id} todo={todo} />
          ))}
          {remaining > 0 && (
            <TextWidget
              text={`+${remaining}개 더 보기`}
              style={{
                fontSize: 11,
                color: COLORS.primary,
                marginTop: 4,
                textAlign: 'center',
              }}
            />
          )}
        </FlexWidget>
      )}
    </FlexWidget>
  );
}

/**
 * Single todo item row for the widget.
 */
function TodoItemRow({
  todo,
}: {
  todo: Pick<Todo, 'id' | 'title' | 'is_completed' | 'color'>;
}) {
  const isCompleted = todo.is_completed;
  const titleColor = isCompleted ? COLORS.textTertiary : COLORS.textPrimary;

  // For completed items, prefix with strikethrough unicode combining character
  // since TextWidget does not support textDecorationLine
  const displayTitle = todo.title || '(제목 없음)';
  const formattedTitle = isCompleted
    ? displayTitle
        .split('')
        .map((ch) => ch + '\u0336')
        .join('')
    : displayTitle;

  return (
    <FlexWidget
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        width: 'match_parent',
        paddingVertical: 4,
      }}
      clickAction="OPEN_APP"
    >
      {/* Check circle */}
      <FlexWidget
        style={{
          width: 18,
          height: 18,
          borderRadius: 9,
          borderWidth: isCompleted ? 0 : 2,
          borderColor: isCompleted ? COLORS.success : COLORS.checkBorder,
          backgroundColor: isCompleted ? COLORS.success : COLORS.transparent,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 10,
        }}
      >
        {isCompleted ? (
          <TextWidget
            text={'\u2713'}
            style={{
              fontSize: 10,
              color: '#FFFFFF',
              fontWeight: '700',
            }}
          />
        ) : null}
      </FlexWidget>

      {/* Color indicator */}
      {todo.color ? (
        <FlexWidget
          style={{
            width: 3,
            height: 14,
            backgroundColor: todo.color as `#${string}`,
            borderRadius: 2,
            marginRight: 8,
          }}
        />
      ) : null}

      {/* Title wrapped in FlexWidget for flex: 1 */}
      <FlexWidget
        style={{
          flex: 1,
          flexDirection: 'column',
        }}
      >
        <TextWidget
          text={formattedTitle}
          style={{
            fontSize: 13,
            color: titleColor,
          }}
          maxLines={1}
          truncate="END"
        />
      </FlexWidget>
    </FlexWidget>
  );
}
