import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import ko from './locales/ko';
import en from './locales/en';
import ja from './locales/ja';
import es from './locales/es';

const SUPPORTED_LANGUAGES = ['ko', 'en', 'ja', 'es'] as const;
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

function getDeviceLanguage(): SupportedLanguage {
  const locales = getLocales();
  if (locales.length === 0) return 'ko';

  const deviceLang = locales[0].languageCode;
  if (!deviceLang) return 'ko';

  // Exact match
  if (SUPPORTED_LANGUAGES.includes(deviceLang as SupportedLanguage)) {
    return deviceLang as SupportedLanguage;
  }

  // Fallback to Korean
  return 'ko';
}

i18n.use(initReactI18next).init({
  resources: {
    ko: { translation: ko },
    en: { translation: en },
    ja: { translation: ja },
    es: { translation: es },
  },
  lng: getDeviceLanguage(),
  fallbackLng: 'ko',
  interpolation: {
    escapeValue: false, // React already handles escaping
  },
  compatibilityJSON: 'v4',
});

export default i18n;
