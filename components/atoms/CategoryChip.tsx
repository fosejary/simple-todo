import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Typography, Spacing, BorderRadius } from '@/constants/theme';

interface CategoryChipProps {
  label: string;
  color?: string;
  selected?: boolean;
  onPress?: () => void;
}

export function CategoryChip({
  label,
  color,
  selected = false,
  onPress,
}: CategoryChipProps) {
  const { colors } = useTheme();
  const chipColor = color || colors.primary;

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? chipColor : colors.surfaceVariant,
          borderColor: selected ? chipColor : 'transparent',
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            color: selected ? '#FFFFFF' : colors.textPrimary,
            fontWeight: selected ? '600' : '400',
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xxs + 3,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    marginRight: Spacing.xs,
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
  },
});
