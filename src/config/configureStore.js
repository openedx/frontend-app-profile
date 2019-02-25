import { configuration } from './environment';
import configureStoreProd from './configureStore.prod';
import configureStoreDev from './configureStore.dev';

if (configuration.ENVIRONMENT === 'production') {
  module.exports = configureStoreProd;
} else {
  module.exports = configureStoreDev;
}
