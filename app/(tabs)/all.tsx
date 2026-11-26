import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, Pressable, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, BackHandler } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Text } from '@/components/atoms/AppText';
import { Icon } from '@/components/atoms/Icon';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { EmptyState } from '@/components/molecules/EmptyState';
import { QuickAddBar } from '@/components/molecules/QuickAddBar';
import { TodoDetailSheet } from '@/components/organisms/TodoDetailSheet';
import { TodoSectionList } from '@/components/organisms/TodoSectionList';
import { CategoryEditor } from '@/components/organisms/CategoryEditor';
import { useTheme } from '@/hooks/useTheme';
import { useTodoStore } from '@/stores/todoStore';
import { Category, Todo } from '@/lib/types';
import { Spacing, Radius, Typography } from '@/constants/theme';

const UNCATEGORIZED = '__uncategorized__';

interface Group {
  active: Todo[];
  completed: Todo[];
}

/** Active todos: dated first (soonest first), then undated, then manual order. */
const byDueThenOrder = (a: Todo, b: Todo) => {
  if (a.due_date !== b.due_date) {
    if (!a.due_date) return 1;
    if (!b.due_date) return -1;
    return a.due_date.localeCompare(b.due_date);
  }
  return a.sort_order - b.sort_order;
};

type MaterialName = keyof typeof MaterialIcons.glyphMap;

export default function CategoryScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const todos = useTodoStore((s) => s.todos);
  const categories = useTodoStore((s) => s.categories);
  const addTodo = useTodoStore((s) => s.addTodo);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showCategoryEditor, setShowCategoryEditor] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  // Category detail is local state, not a route — make the Android back button leave it.
  useEffect(() => {
    if (!selectedCategoryId) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      setSelectedCategoryId(null);
      return true;
    });
    return () => sub.remove();
  }, [selectedCategoryId]);

  useEffect(() => {
    setShowCompleted(false);
  }, [selectedCategoryId]);

  const groups = useMemo(() => {
    const known = new Set(categories.map((c) => c.id));
    const map = new Map<string, Group>();
    for (const todo of todos) {
      if (todo.is_deleted) continue;
      const key = todo.category_id && known.has(todo.category_id) ? todo.category_id : UNCATEGORIZED;
      let g = map.get(key);
      if (!g) {
        g = { active: [], completed: [] };
        map.set(key, g);
      }
      (todo.is_completed ? g.completed : g.active).push(todo);
    }
    for (const g of map.values()) {
      g.active.sort(byDueThenOrder);
      g.completed.sort((a, b) => (b.completed_at ?? '').localeCompare(a.completed_at ?? ''));
    }
    return map;
  }, [todos, categories]);

  const emptyGroup: Group = { active: [], completed: [] };
  const groupFor = (id: string) => groups.get(id) ?? emptyGroup;
  const uncategorized = groupFor(UNCATEGORIZED);

  const totals = useMemo(() => {
    let active = 0;
    let completed = 0;
    for (const g of groups.values()) {
      active += g.active.length;
      completed += g.completed.length;
    }
    return { active, completed };
  }, [groups]);

  const openCreateCategory = () => {
    setEditingCategory(null);
    setShowCategoryEditor(true);
  };

  const openEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setShowCategoryEditor(true);
  };

  const selectedCategory =
    selectedCategoryId && selectedCategoryId !== UNCATEGORIZED
      ? categories.find((c) => c.id === selectedCategoryId) ?? null
      : null;

  const handleAddTodo = useCallback(
    (title: string) => {
      addTodo({ title, category_id: selectedCategoryId === UNCATEGORIZED ? null : selectedCategoryId });
    },
    [selectedCategoryId]
  );

  const editor = (
    <CategoryEditor
      category={editingCategory}
      visible={showCategoryEditor}
      onClose={() => setShowCategoryEditor(false)}
      onDeleted={() => setSelectedCategoryId(null)}
    />
  );

  const sheet = selectedTodoId ? (
    <TodoDetailSheet todoId={selectedTodoId} onClose={() => setSelectedTodoId(null)} />
  ) : null;

  // ---- Detail view (one category, or uncategorized) ----
  if (selectedCategoryId && (selectedCategory || selectedCategoryId === UNCATEGORIZED)) {
    const group = groupFor(selectedCategoryId);
    const name = selectedCategory?.name ?? t('category.uncategorized');
    const accent = selectedCategory?.color ?? colors.textTertiary;
    const icon = (selectedCategory?.icon || 'inbox') as MaterialName;
    const isEmpty = group.active.length === 0 && group.completed.length === 0;

    return (
      <ScreenContainer>
        <KeyboardAvoidingView style={styles.flex} behavior="padding" keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
          <View style={styles.detailHeader}>
            <Pressable
              onPress={() => setSelectedCategoryId(null)}
              hitSlop={6}
              style={({ pressed }) => [styles.iconButton, pressed && { backgroundColor: colors.surfaceVariant }]}
              accessibilityRole="button"
              accessibilityLabel={t('a11y.back')}
            >
              <Icon name="arrow-left" size={22} color={colors.textPrimary} />
            </Pressable>
            <MaterialIcons name={icon} size={22} color={accent} />
            <View style={styles.flex}>
              <Text style={[styles.detailTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                {name}
              </Text>
              <Text style={[styles.detailSubtitle, { color: colors.textSecondary }]}>
                {t('category.detailSummary', { active: group.active.length, completed: group.completed.length })}
              </Text>
            </View>
            {selectedCategory && (
              <Pressable
                onPress={() => openEditCategory(selectedCategory)}
                hitSlop={6}
                style={({ pressed }) => [styles.iconButton, pressed && { backgroundColor: colors.surfaceVariant }]}
                accessibilityRole="button"
                accessibilityLabel={t('categoryEditor.edit')}
              >
                <Icon name="edit-2" size={18} color={colors.textSecondary} />
              </Pressable>
            )}
          </View>

          {isEmpty ? (
            <View style={styles.flex}>
              <EmptyState
                icon={selectedCategory ? 'folder' : 'inbox'}
                title={selectedCategory ? t('category.noTodosTitle') : t('category.uncategorizedEmpty')}
                description={selectedCategory ? t('category.noTodosDesc') : undefined}
              />
            </View>
          ) : (
            <TodoSectionList
              hideCategory
              onPressTodo={setSelectedTodoId}
              sections={[
                { key: 'active', title: t('category.sectionActive'), data: group.active, showDate: true },
                {
                  key: 'completed',
                  title: t('today.sectionCompleted'),
                  data: group.completed,
                  showDate: true,
                  collapsible: true,
                  collapsed: !showCompleted,
                  onToggle: () => setShowCompleted((v) => !v),
                },
              ]}
            />
          )}

          <QuickAddBar
            onAdd={handleAddTodo}
            placeholder={selectedCategory ? t('category.addTodoPlaceholder', { name }) : t('category.uncategorizedAddPlaceholder')}
          />
        </KeyboardAvoidingView>
        {editor}
        {sheet}
      </ScreenContainer>
    );
  }

  // ---- List view ----
  const rows: { key: string; cat: Category | null }[] = [
    ...categories.map((cat) => ({ key: cat.id, cat })),
    ...(uncategorized.active.length > 0 ? [{ key: UNCATEGORIZED, cat: null }] : []),
  ];

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>{t('category.title')}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {t('category.summary', { active: totals.active, completed: totals.completed })}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {categories.length === 0 && (
          <EmptyState icon="folder-plus" title={t('category.emptyTitle')} description={t('category.emptyDesc')} compact />
        )}
        <View style={[styles.panel, { backgroundColor: colors.surface, borderColor: colors.hairline }]}>
          {rows.map(({ key, cat }, i) => {
            const g = groupFor(cat?.id ?? UNCATEGORIZED);
            return (
              <Pressable
                key={key}
                onPress={() => setSelectedCategoryId(cat?.id ?? UNCATEGORIZED)}
                onLongPress={cat ? () => openEditCategory(cat) : undefined}
                style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.divider }]}
                accessibilityRole="button"
                accessibilityHint={cat ? t('a11y.longPressToEdit') : undefined}
              >
                {i > 0 && <View style={[styles.separator, { backgroundColor: colors.divider }]} />}
                <MaterialIcons
                  name={(cat?.icon || 'inbox') as MaterialName}
                  size={22}
                  color={cat?.color ?? colors.textTertiary}
                />
                <Text style={[styles.rowLabel, { color: cat ? colors.textPrimary : colors.textSecondary }]} numberOfLines={1}>
                  {cat?.name ?? t('category.uncategorized')}
                </Text>
                <Text style={[styles.rowCount, { color: colors.textTertiary }]}>{g.active.length}</Text>
                <Icon name="chevron-right" size={18} color={colors.textTertiary} />
              </Pressable>
            );
          })}
          <Pressable
            onPress={openCreateCategory}
            style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.divider }]}
            accessibilityRole="button"
          >
            {rows.length > 0 && <View style={[styles.separator, { backgroundColor: colors.divider }]} />}
            <View style={styles.addIcon}>
              <Icon name="plus" size={20} color={colors.textSecondary} />
            </View>
            <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>{t('category.addCategory')}</Text>
          </Pressable>
        </View>
      </ScrollView>
      {editor}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  title: {
    ...Typography.title,
  },
  subtitle: {
    ...Typography.caption,
    marginTop: 2,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxxl,
  },
  panel: {
    borderRadius: Radius.panel,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    minHeight: 56,
    paddingLeft: Spacing.md,
    paddingRight: Spacing.sm,
  },
  separator: {
    position: 'absolute',
    top: 0,
    left: 50,
    right: 0,
    height: StyleSheet.hairlineWidth,
  },
  addIcon: {
    width: 22,
    alignItems: 'center',
  },
  rowLabel: {
    ...Typography.body,
    flex: 1,
  },
  rowCount: {
    fontSize: 14,
    fontVariant: ['tabular-nums'],
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingLeft: Spacing.xs,
    paddingRight: Spacing.md,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xs,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailTitle: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600',
  },
  detailSubtitle: {
    ...Typography.caption,
    marginTop: 1,
  },
});
