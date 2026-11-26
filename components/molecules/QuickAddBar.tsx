import React, { useState, useRef } from 'react';
import { View, Pressable, StyleSheet, TextInput as RNTextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { TextInput } from '@/components/atoms/AppText';
import { Icon } from '@/components/atoms/Icon';
import { useTheme } from '@/hooks/useTheme';
import { Spacing, Radius, Elevation } from '@/constants/theme';

interface QuickAddBarProps {
  onAdd: (title: string) => void;
  placeholder?: string;
}

/** Floating pill at the bottom of list screens. Focus stays put for rapid entry. */
export function QuickAddBar({ onAdd, placeholder }: QuickAddBarProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const label = placeholder ?? t('quickAdd.placeholder');
  const [text, setText] = useState('');
  const inputRef = useRef<RNTextInput>(null);
  const canAdd = text.trim().length > 0;

  const handleAdd = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText('');
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.pill,
          { backgroundColor: colors.surface, borderColor: colors.hairline },
          Elevation.float,
        ]}
      >
        <Icon name="plus" size={20} color={colors.textTertiary} />
        <TextInput
          ref={inputRef}
          style={[styles.input, { color: colors.textPrimary }]}
          placeholder={label}
          placeholderTextColor={colors.textTertiary}
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
          blurOnSubmit={false}
          accessibilityLabel={label}
        />
        <Pressable
          onPress={handleAdd}
          disabled={!canAdd}
          style={[styles.send, { backgroundColor: canAdd ? colors.primary : colors.surfaceVariant }]}
          accessibilityRole="button"
          accessibilityLabel={t('detail.add')}
          accessibilityState={{ disabled: !canAdd }}
        >
          <Icon name="arrow-up" size={18} color={canAdd ? colors.onPrimary : colors.textTertiary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.sm,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs + 2,
    height: 52,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    paddingLeft: 18,
    paddingRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    paddingVertical: Spacing.xs,
  },
  send: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
