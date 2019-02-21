import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: true,
    lng: window.navigator.language,
    defaultNS: 'profile',

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

i18n.addResources(
  'en',
  'profile',
  {
    'profile.no.certificates': 'No certificates',
  },
);

i18n.addResources(
  'es-MX',
  'profile',
  {
    'profile.no.certificates': 'Aún no tienes ningún certificado.',
    'profile.bio.empty': 'Añada una breve biografía',
  },
);

export default i18n;
