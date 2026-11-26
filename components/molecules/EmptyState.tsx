import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/atoms/AppText';
import { Icon, type IconName } from '@/components/atoms/Icon';
import { useTheme } from '@/hooks/useTheme';
import { Spacing, Typography } from '@/constants/theme';

interface EmptyStateProps {
  icon?: IconName;
  title: string;
  description?: string;
  compact?: boolean;
}

/** Quiet empty state: a muted line icon and two lines of text, no decoration. */
export function EmptyState({ icon, title, description, compact = false }: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, compact && styles.compact]}>
      {icon && <Icon name={icon} size={28} color={colors.textTertiary} />}
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      {!!description && (
        <Text style={[styles.description, { color: colors.textSecondary }]}>{description}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
    gap: Spacing.xs,
    minHeight: 240,
  },
  compact: {
    flex: 0,
    minHeight: 0,
    paddingVertical: Spacing.xxl,
  },
  title: {
    ...Typography.bodyMedium,
    textAlign: 'center',
    marginTop: Spacing.xxs,
  },
  description: {
    ...Typography.callout,
    textAlign: 'center',
  },
});
