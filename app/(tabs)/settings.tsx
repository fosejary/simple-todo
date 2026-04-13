import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { useTheme } from '@/hooks/useTheme';
import { useSettingsStore } from '@/stores/settingsStore';
import { useTodoStore } from '@/stores/todoStore';
import { Spacing, BorderRadius, Elevation } from '@/constants/theme';

type ThemeSetting = 'light' | 'dark' | 'system';

function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        {title}
      </Text>
      <View
        style={[
          styles.sectionContent,
          { backgroundColor: colors.surface },
          Elevation.level1,
        ]}
      >
        {children}
      </View>
    </View>
  );
}

function SettingsRow({
  icon,
  label,
  value,
  onPress,
  rightElement,
  danger = false,
  isLast = false,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  danger?: boolean;
  isLast?: boolean;
}) {
  const { colors } = useTheme();

  const content = (
    <View
      style={[
        styles.row,
        !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.divider },
      ]}
    >
      <View style={[styles.iconCircle, { backgroundColor: danger ? colors.errorContainer : colors.surfaceVariant }]}>
        <MaterialIcons
          name={icon}
          size={18}
          color={danger ? colors.error : colors.textSecondary}
        />
      </View>
      <Text
        style={[
          styles.rowLabel,
          { color: danger ? colors.error : colors.textPrimary },
        ]}
      >
        {label}
      </Text>
      <View style={styles.rowRight}>
        {rightElement || (
          <>
            {value && (
              <Text style={[styles.rowValue, { color: colors.textSecondary }]}>
                {value}
              </Text>
            )}
            {onPress && (
              <MaterialIcons
                name="chevron-right"
                size={20}
                color={colors.textDisabled}
              />
            )}
          </>
        )}
      </View>
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }

  return content;
}

export default function SettingsScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const theme = useSettingsStore((s) => s.theme);
  const updateSetting = useSettingsStore((s) => s.updateSetting);
  const resetSettings = useSettingsStore((s) => s.resetSettings);

  const themeLabels: Record<ThemeSetting, string> = {
    light: t('settings.themeLight'),
    dark: t('settings.themeDark'),
    system: t('settings.themeSystem'),
  };

  const showThemePicker = () => {
    const themes: ThemeSetting[] = ['light', 'dark', 'system'];
    const currentIdx = themes.indexOf(theme);
    const next = themes[(currentIdx + 1) % themes.length];
    updateSetting('theme', next);
  };

  const doReset = () => {
    useTodoStore.setState({
      todos: [],
      categories: [],
      streaks: {},
    });
    resetSettings();
  };

  const handleDataReset = () => {
    if (Platform.OS === 'web') {
      if (window.confirm(t('settings.dataResetConfirm'))) {
        doReset();
      }
    } else {
      Alert.alert(
        t('settings.dataResetTitle'),
        t('settings.dataResetDetail'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          {
            text: t('settings.dataResetButton'),
            style: 'destructive',
            onPress: () => {
              Alert.alert(t('settings.dataResetFinalConfirm'), t('settings.dataResetFinalDetail'), [
                { text: t('common.cancel'), style: 'cancel' },
                { text: t('settings.dataResetButton'), style: 'destructive', onPress: doReset },
              ]);
            },
          },
        ]
      );
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {t('settings.title')}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* General */}
        <SettingsSection title={t('settings.sectionGeneral')}>
          <SettingsRow
            icon="palette"
            label={t('settings.theme')}
            value={themeLabels[theme]}
            onPress={showThemePicker}
            isLast
          />
        </SettingsSection>

        {/* Data */}
        <SettingsSection title={t('settings.sectionData')}>
          <SettingsRow
            icon="delete-forever"
            label={t('settings.dataReset')}
            onPress={handleDataReset}
            danger
            isLast
          />
        </SettingsSection>

        {/* Info */}
        <SettingsSection title={t('settings.sectionInfo')}>
          <SettingsRow icon="info" label={t('settings.appVersion')} value="1.0.0" isLast />
        </SettingsSection>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  title: {
    fontSize: 26,
    lineHeight: 34,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  content: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xxl,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700' as const,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xs,
  },
  sectionContent: {
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400' as const,
    flex: 1,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs,
  },
  rowValue: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400' as const,
    color: '#6B7280',
  },
});
