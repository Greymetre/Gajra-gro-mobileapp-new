import i18next from 'i18next';
import {initReactI18next, useTranslation} from 'react-i18next';
import {getLocales} from 'react-native-localize';


import english from './en/english.json';
import hindi from './hi/hindi.json';
import bengali from './bn/bengali.json';
import tamil from './ta/tamil.json';

i18next.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  fallbackLng: 'en',
  debug: true,
  resources: {
      en: {
        translation :english
      },
      hi: {
        translation: hindi
      },
      bn: {
        translation: bengali
      },
      ta: {
        translation: tamil
      },
    },
});