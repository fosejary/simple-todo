import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';

interface CheckBoxProps {
  checked: boolean;
  onToggle: () => void;
  size?: number;
  /** Ring color while unchecked (e.g. on a tinted row). */
  ringColor?: string;
}

/** Round check. Completed = the sun color with an ink check. */
export function CheckBox({ checked, onToggle, size = 22, ringColor }: CheckBoxProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withTiming(0.86, { duration: 70 }),
      withSpring(1, { damping: 14, stiffness: 320 })
    );
    onToggle();
  };

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={11}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={checked ? t('a11y.markIncomplete') : t('a11y.markComplete')}
    >
      <Animated.View
        style={[
          styles.box,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: checked ? 0 : 1.5,
            borderColor: ringColor ?? colors.outline,
            backgroundColor: checked ? colors.accent : 'transparent',
          },
          animatedStyle,
        ]}
      >
        {checked && <Feather name="check" size={Math.round(size * 0.62)} color={colors.onAccent} />}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
