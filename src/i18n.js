import i18n from 'i18next';
import Backend from 'i18next-xhr-backend';
import LngDetector from 'i18next-browser-languagedetector';

const lngDetectorOptions = {
  order: ['querystring', 'cookie', 'localStorage', 'navigator'],

  // keys or params to lookup language from
  lookupQuerystring: 'lang',
  lookupCookie: 'lang',
  lookupLocalStorage: 'i18nextLng',

  // cache user language on
  caches: ['localStorage', 'cookie'],
  excludeCacheFor: ['cimode'], // languages to not persist (cookie, localStorage)

  // optional expire and domain for set cookie
  cookieMinutes: 1440
  // cookieDomain: 'localhost',
};

i18n
  .use(LngDetector)
  .use(Backend)
  .init({
    detection: lngDetectorOptions,

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
      // addPath: '/locales/add/{{lng}}/{{ns}}',
    },

    // preload: true,
    load: 'currentOnly',
    // resources: translations,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV !== 'production',

    whitelist: ['en', 'zh-CN'],

    // have a common namespace used around the full app
    ns: ['common'],
    defaultNS: 'common',

    interpolation: {
      escapeValue: false // not needed for react!!
      // formatSeparator: ","
    },

    // missing keys
    // saveMissing: true,
    // saveMissingTo: 'current',

    react: {
      wait: false // set wait to false when on SSR
    }
  });

export default i18n;
