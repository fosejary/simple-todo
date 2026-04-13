import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  Pressable,
  Text,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import { Typography, Spacing, BorderRadius, Elevation } from '@/constants/theme';

interface QuickAddBarProps {
  onAdd: (title: string) => void;
  placeholder?: string;
}

export function QuickAddBar({
  onAdd,
  placeholder,
}: QuickAddBarProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const resolvedPlaceholder = placeholder ?? t('quickAdd.placeholder');
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);

  const handleAdd = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText('');
    // Keep focus on input for rapid entry
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface },
        Elevation.level3,
      ]}
    >
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: colors.surfaceVariant,
          },
        ]}
      >
        <MaterialIcons
          name="add"
          size={20}
          color={text.trim() ? colors.primary : colors.textDisabled}
          style={styles.inputIcon}
        />
        <TextInput
          ref={inputRef}
          style={[styles.input, { color: colors.textPrimary }]}
          placeholder={resolvedPlaceholder}
          placeholderTextColor={colors.textDisabled}
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
          blurOnSubmit={false}
        />
        <Pressable
          onPress={handleAdd}
          disabled={!text.trim()}
          style={[
            styles.addButton,
            {
              backgroundColor: text.trim()
                ? colors.primary
                : colors.outline,
            },
          ]}
        >
          <MaterialIcons name="arrow-upward" size={18} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.xl,
    paddingLeft: Spacing.xs,
    paddingRight: Spacing.xxs + 2,
    paddingVertical: Spacing.xxs + 2,
  },
  inputIcon: {
    marginLeft: Spacing.xxs,
    marginRight: Spacing.xxs,
  },
  input: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400' as const,
    paddingVertical: Spacing.xs,
  },
  addButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
