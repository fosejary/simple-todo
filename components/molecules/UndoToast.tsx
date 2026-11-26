import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { Text } from '@/components/atoms/AppText';
import { useTheme } from '@/hooks/useTheme';
import { useToastStore } from '@/stores/toastStore';
import { Spacing, Radius, Elevation, Typography } from '@/constants/theme';

const DURATION_MS = 4000;

/** Snackbar with an optional action, floating just above whatever its parent sits on. */
export function UndoToast() {
  const { colors } = useTheme();
  const toast = useToastStore((s) => s.toast);
  const hide = useToastStore((s) => s.hide);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(hide, DURATION_MS);
    return () => clearTimeout(timer);
  }, [toast?.id]);

  if (!toast) return null;

  return (
    <View style={styles.anchor}>
      <Animated.View
        key={toast.id}
        entering={FadeInDown.duration(200)}
        exiting={FadeOutDown.duration(150)}
        style={[styles.toast, { backgroundColor: colors.toastBg }, Elevation.float]}
        accessibilityLiveRegion="polite"
      >
        <Pressable style={styles.messageArea} onPress={hide}>
          <Text style={[styles.message, { color: colors.toastText }]} numberOfLines={2}>
            {toast.message}
          </Text>
        </Pressable>
        {toast.actionLabel && toast.onAction && (
          <Pressable
            onPress={() => {
              toast.onAction?.();
              hide();
            }}
            hitSlop={8}
            style={styles.action}
            accessibilityRole="button"
          >
            <Text style={[styles.actionText, { color: colors.toastAction }]}>{toast.actionLabel}</Text>
          </Pressable>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  anchor: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: '100%',
    pointerEvents: 'box-none',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.panel,
    paddingLeft: Spacing.md,
    paddingRight: Spacing.xs,
    minHeight: 48,
  },
  messageArea: {
    flex: 1,
    paddingVertical: Spacing.sm,
  },
  message: {
    ...Typography.callout,
    fontWeight: '500',
  },
  action: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  actionText: {
    ...Typography.label,
  },
});
