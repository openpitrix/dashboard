import i18n from 'i18next';
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

const translations = {
  en: require('../locales/en'),
  'zh-CN': require('../locales/zh-CN')
};

i18n.use(LngDetector).init({
  detector: lngDetectorOptions,

  preload: true,
  resources: translations,
  fallbackLng: 'en',
  debug: process.env.NODE_ENV !== 'production',

  // have a common namespace used around the full app
  ns: ['common', 'app', 'cluster', 'repo', 'runtime', 'category'],
  defaultNS: 'common',

  interpolation: {
    escapeValue: false // not needed for react!!
    // formatSeparator: ","
  },

  react: {
    wait: false // set wait to false when on SSR
  }
});

export default i18n;
