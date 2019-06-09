/**
 * @param {import('./index').SupportedLanguageCode} lang
 */
export const loadLanguage = lang => {
  /**
   * This has to be a switch inside a .js file.
   * Parcel needs to know these paths during build time to copy them to dist/.
   */
  switch (lang) {
    case 'pl':
      return import('./pl.json');
    case 'en':
      return import('./en.json');
    default:
      throw new Error(`language ${lang} is not supported`);
  }
};
