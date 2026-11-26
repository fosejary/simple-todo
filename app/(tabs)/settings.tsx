import React, { useCallback, useState } from 'react';
import { View, ScrollView, Pressable, Alert, StyleSheet, Platform, Linking, AppState } from 'react-native';
import { useFocusEffect } from 'expo-router';
import Constants from 'expo-constants';
import { useTranslation } from 'react-i18next';
import { format, parseISO } from 'date-fns';
import { Text } from '@/components/atoms/AppText';
import { Icon, type IconName } from '@/components/atoms/Icon';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { TextImportModal } from '@/components/organisms/TextImportModal';
import { useTheme } from '@/hooks/useTheme';
import { useSettingsStore } from '@/stores/settingsStore';
import { useTodoStore } from '@/stores/todoStore';
import { showToast } from '@/stores/toastStore';
import { exportBackup, pickBackup, restoreBackup, type BackupFile } from '@/lib/backup';
import { ensureReminderPermission, getReminderPermission, type ReminderPermission } from '@/lib/reminders';
import { showAdPrivacyOptions, useAdsConsent } from '@/lib/adsConsent';
import { getDateLocale } from '@/i18n/dateLocale';
import { Spacing, Radius, Typography, Elevation } from '@/constants/theme';

type ThemeSetting = 'light' | 'dark' | 'system';

const PRIVACY_POLICY_URL = 'https://fosejary.github.io/privacy-policy.html';
const ANDROID_PACKAGE = 'com.zeroninelab.simpletodo.app';

/** Confirm dialog that also works on web (RN Alert buttons are native-only). */
function confirm(title: string, message: string, okLabel: string, cancelLabel: string, onOk: () => void) {
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n\n${message}`)) onOk();
    return;
  }
  Alert.alert(title, message, [
    { text: cancelLabel, style: 'cancel' },
    { text: okLabel, style: 'destructive', onPress: onOk },
  ]);
}

function notify(title: string, message: string) {
  if (Platform.OS === 'web') window.alert(`${title}\n\n${message}`);
  else Alert.alert(title, message);
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{title}</Text>
      <View style={[styles.panel, { backgroundColor: colors.surface, borderColor: colors.hairline }]}>{children}</View>
    </View>
  );
}

function SettingsRow({
  icon,
  label,
  value,
  onPress,
  danger = false,
  external = false,
  first = false,
  children,
}: {
  icon: IconName;
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
  external?: boolean;
  first?: boolean;
  children?: React.ReactNode;
}) {
  const { colors } = useTheme();
  const content = (pressed: boolean) => (
    <View style={[styles.row, pressed && { backgroundColor: colors.divider }]}>
      {!first && <View style={[styles.separator, { backgroundColor: colors.divider }]} />}
      <View style={styles.rowMain}>
        <Icon name={icon} size={18} color={danger ? colors.error : colors.textTertiary} />
        <Text style={[styles.rowLabel, { color: danger ? colors.error : colors.textPrimary }]}>{label}</Text>
        {!!value && <Text style={[styles.rowValue, { color: colors.textTertiary }]}>{value}</Text>}
        {onPress && <Icon name={external ? 'external-link' : 'chevron-right'} size={external ? 16 : 18} color={colors.textTertiary} />}
      </View>
      {children}
    </View>
  );
  if (onPress) {
    return (
      <Pressable onPress={onPress} accessibilityRole="button">
        {({ pressed }) => content(pressed)}
      </Pressable>
    );
  }
  return content(false);
}

function ThemeSegmented() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const theme = useSettingsStore((s) => s.theme);
  const updateSetting = useSettingsStore((s) => s.updateSetting);
  const options: { value: ThemeSetting; label: string; icon: IconName }[] = [
    { value: 'light', label: t('settings.themeLight'), icon: 'sun' },
    { value: 'dark', label: t('settings.themeDark'), icon: 'moon' },
    { value: 'system', label: t('settings.themeSystem'), icon: 'smartphone' },
  ];
  return (
    <View style={[styles.segmented, { backgroundColor: colors.surfaceVariant }]} accessibilityRole="radiogroup">
      {options.map((opt) => {
        const selected = theme === opt.value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => updateSetting('theme', opt.value)}
            style={[styles.segment, selected && [{ backgroundColor: colors.surface }, Elevation.low]]}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
          >
            <Icon name={opt.icon} size={14} color={selected ? colors.textPrimary : colors.textTertiary} />
            <Text
              style={[
                styles.segmentText,
                { color: selected ? colors.textPrimary : colors.textSecondary },
                selected && styles.segmentTextActive,
              ]}
              numberOfLines={1}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function SettingsScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const resetSettings = useSettingsStore((s) => s.resetSettings);
  const appVersion = Constants.expoConfig?.version ?? '1.0.0';
  const [permission, setPermission] = useState<ReminderPermission>('unsupported');
  const [showImport, setShowImport] = useState(false);
  const adPrivacyRequired = useAdsConsent((s) => s.privacyOptionsRequired);

  // Re-read permission whenever the tab is shown or the app returns from system settings.
  useFocusEffect(
    useCallback(() => {
      const refresh = () => getReminderPermission().then(setPermission).catch(() => {});
      refresh();
      const sub = AppState.addEventListener('change', (s) => s === 'active' && refresh());
      return () => sub.remove();
    }, [])
  );

  const handleNotifications = async () => {
    if (permission === 'granted') return;
    if (permission === 'denied') {
      Linking.openSettings();
      return;
    }
    await ensureReminderPermission();
    setPermission(await getReminderPermission());
  };

  const handleExport = async () => {
    try {
      await exportBackup(t('settings.exportDialogTitle'));
    } catch {
      notify(t('settings.exportFailed'), t('settings.exportFailedDetail'));
    }
  };

  const handleRestore = async () => {
    let picked: { backup: BackupFile; summary: { todos: number; categories: number; exportedAt: string } } | null;
    try {
      picked = await pickBackup();
    } catch {
      notify(t('settings.backupInvalid'), t('settings.backupInvalidDetail'));
      return;
    }
    if (!picked) return;
    const { backup, summary } = picked;
    const date = summary.exportedAt
      ? format(parseISO(summary.exportedAt), t('dateFormat.monthDay'), { locale: getDateLocale() })
      : '—';
    confirm(
      t('settings.restoreConfirmTitle'),
      t('settings.restoreConfirmDetail', { todos: summary.todos, categories: summary.categories, date }),
      t('settings.restoreButton'),
      t('common.cancel'),
      () => {
        restoreBackup(backup);
        showToast({ message: t('toast.restored') });
      }
    );
  };

  const doReset = () => {
    useTodoStore.setState({ todos: [], categories: [], streaks: {} });
    resetSettings();
  };

  const handleDataReset = () => {
    if (Platform.OS === 'web') {
      if (window.confirm(t('settings.dataResetConfirm'))) doReset();
      return;
    }
    Alert.alert(t('settings.dataResetTitle'), t('settings.dataResetDetail'), [
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
    ]);
  };

  const openStore = () => {
    Linking.openURL(`market://details?id=${ANDROID_PACKAGE}`).catch(() =>
      Linking.openURL(`https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`)
    );
  };

  const notificationValue =
    permission === 'granted'
      ? t('settings.notificationsOn')
      : permission === 'denied'
        ? t('settings.notificationsBlocked')
        : t('settings.notificationsOff');

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>{t('settings.title')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SettingsSection title={t('settings.sectionGeneral')}>
          <SettingsRow icon="droplet" label={t('settings.theme')} first>
            <ThemeSegmented />
          </SettingsRow>
          {permission !== 'unsupported' && (
            <SettingsRow
              icon="bell"
              label={t('settings.notifications')}
              value={notificationValue}
              onPress={permission === 'granted' ? undefined : handleNotifications}
            />
          )}
        </SettingsSection>

        <SettingsSection title={t('settings.sectionData')}>
          <SettingsRow icon="upload" label={t('settings.backupExport')} onPress={handleExport} first />
          <SettingsRow icon="download" label={t('settings.backupRestore')} onPress={handleRestore} />
          <SettingsRow icon="file-text" label={t('settings.importText')} onPress={() => setShowImport(true)} />
          <SettingsRow icon="trash-2" label={t('settings.dataReset')} onPress={handleDataReset} danger />
        </SettingsSection>

        <SettingsSection title={t('settings.sectionInfo')}>
          {Platform.OS === 'android' && (
            <SettingsRow icon="star" label={t('settings.rateApp')} onPress={openStore} external first />
          )}
          {adPrivacyRequired && (
            <SettingsRow icon="sliders" label={t('settings.adPrivacy')} onPress={showAdPrivacyOptions} />
          )}
          <SettingsRow
            icon="shield"
            label={t('settings.privacyPolicy')}
            onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}
            external
            first={Platform.OS !== 'android'}
          />
          <SettingsRow icon="info" label={t('settings.appVersion')} value={appVersion} />
        </SettingsSection>
      </ScrollView>

      <TextImportModal visible={showImport} onClose={() => setShowImport(false)} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  title: {
    ...Typography.title,
  },
  content: {
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xxxl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    paddingHorizontal: Spacing.lg + 4,
    marginBottom: Spacing.xs,
  },
  panel: {
    marginHorizontal: Spacing.md,
    borderRadius: Radius.panel,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  row: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  separator: {
    position: 'absolute',
    top: 0,
    left: 46,
    right: 0,
    height: StyleSheet.hairlineWidth,
  },
  rowMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    minHeight: 32,
  },
  rowLabel: {
    ...Typography.body,
    flex: 1,
  },
  rowValue: {
    ...Typography.callout,
  },
  segmented: {
    flexDirection: 'row',
    borderRadius: Radius.control + 2,
    padding: 3,
    gap: 3,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    height: 34,
    borderRadius: 9,
  },
  segmentText: {
    fontSize: 13,
  },
  segmentTextActive: {
    fontWeight: '600',
  },
});
