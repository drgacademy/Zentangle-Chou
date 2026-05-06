import zh from './zh.json';
import en from './en.json';

type LanguageCode = 'zh' | 'en';

const translations = { zh, en };

export function useT(lang: LanguageCode) {
  return translations[lang];
}

export function getT(lang: LanguageCode) {
  return translations[lang];
}
