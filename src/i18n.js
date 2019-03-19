import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// import Backend from 'i18next-xhr-backend';
import LngDetector from 'i18next-browser-languagedetector';
import baseConf from '../config/i18n.config';

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
  .use(initReactI18next)
  // .use(Backend)
  .init(
    Object.assign({}, baseConf, {
      detection: lngDetectorOptions
      // backend: {
      //   loadPath: '/locales/{{lng}}/{{ns}}.json'
      // }
    })
  );

export default i18n;
