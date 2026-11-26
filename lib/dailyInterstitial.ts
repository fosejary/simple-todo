import AsyncStorage from '@react-native-async-storage/async-storage';
import { AdEventType, InterstitialAd, TestIds } from 'react-native-google-mobile-ads';
import { prepareAds, useAdsConsent } from '@/lib/adsConsent';
import { format } from 'date-fns';

/**
 * One full-screen ad per day, shown at a natural transition (switching tabs).
 *
 * Rules (AdMob places interstitials at transitions, never on launch or exit):
 * - at most once per calendar day
 * - never on the day the app was first opened (new users settle in first)
 * - only after the app has been open for a while this session
 * - only when an ad is already loaded; nothing ever waits for one
 */

// AdMob ad unit "일일 전면 - 탭 전환" (also capped server-side at 1 impression per user per day).
const INTERSTITIAL_AD_UNIT_ID = 'ca-app-pub-7583212045442485/8851865066';

const UNIT_ID = __DEV__ ? TestIds.INTERSTITIAL : INTERSTITIAL_AD_UNIT_ID;
const STORAGE_KEY = '@simpletodo/ads';
const MIN_SESSION_MS = 30_000;

interface AdState {
  firstOpen: string | null;
  lastShown: string | null;
}

const today = () => format(new Date(), 'yyyy-MM-dd');

let state: AdState = { firstOpen: null, lastShown: null };
let ad: InterstitialAd | null = null;
let loading = false;
let showing = false;
let sessionStart = 0;
let started = false;

async function readState(): Promise<AdState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) return { firstOpen: null, lastShown: null, ...JSON.parse(raw) };
  } catch {}
  return { firstOpen: null, lastShown: null };
}

function saveState() {
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
}

function eligibleToday(): boolean {
  const d = today();
  return !!state.firstOpen && state.firstOpen < d && state.lastShown !== d;
}

function load() {
  if (!UNIT_ID || ad || loading || !eligibleToday() || !useAdsConsent.getState().canRequestAds) return;
  loading = true;
  const next = InterstitialAd.createForAdRequest(UNIT_ID);
  next.addAdEventListener(AdEventType.LOADED, () => {
    loading = false;
    ad = next;
  });
  next.addAdEventListener(AdEventType.ERROR, () => {
    loading = false;
    ad = null;
  });
  next.addAdEventListener(AdEventType.CLOSED, () => {
    showing = false;
    ad = null;
  });
  next.load();
}

/** Call once at app start: gathers consent, initializes the ads SDK and preloads today's ad if one is due. */
export async function startDailyInterstitial(): Promise<void> {
  if (started) return;
  started = true;
  sessionStart = Date.now();
  state = await readState();
  if (!state.firstOpen) {
    state.firstOpen = today();
    saveState();
  }
  if (!(await prepareAds())) return;
  load();
}

/** Call at a natural transition. Shows the ad only if every rule above allows it. */
export function maybeShowDailyInterstitial(): void {
  if (showing || !eligibleToday() || Date.now() - sessionStart < MIN_SESSION_MS) return;
  if (!ad?.loaded) {
    load(); // e.g. the day rolled over while the app stayed open
    return;
  }
  showing = true;
  state.lastShown = today();
  saveState();
  ad.show().catch(() => {
    showing = false;
    ad = null;
  });
}
