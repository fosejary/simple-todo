import React, { useMemo, useState } from 'react';
import { Modal, View, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Text, TextInput } from '@/components/atoms/AppText';
import { Icon } from '@/components/atoms/Icon';
import { useTheme } from '@/hooks/useTheme';
import { useTodoStore } from '@/stores/todoStore';
import { showToast } from '@/stores/toastStore';
import { parseTaskLines } from '@/lib/backup';
import { Spacing, Radius, Typography, Elevation } from '@/constants/theme';

type Target = 'none' | 'today';

export function TextImportModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const importTodos = useTodoStore((s) => s.importTodos);
  const [text, setText] = useState('');
  const [target, setTarget] = useState<Target>('none');

  const items = useMemo(() => parseTaskLines(text), [text]);

  const close = () => {
    setText('');
    setTarget('none');
    onClose();
  };

  const submit = () => {
    if (items.length === 0) return;
    const count = importTodos(items, {
      due_date: target === 'today' ? format(new Date(), 'yyyy-MM-dd') : null,
    });
    close();
    showToast({ message: t('toast.imported', { count }) });
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={close} presentationStyle="pageSheet">
      <KeyboardAvoidingView
        style={[styles.root, { backgroundColor: colors.background, paddingBottom: insets.bottom + Spacing.md }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? Spacing.md : insets.top + Spacing.xs }]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{t('importText.title')}</Text>
          <Pressable onPress={close} hitSlop={10} accessibilityRole="button" accessibilityLabel={t('a11y.close')}>
            <Icon name="x" size={22} color={colors.textSecondary} />
          </Pressable>
        </View>
        <Text style={[styles.help, { color: colors.textSecondary }]}>{t('importText.help')}</Text>

        <TextInput
          style={[
            styles.input,
            { color: colors.textPrimary, backgroundColor: colors.surface, borderColor: colors.hairline },
          ]}
          value={text}
          onChangeText={setText}
          placeholder={t('importText.placeholder')}
          placeholderTextColor={colors.textTertiary}
          multiline
          autoFocus
          textAlignVertical="top"
        />

        <View style={[styles.segmented, { backgroundColor: colors.surfaceVariant }]}>
          {(['none', 'today'] as Target[]).map((v) => {
            const selected = target === v;
            return (
              <Pressable
                key={v}
                onPress={() => setTarget(v)}
                style={[styles.segment, selected && [{ backgroundColor: colors.surface }, Elevation.low]]}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
              >
                <Text
                  style={[
                    styles.segmentText,
                    { color: selected ? colors.textPrimary : colors.textSecondary },
                    selected && { fontWeight: '600' },
                  ]}
                >
                  {v === 'none' ? t('importText.targetNoDate') : t('importText.targetToday')}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          onPress={submit}
          disabled={items.length === 0}
          style={[styles.submit, { backgroundColor: items.length ? colors.primary : colors.surfaceVariant }]}
          accessibilityRole="button"
        >
          <Text style={[styles.submitText, { color: items.length ? colors.onPrimary : colors.textTertiary }]}>
            {items.length ? t('importText.submit', { count: items.length }) : t('importText.submitEmpty')}
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Spacing.xxs,
  },
  title: {
    ...Typography.heading,
  },
  help: {
    ...Typography.callout,
  },
  input: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    borderRadius: Radius.panel,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.md,
    marginTop: Spacing.xxs,
  },
  segmented: {
    flexDirection: 'row',
    padding: 3,
    gap: 3,
    borderRadius: Radius.control + 2,
  },
  segment: {
    flex: 1,
    height: 36,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentText: {
    fontSize: 14,
  },
  submit: {
    height: 52,
    borderRadius: Radius.control + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
