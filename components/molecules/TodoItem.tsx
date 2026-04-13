import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { CheckBox } from '@/components/atoms/CheckBox';
import { useTheme } from '@/hooks/useTheme';
import { Typography, Spacing, BorderRadius, Elevation } from '@/constants/theme';
import { Todo, Category } from '@/lib/types';
import { format, parseISO } from 'date-fns';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onPress: (id: string) => void;
  onToggleSubtask?: (todoId: string, subtaskId: string) => void;
  onAddSubtask?: (todoId: string, title: string) => void;
  onDeleteSubtask?: (todoId: string, subtaskId: string) => void;
  onUpdateSubtask?: (todoId: string, subtaskId: string, title: string) => void;
  onDelete?: (id: string) => void;
  onMoveUp?: (id: string) => void;
  onMoveDown?: (id: string) => void;
  onUpdateMemo?: (id: string, memo: string) => void;
  showDate?: boolean;
  categories?: Category[];
}

export function TodoItem({
  todo,
  onToggle,
  onPress,
  onToggleSubtask,
  onAddSubtask,
  onDeleteSubtask,
  onUpdateSubtask,
  onDelete,
  onMoveUp,
  onMoveDown,
  onUpdateMemo,
  showDate = false,
  categories = [],
}: TodoItemProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const subtasks = todo.subtasks || [];
  const hasSubtasks = subtasks.length > 0;
  const completedCount = subtasks.filter((st) => st.is_completed).length;
  const [expanded, setExpanded] = useState(false);
  const [newSubtaskText, setNewSubtaskText] = useState('');
  const [memoText, setMemoText] = useState(todo.memo || '');
  const memoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<TextInput>(null);
  const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null);
  const [editingSubtaskText, setEditingSubtaskText] = useState('');

  const handleSubtaskEditDone = useCallback(
    (subtaskId: string) => {
      const trimmed = editingSubtaskText.trim();
      if (trimmed && onUpdateSubtask) {
        onUpdateSubtask(todo.id, subtaskId, trimmed);
      }
      setEditingSubtaskId(null);
      setEditingSubtaskText('');
    },
    [editingSubtaskText, onUpdateSubtask, todo.id]
  );

  // Sync memoText when todo.memo changes externally
  useEffect(() => {
    setMemoText(todo.memo || '');
  }, [todo.memo]);

  const handleMemoChange = useCallback(
    (text: string) => {
      setMemoText(text);
      if (memoTimerRef.current) clearTimeout(memoTimerRef.current);
      memoTimerRef.current = setTimeout(() => {
        onUpdateMemo?.(todo.id, text);
      }, 300);
    },
    [todo.id, onUpdateMemo]
  );

  const category = useMemo(() => {
    if (!todo.category_id || categories.length === 0) return null;
    return categories.find((c) => c.id === todo.category_id) || null;
  }, [todo.category_id, categories]);

  const handleMainPress = () => {
    setExpanded(!expanded);
  };

  const handleAddSubtask = () => {
    const trimmed = newSubtaskText.trim();
    if (!trimmed || !onAddSubtask) return;
    onAddSubtask(todo.id, trimmed);
    setNewSubtaskText('');
  };

  const handleDelete = () => {
    if (!onDelete) return;
    if (Platform.OS === 'web') {
      if (window.confirm(t('todo.deleteConfirmMessage'))) {
        onDelete(todo.id);
      }
    } else {
      Alert.alert(
        t('todo.deleteConfirmTitle'),
        t('todo.deleteConfirmMessage'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('common.delete'), style: 'destructive', onPress: () => onDelete(todo.id) },
        ]
      );
    }
  };

  return (
    <View style={{ opacity: todo.is_completed ? 0.6 : 1 }}>
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
      layout={Layout.springify()}
      style={styles.cardWrapper}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderLeftWidth: todo.color ? 4 : 0,
            borderLeftColor: todo.color || 'transparent',
          },
          Elevation.level1,
        ]}
      >
        {/* Main row */}
        <Pressable
          onPress={handleMainPress}
          onLongPress={() => onPress(todo.id)}
          style={styles.container}
        >
          <CheckBox
            checked={todo.is_completed}
            onToggle={() => onToggle(todo.id)}
          />
          <View style={styles.content}>
            <Text
              style={[
                styles.title,
                {
                  color: todo.is_completed
                    ? colors.textDisabled
                    : colors.textPrimary,
                  textDecorationLine: todo.is_completed
                    ? 'line-through'
                    : 'none',
                },
              ]}
              numberOfLines={2}
            >
              {todo.title}
            </Text>
            <View style={styles.meta}>
              {showDate && todo.due_date && (
                <View style={[styles.metaBadge, { backgroundColor: colors.surfaceVariant }]}>
                  <MaterialIcons name="event" size={11} color={colors.textSecondary} />
                  <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                    {format(parseISO(todo.due_date), 'MM.dd')}
                  </Text>
                </View>
              )}
              {category && (
                <View
                  style={[
                    styles.categoryChip,
                    {
                      backgroundColor: `${category.color}15`,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.categoryDot,
                      { backgroundColor: category.color },
                    ]}
                  />
                  <Text
                    style={[
                      styles.categoryChipText,
                      { color: category.color },
                    ]}
                    numberOfLines={1}
                  >
                    {category.name}
                  </Text>
                </View>
              )}
              {hasSubtasks && (
                <View style={[styles.subtaskBadge, { backgroundColor: colors.surfaceVariant }]}>
                  <MaterialIcons
                    name={completedCount === subtasks.length ? 'check-circle' : 'checklist'}
                    size={11}
                    color={completedCount === subtasks.length ? colors.success : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.badgeText,
                      { color: completedCount === subtasks.length ? colors.success : colors.textSecondary },
                    ]}
                  >
                    {completedCount}/{subtasks.length}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <MaterialIcons
            name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
            size={20}
            color={colors.textDisabled}
          />
        </Pressable>

        {/* Expanded panel: subtasks + inline add -- inside the card */}
        {expanded && (
          <View
            style={[
              styles.expandedPanel,
              {
                borderTopColor: colors.divider,
              },
            ]}
          >
            {/* Memo field */}
            {onUpdateMemo && (
              <View style={styles.memoSection}>
                <MaterialIcons name="notes" size={14} color={colors.textSecondary} />
                <TextInput
                  style={[styles.memoInput, { color: colors.textPrimary, backgroundColor: colors.surfaceVariant }]}
                  value={memoText}
                  onChangeText={handleMemoChange}
                  placeholder={t('todo.memoPlaceholder')}
                  placeholderTextColor={colors.textDisabled}
                  multiline
                />
              </View>
            )}

            {/* Existing subtasks */}
            {subtasks
              .slice()
              .sort((a, b) => {
                if (a.is_completed !== b.is_completed) return a.is_completed ? 1 : -1;
                return a.sort_order - b.sort_order;
              })
              .map((st) => (
                <View key={st.id} style={styles.subtaskRow}>
                  <Pressable
                    onPress={() => onToggleSubtask?.(todo.id, st.id)}
                    hitSlop={6}
                  >
                    <MaterialIcons
                      name={st.is_completed ? 'check-circle' : 'radio-button-unchecked'}
                      size={16}
                      color={st.is_completed ? colors.success : colors.outline}
                    />
                  </Pressable>
                  {editingSubtaskId === st.id ? (
                    <TextInput
                      style={[
                        styles.subtaskTitle,
                        {
                          color: colors.textPrimary,
                          padding: 0,
                        },
                      ]}
                      value={editingSubtaskText}
                      onChangeText={setEditingSubtaskText}
                      onBlur={() => handleSubtaskEditDone(st.id)}
                      onSubmitEditing={() => handleSubtaskEditDone(st.id)}
                      autoFocus
                      returnKeyType="done"
                    />
                  ) : (
                    <Pressable
                      style={styles.subtaskTitlePressable}
                      onPress={() => {
                        setEditingSubtaskId(st.id);
                        setEditingSubtaskText(st.title);
                      }}
                    >
                      <Text
                        style={[
                          styles.subtaskTitle,
                          {
                            color: st.is_completed ? colors.textDisabled : colors.textPrimary,
                            textDecorationLine: st.is_completed ? 'line-through' : 'none',
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {st.title}
                      </Text>
                    </Pressable>
                  )}
                  <Pressable
                    onPress={() => onDeleteSubtask?.(todo.id, st.id)}
                    hitSlop={6}
                    style={styles.subtaskDeleteBtn}
                  >
                    <MaterialIcons name="close" size={14} color={colors.textDisabled} />
                  </Pressable>
                </View>
              ))}

            {/* Inline add input */}
            <View style={styles.addRow}>
              <MaterialIcons name="add" size={16} color={colors.primary} />
              <TextInput
                ref={inputRef}
                style={[styles.addInput, { color: colors.textPrimary }]}
                value={newSubtaskText}
                onChangeText={setNewSubtaskText}
                placeholder={t('todo.subtaskPlaceholder')}
                placeholderTextColor={colors.textDisabled}
                onSubmitEditing={handleAddSubtask}
                returnKeyType="done"
                blurOnSubmit={false}
              />
              {newSubtaskText.trim().length > 0 && (
                <Pressable onPress={handleAddSubtask} hitSlop={8}>
                  <MaterialIcons name="check" size={18} color={colors.primary} />
                </Pressable>
              )}
            </View>

            {/* Quick actions: move + delete + open detail sheet */}
            <View style={[styles.actionRow, { borderTopColor: colors.divider }]}>
              <View style={styles.moveButtons}>
                {onMoveUp && !todo.is_completed && (
                  <Pressable
                    onPress={() => onMoveUp(todo.id)}
                    hitSlop={6}
                    style={[styles.moveBtn, { backgroundColor: colors.surfaceVariant }]}
                  >
                    <MaterialIcons name="arrow-upward" size={14} color={colors.textSecondary} />
                  </Pressable>
                )}
                {onMoveDown && !todo.is_completed && (
                  <Pressable
                    onPress={() => onMoveDown(todo.id)}
                    hitSlop={6}
                    style={[styles.moveBtn, { backgroundColor: colors.surfaceVariant }]}
                  >
                    <MaterialIcons name="arrow-downward" size={14} color={colors.textSecondary} />
                  </Pressable>
                )}
                {onDelete && (
                  <Pressable
                    onPress={handleDelete}
                    hitSlop={6}
                    style={[styles.moveBtn, { backgroundColor: colors.errorContainer }]}
                  >
                    <MaterialIcons name="close" size={14} color={colors.error} />
                  </Pressable>
                )}
              </View>
              <Pressable
                onPress={() => onPress(todo.id)}
                style={[styles.detailButton, { backgroundColor: colors.surfaceVariant }]}
              >
                <MaterialIcons name="tune" size={14} color={colors.textSecondary} />
                <Text style={[styles.detailButtonText, { color: colors.textSecondary }]}>
                  {t('todo.detailButton')}
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xs,
  },
  card: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    gap: Spacing.sm,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500' as const,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  metaText: {
    fontSize: 11,
    fontWeight: '500' as const,
  },
  subtaskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  categoryChipText: {
    fontSize: 11,
    fontWeight: '500' as const,
    maxWidth: 80,
  },
  expandedPanel: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xxs,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  memoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.xs,
    paddingVertical: 6,
    marginBottom: 4,
  },
  memoInput: {
    ...Typography.caption,
    flex: 1,
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.xs,
    borderRadius: 6,
    minHeight: 32,
    maxHeight: 80,
    textAlignVertical: 'top',
  },
  subtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: 6,
  },
  subtaskTitle: {
    ...Typography.caption,
    flex: 1,
  },
  subtaskDeleteBtn: {
    padding: 2,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: 6,
    marginTop: 2,
  },
  addInput: {
    ...Typography.caption,
    flex: 1,
    padding: 0,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginTop: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  moveButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  moveBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtaskTitlePressable: {
    flex: 1,
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  detailButtonText: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
});
