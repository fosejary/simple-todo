import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

interface CheckBoxProps {
  checked: boolean;
  onToggle: () => void;
  size?: number;
}

export function CheckBox({ checked, onToggle, size = 24 }: CheckBoxProps) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(1, { damping: 4, stiffness: 300 }, () => {
      scale.value = 1;
    });
    scale.value = 1.3;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onToggle();
  };

  const borderColor = checked ? colors.success : colors.outline;
  const bgColor = checked ? colors.success : 'transparent';

  return (
    <Pressable onPress={handlePress} hitSlop={8}>
      <Animated.View
        style={[
          styles.container,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor,
            backgroundColor: bgColor,
            borderWidth: checked ? 0 : 2,
          },
          animatedStyle,
        ]}
      >
        {checked && (
          <MaterialIcons name="check" size={size * 0.65} color="#FFFFFF" />
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
