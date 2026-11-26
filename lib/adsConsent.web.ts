import { create } from 'zustand';

// Ads are native-only.
export const useAdsConsent = create(() => ({ ready: true, canRequestAds: false, privacyOptionsRequired: false }));
export async function prepareAds(): Promise<boolean> {
  return false;
}
export async function showAdPrivacyOptions(): Promise<void> {}
