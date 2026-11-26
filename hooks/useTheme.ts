import { useColorScheme } from 'react-native';
import { Colors, type ThemeColors } from '@/constants/theme';
import { useSettingsStore } from '@/stores/settingsStore';

export type { ThemeColors };

export function useTheme(): { colors: ThemeColors; isDark: boolean } {
  const systemScheme = useColorScheme();
  const themeSetting = useSettingsStore((s) => s.theme);

  const isDark =
    themeSetting === 'dark' ||
    (themeSetting === 'system' && systemScheme === 'dark');

  return {
    colors: isDark ? Colors.dark : Colors.light,
    isDark,
  };
}
