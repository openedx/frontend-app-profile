import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: true,
    lng: window.navigator.language,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

i18n.addResourceBundle(
  'es-MX',
  'profile', // this is the namespace, so I think it doesn't need to appear below?
  {
    'profile.no.certificates': 'Aún no tienes ningún certificado.',
    'no.certificates': 'Aún no tienes ningún certificado. 2',
    'bio.empty': 'Añada una breve biografía',
  },
);

export default i18n;
