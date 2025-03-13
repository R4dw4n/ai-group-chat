import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import arTranslation from "./ar.json"
import enTranslation from "./en.json"

const resources = {
  ar: {
    translation: arTranslation
  },
  en: {
    translation: enTranslation
  },
}

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  detection: {
    order: ['path', 'cookie'], // Detect language from the URL first, then cookies
    lookupFromPathIndex: 0, // Look for the language in the first part of the URL (e.g., /ar/about)
    caches: ['cookie'], // Cache the detected language in a cookie
  },
  
});

export default i18n;