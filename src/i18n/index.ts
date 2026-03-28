import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import el from './locales/el.json';
import en from './locales/en.json';

const isServer = typeof window === 'undefined';

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      el: { translation: el },
      en: { translation: en },
    },
    lng: 'el',
    fallbackLng: 'el',
    interpolation: { escapeValue: false },
  });
}

if (!isServer) {
  i18n.on('languageChanged', (lng) => {
    const lang = lng.startsWith('en') ? 'en' : 'el';
    document.documentElement.lang = lang;
    localStorage.setItem('i18nextLng', lang);
  });

  // Restore saved language preference after hydration
  const saved = localStorage.getItem('i18nextLng') as 'el' | 'en' | null;
  if (saved && saved !== i18n.language) {
    i18n.changeLanguage(saved);
  }
  document.documentElement.lang = i18n.language?.startsWith('en') ? 'en' : 'el';
}

export default i18n;
