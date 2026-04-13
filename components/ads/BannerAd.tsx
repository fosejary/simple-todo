import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  BannerAd as GADBannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';

const BANNER_AD_UNIT_ID = 'ca-app-pub-7583212045442485/6860825967';

function getAdUnitId(): string {
  if (__DEV__) {
    return TestIds.ADAPTIVE_BANNER;
  }
  return BANNER_AD_UNIT_ID;
}

export default function BannerAdComponent() {
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);

  const onAdLoaded = useCallback(() => {
    setAdLoaded(true);
    setAdError(false);
  }, []);

  const onAdFailedToLoad = useCallback(() => {
    setAdLoaded(false);
    setAdError(true);
  }, []);

  if (adError) {
    return <View />;
  }

  return (
    <View style={[styles.container, !adLoaded && styles.hidden]}>
      <GADBannerAd
        unitId={getAdUnitId()}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        onAdLoaded={onAdLoaded}
        onAdFailedToLoad={onAdFailedToLoad}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  hidden: {
    opacity: 0,
    height: 0,
  },
});
