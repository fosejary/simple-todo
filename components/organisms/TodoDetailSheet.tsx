import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { getDateLocale } from '@/i18n/dateLocale';
import { useTheme } from '@/hooks/useTheme';
import { Typography, Spacing, BorderRadius, Elevation } from '@/constants/theme';
import { PASTEL_COLORS, CATEGORY_COLORS, Recurrence } from '@/lib/types';
import { useTodoStore } from '@/stores/todoStore';
import {
  format, parseISO, addDays, addMonths, subMonths,
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isSameDay, isToday,
} from 'date-fns';

interface TodoDetailSheetProps {
  todoId: string | null;
  onClose: () => void;
}

export function TodoDetailSheet({ todoId, onClose }: TodoDetailSheetProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dateLocale = getDateLocale();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['55%', '80%'], []);

  const todo = useTodoStore((s) => s.todos.find((t) => t.id === todoId));
  const updateTodo = useTodoStore((s) => s.updateTodo);
  const deleteTodo = useTodoStore((s) => s.deleteTodo);
  const categories = useTodoStore((s) => s.categories);
  const addCategory = useTodoStore((s) => s.addCategory);

  const today = format(new Date(), 'yyyy-MM-dd');
  const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerMonth, setPickerMonth] = useState(new Date());

  // Title inline editing with debounce
  const [titleText, setTitleText] = useState(todo?.title || '');
  const titleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setTitleText(todo?.title || '');
  }, [todo?.title]);

  const handleTitleChange = useCallback(
    (text: string) => {
      setTitleText(text);
      if (titleTimerRef.current) clearTimeout(titleTimerRef.current);
      titleTimerRef.current = setTimeout(() => {
        if (todoId && text.trim()) {
          updateTodo(todoId, { title: text.trim() });
        }
      }, 300);
    },
    [todoId, updateTodo]
  );

  const handleClose = useCallback(() => {
    bottomSheetRef.current?.close();
    onClose();
  }, [onClose]);

  const doDelete = () => {
    if (todoId) {
      deleteTodo(todoId);
      handleClose();
    }
  };

  const handleDelete = () => {
    if (Platform.OS === 'web') {
      if (window.confirm(t('todo.deleteConfirmMessage'))) {
        doDelete();
      }
    } else {
      Alert.alert(
        t('todo.deleteConfirmTitle'),
        t('todo.deleteConfirmMessage'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('common.delete'), style: 'destructive', onPress: doDelete },
        ]
      );
    }
  };

  const handleAddCategory = () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    const autoColor = CATEGORY_COLORS[categories.length % CATEGORY_COLORS.length];
    const id = addCategory(trimmed, autoColor);
    if (todoId) updateTodo(todoId, { category_id: id });
    setNewCategoryName('');
    setShowAddCategory(false);
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  if (!todoId || !todo) return null;

  const categoryName =
    categories.find((c) => c.id === todo.category_id)?.name || null;
  const todoColor = todo.color || null;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onClose={onClose}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={[
        { backgroundColor: colors.surface },
        { borderTopLeftRadius: 20, borderTopRightRadius: 20 },
      ]}
      handleIndicatorStyle={{
        backgroundColor: colors.outline,
        width: 36,
        height: 4,
        borderRadius: 2,
      }}
    >
      <BottomSheetView style={styles.content}>
        {/* Title */}
        <View style={styles.titleSection}>
          <TextInput
            style={[styles.sheetTitle, { color: colors.textPrimary }]}
            value={titleText}
            onChangeText={handleTitleChange}
            placeholder={t('detail.titlePlaceholder')}
            placeholderTextColor={colors.textDisabled}
            multiline
            numberOfLines={2}
            blurOnSubmit
            returnKeyType="done"
          />
        </View>

        <BottomSheetScrollView showsVerticalScrollIndicator={false}>
          {/* Due Date */}
          <View style={[styles.section, { borderBottomColor: colors.divider }]}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="event" size={20} color={colors.textSecondary} />
              <Text style={[styles.sectionLabel, { color: colors.textPrimary }]}>
                {t('detail.dueDate')}
              </Text>
              {todo.due_date && (
                <Text style={{ fontSize: 13, color: colors.textSecondary }}>
                  {format(parseISO(todo.due_date), 'yyyy.MM.dd')}
                </Text>
              )}
            </View>
            <View style={styles.chipWrap}>
              {([
                { label: t('detail.none'), value: null },
                { label: t('detail.today'), value: today },
                { label: t('detail.tomorrow'), value: tomorrow },
              ] as { label: string; value: string | null }[]).map((opt) => {
                const isSelected = todo.due_date === opt.value;
                return (
                  <Pressable
                    key={opt.label}
                    onPress={() => {
                      updateTodo(todoId, { due_date: opt.value });
                    }}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: isSelected ? colors.primary : colors.surfaceVariant,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        { color: isSelected ? '#FFF' : colors.textSecondary },
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
              {/* Calendar picker toggle */}
              <Pressable
                onPress={() => setShowDatePicker(!showDatePicker)}
                style={[
                  styles.chip,
                  { backgroundColor: showDatePicker ? colors.primary : colors.surfaceVariant },
                ]}
              >
                <MaterialIcons
                  name="calendar-month"
                  size={14}
                  color={showDatePicker ? '#FFF' : colors.textSecondary}
                />
                <Text style={[styles.chipText, { color: showDatePicker ? '#FFF' : colors.textSecondary }]}>
                  {t('detail.calendar')}
                </Text>
              </Pressable>
            </View>

            {/* Mini calendar */}
            {showDatePicker && (() => {
              const monthStart = startOfMonth(pickerMonth);
              const monthEnd = endOfMonth(pickerMonth);
              const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
              const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
              const days = eachDayOfInterval({ start: calStart, end: calEnd });
              const selectedDateStr = todo.due_date || '';
              return (
                <View style={styles.miniCal}>
                  <View style={styles.miniCalNav}>
                    <Pressable onPress={() => setPickerMonth(subMonths(pickerMonth, 1))} hitSlop={8}>
                      <MaterialIcons name="chevron-left" size={20} color={colors.textPrimary} />
                    </Pressable>
                    <Text style={[styles.miniCalMonth, { color: colors.textPrimary }]}>
                      {format(pickerMonth, t('dateFormat.monthYear'), { locale: dateLocale })}
                    </Text>
                    <Pressable onPress={() => setPickerMonth(addMonths(pickerMonth, 1))} hitSlop={8}>
                      <MaterialIcons name="chevron-right" size={20} color={colors.textPrimary} />
                    </Pressable>
                  </View>
                  <View style={styles.miniCalWeek}>
                    {(t('calendar.dayLabels', { returnObjects: true }) as string[]).map((d: string, i: number) => (
                      <Text key={d} style={[styles.miniCalDayLabel, {
                        color: i === 0 ? colors.error : i === 6 ? colors.primary : colors.textSecondary,
                      }]}>{d}</Text>
                    ))}
                  </View>
                  <View style={styles.miniCalGrid}>
                    {days.map((day) => {
                      const dateStr = format(day, 'yyyy-MM-dd');
                      const inMonth = isSameMonth(day, pickerMonth);
                      const isSelected = dateStr === selectedDateStr;
                      const isTodayDate = isToday(day);
                      return (
                        <Pressable
                          key={dateStr}
                          onPress={() => {
                            updateTodo(todoId, { due_date: dateStr });
                            setShowDatePicker(false);
                          }}
                          style={styles.miniCalCell}
                        >
                          <View style={[
                            styles.miniCalDayCircle,
                            isSelected && { backgroundColor: colors.primary },
                            isTodayDate && !isSelected && { borderWidth: 1, borderColor: colors.primary },
                          ]}>
                            <Text style={[styles.miniCalDayText, {
                              color: isSelected ? '#FFF' : !inMonth ? colors.textDisabled : colors.textPrimary,
                              fontWeight: isTodayDate || isSelected ? '700' : '400',
                            }]}>{format(day, 'd')}</Text>
                          </View>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              );
            })()}
          </View>

          {/* Category */}
          <View style={[styles.section, { borderBottomColor: colors.divider }]}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="label" size={20} color={colors.textSecondary} />
              <Text style={[styles.sectionLabel, { color: colors.textPrimary }]}>
                {t('detail.category')}
              </Text>
            </View>
            <View style={styles.chipWrap}>
              <Pressable
                onPress={() => updateTodo(todoId, { category_id: null })}
                style={[
                  styles.chip,
                  {
                    backgroundColor: !todo.category_id ? colors.primary : colors.surfaceVariant,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: !todo.category_id ? '#FFF' : colors.textSecondary },
                  ]}
                >
                  {t('detail.none')}
                </Text>
              </Pressable>
              {categories.map((cat) => (
                <Pressable
                  key={cat.id}
                  onPress={() => updateTodo(todoId, { category_id: cat.id })}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: todo.category_id === cat.id ? colors.primary : colors.surfaceVariant,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      { color: todo.category_id === cat.id ? '#FFF' : colors.textSecondary },
                    ]}
                  >
                    {cat.name}
                  </Text>
                </Pressable>
              ))}
              <Pressable
                onPress={() => setShowAddCategory(true)}
                style={[styles.chip, { backgroundColor: colors.surfaceVariant }]}
              >
                <MaterialIcons name="add" size={14} color={colors.primary} />
                <Text style={[styles.chipText, { color: colors.primary }]}>{t('detail.add')}</Text>
              </Pressable>
            </View>
            {showAddCategory && (
              <View style={styles.addCategoryRow}>
                <TextInput
                  style={[styles.addCategoryInput, { color: colors.textPrimary, borderColor: colors.outline, backgroundColor: colors.surfaceVariant }]}
                  value={newCategoryName}
                  onChangeText={setNewCategoryName}
                  placeholder={t('detail.categoryNamePlaceholder')}
                  placeholderTextColor={colors.textDisabled}
                  onSubmitEditing={handleAddCategory}
                  autoFocus
                />
                <Pressable onPress={handleAddCategory}>
                  <MaterialIcons name="check" size={22} color={colors.primary} />
                </Pressable>
                <Pressable onPress={() => { setShowAddCategory(false); setNewCategoryName(''); }}>
                  <MaterialIcons name="close" size={22} color={colors.textDisabled} />
                </Pressable>
              </View>
            )}
          </View>

          {/* Recurrence */}
          <View style={[styles.section, { borderBottomColor: colors.divider }]}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="repeat" size={20} color={colors.textSecondary} />
              <Text style={[styles.sectionLabel, { color: colors.textPrimary }]}>
                {t('detail.recurrence')}
              </Text>
            </View>
            <View style={styles.chipWrap}>
              {([
                { label: t('detail.none'), value: null },
                { label: t('detail.daily'), value: { type: 'daily' as const, interval: 1 } },
                { label: t('detail.weekly'), value: { type: 'weekly' as const, interval: 1 } },
                { label: t('detail.monthly'), value: { type: 'monthly' as const, interval: 1 } },
              ] as { label: string; value: Recurrence | null }[]).map((opt) => {
                const isSelected = opt.value === null
                  ? !todo.recurrence
                  : todo.recurrence?.type === opt.value?.type;
                return (
                  <Pressable
                    key={opt.label}
                    onPress={() => updateTodo(todoId, { recurrence: opt.value })}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: isSelected ? colors.primary : colors.surfaceVariant,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        { color: isSelected ? '#FFF' : colors.textSecondary },
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Color */}
          <View style={[styles.section, { borderBottomColor: colors.divider }]}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="palette" size={20} color={colors.textSecondary} />
              <Text style={[styles.sectionLabel, { color: colors.textPrimary }]}>
                {t('detail.color')}
              </Text>
              {todoColor && (
                <View style={[styles.currentColorDot, { backgroundColor: todoColor }]} />
              )}
            </View>

            {/* Pastel palette */}
            <View style={styles.colorGrid}>
              {PASTEL_COLORS.map((c, i) => (
                <Pressable
                  key={`p-${i}`}
                  onPress={() => updateTodo(todoId, { color: c })}
                  style={[
                    styles.colorDot,
                    {
                      backgroundColor: c || colors.surface,
                      borderColor: todoColor === c
                        ? colors.primary
                        : c ? c : colors.outline,
                      borderWidth: todoColor === c ? 2.5 : 1,
                    },
                  ]}
                >
                  {c === null && (
                    <MaterialIcons name="block" size={14} color={colors.textDisabled} />
                  )}
                  {todoColor === c && c !== null && (
                    <MaterialIcons name="check" size={14} color="#FFFFFF" />
                  )}
                </Pressable>
              ))}
            </View>

          </View>

          {/* Delete */}
          <Pressable
            onPress={handleDelete}
            style={[styles.deleteButton, { backgroundColor: colors.errorContainer }]}
          >
            <MaterialIcons name="delete-outline" size={18} color={colors.error} />
            <Text style={[styles.deleteText, { color: colors.error }]}>
              {t('detail.delete')}
            </Text>
          </Pressable>
        </BottomSheetScrollView>
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  titleSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 26,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '500' as const,
    flex: 1,
  },
  currentColorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  miniCal: {
    marginTop: Spacing.sm,
  },
  miniCalNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  miniCalMonth: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  miniCalWeek: {
    flexDirection: 'row',
  },
  miniCalDayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600' as const,
    paddingVertical: 2,
  },
  miniCalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  miniCalCell: {
    width: '14.28%',
    alignItems: 'center',
    paddingVertical: 3,
  },
  miniCalDayCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniCalDayText: {
    fontSize: 13,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    marginRight: 8,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  addCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  addCategoryInput: {
    fontSize: 14,
    fontWeight: '400' as const,
    flex: 1,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 6,
  },
  colorDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm + 2,
    marginTop: Spacing.lg,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  deleteText: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
});
