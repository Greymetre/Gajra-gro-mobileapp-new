import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        //English translations here
        'welcome text': 'Welcome to the react-i18next tutorial',
      },
    },
    ja: {
      translation: {
        //Japanese translations here
        'welcome text': 'react-i18nextチュートリアルへようこそ',
      },
    },
  },
  lng: 'ja',
  fallbackLng: 'en',
});

export default i18n;
