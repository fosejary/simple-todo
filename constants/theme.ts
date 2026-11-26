// Sunlist design system — direction B "하루의 빛" (Daylight).
// Quiet warm-neutral chrome; the one warm color (the sun) is reserved for
// progress, completion and the "today / now" marker.

export const Colors = {
  light: {
    background: '#F7F6F3',
    surface: '#FFFFFF',
    surfaceVariant: '#EFEDE8', // chips, raised controls
    surfaceSunken: '#F5F3EF', // input fields inside panels

    textPrimary: '#1A1A18',
    textSecondary: '#55524C',
    textTertiary: '#77736C',
    textDisabled: '#B5B0A7',

    outline: '#C4BFB5', // unchecked rings, dashed borders
    divider: 'rgba(26,26,24,0.07)',
    hairline: 'rgba(26,26,24,0.08)',
    scrim: 'rgba(26,26,24,0.32)',

    // Primary action = ink. Buttons, selected chips.
    primary: '#1A1A18',
    onPrimary: '#FFFFFF',

    // The sun. Progress, checks, today marker.
    accent: '#EE8F1F',
    accentText: '#A55A08', // accent used as text on light surfaces (≥4.5:1)
    accentSoft: 'rgba(238,143,31,0.16)',
    onAccent: '#1A1A18',

    error: '#B93C2B',
    errorContainer: '#F9E3DF',

    swipeNeutral: '#55524C',

    toastBg: '#1A1A18',
    toastText: '#F7F6F3',
    toastAction: '#F5B565',

    arcTrack: '#E9E4DA',
    horizon: '#DDD8CE',
  },
  dark: {
    background: '#121211',
    surface: '#1B1A18',
    surfaceVariant: '#2A2825',
    surfaceSunken: '#22211E',

    textPrimary: '#EFEDE8',
    textSecondary: '#ABA69D',
    textTertiary: '#8C877E',
    textDisabled: '#5A5650',

    outline: '#5E5A53',
    divider: 'rgba(239,237,232,0.08)',
    hairline: 'rgba(239,237,232,0.09)',
    scrim: 'rgba(0,0,0,0.5)',

    primary: '#EFEDE8',
    onPrimary: '#1A1A18',

    accent: '#F2A13A',
    accentText: '#F5B565',
    accentSoft: 'rgba(242,161,58,0.18)',
    onAccent: '#1A1A18',

    error: '#E5664F',
    errorContainer: '#3A1E19',

    swipeNeutral: '#4A4741',

    toastBg: '#EFEDE8',
    toastText: '#1A1A18',
    toastAction: '#A55A08',

    arcTrack: '#2E2C28',
    horizon: '#38352F',
  },
};

export type ThemeColors = typeof Colors.light;

/** Font family names, as registered with expo-font (see app/_layout.tsx). */
export const Fonts = {
  regular: 'GothicA1-Regular',
  medium: 'GothicA1-Medium',
  semibold: 'GothicA1-SemiBold',
  display: 'GowunDodum-Regular',
} as const;

export const FontAssets = {
  [Fonts.regular]: require('../assets/fonts/GothicA1-Regular.ttf'),
  [Fonts.medium]: require('../assets/fonts/GothicA1-Medium.ttf'),
  [Fonts.semibold]: require('../assets/fonts/GothicA1-SemiBold.ttf'),
  [Fonts.display]: require('../assets/fonts/GowunDodum-Regular.ttf'),
};

/**
 * Type scale. Hierarchy comes from size and color; weights stay 400–600.
 * `fontWeight` is mapped to the matching family by <Text> in components/atoms/AppText.
 */
export const Typography = {
  display: { fontFamily: Fonts.display, fontSize: 52, lineHeight: 58 },
  title: { fontFamily: Fonts.display, fontSize: 28, lineHeight: 36 },
  heading: { fontSize: 20, lineHeight: 28, fontWeight: '600' as const },
  body: { fontSize: 16, lineHeight: 22, fontWeight: '400' as const },
  bodyMedium: { fontSize: 16, lineHeight: 22, fontWeight: '500' as const },
  label: { fontSize: 14, lineHeight: 20, fontWeight: '600' as const },
  callout: { fontSize: 14, lineHeight: 20, fontWeight: '400' as const },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' as const },
  small: { fontSize: 12, lineHeight: 16, fontWeight: '400' as const },
  tiny: { fontSize: 11, lineHeight: 14, fontWeight: '500' as const },
};

export const Spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const Radius = {
  xs: 4,
  sm: 8,
  control: 10, // chips, buttons, inputs
  panel: 16, // grouped list panels, cards
  pill: 26, // quick-add bar
  sheet: 28,
  full: 9999,
};

export const Elevation = {
  none: {},
  /** Small resting surfaces (segmented thumb, toast). */
  low: {
    shadowColor: '#1A1A18',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  /** Floating things: quick-add pill, dragged row. */
  float: {
    shadowColor: '#1A1A18',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
  },
};

export const Motion = {
  fast: 150,
  normal: 220,
  slow: 350,
};

/**
 * Todo colors are stored as their original pastel hex (kept for backward
 * compatibility) and rendered as theme-appropriate tints.
 */
const TODO_TINTS: Record<string, { light: string; dark: string; swatch: string; swatchDark: string }> = {
  // Dark tints are pre-mixed over the dark surface (#1B1A18) so they stay opaque and quiet.
  '#FFD1DC': { light: '#FDECF0', dark: '#352427', swatch: '#FADDE4', swatchDark: '#5A2E3A' },
  '#FFF3B0': { light: '#FFF6DC', dark: '#352E1E', swatch: '#FFF0C2', swatchDark: '#5A4A22' },
  '#D4EDDA': { light: '#EAF5EC', dark: '#202C25', swatch: '#D9EFDD', swatchDark: '#26463A' },
  '#CCE5FF': { light: '#EBF1FC', dark: '#242936', swatch: '#DCE7FA', swatchDark: '#2A3656' },
  '#E8DAEF': { light: '#F2EDFA', dark: '#2B2635', swatch: '#E8E0F7', swatchDark: '#3A3056' },
};

export function todoRowTint(color: string | null | undefined, isDark: boolean): string | null {
  if (!color) return null;
  const t = TODO_TINTS[color.toUpperCase()];
  if (!t) return null;
  return isDark ? t.dark : t.light;
}

export function todoSwatch(color: string, isDark: boolean): string {
  const t = TODO_TINTS[color.toUpperCase()];
  if (!t) return color;
  return isDark ? t.swatchDark : t.swatch;
}
