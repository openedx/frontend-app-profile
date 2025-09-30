import languages from '@cospired/i18n-iso-languages';
import { langs as countryLangs } from 'i18n-iso-countries';

import arLanguageLocale from '@cospired/i18n-iso-languages/langs/ar.json';
import enLanguageLocale from '@cospired/i18n-iso-languages/langs/en.json';
import esLanguageLocale from '@cospired/i18n-iso-languages/langs/es.json';
import frLanguageLocale from '@cospired/i18n-iso-languages/langs/fr.json';
import heLanguageLocale from '@cospired/i18n-iso-languages/langs/he.json';
import idLanguageLocale from '@cospired/i18n-iso-languages/langs/id.json';
import koLanguageLocale from '@cospired/i18n-iso-languages/langs/ko.json';
import plLanguageLocale from '@cospired/i18n-iso-languages/langs/pl.json';
import ptLanguageLocale from '@cospired/i18n-iso-languages/langs/pt.json';
import ruLanguageLocale from '@cospired/i18n-iso-languages/langs/ru.json';
import thLanguageLocale from '@cospired/i18n-iso-languages/langs/th.json';
import ukLanguageLocale from '@cospired/i18n-iso-languages/langs/uk.json';
import viLanguageLocale from '@cospired/i18n-iso-languages/langs/vi.json';
import zhLanguageLocale from '@cospired/i18n-iso-languages/langs/zh.json';

languages.registerLocale(arLanguageLocale);
languages.registerLocale(enLanguageLocale);
languages.registerLocale(esLanguageLocale);
languages.registerLocale(frLanguageLocale);
languages.registerLocale(zhLanguageLocale);
// languages.registerLocale(caLanguageLocale); // Doesn't exist in lib.
languages.registerLocale(heLanguageLocale);
languages.registerLocale(idLanguageLocale);
languages.registerLocale(koLanguageLocale);
languages.registerLocale(plLanguageLocale);
languages.registerLocale(ptLanguageLocale);
languages.registerLocale(ruLanguageLocale);
languages.registerLocale(thLanguageLocale);
languages.registerLocale(ukLanguageLocale);
languages.registerLocale(viLanguageLocale);

const getLanguageMessages = (locale) => { // TODO: check if this is correct
  const primaryLanguageSubtag = locale.split('-')[0];
  const languageCode = countryLangs().includes(primaryLanguageSubtag) ? primaryLanguageSubtag : 'en';

  return languages.getNames(languageCode);
};

const getLanguageList = (locale = 'en'): Record<string, string>[] => {
  const primaryLanguageSubtag = locale.split('-')[0];

  try {
    const languageMessages = languages.getNames(primaryLanguageSubtag);
    return Object.entries(languageMessages).map(([code, name]) => ({ code, name }));
  } catch (error) {
    console.warn(`Locale ${primaryLanguageSubtag} not available, falling back to English`);
    const languageMessages = languages.getNames('en');
    return Object.entries(languageMessages).map(([code, name]) => ({ code, name }));
  }
};

export { getLanguageList, getLanguageMessages };
