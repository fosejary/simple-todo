import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';
import type { Todo } from '@/lib/types';

type Hex = `#${string}`;

export interface TodoWidgetProps {
  todos: (Pick<Todo, 'id' | 'title' | 'is_completed'> & { tint: Hex | null })[];
  dateLabel: string;
  doneCount: number;
  totalCount: number;
  strings: { empty: string; tapToAdd: string; more: string; untitled: string };
}

const MAX_DISPLAY_ITEMS = 5;

// Light tokens from constants/theme.ts (direction B).
const C = {
  surface: '#FFFFFF' as Hex,
  textPrimary: '#1A1A18' as Hex,
  textSecondary: '#55524C' as Hex,
  textTertiary: '#77736C' as Hex,
  outline: '#C4BFB5' as Hex,
  track: '#E9E4DA' as Hex,
  accent: '#EE8F1F' as Hex,
  accentText: '#A55A08' as Hex,
};

/** Today's tasks on the home screen. Tap a circle to complete; tap elsewhere to open the app. */
export function TodoWidget({ todos, dateLabel, doneCount, totalCount, strings }: TodoWidgetProps) {
  const display = todos.slice(0, MAX_DISPLAY_ITEMS);
  const remaining = todos.length - display.length;

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        flexDirection: 'column',
        backgroundColor: C.surface,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: 10,
      }}
      clickAction="OPEN_APP"
    >
      <FlexWidget style={{ flexDirection: 'row', alignItems: 'center', width: 'match_parent' }}>
        <TextWidget
          text={dateLabel}
          style={{ fontSize: 15, color: C.textPrimary, fontWeight: '600' }}
          maxLines={1}
        />
        <FlexWidget style={{ flex: 1 }} />
        {totalCount > 0 ? (
          <TextWidget
            text={`${doneCount}/${totalCount}`}
            style={{ fontSize: 13, color: C.accentText, fontWeight: '600' }}
          />
        ) : null}
      </FlexWidget>

      {totalCount > 0 ? (
        <FlexWidget
          style={{
            flexDirection: 'row',
            width: 'match_parent',
            height: 4,
            borderRadius: 2,
            backgroundColor: C.track,
            marginTop: 8,
            marginBottom: 6,
          }}
        >
          {doneCount > 0 ? (
            <FlexWidget style={{ flex: doneCount, height: 4, borderRadius: 2, backgroundColor: C.accent }} />
          ) : null}
          {totalCount - doneCount > 0 ? <FlexWidget style={{ flex: totalCount - doneCount, height: 4 }} /> : null}
        </FlexWidget>
      ) : null}

      {display.length === 0 ? (
        <FlexWidget
          style={{
            flex: 1,
            width: 'match_parent',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TextWidget text={strings.empty} style={{ fontSize: 14, color: C.textSecondary }} />
          <TextWidget
            text={strings.tapToAdd}
            style={{ fontSize: 13, color: C.accentText, marginTop: 4, fontWeight: '600' }}
          />
        </FlexWidget>
      ) : (
        <FlexWidget style={{ flexDirection: 'column', width: 'match_parent', flex: 1 }}>
          {display.map((todo) => (
            <TodoRow key={todo.id} todo={todo} untitled={strings.untitled} />
          ))}
          {remaining > 0 ? (
            <TextWidget
              text={strings.more.replace('{{count}}', String(remaining))}
              style={{ fontSize: 12, color: C.textTertiary, marginTop: 2, marginLeft: 36 }}
            />
          ) : null}
        </FlexWidget>
      )}
    </FlexWidget>
  );
}

function TodoRow({ todo, untitled }: { todo: TodoWidgetProps['todos'][number]; untitled: string }) {
  const done = todo.is_completed;
  const title = todo.title || untitled;
  // TextWidget has no textDecorationLine; combine each char with a strike overlay.
  const shown = done ? title.split('').map((ch) => ch + '̶').join('') : title;

  return (
    <FlexWidget
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        width: 'match_parent',
        borderRadius: 10,
        backgroundColor: todo.tint ?? C.surface,
        paddingRight: 8,
        marginTop: 2,
      }}
      clickAction="OPEN_APP"
    >
      <FlexWidget
        style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}
        clickAction="TOGGLE"
        clickActionData={{ id: todo.id }}
      >
        <FlexWidget
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            borderWidth: done ? 0 : 2,
            borderColor: C.outline,
            backgroundColor: done ? C.accent : ('#00000000' as Hex),
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {done ? (
            <TextWidget text={'✓'} style={{ fontSize: 11, color: C.textPrimary, fontWeight: '700' }} />
          ) : null}
        </FlexWidget>
      </FlexWidget>
      <FlexWidget style={{ flex: 1, flexDirection: 'column' }}>
        <TextWidget
          text={shown}
          style={{ fontSize: 14, color: done ? C.textTertiary : C.textPrimary }}
          maxLines={1}
          truncate="END"
        />
      </FlexWidget>
    </FlexWidget>
  );
}
