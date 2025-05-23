import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    react: { useSuspense: true },
    fallbackLng: 'en',
    preload: ['en'],
    ns: ['common'],
    defaultNS: 'common',
    cleanCode: true,
    nonExplicitSupportedLngs: true,
    interpolation: {
      escapeValue: false,
    },
    load: 'languageOnly',
    debug: false,
  });

export default i18n;
