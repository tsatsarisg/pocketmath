import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import el from './locales/el.json';
import en from './locales/en.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      el: { translation: el },
      en: { translation: en },
    },
    fallbackLng: 'el',
    // React's JSX rendering auto-escapes interpolated values, so i18next
    // escaping is disabled to avoid double-escaping. Do NOT use the <Trans>
    // component with user-controlled HTML or dangerouslySetInnerHTML.
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

// Keep the <html lang> attribute in sync with the active language
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng.startsWith('en') ? 'en' : 'el';
});
// Set it on init as well
document.documentElement.lang = i18n.language?.startsWith('en') ? 'en' : 'el';

export default i18n;
