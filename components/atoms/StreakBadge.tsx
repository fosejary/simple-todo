import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import { Typography, Spacing, BorderRadius, Elevation } from '@/constants/theme';

interface StreakBadgeProps {
  count: number;
}

export function StreakBadge({ count }: StreakBadgeProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  if (count === 0) return null;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colors.warningContainer,
        },
        Elevation.level1,
      ]}
    >
      <Text style={styles.fire}>{'🔥'}</Text>
      <Text style={[styles.count, { color: colors.streakFire }]}>{count}</Text>
      <Text style={[styles.label, { color: colors.streakFire }]}>{t('streak.days')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs + 2,
    borderRadius: BorderRadius.xl,
    gap: 3,
  },
  fire: {
    fontSize: 13,
  },
  count: {
    fontSize: 13,
    fontWeight: '800' as const,
  },
  label: {
    fontSize: 11,
    fontWeight: '500' as const,
  },
});
