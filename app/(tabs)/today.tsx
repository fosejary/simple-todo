import React, { useState, useCallback, useMemo } from 'react';
import { View, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { format, subDays } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { getDateLocale } from '@/i18n/dateLocale';
import { Text, TextInput } from '@/components/atoms/AppText';
import { Icon } from '@/components/atoms/Icon';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { TodoDetailSheet } from '@/components/organisms/TodoDetailSheet';
import { TodoSectionList, type TodoSection } from '@/components/organisms/TodoSectionList';
import { QuickAddBar } from '@/components/molecules/QuickAddBar';
import { EmptyState } from '@/components/molecules/EmptyState';
import { SunArc } from '@/components/molecules/SunArc';
import { useTheme } from '@/hooks/useTheme';
import { useTodoActions } from '@/hooks/useTodoActions';
import { useTodoStore } from '@/stores/todoStore';
import { Spacing, Radius, Typography } from '@/constants/theme';
import { Todo, StreakData } from '@/lib/types';

function computeStreak(streaks: Record<string, StreakData>): number {
  let date = new Date();
  const todayData = streaks[format(date, 'yyyy-MM-dd')];
  if (!todayData || todayData.todos_completed === 0) date = subDays(date, 1);
  let count = 0;
  for (let i = 0; i < 3650; i++) {
    const data = streaks[format(date, 'yyyy-MM-dd')];
    if (!data || data.todos_completed === 0) break;
    count++;
    date = subDays(date, 1);
  }
  return count;
}

const bySortOrder = (a: Todo, b: Todo) => a.sort_order - b.sort_order;

export default function TodayScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const today = format(new Date(), 'yyyy-MM-dd');
  const dateLabel = format(new Date(), t('dateFormat.monthDayWeekday'), { locale: getDateLocale() });

  const todos = useTodoStore((s) => s.todos);
  const streaks = useTodoStore((s) => s.streaks);
  const addTodo = useTodoStore((s) => s.addTodo);
  const reorderTodos = useTodoStore((s) => s.reorderTodos);
  const { moveToToday } = useTodoActions();

  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState('');

  const { overdue, active, completed } = useMemo(() => {
    const overdue: Todo[] = [];
    const active: Todo[] = [];
    const completed: Todo[] = [];
    for (const todo of todos) {
      if (todo.is_deleted || !todo.due_date) continue;
      if (todo.due_date === today) {
        (todo.is_completed ? completed : active).push(todo);
      } else if (todo.due_date < today && !todo.is_completed) {
        overdue.push(todo);
      }
    }
    overdue.sort((a, b) => a.due_date!.localeCompare(b.due_date!) || bySortOrder(a, b));
    active.sort(bySortOrder);
    completed.sort((a, b) => (b.completed_at ?? '').localeCompare(a.completed_at ?? ''));
    return { overdue, active, completed };
  }, [todos, today]);

  const streak = useMemo(() => computeStreak(streaks), [streaks]);

  const query = searchText.trim().toLowerCase();
  const isSearching = showSearch && query.length > 0;

  const searchResults = useMemo(() => {
    if (!isSearching) return [];
    return todos
      .filter(
        (todo) =>
          !todo.is_deleted &&
          (todo.title.toLowerCase().includes(query) || todo.memo?.toLowerCase().includes(query))
      )
      .sort((a, b) => {
        if (a.is_completed !== b.is_completed) return a.is_completed ? 1 : -1;
        return (b.due_date ?? '').localeCompare(a.due_date ?? '');
      });
  }, [todos, query, isSearching]);

  const handleAddTodo = useCallback((title: string) => addTodo({ title, due_date: today }), [today]);

  const closeSearch = () => {
    setShowSearch(false);
    setSearchText('');
  };

  const sections: TodoSection[] = isSearching
    ? [{ key: 'search', title: t('today.searchResults'), data: searchResults, showDate: true }]
    : [
        {
          key: 'overdue',
          title: t('today.sectionOverdue'),
          data: overdue,
          showDate: true,
          action: {
            label: t('today.moveAllToToday'),
            onPress: () => moveToToday(overdue.map((x) => x.id)),
          },
        },
        { key: 'active', title: t('today.sectionActive'), data: active },
        {
          key: 'completed',
          title: t('today.sectionCompleted'),
          data: completed,
          collapsible: true,
          collapsed: !showCompleted,
          onToggle: () => setShowCompleted((v) => !v),
        },
      ];

  const totalToday = active.length + completed.length;
  const nothingAtAll = totalToday === 0 && overdue.length === 0;

  let listHeader: React.ReactElement | null = null;
  if (isSearching) {
    listHeader =
      searchResults.length === 0 ? (
        <EmptyState icon="search" title={t('today.searchEmpty')} compact />
      ) : null;
  } else {
    listHeader = <SunArc done={completed.length} total={totalToday} />;
  }

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.topBar}>
          {showSearch ? (
            <View style={[styles.searchBar, { backgroundColor: colors.surfaceVariant }]}>
              <Icon name="search" size={18} color={colors.textTertiary} />
              <TextInput
                style={[styles.searchInput, { color: colors.textPrimary }]}
                placeholder={t('today.searchPlaceholder')}
                placeholderTextColor={colors.textTertiary}
                value={searchText}
                onChangeText={setSearchText}
                autoFocus
                returnKeyType="search"
              />
            </View>
          ) : (
            <View style={styles.flex}>
              <Text style={[styles.date, { color: colors.textPrimary }]}>{dateLabel}</Text>
              <Text style={[styles.streak, { color: colors.textSecondary }]}>
                {streak > 0 ? t('today.streak', { count: streak }) : t(getGreetingKey())}
              </Text>
            </View>
          )}
          <Pressable
            onPress={() => (showSearch ? closeSearch() : setShowSearch(true))}
            hitSlop={6}
            style={({ pressed }) => [
              styles.iconButton,
              { backgroundColor: pressed ? colors.outline : colors.surfaceVariant },
            ]}
            accessibilityRole="button"
            accessibilityLabel={showSearch ? t('common.cancel') : t('a11y.search')}
          >
            <Icon name={showSearch ? 'x' : 'search'} size={18} color={colors.textSecondary} />
          </Pressable>
        </View>

        {nothingAtAll && !isSearching ? (
          <View style={styles.flex}>
            <SunArc done={0} total={0} />
          </View>
        ) : (
          <TodoSectionList
            sections={sections}
            onPressTodo={setSelectedTodoId}
            reorderSectionKey={isSearching ? undefined : 'active'}
            onReorder={reorderTodos}
            ListHeaderComponent={listHeader}
          />
        )}

        {!showSearch && <QuickAddBar onAdd={handleAddTodo} />}
      </KeyboardAvoidingView>

      {selectedTodoId && (
        <TodoDetailSheet todoId={selectedTodoId} onClose={() => setSelectedTodoId(null)} />
      )}
    </ScreenContainer>
  );
}

function getGreetingKey(): string {
  const hour = new Date().getHours();
  if (hour < 6) return 'today.greeting.night';
  if (hour < 12) return 'today.greeting.morning';
  if (hour < 18) return 'today.greeting.afternoon';
  return 'today.greeting.evening';
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xxs,
    minHeight: 52,
  },
  date: {
    ...Typography.bodyMedium,
    fontWeight: '600',
  },
  streak: {
    ...Typography.caption,
    marginTop: 2,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.control,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
});
