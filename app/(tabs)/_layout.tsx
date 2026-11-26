import React from 'react';
import { Platform, View, Pressable, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Text } from '@/components/atoms/AppText';
import { Icon, type IconName } from '@/components/atoms/Icon';
import { useTheme } from '@/hooks/useTheme';
import { Spacing } from '@/constants/theme';
import BannerAd from '@/components/ads/BannerAd';
import { UndoToast } from '@/components/molecules/UndoToast';
import { maybeShowDailyInterstitial } from '@/lib/dailyInterstitial';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const TAB_ICONS: Record<string, IconName> = {
  today: 'sun',
  all: 'folder',
  stats: 'calendar',
  settings: 'sliders',
};

function TabBarWithAd({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === 'web' ? 12 : Math.max(insets.bottom, 8);

  return (
    <View>
      <UndoToast />
      <View
        style={[
          styles.tabBar,
          { backgroundColor: colors.surface, borderTopColor: colors.divider, paddingBottom: bottomPadding },
        ]}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.title ?? route.name;
          const isFocused = state.index === index;
          const color = isFocused ? colors.textPrimary : colors.textTertiary;

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
              // Switching tabs is the one natural break where the daily ad may appear.
              maybeShowDailyInterstitial();
            }
          };

          return (
            <Pressable
              key={route.key}
              style={styles.tabItem}
              accessibilityRole="tab"
              accessibilityState={{ selected: isFocused }}
              accessibilityLabel={label}
              onPress={onPress}
              onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
            >
              <Icon name={TAB_ICONS[route.name] ?? 'circle'} size={22} color={color} />
              <Text style={[styles.tabLabel, { color }, isFocused && styles.tabLabelActive]} numberOfLines={1}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <BannerAd />
    </View>
  );
}

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs tabBar={(props) => <TabBarWithAd {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="today" options={{ title: t('tabs.today') }} />
      <Tabs.Screen name="all" options={{ title: t('tabs.category') }} />
      <Tabs.Screen name="stats" options={{ title: t('tabs.calendar') }} />
      <Tabs.Screen name="settings" options={{ title: t('tabs.settings') }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.xs,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  tabLabelActive: {
    fontWeight: '600',
  },
});
