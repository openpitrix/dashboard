import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en_trans from '../locales/en/common.json';
import zh_trans from '../locales/zh/common.json';

i18n.use(LanguageDetector).init({
  // we init with resources
  resources: {
    en: {
      common: en_trans
    },
    zh: {
      common: zh_trans
    }
  },
  // lng: 'zh',
  fallbackLng: 'en',
  debug: process.env.NODE_ENV !== 'production',

  // have a common namespace used around the full app
  ns: ['common'],
  defaultNS: 'common',

  interpolation: {
    escapeValue: false // not needed for react!!
    // formatSeparator: ","
  },

  react: {
    wait: false
  }
});

export default i18n;
