import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import {
  format,
  addMonths,
  subMonths,
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
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { TodoItem } from '@/components/molecules/TodoItem';
import { TodoDetailSheet } from '@/components/organisms/TodoDetailSheet';
import { QuickAddBar } from '@/components/molecules/QuickAddBar';
import { EmptyState } from '@/components/molecules/EmptyState';
import { useTheme } from '@/hooks/useTheme';
import { useTodoStore } from '@/stores/todoStore';
import { Todo } from '@/lib/types';
import { Typography, Spacing, BorderRadius, Elevation } from '@/constants/theme';

export default function CalendarScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dateLocale = getDateLocale();
  const dayLabels = t('calendar.dayLabels', { returnObjects: true }) as string[];

  // Store selectors - raw state only
  const todos = useTodoStore((s) => s.todos);
  const categories = useTodoStore((s) => s.categories);
  const addTodo = useTodoStore((s) => s.addTodo);
  const toggleTodo = useTodoStore((s) => s.toggleTodo);
  const toggleSubtask = useTodoStore((s) => s.toggleSubtask);
  const addSubtask = useTodoStore((s) => s.addSubtask);
  const deleteSubtask = useTodoStore((s) => s.deleteSubtask);
  const updateSubtask = useTodoStore((s) => s.updateSubtask);
  const updateTodo = useTodoStore((s) => s.updateTodo);
  const deleteTodo = useTodoStore((s) => s.deleteTodo);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null);

  // Build a map of date -> todos for the current month (and visible overflow days)
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    return eachDayOfInterval({ start: calStart, end: calEnd });
  }, [currentMonth]);

  // Map: dateStr -> { total, completed }
  const todosByDate = useMemo(() => {
    const map: Record<string, { total: number; completed: number; todos: Todo[] }> = {};
    const activeTodos = todos.filter((t) => !t.is_deleted && t.due_date);
    for (const t of activeTodos) {
      const dateStr = t.due_date!;
      if (!map[dateStr]) {
        map[dateStr] = { total: 0, completed: 0, todos: [] };
      }
      map[dateStr].total++;
      if (t.is_completed) {
        map[dateStr].completed++;
      }
      map[dateStr].todos.push(t);
    }
    return map;
  }, [todos]);

  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');

  const selectedDayTodos = useMemo(() => {
    const entry = todosByDate[selectedDateStr];
    if (!entry) return [];
    return entry.todos.sort((a, b) => {
      if (a.is_completed !== b.is_completed) return a.is_completed ? 1 : -1;
      return a.sort_order - b.sort_order;
    });
  }, [todosByDate, selectedDateStr]);

  const handlePrevMonth = useCallback(() => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  }, []);

  const handleDatePress = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  const handleAddTodo = useCallback(
    (title: string) => {
      addTodo({ title, due_date: selectedDateStr });
    },
    [selectedDateStr]
  );

  const getDotColor = (dateStr: string): string | null => {
    const entry = todosByDate[dateStr];
    if (!entry || entry.total === 0) return null;
    if (entry.completed === entry.total) return colors.success;
    if (entry.completed > 0) return colors.warning;
    return colors.textDisabled;
  };

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {t('calendar.title')}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Calendar Card */}
        <View
          style={[
            styles.calendarCard,
            { backgroundColor: colors.surface },
            Elevation.level1,
          ]}
        >
          {/* Month Navigation */}
          <View style={styles.monthNav}>
            <Pressable
              onPress={handlePrevMonth}
              hitSlop={12}
              style={[styles.navButton, { backgroundColor: colors.surfaceVariant }]}
            >
              <MaterialIcons
                name="chevron-left"
                size={22}
                color={colors.textPrimary}
              />
            </Pressable>
            <Text style={[styles.monthLabel, { color: colors.textPrimary }]}>
              {format(currentMonth, t('dateFormat.monthYear'), { locale: dateLocale })}
            </Text>
            <Pressable
              onPress={handleNextMonth}
              hitSlop={12}
              style={[styles.navButton, { backgroundColor: colors.surfaceVariant }]}
            >
              <MaterialIcons
                name="chevron-right"
                size={22}
                color={colors.textPrimary}
              />
            </Pressable>
          </View>

          {/* Day-of-week headers */}
          <View style={styles.weekRow}>
            {dayLabels.map((label: string, idx: number) => (
              <View key={label} style={styles.weekCell}>
                <Text
                  style={[
                    styles.weekLabel,
                    {
                      color:
                        idx === 0
                          ? colors.error
                          : idx === 6
                          ? colors.primary
                          : colors.textSecondary,
                    },
                  ]}
                >
                  {label}
                </Text>
              </View>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {calendarDays.map((day) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isSelected = isSameDay(day, selectedDate);
              const isTodayDate = isToday(day);
              const dotColor = getDotColor(dateStr);
              const dayOfWeek = day.getDay();

              return (
                <Pressable
                  key={dateStr}
                  onPress={() => handleDatePress(day)}
                  style={styles.dayCell}
                >
                  <View
                    style={[
                      styles.dayCircle,
                      isTodayDate && {
                        backgroundColor: colors.primary,
                      },
                      isSelected &&
                        !isTodayDate && {
                          backgroundColor: `${colors.primary}15`,
                          borderWidth: 1.5,
                          borderColor: colors.primary,
                        },
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        {
                          color: !isCurrentMonth
                            ? colors.textDisabled
                            : isTodayDate
                            ? '#FFFFFF'
                            : dayOfWeek === 0
                            ? colors.error
                            : dayOfWeek === 6
                            ? colors.primary
                            : colors.textPrimary,
                        },
                        isTodayDate && { fontWeight: '700' },
                        isSelected && !isTodayDate && { fontWeight: '600' },
                      ]}
                    >
                      {format(day, 'd')}
                    </Text>
                  </View>
                  {dotColor && (
                    <View
                      style={[
                        styles.dot,
                        { backgroundColor: dotColor },
                      ]}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Divider between calendar and todos */}
        <View style={styles.selectedDateSection}>
          <View style={[styles.dividerLine, { backgroundColor: colors.divider }]} />
          <View style={styles.selectedDateHeader}>
            <Text
              style={[styles.selectedDateLabel, { color: colors.textPrimary }]}
            >
              {format(selectedDate, t('dateFormat.monthDayWeekday'), { locale: dateLocale })}
            </Text>
            {selectedDayTodos.length > 0 && (
              <View style={[styles.todoCountBadge, { backgroundColor: colors.primaryContainer }]}>
                <Text
                  style={[styles.todoCountText, { color: colors.primary }]}
                >
                  {selectedDayTodos.length}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Selected date todos */}
        {selectedDayTodos.length === 0 ? (
          <EmptyState
            icon="event-available"
            title={t('calendar.emptyTitle')}
            description={t('calendar.emptyDesc')}
          />
        ) : (
          <View style={styles.todoList}>
            {selectedDayTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={(id) => toggleTodo(id)}
                onToggleSubtask={toggleSubtask}
                onAddSubtask={addSubtask}
                onDeleteSubtask={deleteSubtask}
                onUpdateSubtask={updateSubtask}
                onDelete={deleteTodo}
                onUpdateMemo={(id, memo) => updateTodo(id, { memo })}
                onPress={setSelectedTodoId}
                categories={categories}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Quick Add Bar */}
      <QuickAddBar onAdd={handleAddTodo} placeholder={t('calendar.addPlaceholder')} />

      {/* Bottom Sheet */}
      {selectedTodoId && (
        <TodoDetailSheet
          todoId={selectedTodoId}
          onClose={() => setSelectedTodoId(null)}
        />
      )}
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  title: {
    fontSize: 26,
    lineHeight: 34,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  content: {
    paddingBottom: Spacing.xxl,
  },
  // Calendar Card
  calendarCard: {
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.sm,
    marginTop: Spacing.xs,
  },
  // Month navigation
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthLabel: {
    fontSize: 17,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
  },
  // Week header
  weekRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.xxs,
    marginTop: Spacing.xxs,
  },
  weekCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.xxs,
  },
  weekLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  // Calendar grid
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.sm,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 2,
    position: 'absolute',
    bottom: 2,
  },
  // Selected date section
  selectedDateSection: {
    marginTop: Spacing.lg,
  },
  dividerLine: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: Spacing.lg,
  },
  selectedDateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
    gap: Spacing.xs,
  },
  selectedDateLabel: {
    fontSize: 17,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
  },
  todoCountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: 'center',
  },
  todoCountText: {
    fontSize: 12,
    fontWeight: '700' as const,
  },
  todoList: {
    paddingBottom: Spacing.md,
    paddingTop: Spacing.xxs,
  },
});
