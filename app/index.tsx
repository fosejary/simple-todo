import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import { useTodoStore } from '@/stores/todoStore';
import { Typography, Spacing } from '@/constants/theme';

export default function SplashScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const setFirstLaunchDone = useTodoStore((s) => s.setFirstLaunchDone);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    // Fade in animation
    opacity.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) });
    translateY.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) });

    // Navigate to main after 1 second
    const timer = setTimeout(() => {
      setFirstLaunchDone();
      router.replace('/(tabs)/today');
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <Animated.View style={[styles.content, animStyle]}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{'✓'}</Text>
        </View>
        <Text style={styles.appName}>SimpleTodo</Text>
        <Text style={styles.tagline}>{t('splash.tagline')}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  icon: {
    fontSize: 36,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  appName: {
    ...Typography.heading,
    color: '#FFFFFF',
    fontSize: 28,
  },
  tagline: {
    ...Typography.body,
    color: 'rgba(255,255,255,0.8)',
  },
});
