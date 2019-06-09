import React, { createContext, useCallback, useEffect, useState } from 'react';

import { loadLanguage } from './loadLanguage';

type Locale = typeof import('./pl.json');
export type LocaleEntry = keyof Locale;

const supportedLanguages = ['pl', 'en'];
export type SupportedLanguageCode = typeof supportedLanguages[number];

function createLanguagePack(texts: Locale) {
  return {
    texts,
    getText(key: string) {
      const val = texts[key as keyof Locale];
      if (val) {
        return val;
      }

      return undefined;
    },
    changeLanguage(langCode: SupportedLanguageCode): void {
      console.error(langCode);
      throw new Error("can't change locale outside of context provider");
    },
  };
}
type LanguagePack = ReturnType<typeof createLanguagePack>;

// We're loading polish by default for everyone to avoid blinking text.
// tslint:disable-next-line:ordered-imports
import pl from './pl.json';
const DEFAULT_LANG = 'pl';
const defaultLanguagePack = createLanguagePack(pl);
export const LocaleContext = createContext(defaultLanguagePack);

export const LocaleContextStatefulProvider: React.FC = ({ children }) => {
  const [languagePack, setLanguagePack] = useState<LanguagePack>(
    defaultLanguagePack
  );

  const changeLanguage = useCallback((lang: SupportedLanguageCode) => {
    localStorage.setItem('language', lang);
    loadLanguage(lang)
      .then(createLanguagePack)
      .then(setLanguagePack);
  }, []);

  useEffect(() => {
    const lang = localStorage.getItem('language');
    if (lang !== null && lang !== DEFAULT_LANG) {
      changeLanguage(lang);
    }
  }, []);

  useEffect(() => {
    languagePack.changeLanguage = changeLanguage;
  }, [languagePack]);

  return (
    <LocaleContext.Provider value={languagePack}>
      {children}
    </LocaleContext.Provider>
  );
};
