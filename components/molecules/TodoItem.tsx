import React, { memo, useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import ReanimatedSwipeable, {
  type SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import { format, parseISO } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Text } from '@/components/atoms/AppText';
import { Icon, type IconName } from '@/components/atoms/Icon';
import { CheckBox } from '@/components/atoms/CheckBox';
import { useTheme } from '@/hooks/useTheme';
import { useTodoActions } from '@/hooks/useTodoActions';
import { useTodoStore } from '@/stores/todoStore';
import { getDateLocale } from '@/i18n/dateLocale';
import { Spacing, Radius, Elevation, Typography, todoRowTint } from '@/constants/theme';
import { Todo } from '@/lib/types';

export type RowPosition = 'single' | 'first' | 'middle' | 'last';

interface TodoItemProps {
  todo: Todo;
  onPress: (id: string) => void;
  /** Where the row sits in its grouped panel (draws corners and separators). */
  position?: RowPosition;
  /** Always show the due date (search results, overdue, category lists). */
  showDate?: boolean;
  /** Hide the category label, e.g. inside that category's own screen. */
  hideCategory?: boolean;
  /** Long-press handler, used to start a drag. */
  onLongPress?: () => void;
  /** This row is being dragged. */
  active?: boolean;
}

const SWIPE_ACTION_W = 76;

function SwipeAction({
  icon,
  label,
  color,
  onPress,
}: {
  icon: IconName;
  label: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.swipeAction, { backgroundColor: color }]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Icon name={icon} size={18} color="#FFFFFF" />
      <Text style={styles.swipeActionText} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

function TodoItemBase({
  todo,
  onPress,
  position = 'single',
  showDate = false,
  hideCategory = false,
  onLongPress,
  active = false,
}: TodoItemProps) {
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  const { toggle, remove, postponeToTomorrow, skip } = useTodoActions();
  const toggleSubtask = useTodoStore((s) => s.toggleSubtask);
  const category = useTodoStore((s) =>
    todo.category_id && !hideCategory ? s.categories.find((c) => c.id === todo.category_id) : undefined
  );
  const [showSubtasks, setShowSubtasks] = useState(false);

  const subtasks = todo.subtasks ?? [];
  const hasSubtasks = subtasks.length > 0;
  const doneCount = subtasks.filter((st) => st.is_completed).length;

  const today = format(new Date(), 'yyyy-MM-dd');
  const isOverdue = !todo.is_completed && !!todo.due_date && todo.due_date < today;
  const showDateBadge = !!todo.due_date && (showDate || isOverdue);
  const isRecurring = !!todo.recurrence;
  const canMove = !todo.is_completed && !!todo.due_date && todo.due_date <= today;
  const isImportant = todo.priority > 0;
  const hasMemo = !!todo.memo?.trim();
  const hasMeta = showDateBadge || !!todo.due_time || !!category || isRecurring || hasMemo;

  const tint = todoRowTint(todo.color, isDark);
  const isFirst = position === 'single' || position === 'first';
  const isLast = position === 'single' || position === 'last';
  const corners = active
    ? { borderRadius: Radius.panel }
    : {
        borderTopLeftRadius: isFirst ? Radius.panel : 0,
        borderTopRightRadius: isFirst ? Radius.panel : 0,
        borderBottomLeftRadius: isLast ? Radius.panel : 0,
        borderBottomRightRadius: isLast ? Radius.panel : 0,
      };

  const renderRightActions = (_p: unknown, _t: unknown, methods: SwipeableMethods) => (
    <View style={styles.swipeActions}>
      {canMove && isRecurring && (
        <SwipeAction
          icon="skip-forward"
          label={t('todo.swipeSkip')}
          color={colors.swipeNeutral}
          onPress={() => {
            methods.close();
            skip(todo.id);
          }}
        />
      )}
      {canMove && !isRecurring && (
        <SwipeAction
          icon="sunrise"
          label={t('todo.swipeTomorrow')}
          color={colors.swipeNeutral}
          onPress={() => {
            methods.close();
            postponeToTomorrow(todo.id);
          }}
        />
      )}
      <SwipeAction
        icon="trash-2"
        label={t('common.delete')}
        color={colors.error}
        onPress={() => {
          methods.close();
          remove(todo.id);
        }}
      />
    </View>
  );

  const sortedSubtasks = showSubtasks
    ? subtasks.slice().sort((a, b) => {
        if (a.is_completed !== b.is_completed) return a.is_completed ? 1 : -1;
        return a.sort_order - b.sort_order;
      })
    : [];

  const metaColor = colors.textSecondary;

  return (
    <Animated.View
      entering={FadeIn.duration(180)}
      exiting={FadeOut.duration(150)}
      layout={LinearTransition.duration(200)}
      style={[styles.outer, active && [styles.activeLift, Elevation.float]]}
    >
      <View
        style={[
          styles.panelCell,
          corners,
          {
            backgroundColor: tint ?? colors.surface,
            borderColor: colors.hairline,
            borderTopWidth: isFirst || active ? StyleSheet.hairlineWidth : 0,
            borderBottomWidth: isLast || active ? StyleSheet.hairlineWidth : 0,
          },
        ]}
      >
        <ReanimatedSwipeable
          friction={2}
          rightThreshold={40}
          overshootRight={false}
          renderRightActions={renderRightActions}
          enabled={!active}
        >
          <View style={{ backgroundColor: tint ?? colors.surface }}>
            {!isFirst && !active && (
              <View style={[styles.separator, { backgroundColor: colors.divider }]} />
            )}
            <View style={styles.row}>
              {/* Full-row tap target sits behind the controls so they don't nest inside it. */}
              <Pressable
                onPress={() => onPress(todo.id)}
                onLongPress={onLongPress}
                delayLongPress={350}
                style={({ pressed }) => [
                  StyleSheet.absoluteFill,
                  pressed && { backgroundColor: colors.divider },
                ]}
                accessibilityRole="button"
                accessibilityLabel={todo.title}
                accessibilityHint={onLongPress ? t('a11y.openDetailOrDrag') : t('a11y.openDetail')}
              />
              <CheckBox checked={todo.is_completed} onToggle={() => toggle(todo.id)} />

              <View style={[styles.content, styles.passThrough]}>
                <Text
                  style={[
                    styles.title,
                    todo.is_completed
                      ? { color: colors.textTertiary, textDecorationLine: 'line-through' }
                      : { color: colors.textPrimary },
                  ]}
                  numberOfLines={2}
                >
                  {todo.title}
                </Text>

                {hasMeta && (
                  <View style={styles.meta}>
                    {showDateBadge && (
                      <Text style={[styles.metaText, { color: isOverdue ? colors.error : metaColor }]}>
                        {format(parseISO(todo.due_date!), t('dateFormat.monthDay'), {
                          locale: getDateLocale(),
                        })}
                      </Text>
                    )}
                    {!!todo.due_time && (
                      <View style={styles.metaItem}>
                        <Icon name="bell" size={12} color={metaColor} />
                        <Text style={[styles.metaText, { color: metaColor }]}>
                          {format(parseISO(`2000-01-01T${todo.due_time}:00`), 'p', { locale: getDateLocale() })}
                        </Text>
                      </View>
                    )}
                    {category && (
                      <View style={styles.metaItem}>
                        <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                        <Text style={[styles.metaText, styles.categoryText, { color: metaColor }]} numberOfLines={1}>
                          {category.name}
                        </Text>
                      </View>
                    )}
                    {isRecurring && <Icon name="repeat" size={12} color={colors.textTertiary} />}
                    {hasMemo && <Icon name="align-left" size={12} color={colors.textTertiary} />}
                  </View>
                )}
              </View>

              {isImportant && (
                <View style={styles.passThrough}>
                  <MaterialIcons name="star" size={18} color={colors.accentText} accessibilityLabel={t('a11y.important')} />
                </View>
              )}

              {hasSubtasks && (
                <Pressable
                  onPress={() => setShowSubtasks((v) => !v)}
                  hitSlop={8}
                  style={[
                    styles.subtaskChip,
                    {
                      backgroundColor: tint
                        ? isDark
                          ? 'rgba(255,255,255,0.08)'
                          : 'rgba(255,255,255,0.65)'
                        : colors.surfaceVariant,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ expanded: showSubtasks }}
                  accessibilityLabel={t('a11y.toggleSubtasks')}
                >
                  <Text
                    style={[
                      styles.subtaskChipText,
                      { color: tint && !isDark ? '#55524C' : colors.textSecondary },
                    ]}
                  >
                    {doneCount}/{subtasks.length}
                  </Text>
                  <Icon
                    name={showSubtasks ? 'chevron-up' : 'chevron-down'}
                    size={14}
                    color={tint && !isDark ? '#55524C' : colors.textSecondary}
                  />
                </Pressable>
              )}
            </View>

            {showSubtasks && (
              <View style={styles.subtaskList}>
                {sortedSubtasks.map((st) => (
                  <Pressable
                    key={st.id}
                    onPress={() => toggleSubtask(todo.id, st.id)}
                    style={styles.subtaskRow}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: st.is_completed }}
                  >
                    <View
                      style={[
                        styles.subtaskCheck,
                        st.is_completed
                          ? { backgroundColor: colors.accent }
                          : { borderWidth: 1.5, borderColor: colors.outline },
                      ]}
                    >
                      {st.is_completed && <Icon name="check" size={11} color={colors.onAccent} />}
                    </View>
                    <Text
                      style={[
                        styles.subtaskTitle,
                        st.is_completed
                          ? { color: colors.textTertiary, textDecorationLine: 'line-through' }
                          : { color: colors.textPrimary },
                      ]}
                      numberOfLines={1}
                    >
                      {st.title}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        </ReanimatedSwipeable>
      </View>
    </Animated.View>
  );
}

export const TodoItem = memo(TodoItemBase);

const styles = StyleSheet.create({
  outer: {
    marginHorizontal: Spacing.md,
  },
  activeLift: {
    borderRadius: Radius.panel,
  },
  panelCell: {
    overflow: 'hidden',
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  separator: {
    position: 'absolute',
    top: 0,
    left: 50,
    right: 0,
    height: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: Spacing.md,
    paddingRight: Spacing.sm,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    minHeight: 56,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  passThrough: {
    pointerEvents: 'none',
  },
  title: {
    ...Typography.body,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    columnGap: 10,
    rowGap: 2,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    ...Typography.small,
  },
  categoryDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  categoryText: {
    maxWidth: 120,
  },
  subtaskChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingLeft: 8,
    paddingRight: 4,
    height: 24,
    borderRadius: Radius.sm,
  },
  subtaskChipText: {
    fontSize: 12,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  },
  subtaskList: {
    paddingLeft: 50,
    paddingRight: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  subtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs + 2,
    minHeight: 36,
  },
  subtaskCheck: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtaskTitle: {
    flex: 1,
    ...Typography.callout,
  },
  swipeActions: {
    flexDirection: 'row',
  },
  swipeAction: {
    width: SWIPE_ACTION_W,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  swipeActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
  },
});
