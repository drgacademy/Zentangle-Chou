import zh from './zh.json';
import en from './en.json';

type Language = 'zh' | 'en';

export function useT(lang: Language) {
  const dict = lang === 'zh' ? zh : en;

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = dict;

    for (const k of keys) {
      value = value?.[k];
    }

    return typeof value === 'string' ? value : key;
  };

  return t;
}
