import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Pressable, StyleSheet, Platform, Alert, Linking } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetTextInput,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import {
  format, parseISO, addDays, addMonths, subMonths, nextMonday, getDay,
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isToday,
} from 'date-fns';
import { getDateLocale } from '@/i18n/dateLocale';
import { Text, resolveFont } from '@/components/atoms/AppText';
import { Icon, type IconName } from '@/components/atoms/Icon';
import { CheckBox } from '@/components/atoms/CheckBox';
import { useTheme } from '@/hooks/useTheme';
import { useTodoActions } from '@/hooks/useTodoActions';
import { ensureReminderPermission } from '@/lib/reminders';
import { WEEKDAY_ORDER } from '@/lib/recurrence';
import { Spacing, Radius, Typography, Elevation, todoSwatch } from '@/constants/theme';
import { PASTEL_COLORS, CATEGORY_COLORS, Recurrence, SubTask } from '@/lib/types';
import { useTodoStore } from '@/stores/todoStore';

interface TodoDetailSheetProps {
  todoId: string | null;
  onClose: () => void;
}

const QUICK_TIMES = ['09:00', '13:00', '18:00'];

/** Text that commits to the store after a pause, on blur, and on unmount. */
function useDebouncedField(value: string, commit: (next: string) => void, delay = 400) {
  const [text, setText] = useState(value);
  const pending = useRef<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const commitRef = useRef(commit);
  commitRef.current = commit;

  useEffect(() => {
    if (pending.current === null) setText(value);
  }, [value]);

  const flush = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    if (pending.current !== null) {
      commitRef.current(pending.current);
      pending.current = null;
    }
  }, []);

  useEffect(() => flush, [flush]);

  const onChange = useCallback(
    (next: string) => {
      setText(next);
      pending.current = next;
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(flush, delay);
    },
    [delay, flush]
  );

  return { text, onChange, flush };
}

const inputFont = (style: object) => resolveFont(style as never);

function Chip({
  label,
  selected,
  onPress,
  icon,
  dotColor,
  disabled,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  icon?: IconName;
  dotColor?: string;
  disabled?: boolean;
}) {
  const { colors } = useTheme();
  const fg = selected ? colors.onPrimary : disabled ? colors.textDisabled : colors.textPrimary;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.chip, { backgroundColor: selected ? colors.primary : colors.surfaceVariant }]}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
    >
      {icon && <Icon name={icon} size={14} color={fg} />}
      {dotColor && <View style={[styles.chipDot, { backgroundColor: dotColor }]} />}
      <Text style={[styles.chipText, { color: fg }, selected && styles.chipTextSelected]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  const { colors } = useTheme();
  return (
    <View style={[styles.segmented, { backgroundColor: colors.surfaceVariant }]} accessibilityRole="radiogroup">
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            style={[styles.segment, selected && [{ backgroundColor: colors.surface }, Elevation.low]]}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
          >
            <Text
              style={[
                styles.segmentText,
                { color: selected ? colors.textPrimary : colors.textSecondary },
                selected && styles.chipTextSelected,
              ]}
            >
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function Section({
  label,
  trailing,
  children,
}: {
  label: string;
  trailing?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>{label}</Text>
        {trailing}
      </View>
      {children}
    </View>
  );
}

function SubtaskRow({ todoId, subtask }: { todoId: string; subtask: SubTask }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const toggleSubtask = useTodoStore((s) => s.toggleSubtask);
  const updateSubtask = useTodoStore((s) => s.updateSubtask);
  const deleteSubtask = useTodoStore((s) => s.deleteSubtask);
  const field = useDebouncedField(subtask.title, (next) => {
    const trimmed = next.trim();
    if (trimmed) updateSubtask(todoId, subtask.id, trimmed);
  });
  const style = [
    styles.subtaskInput,
    subtask.is_completed
      ? { color: colors.textTertiary, textDecorationLine: 'line-through' as const }
      : { color: colors.textPrimary },
  ];

  return (
    <View style={styles.subtaskRow}>
      <Pressable
        onPress={() => toggleSubtask(todoId, subtask.id)}
        hitSlop={8}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: subtask.is_completed }}
        style={[
          styles.subtaskCheck,
          subtask.is_completed
            ? { backgroundColor: colors.accent }
            : { borderWidth: 1.5, borderColor: colors.outline },
        ]}
      >
        {subtask.is_completed && <Icon name="check" size={12} color={colors.onAccent} />}
      </Pressable>
      <BottomSheetTextInput
        style={[style, inputFont(StyleSheet.flatten(style))]}
        value={field.text}
        onChangeText={field.onChange}
        onBlur={field.flush}
        onSubmitEditing={field.flush}
        returnKeyType="done"
      />
      <Pressable
        onPress={() => deleteSubtask(todoId, subtask.id)}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={t('common.delete')}
      >
        <Icon name="x" size={16} color={colors.textTertiary} />
      </Pressable>
    </View>
  );
}

export function TodoDetailSheet({ todoId, onClose }: TodoDetailSheetProps) {
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const dateLocale = getDateLocale();
  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['70%', '94%'], []);

  const todo = useTodoStore((s) => s.todos.find((x) => x.id === todoId));
  const categories = useTodoStore((s) => s.categories);
  const updateTodo = useTodoStore((s) => s.updateTodo);
  const toggleTodo = useTodoStore((s) => s.toggleTodo);
  const skipOccurrence = useTodoStore((s) => s.skipOccurrence);
  const addCategory = useTodoStore((s) => s.addCategory);
  const addSubtask = useTodoStore((s) => s.addSubtask);
  const { remove } = useTodoActions();

  const today = format(new Date(), 'yyyy-MM-dd');
  const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');
  const nextWeek = format(nextMonday(new Date()), 'yyyy-MM-dd');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerMonth, setPickerMonth] = useState(() =>
    todo?.due_date ? parseISO(todo.due_date) : new Date()
  );
  const [newSubtask, setNewSubtask] = useState('');

  const title = useDebouncedField(todo?.title ?? '', (next) => {
    const trimmed = next.trim();
    if (todoId && trimmed) updateTodo(todoId, { title: trimmed });
  });
  const memo = useDebouncedField(todo?.memo ?? '', (next) => {
    if (todoId) updateTodo(todoId, { memo: next });
  });

  useEffect(() => {
    sheetRef.current?.present();
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    ),
    []
  );

  if (!todoId || !todo) return null;

  const dueDate = todo.due_date;
  const isPreset = dueDate === today || dueDate === tomorrow || dueDate === nextWeek;
  const isCustomDate = !!dueDate && !isPreset;
  const subtasks = (todo.subtasks ?? []).slice().sort((a, b) => a.sort_order - b.sort_order);
  const doneSubtasks = subtasks.filter((s) => s.is_completed).length;
  const isImportant = todo.priority > 0;
  const dayLabels = t('calendar.dayLabels', { returnObjects: true }) as string[];
  const timeLabel = (hhmm: string) =>
    format(parseISO(`2000-01-01T${hhmm}:00`), 'p', { locale: dateLocale });

  const haptic = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  const handleToggle = () => {
    haptic();
    toggleTodo(todoId);
  };

  const handleDelete = () => {
    sheetRef.current?.dismiss();
    remove(todoId);
  };

  const setTime = async (hhmm: string | null) => {
    updateTodo(todoId, { due_time: hhmm });
    if (!hhmm || Platform.OS === 'web') return;
    const granted = await ensureReminderPermission();
    if (!granted) {
      Alert.alert(t('detail.notificationsOff'), t('detail.notificationsOffDesc'), [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('detail.openSettings'), onPress: () => Linking.openSettings() },
      ]);
    }
  };

  const pickTime = () => {
    if (Platform.OS !== 'android') return;
    const [h, m] = (todo.due_time ?? '09:00').split(':').map(Number);
    const value = new Date();
    value.setHours(h, m, 0, 0);
    DateTimePickerAndroid.open({
      mode: 'time',
      value,
      onChange: (event, date) => {
        if (event.type === 'set' && date) setTime(format(date, 'HH:mm'));
      },
    });
  };

  const handleAddCategory = () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    const autoColor = CATEGORY_COLORS[categories.length % CATEGORY_COLORS.length];
    const id = addCategory(trimmed, autoColor);
    updateTodo(todoId, { category_id: id });
    setNewCategoryName('');
    setShowAddCategory(false);
  };

  const handleAddSubtask = () => {
    const trimmed = newSubtask.trim();
    if (!trimmed) return;
    addSubtask(todoId, trimmed);
    setNewSubtask('');
  };

  type RepeatKey = 'none' | Recurrence['type'];
  const repeatValue: RepeatKey = todo.recurrence?.type ?? 'none';
  const setRepeat = (v: RepeatKey) => {
    if (v === 'none') return updateTodo(todoId, { recurrence: null });
    const rule: Recurrence = { type: v, interval: 1 };
    if (v === 'weekly') rule.days_of_week = [getDay(dueDate ? parseISO(dueDate) : new Date())];
    updateTodo(todoId, { recurrence: rule });
  };
  // Older weekly rules have no saved weekdays: they repeat on the due date's weekday.
  const weekdays =
    todo.recurrence?.type === 'weekly'
      ? todo.recurrence.days_of_week?.length
        ? todo.recurrence.days_of_week
        : [getDay(dueDate ? parseISO(dueDate) : new Date())]
      : [];
  const toggleWeekday = (d: number) => {
    const next = weekdays.includes(d) ? weekdays.filter((x) => x !== d) : [...weekdays, d];
    if (next.length === 0) return; // at least one day
    updateTodo(todoId, { recurrence: { type: 'weekly', interval: 1, days_of_week: next.sort() } });
  };

  const titleStyle = [styles.titleInput, { color: todo.is_completed ? colors.textTertiary : colors.textPrimary }];
  const memoStyle = [styles.memoInput, { color: colors.textPrimary, backgroundColor: colors.surfaceSunken }];
  const plainInputStyle = [styles.inlineInput, { color: colors.textPrimary }];
  const subtaskAddStyle = [styles.subtaskInput, { color: colors.textPrimary }];

  const renderMiniCalendar = () => {
    const days = eachDayOfInterval({
      start: startOfWeek(startOfMonth(pickerMonth), { weekStartsOn: 0 }),
      end: endOfWeek(endOfMonth(pickerMonth), { weekStartsOn: 0 }),
    });
    return (
      <View style={[styles.miniCal, { backgroundColor: colors.surfaceSunken }]}>
        <View style={styles.miniCalNav}>
          <Pressable onPress={() => setPickerMonth(subMonths(pickerMonth, 1))} hitSlop={10} accessibilityLabel={t('a11y.prevMonth')}>
            <Icon name="chevron-left" size={20} color={colors.textSecondary} />
          </Pressable>
          <Text style={[styles.miniCalMonth, { color: colors.textPrimary }]}>
            {format(pickerMonth, t('dateFormat.monthYear'), { locale: dateLocale })}
          </Text>
          <Pressable onPress={() => setPickerMonth(addMonths(pickerMonth, 1))} hitSlop={10} accessibilityLabel={t('a11y.nextMonth')}>
            <Icon name="chevron-right" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>
        <View style={styles.miniCalWeek}>
          {dayLabels.map((d, i) => (
            <Text
              key={d}
              style={[styles.miniCalDayLabel, { color: i === 0 ? colors.error : colors.textTertiary }]}
            >
              {d}
            </Text>
          ))}
        </View>
        <View style={styles.miniCalGrid}>
          {days.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const inMonth = isSameMonth(day, pickerMonth);
            const selected = dateStr === dueDate;
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
                <View
                  style={[
                    styles.miniCalDayCircle,
                    selected
                      ? { backgroundColor: colors.primary }
                      : isTodayDate && { backgroundColor: colors.accentSoft },
                  ]}
                >
                  <Text
                    style={[
                      styles.miniCalDayText,
                      {
                        color: selected
                          ? colors.onPrimary
                          : isTodayDate
                            ? colors.accentText
                            : !inMonth
                              ? colors.textDisabled
                              : colors.textPrimary,
                      },
                      (selected || isTodayDate) && styles.chipTextSelected,
                    ]}
                  >
                    {format(day, 'd')}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      onDismiss={onClose}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      keyboardBlurBehavior="restore"
      backgroundStyle={{ backgroundColor: colors.surface, borderRadius: Radius.sheet }}
      handleIndicatorStyle={{ backgroundColor: colors.outline, width: 40, height: 4 }}
    >
      <BottomSheetScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.xxl }}
      >
        {/* Title */}
        <View style={styles.titleRow}>
          <View style={styles.titleCheck}>
            <CheckBox checked={todo.is_completed} onToggle={handleToggle} size={26} />
          </View>
          <BottomSheetTextInput
            style={[titleStyle, inputFont(StyleSheet.flatten(titleStyle))]}
            value={title.text}
            onChangeText={title.onChange}
            onBlur={title.flush}
            placeholder={t('detail.titlePlaceholder')}
            placeholderTextColor={colors.textTertiary}
            multiline
            blurOnSubmit
            returnKeyType="done"
          />
          <Pressable
            onPress={() => {
              haptic();
              updateTodo(todoId, { priority: isImportant ? 0 : 1 });
            }}
            hitSlop={10}
            style={styles.starButton}
            accessibilityRole="button"
            accessibilityState={{ selected: isImportant }}
            accessibilityLabel={isImportant ? t('detail.unmarkImportant') : t('detail.markImportant')}
          >
            <MaterialIcons
              name={isImportant ? 'star' : 'star-outline'}
              size={26}
              color={isImportant ? colors.accentText : colors.textTertiary}
            />
          </Pressable>
        </View>

        {/* Date */}
        <Section
          label={t('detail.dueDate')}
          trailing={
            dueDate ? (
              <Text style={[styles.sectionValue, { color: colors.accentText }]}>
                {format(parseISO(dueDate), t('dateFormat.monthDayWeekday'), { locale: dateLocale })}
              </Text>
            ) : null
          }
        >
          <View style={styles.chipWrap}>
            <Chip label={t('detail.today')} selected={dueDate === today} onPress={() => updateTodo(todoId, { due_date: today })} />
            <Chip label={t('detail.tomorrow')} selected={dueDate === tomorrow} onPress={() => updateTodo(todoId, { due_date: tomorrow })} />
            <Chip label={t('detail.nextWeek')} selected={dueDate === nextWeek} onPress={() => updateTodo(todoId, { due_date: nextWeek })} />
            <Chip
              icon="calendar"
              label={
                isCustomDate
                  ? format(parseISO(dueDate!), t('dateFormat.monthDay'), { locale: dateLocale })
                  : t('detail.pickDate')
              }
              selected={isCustomDate}
              onPress={() => setShowDatePicker((v) => !v)}
            />
            <Chip
              label={t('detail.noDate')}
              selected={!dueDate}
              onPress={() => {
                updateTodo(todoId, { due_date: null, due_time: null });
                setShowDatePicker(false);
              }}
            />
          </View>
          {showDatePicker && renderMiniCalendar()}
        </Section>

        {/* Reminder time */}
        <Section label={t('detail.time')}>
          {dueDate ? (
            <View style={styles.chipWrap}>
              <Chip label={t('detail.none')} selected={!todo.due_time} onPress={() => setTime(null)} />
              {QUICK_TIMES.map((hhmm) => (
                <Chip key={hhmm} label={timeLabel(hhmm)} selected={todo.due_time === hhmm} onPress={() => setTime(hhmm)} />
              ))}
              {Platform.OS === 'android' && (
                <Chip
                  icon="clock"
                  label={
                    todo.due_time && !QUICK_TIMES.includes(todo.due_time)
                      ? timeLabel(todo.due_time)
                      : t('detail.pickTime')
                  }
                  selected={!!todo.due_time && !QUICK_TIMES.includes(todo.due_time)}
                  onPress={pickTime}
                />
              )}
            </View>
          ) : (
            <Text style={[styles.hint, { color: colors.textTertiary }]}>{t('detail.timeNeedsDate')}</Text>
          )}
        </Section>

        {/* Category */}
        <Section label={t('detail.category')}>
          <View style={styles.chipWrap}>
            <Chip label={t('detail.none')} selected={!todo.category_id} onPress={() => updateTodo(todoId, { category_id: null })} />
            {categories.map((cat) => (
              <Chip
                key={cat.id}
                label={cat.name}
                dotColor={cat.color}
                selected={todo.category_id === cat.id}
                onPress={() => updateTodo(todoId, { category_id: cat.id })}
              />
            ))}
            {!showAddCategory && (
              <Pressable
                onPress={() => setShowAddCategory(true)}
                style={[styles.chip, styles.chipOutline, { borderColor: colors.outline }]}
                accessibilityRole="button"
                accessibilityLabel={t('category.addCategory')}
              >
                <Icon name="plus" size={14} color={colors.textSecondary} />
              </Pressable>
            )}
          </View>
          {showAddCategory && (
            <View style={[styles.inlineInputRow, { backgroundColor: colors.surfaceSunken }]}>
              <BottomSheetTextInput
                style={[plainInputStyle, inputFont(StyleSheet.flatten(plainInputStyle))]}
                value={newCategoryName}
                onChangeText={setNewCategoryName}
                placeholder={t('detail.categoryNamePlaceholder')}
                placeholderTextColor={colors.textTertiary}
                onSubmitEditing={handleAddCategory}
                returnKeyType="done"
                autoFocus
              />
              <Pressable onPress={handleAddCategory} hitSlop={8} disabled={!newCategoryName.trim()}>
                <Icon name="check" size={20} color={newCategoryName.trim() ? colors.textPrimary : colors.textDisabled} />
              </Pressable>
              <Pressable
                onPress={() => {
                  setShowAddCategory(false);
                  setNewCategoryName('');
                }}
                hitSlop={8}
              >
                <Icon name="x" size={20} color={colors.textTertiary} />
              </Pressable>
            </View>
          )}
        </Section>

        {/* Repeat */}
        <Section label={t('detail.recurrence')}>
          <Segmented<RepeatKey>
            value={repeatValue}
            onChange={setRepeat}
            options={[
              { value: 'none', label: t('detail.repeatNone') },
              { value: 'daily', label: t('detail.daily') },
              { value: 'weekly', label: t('detail.weekly') },
              { value: 'monthly', label: t('detail.monthly') },
            ]}
          />
          {repeatValue === 'weekly' && (
            <View style={styles.weekdayRow}>
              {WEEKDAY_ORDER.map((d) => {
                const on = weekdays.includes(d);
                return (
                  <Pressable
                    key={d}
                    onPress={() => toggleWeekday(d)}
                    style={[styles.weekday, { backgroundColor: on ? colors.primary : colors.surfaceVariant }]}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: on }}
                  >
                    <Text
                      style={[
                        styles.weekdayText,
                        { color: on ? colors.onPrimary : colors.textSecondary },
                        on && styles.chipTextSelected,
                      ]}
                    >
                      {dayLabels[d]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
          {todo.recurrence && !todo.is_completed && (
            <Pressable
              onPress={() => {
                haptic();
                skipOccurrence(todoId);
              }}
              style={styles.skipButton}
              hitSlop={6}
              accessibilityRole="button"
            >
              <Icon name="skip-forward" size={15} color={colors.accentText} />
              <Text style={[styles.skipText, { color: colors.accentText }]}>{t('detail.skipOccurrence')}</Text>
            </Pressable>
          )}
        </Section>

        {/* Row color */}
        <Section label={t('detail.color')}>
          <View style={styles.colorRow}>
            {PASTEL_COLORS.map((c, i) => {
              const selected = (todo.color ?? null) === c;
              return (
                <Pressable
                  key={`p-${i}`}
                  onPress={() => updateTodo(todoId, { color: c })}
                  style={[
                    styles.colorDot,
                    {
                      backgroundColor: c ? todoSwatch(c, isDark) : colors.surface,
                      borderColor: selected ? colors.textPrimary : colors.hairline,
                      borderWidth: selected ? 2 : 1,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={c === null ? t('detail.none') : undefined}
                >
                  {c === null && !selected && <Icon name="slash" size={14} color={colors.textTertiary} />}
                </Pressable>
              );
            })}
          </View>
        </Section>

        {/* Memo */}
        <Section label={t('detail.memo')}>
          <BottomSheetTextInput
            style={[memoStyle, inputFont(StyleSheet.flatten(memoStyle))]}
            value={memo.text}
            onChangeText={memo.onChange}
            onBlur={memo.flush}
            placeholder={t('todo.memoPlaceholder')}
            placeholderTextColor={colors.textTertiary}
            multiline
          />
        </Section>

        {/* Subtasks */}
        <Section
          label={t('detail.subtasks')}
          trailing={
            subtasks.length > 0 ? (
              <Text style={[styles.sectionValue, { color: colors.textTertiary }]}>
                {doneSubtasks}/{subtasks.length}
              </Text>
            ) : null
          }
        >
          {subtasks.map((st) => (
            <SubtaskRow key={st.id} todoId={todoId} subtask={st} />
          ))}
          <View style={styles.subtaskRow}>
            <Icon name="plus" size={18} color={colors.textTertiary} />
            <BottomSheetTextInput
              style={[subtaskAddStyle, inputFont(StyleSheet.flatten(subtaskAddStyle))]}
              value={newSubtask}
              onChangeText={setNewSubtask}
              placeholder={t('todo.subtaskPlaceholder')}
              placeholderTextColor={colors.textTertiary}
              onSubmitEditing={handleAddSubtask}
              returnKeyType="done"
              blurOnSubmit={false}
            />
          </View>
        </Section>

        <Pressable
          onPress={handleDelete}
          style={({ pressed }) => [
            styles.deleteButton,
            { borderColor: colors.hairline },
            pressed && { backgroundColor: colors.errorContainer },
          ]}
          accessibilityRole="button"
        >
          <Icon name="trash-2" size={16} color={colors.error} />
          <Text style={[styles.deleteText, { color: colors.error }]}>{t('detail.delete')}</Text>
        </Pressable>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    paddingLeft: Spacing.xl,
    paddingRight: Spacing.md,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.sm,
  },
  titleCheck: {
    paddingTop: 1,
  },
  titleInput: {
    flex: 1,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
    padding: 0,
    textAlignVertical: 'top',
  },
  starButton: {
    width: 36,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs + 2,
  },
  sectionLabel: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    flex: 1,
  },
  sectionValue: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  },
  hint: {
    ...Typography.caption,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    height: 36,
    borderRadius: Radius.control,
  },
  chipOutline: {
    borderWidth: 1,
    borderStyle: 'dashed',
    paddingHorizontal: 11,
  },
  chipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  chipText: {
    fontSize: 14,
    lineHeight: 20,
  },
  chipTextSelected: {
    fontWeight: '600',
  },
  segmented: {
    flexDirection: 'row',
    padding: 3,
    gap: 3,
    borderRadius: Radius.control + 2,
  },
  segment: {
    flex: 1,
    height: 34,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentText: {
    fontSize: 14,
    lineHeight: 20,
  },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  weekday: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekdayText: {
    fontSize: 14,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    marginTop: Spacing.sm,
    paddingVertical: Spacing.xxs,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  inlineInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
    borderRadius: Radius.control,
    paddingHorizontal: Spacing.sm,
  },
  inlineInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: Spacing.sm,
  },
  miniCal: {
    marginTop: Spacing.sm,
    borderRadius: Radius.panel,
    padding: Spacing.sm,
  },
  miniCalNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  miniCalMonth: {
    fontSize: 15,
    fontWeight: '600',
  },
  miniCalWeek: {
    flexDirection: 'row',
  },
  miniCalDayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    paddingVertical: 4,
  },
  miniCalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  miniCalCell: {
    width: '14.2857%',
    alignItems: 'center',
    paddingVertical: 2,
  },
  miniCalDayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniCalDayText: {
    fontSize: 14,
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  colorDot: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memoInput: {
    fontSize: 15,
    lineHeight: 22,
    borderRadius: Radius.control + 2,
    paddingHorizontal: 14,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    minHeight: 72,
    textAlignVertical: 'top',
  },
  subtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    minHeight: 44,
  },
  subtaskCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtaskInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: Spacing.xs,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    height: 48,
    marginTop: Spacing.lg,
    marginHorizontal: Spacing.xl,
    borderRadius: Radius.control + 2,
    borderWidth: 1,
  },
  deleteText: {
    fontSize: 15,
    fontWeight: '500',
  },
});
