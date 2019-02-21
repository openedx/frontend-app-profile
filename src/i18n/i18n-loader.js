import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .use(XHR)
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
    'profile.bio.empty': 'Añada una breve biografía',
  },
);

i18n.addResourceBundle(
  'en',
  'profile', // this is the namespace, so I think it doesn't need to appear below?
  {
    'profile.no.certificates': 'No certificates',
    'no.certificates': 'No certifiCATS',
  },
);

export default i18n;
