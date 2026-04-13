import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Typography, Spacing } from '@/constants/theme';

interface PropertyRowProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
}

export function PropertyRow({
  icon,
  label,
  value,
  onPress,
  rightElement,
}: PropertyRowProps) {
  const { colors } = useTheme();

  const content = (
    <View style={[styles.container, { borderBottomColor: colors.divider }]}>
      <View style={[styles.iconBox, { backgroundColor: colors.surfaceVariant }]}>
        <MaterialIcons name={icon} size={18} color={colors.textSecondary} />
      </View>
      <Text style={[styles.label, { color: colors.textPrimary }]}>
        {label}
      </Text>
      <View style={styles.right}>
        {rightElement || (
          <>
            {value && (
              <Text style={[styles.value, { color: colors.textSecondary }]}>
                {value}
              </Text>
            )}
            {onPress && (
              <MaterialIcons
                name="chevron-right"
                size={20}
                color={colors.textDisabled}
              />
            )}
          </>
        )}
      </View>
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400' as const,
    flex: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs,
  },
  value: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400' as const,
  },
});
