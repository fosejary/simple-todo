import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Typography, Spacing } from '@/constants/theme';

interface SectionHeaderProps {
  title: string;
  count?: number;
  collapsible?: boolean;
  collapsed?: boolean;
  onToggle?: () => void;
}

export function SectionHeader({
  title,
  count,
  collapsible = false,
  collapsed = false,
  onToggle,
}: SectionHeaderProps) {
  const { colors } = useTheme();

  const content = (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={[styles.title, { color: colors.textSecondary }]}>
          {title}
        </Text>
        {count !== undefined && (
          <View style={[styles.countBadge, { backgroundColor: colors.surfaceVariant }]}>
            <Text style={[styles.countText, { color: colors.textSecondary }]}>
              {count}
            </Text>
          </View>
        )}
      </View>
      {collapsible && (
        <MaterialIcons
          name={collapsed ? 'expand-more' : 'expand-less'}
          size={18}
          color={colors.textSecondary}
        />
      )}
    </View>
  );

  if (collapsible && onToggle) {
    return <Pressable onPress={onToggle}>{content}</Pressable>;
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs + 2,
    marginTop: Spacing.sm,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  title: {
    fontSize: 12,
    fontWeight: '700' as const,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  countBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    minWidth: 20,
    alignItems: 'center',
  },
  countText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
});
