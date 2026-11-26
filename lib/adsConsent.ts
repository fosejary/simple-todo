import mobileAds, {
  AdsConsent,
  AdsConsentPrivacyOptionsRequirementStatus,
  type AdsConsentInfo,
} from 'react-native-google-mobile-ads';
import { create } from 'zustand';

/**
 * Google UMP consent before any ad request. In the EEA/UK/Switzerland this
 * shows the consent message configured in AdMob → 개인 정보 보호 및 메시지;
 * elsewhere (or before a message is published) it resolves immediately.
 */
interface AdsConsentState {
  ready: boolean;
  canRequestAds: boolean;
  /** The user must be able to reopen their choices (a settings row shows). */
  privacyOptionsRequired: boolean;
}

export const useAdsConsent = create<AdsConsentState>(() => ({
  ready: false,
  canRequestAds: false,
  privacyOptionsRequired: false,
}));

function apply(info: AdsConsentInfo | null) {
  useAdsConsent.setState({
    ready: true,
    canRequestAds: info?.canRequestAds ?? false,
    privacyOptionsRequired:
      info?.privacyOptionsRequirementStatus === AdsConsentPrivacyOptionsRequirementStatus.REQUIRED,
  });
}

let preparing: Promise<boolean> | null = null;

/** Gathers consent once per launch, then initializes the ads SDK if ads may be requested. */
export function prepareAds(): Promise<boolean> {
  preparing ??= (async () => {
    let info: AdsConsentInfo | null = null;
    try {
      info = await AdsConsent.gatherConsent();
    } catch {
      // Offline or the form failed: fall back to the choice stored from a previous launch.
      info = await AdsConsent.getConsentInfo().catch(() => null);
    }
    apply(info);
    if (!info?.canRequestAds) return false;
    try {
      await mobileAds().initialize();
    } catch {}
    return true;
  })();
  return preparing;
}

/** Reopens the consent choices (Settings → 광고 개인정보 설정). */
export async function showAdPrivacyOptions(): Promise<void> {
  const info = await AdsConsent.showPrivacyOptionsForm().catch(() => null);
  if (info) apply(info);
}
