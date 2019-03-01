import LANGUAGES from '@cospired/i18n-iso-languages';

LANGUAGES.registerLocale(require('@cospired/i18n-iso-languages/langs/en.json'));

const ALL_LANGUAGES = LANGUAGES.getNames('en');

export { ALL_LANGUAGES, LANGUAGES };
