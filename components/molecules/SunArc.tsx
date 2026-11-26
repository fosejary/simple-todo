import React, { useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { Text } from '@/components/atoms/AppText';
import { useTheme } from '@/hooks/useTheme';
import { Fonts, Spacing, Typography } from '@/constants/theme';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface SunArcProps {
  done: number;
  total: number;
}

/**
 * Today's progress as the sun crossing the sky: it rises on the left and
 * reaches the far horizon when every task is done.
 */
export function SunArc({ done, total }: SunArcProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { width: screenW } = useWindowDimensions();

  const W = Math.min(screenW, 480) - Spacing.lg * 2;
  const R = W / 2 - 24;
  const H = R + 22;
  const cx = W / 2;
  const cy = H - 8;
  const arcLen = Math.PI * R;
  const arcPath = `M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`;

  const ratio = total > 0 ? done / total : 0;
  const progress = useSharedValue(ratio);

  useEffect(() => {
    progress.value = withTiming(ratio, { duration: 500, easing: Easing.out(Easing.cubic) });
  }, [ratio]);

  const fillProps = useAnimatedProps(() => ({
    strokeDashoffset: arcLen * (1 - progress.value),
  }));
  const sunPos = (p: number) => {
    'worklet';
    const theta = Math.PI * (1 - p);
    return { cx: cx + R * Math.cos(theta), cy: cy - R * Math.sin(theta) };
  };
  const glowProps = useAnimatedProps(() => sunPos(progress.value));
  const sunProps = useAnimatedProps(() => sunPos(progress.value));

  const remaining = total - done;
  const caption =
    total === 0
      ? t('today.arcEmpty')
      : remaining === 0
        ? t('today.allDoneShort')
        : t('today.remaining', { count: remaining });

  return (
    <View style={[styles.wrap, { height: H + 4 }]}>
      <Svg
        width={W}
        height={H}
        accessibilityRole="image"
        accessibilityLabel={t('today.progress', { done, total })}
      >
        <Line x1={0} y1={cy} x2={W} y2={cy} stroke={colors.horizon} strokeWidth={1} />
        <Path d={arcPath} stroke={colors.arcTrack} strokeWidth={6} strokeLinecap="round" fill="none" />
        {total > 0 && (
          <AnimatedPath
            d={arcPath}
            stroke={colors.accent}
            strokeWidth={6}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${arcLen} ${arcLen}`}
            animatedProps={fillProps}
          />
        )}
        <AnimatedCircle r={17} fill={colors.accent} fillOpacity={0.16} animatedProps={glowProps} />
        <AnimatedCircle r={9} fill={colors.accent} animatedProps={sunProps} />
      </Svg>
      <View style={[styles.center, { top: H * 0.38 }]} pointerEvents="none">
        {total > 0 && (
          <Text style={[styles.count, { color: colors.textPrimary }]}>
            {done}
            <Text style={[styles.total, { color: colors.textTertiary }]}> / {total}</Text>
          </Text>
        )}
        <Text style={[styles.caption, { color: colors.textSecondary }]}>{caption}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.xs,
    alignItems: 'center',
  },
  center: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  count: {
    ...Typography.display,
    fontVariant: ['tabular-nums'],
  },
  total: {
    fontFamily: Fonts.display,
    fontSize: 24,
  },
  caption: {
    ...Typography.caption,
    marginTop: 2,
  },
});
