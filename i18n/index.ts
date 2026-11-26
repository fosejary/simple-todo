// Hermes has no full Intl.PluralRules; i18next needs it for `_one` (singular) keys.
import 'intl-pluralrules';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { AppState, Platform } from 'react-native';
import { getLocales } from 'expo-localization';
import ko from './locales/ko';
import en from './locales/en';
import ja from './locales/ja';
import es from './locales/es';

const SUPPORTED_LANGUAGES = ['ko', 'en', 'ja', 'es'] as const;
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/** Device language if we have it, else English (the widest second language among our users). */
function getDeviceLanguage(): SupportedLanguage {
  const code = getLocales()[0]?.languageCode?.toLowerCase();
  return SUPPORTED_LANGUAGES.includes(code as SupportedLanguage) ? (code as SupportedLanguage) : 'en';
}

i18n.use(initReactI18next).init({
  resources: {
    ko: { translation: ko },
    en: { translation: en },
    ja: { translation: ja },
    es: { translation: es },
  },
  lng: getDeviceLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React already handles escaping
  },
  compatibilityJSON: 'v4',
});

// Follow a language change made in system settings while the app was in the background.
if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state !== 'active') return;
    const lang = getDeviceLanguage();
    if (lang !== i18n.language) i18n.changeLanguage(lang);
  });
}

export default i18n;
