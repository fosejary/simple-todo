// Design Tokens from MVP Design Spec

export const Colors = {
  light: {
    primary: '#2563EB',
    primaryLight: '#EBF2FF',
    primaryContainer: '#DBEAFE',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#1E40AF',

    secondary: '#7C3AED',
    secondaryContainer: '#EDE9FE',
    onSecondary: '#FFFFFF',

    background: '#F8F9FA',
    surface: '#FFFFFF',
    surfaceVariant: '#F1F3F5',

    textPrimary: '#1A1D21',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    textDisabled: '#D1D5DB',

    success: '#10B981',
    successContainer: '#D1FAE5',
    warning: '#F59E0B',
    warningContainer: '#FEF3C7',
    error: '#EF4444',
    errorContainer: '#FEE2E2',

    focusStar: '#F59E0B',
    streakFire: '#F97316',

    divider: '#ECEEF0',
    outline: '#DEE1E5',
  },
  dark: {
    primary: '#60A5FA',
    primaryLight: '#1E3A5F',
    primaryContainer: '#1E3A5F',
    onPrimary: '#1E3A5F',
    onPrimaryContainer: '#DBEAFE',

    secondary: '#A78BFA',
    secondaryContainer: '#3B1F6E',
    onSecondary: '#FFFFFF',

    background: '#0F1419',
    surface: '#1A2332',
    surfaceVariant: '#2A3444',

    textPrimary: '#F0F2F5',
    textSecondary: '#9CA3AF',
    textTertiary: '#6B7280',
    textDisabled: '#4B5563',

    success: '#34D399',
    successContainer: '#065F46',
    warning: '#FBBF24',
    warningContainer: '#78350F',
    error: '#F87171',
    errorContainer: '#7F1D1D',

    focusStar: '#FBBF24',
    streakFire: '#FB923C',

    divider: '#2A3444',
    outline: '#3A4454',
  },
};

export const Typography = {
  display: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700' as const,
  },
  heading: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700' as const,
  },
  subheading: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  bodyBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600' as const,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
  small: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
  },
};

export const Spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Elevation = {
  level0: {},
  level1: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  level2: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  level3: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  level4: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 6,
  },
};

export const AnimationDuration = {
  instant: 100,
  fast: 200,
  normal: 300,
  slow: 500,
  celebration: 2000,
};
