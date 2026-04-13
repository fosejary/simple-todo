import React, { useState, useCallback, useMemo } from 'react';
import { View, FlatList, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { getDateLocale } from '@/i18n/dateLocale';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { TodoDetailSheet } from '@/components/organisms/TodoDetailSheet';
import { TodoItem } from '@/components/molecules/TodoItem';
import { QuickAddBar } from '@/components/molecules/QuickAddBar';
import { SectionHeader } from '@/components/molecules/SectionHeader';
import { EmptyState } from '@/components/molecules/EmptyState';
import { StreakBadge } from '@/components/atoms/StreakBadge';
import { useTheme } from '@/hooks/useTheme';
import { useTodoStore } from '@/stores/todoStore';
import { Spacing } from '@/constants/theme';

function getGreetingKey(): string {
  const hour = new Date().getHours();
  if (hour < 6) return 'today.greeting.night';
  if (hour < 12) return 'today.greeting.morning';
  if (hour < 18) return 'today.greeting.afternoon';
  return 'today.greeting.evening';
}

export default function TodayScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dateLocale = getDateLocale();
  const today = format(new Date(), 'yyyy-MM-dd');
  const dateLabel = format(new Date(), t('dateFormat.monthDayWeekday'), { locale: dateLocale });

  // Store selectors
  const todos = useTodoStore((s) => s.todos);
  const categories = useTodoStore((s) => s.categories);
  const streaks = useTodoStore((s) => s.streaks);
  const addTodo = useTodoStore((s) => s.addTodo);
  const toggleTodo = useTodoStore((s) => s.toggleTodo);
  const toggleSubtask = useTodoStore((s) => s.toggleSubtask);
  const addSubtask = useTodoStore((s) => s.addSubtask);
  const deleteSubtask = useTodoStore((s) => s.deleteSubtask);
  const updateSubtask = useTodoStore((s) => s.updateSubtask);
  const updateTodo = useTodoStore((s) => s.updateTodo);
  const deleteTodo = useTodoStore((s) => s.deleteTodo);
  const moveTodoUp = useTodoStore((s) => s.moveTodoUp);
  const moveTodoDown = useTodoStore((s) => s.moveTodoDown);

  // Derived values
  const todayTodos = useMemo(() => {
    return todos
      .filter((t) => t.due_date === today && !t.is_deleted)
      .sort((a, b) => {
        if (a.is_completed !== b.is_completed) return a.is_completed ? 1 : -1;
        return a.sort_order - b.sort_order;
      });
  }, [todos, today]);

  const currentStreak = useMemo(() => {
    let count = 0;
    let date = new Date();
    const todayData = streaks[format(date, 'yyyy-MM-dd')];
    if (!todayData || todayData.todos_completed === 0) {
      date = new Date(date.getTime() - 86400000);
    }
    while (true) {
      const dateStr = format(date, 'yyyy-MM-dd');
      const data = streaks[dateStr];
      if (data && data.todos_completed > 0) {
        count++;
        date = new Date(date.getTime() - 86400000);
      } else {
        break;
      }
    }
    return count;
  }, [streaks]);

  // UI state
  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState('');

  // When searching, search ALL non-deleted todos; otherwise show today only
  const isSearching = showSearch && searchText.trim().length > 0;

  const filteredTodos = useMemo(() => {
    if (!searchText.trim()) return todayTodos;
    const q = searchText.trim().toLowerCase();
    // Search all non-deleted todos
    return todos
      .filter(
        (t) =>
          !t.is_deleted &&
          (t.title.toLowerCase().includes(q) ||
            (t.memo && t.memo.toLowerCase().includes(q)))
      )
      .sort((a, b) => {
        if (a.is_completed !== b.is_completed) return a.is_completed ? 1 : -1;
        return a.sort_order - b.sort_order;
      });
  }, [todos, todayTodos, searchText]);

  const activeTodos = useMemo(
    () => filteredTodos.filter((t) => !t.is_completed),
    [filteredTodos]
  );
  const completedTodos = useMemo(
    () => filteredTodos.filter((t) => t.is_completed),
    [filteredTodos]
  );

  const handleAddTodo = useCallback(
    (title: string) => {
      addTodo({ title, due_date: today });
    },
    [today]
  );

  const handleToggle = useCallback(
    (id: string) => {
      toggleTodo(id);
    },
    []
  );

  const handleUpdateMemo = useCallback(
    (id: string, memo: string) => {
      updateTodo(id, { memo });
    },
    []
  );

  const isEmpty = todayTodos.length === 0;

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={[styles.brandLabel, { color: colors.textSecondary }]}>
              SimpleTodo
            </Text>
            <View style={styles.headerActions}>
              <Pressable
                onPress={() => {
                  setShowSearch(!showSearch);
                  if (showSearch) setSearchText('');
                }}
                hitSlop={8}
              >
                <MaterialIcons
                  name={showSearch ? 'close' : 'search'}
                  size={22}
                  color={colors.textSecondary}
                />
              </Pressable>
              <StreakBadge count={currentStreak} />
            </View>
          </View>
          {showSearch ? (
            <View style={[styles.searchBar, { backgroundColor: colors.surfaceVariant }]}>
              <MaterialIcons name="search" size={18} color={colors.textDisabled} />
              <TextInput
                style={[styles.searchInput, { color: colors.textPrimary }]}
                placeholder={t('today.searchPlaceholder')}
                placeholderTextColor={colors.textDisabled}
                value={searchText}
                onChangeText={setSearchText}
                autoFocus
              />
              {searchText.length > 0 && (
                <Pressable onPress={() => setSearchText('')} hitSlop={8}>
                  <MaterialIcons name="close" size={16} color={colors.textDisabled} />
                </Pressable>
              )}
            </View>
          ) : (
            <>
              <Text style={[styles.dateLabel, { color: colors.textPrimary }]}>
                {dateLabel}
              </Text>
              <Text style={[styles.greeting, { color: colors.textSecondary }]}>
                {t(getGreetingKey())}
              </Text>
            </>
          )}
        </View>

        {isEmpty ? (
          <View style={styles.emptyWrapper}>
            <EmptyState
              icon="check-circle-outline"
              title={t('today.emptyTitle')}
              description={t('today.emptyDesc')}
            />
          </View>
        ) : (
          <FlatList
            data={isSearching ? filteredTodos : activeTodos}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              isSearching ? (
                <SectionHeader
                  title={`${t('today.searchResults')} ${t('today.searchCount', { count: filteredTodos.length })}`}
                  count={filteredTodos.length}
                />
              ) : activeTodos.length > 0 ? (
                <SectionHeader title={t('today.sectionActive')} count={activeTodos.length} />
              ) : null
            }
            renderItem={({ item }) => (
              <TodoItem
                todo={item}
                onToggle={handleToggle}
                onToggleSubtask={toggleSubtask}
                onAddSubtask={addSubtask}
                onDeleteSubtask={deleteSubtask}
                onUpdateSubtask={updateSubtask}
                onDelete={deleteTodo}
                onMoveUp={moveTodoUp}
                onMoveDown={moveTodoDown}
                onUpdateMemo={handleUpdateMemo}
                onPress={setSelectedTodoId}
                showDate={isSearching}
                categories={categories}
              />
            )}
            ListFooterComponent={
              !isSearching && completedTodos.length > 0 ? (
                <>
                  <SectionHeader
                    title={t('today.sectionCompleted')}
                    count={completedTodos.length}
                    collapsible
                    collapsed={!showCompleted}
                    onToggle={() => setShowCompleted(!showCompleted)}
                  />
                  {showCompleted &&
                    completedTodos.map((todo) => (
                      <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggle={handleToggle}
                        onToggleSubtask={toggleSubtask}
                        onUpdateSubtask={updateSubtask}
                        onDelete={deleteTodo}
                        onUpdateMemo={handleUpdateMemo}
                        onPress={setSelectedTodoId}
                        categories={categories}
                      />
                    ))}
                </>
              ) : null
            }
          />
        )}

        {/* Quick Add Bar */}
        <QuickAddBar onAdd={handleAddTodo} />

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
    paddingBottom: Spacing.sm,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  brandLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  dateLabel: {
    fontSize: 26,
    lineHeight: 34,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  greeting: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400' as const,
    marginTop: 2,
  },
  emptyWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 10,
    marginTop: Spacing.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400' as const,
    padding: 0,
    paddingVertical: Spacing.xs,
  },
  listContent: {
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.md,
  },
});
