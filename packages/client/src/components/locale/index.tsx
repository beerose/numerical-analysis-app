import React, { createContext, useCallback, useEffect, useState } from 'react';
import { assertType, TypeEq } from 'typepark';

import { loadLanguage } from './loadLanguage';

// Hiding Locale under interface because it's **really** bad tooltip content
type __Locale = typeof import('./pl.json');
// tslint:disable-next-line:no-empty-interface
export interface Locale extends __Locale {}

export type LocaleEntry = keyof Locale;

{
  type Missing<Loc> = Exclude<LocaleEntry, keyof Loc>;
  /**
   * Assert that all locale files have the same keys
   */
  type MissingInEnglish = Missing<typeof import('./en.json')>;
  assertType<TypeEq<MissingInEnglish, never>>();
}

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
    /**
     * If a line below errors, you can find the reason around line 15.
     * Check which assertion fails.
     */
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
