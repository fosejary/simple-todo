import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Redirect } from 'expo-router';
import { useTodoStore } from '@/stores/todoStore';
import { useAppReady } from '@/lib/appReady';

const SPLASH_BG = '#F7F6F3';

/**
 * Holds the native-splash look only until saved todos and fonts are loaded,
 * so Today never flashes an empty state or a font swap. No artificial delay.
 */
export default function LaunchScreen() {
  const [hydrated, setHydrated] = useState(() => useTodoStore.persist.hasHydrated());
  const fontsReady = useAppReady((s) => s.fontsReady);

  useEffect(() => {
    const unsub = useTodoStore.persist.onFinishHydration(() => setHydrated(true));
    if (useTodoStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);

  useEffect(() => {
    if (hydrated) useTodoStore.getState().setFirstLaunchDone();
  }, [hydrated]);

  if (hydrated && fontsReady) return <Redirect href="/(tabs)/today" />;

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/splash.png')} style={styles.image} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SPLASH_BG,
  },
  image: {
    flex: 1,
    width: '100%',
  },
});
