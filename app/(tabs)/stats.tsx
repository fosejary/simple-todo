import React, { useState, useMemo, useCallback } from 'react';
import { View, Pressable, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Gesture, GestureDetector, Directions } from 'react-native-gesture-handler';
import {
  format,
  addMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import { useTranslation } from 'react-i18next';
import { getDateLocale } from '@/i18n/dateLocale';
import { Text } from '@/components/atoms/AppText';
import { Icon } from '@/components/atoms/Icon';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { TodoItem } from '@/components/molecules/TodoItem';
import { TodoDetailSheet } from '@/components/organisms/TodoDetailSheet';
import { positionOf } from '@/components/organisms/TodoSectionList';
import { QuickAddBar } from '@/components/molecules/QuickAddBar';
import { EmptyState } from '@/components/molecules/EmptyState';
import { useTheme } from '@/hooks/useTheme';
import { useTodoStore } from '@/stores/todoStore';
import { Todo } from '@/lib/types';
import { Spacing, Radius, Typography } from '@/constants/theme';

const SATURDAY = '#5677CF';

export default function CalendarScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dateLocale = getDateLocale();
  const dayLabels = t('calendar.dayLabels', { returnObjects: true }) as string[];

  const todos = useTodoStore((s) => s.todos);
  const addTodo = useTodoStore((s) => s.addTodo);

  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null);

  const calendarDays = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 }),
        end: endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 }),
      }),
    [currentMonth]
  );

  const todosByDate = useMemo(() => {
    const map: Record<string, { total: number; completed: number; todos: Todo[] }> = {};
    for (const todo of todos) {
      if (todo.is_deleted || !todo.due_date) continue;
      const entry = (map[todo.due_date] ??= { total: 0, completed: 0, todos: [] });
      entry.total++;
      if (todo.is_completed) entry.completed++;
      entry.todos.push(todo);
    }
    return map;
  }, [todos]);

  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const selectedEntry = todosByDate[selectedDateStr];

  const selectedDayTodos = useMemo(() => {
    if (!selectedEntry) return [];
    return selectedEntry.todos.slice().sort((a, b) => {
      if (a.is_completed !== b.is_completed) return a.is_completed ? 1 : -1;
      return a.sort_order - b.sort_order;
    });
  }, [selectedEntry]);

  const changeMonth = (delta: number) => {
    const next = addMonths(currentMonth, delta);
    setCurrentMonth(next);
    // Keep the list in sync with what's on screen: today if visible, else the 1st.
    setSelectedDate(isSameMonth(next, new Date()) ? new Date() : startOfMonth(next));
  };

  const goToToday = useCallback(() => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  }, []);

  const swipe = Gesture.Race(
    Gesture.Fling().direction(Directions.LEFT).runOnJS(true).onEnd(() => changeMonth(1)),
    Gesture.Fling().direction(Directions.RIGHT).runOnJS(true).onEnd(() => changeMonth(-1))
  );

  const handleAddTodo = useCallback((title: string) => addTodo({ title, due_date: selectedDateStr }), [selectedDateStr]);

  const viewingToday = isToday(selectedDate) && isSameMonth(currentMonth, new Date());

  return (
    <ScreenContainer>
      <KeyboardAvoidingView style={styles.flex} behavior="padding" keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{t('calendar.title')}</Text>
          {!viewingToday && (
            <Pressable
              onPress={goToToday}
              style={({ pressed }) => [
                styles.todayButton,
                { borderColor: colors.hairline, backgroundColor: pressed ? colors.surfaceVariant : colors.surface },
              ]}
              accessibilityRole="button"
            >
              <View style={[styles.sunDot, { backgroundColor: colors.accent }]} />
              <Text style={[styles.todayButtonText, { color: colors.textPrimary }]}>{t('detail.today')}</Text>
            </Pressable>
          )}
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <GestureDetector gesture={swipe}>
            <View style={[styles.calendar, { backgroundColor: colors.surface, borderColor: colors.hairline }]}>
              <View style={styles.monthNav}>
                <Pressable onPress={() => changeMonth(-1)} hitSlop={10} style={styles.navButton} accessibilityRole="button" accessibilityLabel={t('a11y.prevMonth')}>
                  <Icon name="chevron-left" size={22} color={colors.textSecondary} />
                </Pressable>
                <Text style={[styles.monthLabel, { color: colors.textPrimary }]}>
                  {format(currentMonth, t('dateFormat.monthYear'), { locale: dateLocale })}
                </Text>
                <Pressable onPress={() => changeMonth(1)} hitSlop={10} style={styles.navButton} accessibilityRole="button" accessibilityLabel={t('a11y.nextMonth')}>
                  <Icon name="chevron-right" size={22} color={colors.textSecondary} />
                </Pressable>
              </View>

              <View style={styles.weekRow}>
                {dayLabels.map((label, idx) => (
                  <Text
                    key={label}
                    style={[
                      styles.weekLabel,
                      { color: idx === 0 ? colors.error : idx === 6 ? SATURDAY : colors.textTertiary },
                    ]}
                  >
                    {label}
                  </Text>
                ))}
              </View>

              <View style={styles.grid}>
                {calendarDays.map((day) => {
                  const dateStr = format(day, 'yyyy-MM-dd');
                  const inMonth = isSameMonth(day, currentMonth);
                  const selected = isSameDay(day, selectedDate);
                  const isTodayDate = isToday(day);
                  const entry = todosByDate[dateStr];
                  const dotColor =
                    entry && entry.total > 0
                      ? entry.completed === entry.total
                        ? colors.accent
                        : colors.textTertiary
                      : 'transparent';
                  const dow = day.getDay();
                  const baseColor = !inMonth
                    ? colors.textDisabled
                    : dow === 0
                      ? colors.error
                      : dow === 6
                        ? SATURDAY
                        : colors.textPrimary;

                  return (
                    <Pressable
                      key={dateStr}
                      onPress={() => setSelectedDate(day)}
                      style={styles.dayCell}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                    >
                      <View
                        style={[
                          styles.dayCircle,
                          selected
                            ? { backgroundColor: colors.primary }
                            : isTodayDate && { backgroundColor: colors.accentSoft },
                        ]}
                      >
                        <Text
                          style={[
                            styles.dayText,
                            { color: selected ? colors.onPrimary : isTodayDate ? colors.accentText : baseColor },
                            (selected || isTodayDate) && styles.dayTextStrong,
                          ]}
                        >
                          {format(day, 'd')}
                        </Text>
                      </View>
                      <View style={[styles.dot, { backgroundColor: dotColor, opacity: inMonth ? 1 : 0.4 }]} />
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </GestureDetector>

          <View style={styles.selectedHeader}>
            <Text style={[styles.selectedLabel, { color: colors.textPrimary }]}>
              {format(selectedDate, t('dateFormat.monthDayWeekday'), { locale: dateLocale })}
            </Text>
            {selectedEntry && selectedEntry.total > 0 && (
              <Text style={[styles.selectedCount, { color: colors.textTertiary }]}>
                {t('today.progress', { done: selectedEntry.completed, total: selectedEntry.total })}
              </Text>
            )}
          </View>

          {selectedDayTodos.length === 0 ? (
            <EmptyState icon="calendar" title={t('calendar.emptyTitle')} description={t('calendar.emptyDesc')} compact />
          ) : (
            selectedDayTodos.map((todo, i) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onPress={setSelectedTodoId}
                position={positionOf(i, selectedDayTodos.length)}
              />
            ))
          )}
        </ScrollView>

        <QuickAddBar onAdd={handleAddTodo} placeholder={t('calendar.addPlaceholder')} />
      </KeyboardAvoidingView>

      {selectedTodoId && <TodoDetailSheet todoId={selectedTodoId} onClose={() => setSelectedTodoId(null)} />}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    minHeight: 52,
  },
  title: {
    ...Typography.title,
  },
  todayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    height: 34,
    borderRadius: 17,
    borderWidth: StyleSheet.hairlineWidth,
  },
  sunDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  todayButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    paddingBottom: Spacing.xl,
  },
  calendar: {
    marginHorizontal: Spacing.md,
    borderRadius: Radius.panel,
    borderWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.xxs,
    paddingBottom: Spacing.xs,
    paddingHorizontal: Spacing.xxs,
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xxs,
    paddingVertical: Spacing.xxs,
  },
  navButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthLabel: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: Spacing.xxs,
  },
  weekLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 16,
    paddingVertical: Spacing.xxs,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.2857%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 15,
  },
  dayTextStrong: {
    fontWeight: '600',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 2,
  },
  selectedHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xs,
  },
  selectedLabel: {
    ...Typography.label,
  },
  selectedCount: {
    fontSize: 13,
    fontVariant: ['tabular-nums'],
  },
});
