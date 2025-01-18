import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './en.json';
import pl from './pl.json';

const LANGUAGE_KEY = 'language';

const resources = {
  en: { translation: en },
  pl: { translation: pl },
};

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async (callback: (lng: string) => void) => {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
    console.log('Detected language:', savedLanguage); // Debug log
    callback(savedLanguage ?? 'en'); // Fallback to English if no saved language
  },
  init: () => {},
  cacheUserLanguage: async (lng: string) => {
    console.log('Caching language:', lng); // Debug log
    await AsyncStorage.setItem(LANGUAGE_KEY, lng);
  },
};

void i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
  });

export default i18n;
