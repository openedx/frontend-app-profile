import COUNTRIES from 'i18n-iso-countries';

COUNTRIES.registerLocale(require('i18n-iso-countries/langs/en.json'));

const ALL_COUNTRIES = COUNTRIES.getNames('en');

export { ALL_COUNTRIES, COUNTRIES };
