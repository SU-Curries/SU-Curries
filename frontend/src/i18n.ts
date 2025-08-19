import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import de from './locales/de.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import it from './locales/it.json';

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      en: { translation: en },
      de: { translation: de },
      es: { translation: es },
      fr: { translation: fr },
      it: { translation: it },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: true, // ✅ SECURITY FIX: Enable XSS protection
      format: (value, format) => {
        // Custom formatting with sanitization
        if (format === 'uppercase') return value.toUpperCase();
        if (format === 'lowercase') return value.toLowerCase();
        return value;
      }
    },
    // Additional security configurations
    saveMissing: false, // Prevent dynamic key creation
    updateMissing: false, // Prevent runtime translation updates
    debug: process.env.NODE_ENV === 'development',
  });

export default i18n; 