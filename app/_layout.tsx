import React, { useEffect } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/stores/authStore';
import { FontAssets } from '@/constants/theme';
import { handleReminderResponse, startReminderSync } from '@/lib/reminders';
import { setFontsReady } from '@/lib/appReady';
import { startDailyInterstitial } from '@/lib/dailyInterstitial';
import '@/i18n';

export default function RootLayout() {
  const { colors, isDark } = useTheme();
  const initialize = useAuthStore((s) => s.initialize);
  const [fontsLoaded, fontError] = useFonts(FontAssets);

  useEffect(() => {
    initialize();
    startDailyInterstitial();
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError) setFontsReady();
  }, [fontsLoaded, fontError]);

  // Reminders follow the store; notification buttons pressed while the app is open land here.
  useEffect(() => {
    if (Platform.OS === 'web') return;
    const stopSync = startReminderSync();
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      handleReminderResponse(response.actionIdentifier, response.notification);
    });
    return () => {
      stopSync();
      sub.remove();
    };
  }, []);

  return (
    <GestureHandlerRootView style={[styles.root, { backgroundColor: colors.background }]}>
      <BottomSheetModalProvider>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
            animation: 'fade',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
