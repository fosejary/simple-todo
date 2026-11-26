import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Text } from '@/components/atoms/AppText';
import { Icon } from '@/components/atoms/Icon';
import { useTheme } from '@/hooks/useTheme';
import { Spacing, Typography } from '@/constants/theme';

interface SectionHeaderProps {
  title: string;
  count?: number;
  collapsible?: boolean;
  collapsed?: boolean;
  onToggle?: () => void;
  action?: { label: string; onPress: () => void };
}

export function SectionHeader({
  title,
  count,
  collapsible = false,
  collapsed = false,
  onToggle,
  action,
}: SectionHeaderProps) {
  const { colors } = useTheme();

  const label = (
    <View style={styles.labelRow}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      {count !== undefined && (
        <Text style={[styles.count, { color: colors.textTertiary }]}>{count}</Text>
      )}
      {collapsible && (
        <Icon name={collapsed ? 'chevron-down' : 'chevron-up'} size={16} color={colors.textTertiary} />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {collapsible && onToggle ? (
        <Pressable
          onPress={onToggle}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityState={{ expanded: !collapsed }}
        >
          {label}
        </Pressable>
      ) : (
        label
      )}
      {action && (
        <Pressable onPress={action.onPress} hitSlop={10} accessibilityRole="button">
          <Text style={[styles.action, { color: colors.accentText }]}>{action.label}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xs,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    ...Typography.label,
  },
  count: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  },
  action: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
});
