import { ko, enUS, ja, es } from 'date-fns/locale';
import i18n from './index';

type DateFnsLocale = typeof ko;

const DATE_LOCALE_MAP: Record<string, DateFnsLocale> = {
  ko,
  en: enUS,
  ja,
  es,
};

/**
 * Returns the date-fns Locale object matching the current i18n language.
 * Falls back to English if the current language is not mapped.
 */
export function getDateLocale(): DateFnsLocale {
  const lang = i18n.language;
  return DATE_LOCALE_MAP[lang] ?? enUS;
}
