/**
 * For each locale we want to support, react-intl needs 1) the locale-data, which includes
 * information about how to format numbers, handle plurals, etc., and 2) the translations, as an
 * object holding message id / translated string pairs.  A locale string and the messages object are
 * passed into the IntlProvider element that wraps your element hierarchy.
 *
 * Note that react-intl has no way of checking if the translations you give it actually have
 * anything to do with the locale you pass it; it will happily use whatever messages object you pass
 * in.  However, if the locale data for the locale you passed into the IntlProvider was not
 * correctly installed with addLocaleData, all of your translations will fall back to the default
 * (in our case English), *even if you gave IntlProvider the correct messages object for that
 * locale*.
 */

import { addLocaleData } from 'react-intl';

import arLocale from 'react-intl/locale-data/ar';
import enLocale from 'react-intl/locale-data/en';
import es419Locale from 'react-intl/locale-data/es';
import frLocale from 'react-intl/locale-data/fr';
import zhcnLocale from 'react-intl/locale-data/zh';

import arMessages from './messages/ar.json';
// no need to import en messages-- they are in the defaultMessage field
import es419Messages from './messages/es_419.json';
import frMessages from './messages/fr.json';
import zhcnMessages from './messages/zh_CN.json';

addLocaleData([...arLocale, ...enLocale, ...es419Locale, ...frLocale, ...zhcnLocale]);

// TODO (ARCH-563): this should ultimately come from the user's settings, but for now, set your
// browser language to the language you want to see
const getLocale = (localeStr = window.navigator.language) => localeStr.substr(0, 2);

const messages = { // current fallback strategy is to use the first two letters of the locale code
  ar: arMessages,
  es: es419Messages,
  fr: frMessages,
  zh: zhcnMessages,
};

const getMessages = (locale = getLocale()) => messages[locale];

export { getLocale, getMessages };
