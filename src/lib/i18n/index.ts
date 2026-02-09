/**
 * @fileoverview Internationalization (i18n) Configuration
 * 
 * This module sets up react-i18next for multi-language support.
 * Currently supports English (default) with infrastructure for additional languages.
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English translations (default)
import enCommon from './locales/en/common.json';
import enLoyalty from './locales/en/loyalty.json';
import enBusiness from './locales/en/business.json';
import enAuth from './locales/en/auth.json';

// Spanish translations
import esCommon from './locales/es/common.json';
import esLoyalty from './locales/es/loyalty.json';
import esBusiness from './locales/es/business.json';
import esAuth from './locales/es/auth.json';

// French translations
import frCommon from './locales/fr/common.json';
import frLoyalty from './locales/fr/loyalty.json';
import frBusiness from './locales/fr/business.json';
import frAuth from './locales/fr/auth.json';

const resources = {
  en: {
    common: enCommon,
    loyalty: enLoyalty,
    business: enBusiness,
    auth: enAuth,
  },
  es: {
    common: esCommon,
    loyalty: esLoyalty,
    business: esBusiness,
    auth: esAuth,
  },
  fr: {
    common: frCommon,
    loyalty: frLoyalty,
    business: frBusiness,
    auth: frAuth,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'loyalty', 'business', 'auth'],
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'mansa-language',
    },
    
    interpolation: {
      escapeValue: false, // React already handles escaping
    },
    
    react: {
      useSuspense: true,
    },
  });

export default i18n;

// Helper to get available languages
export const availableLanguages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
];

// Helper to change language
export const changeLanguage = (languageCode: string) => {
  i18n.changeLanguage(languageCode);
  localStorage.setItem('mansa-language', languageCode);
};
