import React, { useState, useCallback, useMemo } from 'react';
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
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { TodoItem } from '@/components/molecules/TodoItem';
import { EmptyState } from '@/components/molecules/EmptyState';
import { QuickAddBar } from '@/components/molecules/QuickAddBar';
import { TodoDetailSheet } from '@/components/organisms/TodoDetailSheet';
import { CategoryEditor } from '@/components/organisms/CategoryEditor';
import { useTheme } from '@/hooks/useTheme';
import { useTodoStore } from '@/stores/todoStore';
import { Category, Todo } from '@/lib/types';
import { Spacing, BorderRadius, Elevation } from '@/constants/theme';

export default function CategoryScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const todos = useTodoStore((s) => s.todos);
  const categories = useTodoStore((s) => s.categories);
  const addTodo = useTodoStore((s) => s.addTodo);
  const toggleTodo = useTodoStore((s) => s.toggleTodo);
  const toggleSubtask = useTodoStore((s) => s.toggleSubtask);
  const addSubtask = useTodoStore((s) => s.addSubtask);
  const deleteSubtaskAction = useTodoStore((s) => s.deleteSubtask);
  const updateSubtaskAction = useTodoStore((s) => s.updateSubtask);
  const updateTodo = useTodoStore((s) => s.updateTodo);
  const deleteTodo = useTodoStore((s) => s.deleteTodo);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showCategoryEditor, setShowCategoryEditor] = useState(false);

  // Group todos by category
  const activeTodos = useMemo(
    () => todos.filter((t) => !t.is_deleted && !t.is_completed),
    [todos]
  );

  const completedTodos = useMemo(
    () => todos.filter((t) => !t.is_deleted && t.is_completed),
    [todos]
  );

  const uncategorized = useMemo(
    () => activeTodos.filter((t) => !t.category_id).sort((a, b) => a.sort_order - b.sort_order),
    [activeTodos]
  );

  const categoryGroups = useMemo(() => {
    return categories.map((cat) => ({
      category: cat,
      todos: activeTodos
        .filter((t) => t.category_id === cat.id)
        .sort((a, b) => a.sort_order - b.sort_order),
      completedCount: completedTodos.filter((t) => t.category_id === cat.id).length,
    }));
  }, [categories, activeTodos, completedTodos]);

  // Selected category view
  const selectedGroup = useMemo(() => {
    if (!selectedCategoryId) return null;
    return categoryGroups.find((g) => g.category.id === selectedCategoryId) || null;
  }, [selectedCategoryId, categoryGroups]);

  const openCreateCategory = () => {
    setEditingCategory(null);
    setShowCategoryEditor(true);
  };

  const openEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setShowCategoryEditor(true);
  };

  const handleAddTodo = useCallback(
    (title: string) => {
      addTodo({
        title,
        category_id: selectedCategoryId,
      });
    },
    [selectedCategoryId]
  );

  const totalActive = activeTodos.length;
  const totalCompleted = completedTodos.length;

  // Detail view for uncategorized
  if (selectedCategoryId === '__uncategorized__') {
    return (
      <ScreenContainer>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={90}
        >
          <View style={styles.detailHeader}>
            <Pressable
              onPress={() => setSelectedCategoryId(null)}
              style={[styles.backButton, { backgroundColor: colors.surfaceVariant }]}
            >
              <MaterialIcons name="arrow-back" size={20} color={colors.textPrimary} />
            </Pressable>
            <View style={styles.detailHeaderText}>
              <Text style={[styles.detailTitle, { color: colors.textPrimary }]}>
                {t('category.uncategorized')}
              </Text>
              <Text style={[styles.detailSubtitle, { color: colors.textSecondary }]}>
                {t('category.uncategorizedInProgress', { count: uncategorized.length })}
              </Text>
            </View>
          </View>

          <ScrollView
            contentContainerStyle={styles.detailList}
            showsVerticalScrollIndicator={false}
          >
            {uncategorized.length === 0 ? (
              <EmptyState
                icon="inbox"
                title={t('category.uncategorizedEmpty')}
                description=""
              />
            ) : (
              uncategorized.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onToggleSubtask={toggleSubtask}
                  onAddSubtask={addSubtask}
                  onDeleteSubtask={deleteSubtaskAction}
                  onUpdateSubtask={updateSubtaskAction}
                  onDelete={deleteTodo}
                  onUpdateMemo={(id, memo) => updateTodo(id, { memo })}
                  onPress={setSelectedTodoId}
                  categories={categories}
                />
              ))
            )}
          </ScrollView>

          <QuickAddBar onAdd={(title) => addTodo({ title, category_id: null })} placeholder={t('category.uncategorizedAddPlaceholder')} />

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

  // Detail view for selected category
  if (selectedGroup) {
    return (
      <ScreenContainer>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={90}
        >
          {/* Header with back */}
          <View style={styles.detailHeader}>
            <Pressable
              onPress={() => setSelectedCategoryId(null)}
              style={[styles.backButton, { backgroundColor: colors.surfaceVariant }]}
            >
              <MaterialIcons name="arrow-back" size={20} color={colors.textPrimary} />
            </Pressable>
            <View style={styles.detailHeaderText}>
              <View style={styles.detailTitleRow}>
                <View style={[styles.catDotLarge, { backgroundColor: selectedGroup.category.color }]} />
                <Text style={[styles.detailTitle, { color: colors.textPrimary }]}>
                  {selectedGroup.category.name}
                </Text>
              </View>
              <Text style={[styles.detailSubtitle, { color: colors.textSecondary }]}>
                {t('category.detailSummary', { active: selectedGroup.todos.length, completed: selectedGroup.completedCount })}
              </Text>
            </View>
          </View>

          {/* Todo list */}
          <ScrollView
            contentContainerStyle={styles.detailList}
            showsVerticalScrollIndicator={false}
          >
            {selectedGroup.todos.length === 0 ? (
              <EmptyState
                icon="folder-open"
                title={t('category.noTodosTitle')}
                description={t('category.noTodosDesc')}
              />
            ) : (
              selectedGroup.todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onToggleSubtask={toggleSubtask}
                  onAddSubtask={addSubtask}
                  onDeleteSubtask={deleteSubtaskAction}
                  onUpdateSubtask={updateSubtaskAction}
                  onDelete={deleteTodo}
                  onUpdateMemo={(id, memo) => updateTodo(id, { memo })}
                  onPress={setSelectedTodoId}
                  categories={categories}
                />
              ))
            )}
          </ScrollView>

          <QuickAddBar onAdd={handleAddTodo} placeholder={t('category.addTodoPlaceholder', { name: selectedGroup.category.name })} />

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

  // Main category grid view
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
            {t('category.title')}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {t('category.summary', { active: totalActive, completed: totalCompleted })}
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Category cards */}
          <View style={styles.grid}>
            {categoryGroups.map((group) => {
              const total = group.todos.length + group.completedCount;
              const pct = total > 0 ? Math.round((group.completedCount / total) * 100) : 0;
              return (
                <Pressable
                  key={group.category.id}
                  onPress={() => setSelectedCategoryId(group.category.id)}
                  style={[
                    styles.categoryCard,
                    { backgroundColor: colors.surface },
                    Elevation.level1,
                  ]}
                >
                  {/* Color accent top */}
                  <View style={[styles.catAccent, { backgroundColor: group.category.color }]} />

                  {/* Edit button */}
                  <Pressable
                    onPress={(e) => {
                      e.stopPropagation?.();
                      openEditCategory(group.category);
                    }}
                    hitSlop={6}
                    style={styles.catEditBtn}
                  >
                    <MaterialIcons name="more-horiz" size={16} color={colors.textDisabled} />
                  </Pressable>

                  {/* Category icon */}
                  <View style={[styles.catIcon, { backgroundColor: `${group.category.color}18` }]}>
                    <MaterialIcons
                      name={(group.category.icon || 'assignment') as any}
                      size={22}
                      color={group.category.color}
                    />
                  </View>

                  {/* Name */}
                  <Text style={[styles.catCardName, { color: colors.textPrimary }]} numberOfLines={1}>
                    {group.category.name}
                  </Text>

                  {/* Stats row */}
                  <View style={styles.catStatsRow}>
                    <Text style={[styles.catCardCount, { color: colors.textSecondary }]}>
                      {t('category.activeCount', { count: group.todos.length })}
                    </Text>
                    {group.completedCount > 0 && (
                      <Text style={[styles.catCardCount, { color: colors.success }]}>
                        {t('category.completedCount', { count: group.completedCount })}
                      </Text>
                    )}
                  </View>

                  {/* Progress bar */}
                  {total > 0 && (
                    <View style={styles.progressWrap}>
                      <View style={[styles.progressBar, { backgroundColor: colors.surfaceVariant }]}>
                        <View
                          style={[
                            styles.progressFill,
                            { backgroundColor: group.category.color, width: `${pct}%` },
                          ]}
                        />
                      </View>
                      <Text style={[styles.progressPct, { color: colors.textDisabled }]}>
                        {pct}%
                      </Text>
                    </View>
                  )}
                </Pressable>
              );
            })}

            {/* Uncategorized card */}
            {uncategorized.length > 0 && (
              <Pressable
                onPress={() => setSelectedCategoryId('__uncategorized__')}
                style={[
                  styles.categoryCard,
                  { backgroundColor: colors.surface },
                  Elevation.level1,
                ]}
              >
                <View style={[styles.catAccent, { backgroundColor: colors.textDisabled }]} />
                <View style={[styles.catIcon, { backgroundColor: colors.surfaceVariant }]}>
                  <MaterialIcons name="inbox" size={22} color={colors.textDisabled} />
                </View>
                <Text style={[styles.catCardName, { color: colors.textSecondary }]} numberOfLines={1}>
                  {t('category.uncategorized')}
                </Text>
                <View style={styles.catStatsRow}>
                  <Text style={[styles.catCardCount, { color: colors.textDisabled }]}>
                    {t('category.activeCount', { count: uncategorized.length })}
                  </Text>
                </View>
              </Pressable>
            )}

            {/* Add category card */}
            <Pressable
              onPress={openCreateCategory}
              style={[
                styles.addCategoryCard,
                { borderColor: colors.outline },
              ]}
            >
              <MaterialIcons name="add" size={24} color={colors.textDisabled} />
              <Text style={[styles.addCategoryLabel, { color: colors.textDisabled }]}>
                {t('category.addCategory')}
              </Text>
            </Pressable>
          </View>

          {/* Category Editor Bottom Sheet */}
          <CategoryEditor
            category={editingCategory}
            visible={showCategoryEditor}
            onClose={() => setShowCategoryEditor(false)}
            onDeleted={() => setSelectedCategoryId(null)}
          />

          {/* Empty state */}
          {categories.length === 0 && uncategorized.length === 0 && (
            <EmptyState
              icon="category"
              title={t('category.emptyTitle')}
              description={t('category.emptyDesc')}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontSize: 26,
    lineHeight: 34,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  gridContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '47%',
    borderRadius: 16,
    overflow: 'hidden',
    paddingBottom: Spacing.md,
  },
  catAccent: {
    height: 4,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  catEditBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  catIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.md,
    marginLeft: Spacing.md,
  },
  catCardName: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  catStatsRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    marginTop: 4,
  },
  catCardCount: {
    fontSize: 11,
    fontWeight: '500' as const,
  },
  progressWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.xs,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressPct: {
    fontSize: 10,
    fontWeight: '600' as const,
  },
  addCategoryCard: {
    width: '47%',
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addCategoryLabel: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  // Detail view
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailHeaderText: {
    flex: 1,
  },
  detailTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  catDotLarge: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  detailSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  detailList: {
    paddingBottom: Spacing.xxl,
    paddingTop: Spacing.xs,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
