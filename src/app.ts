import { App } from '@openedx/frontend-base';

import { appId } from '@src/constants';
import routes from '@src/routes';
import slots from '@src/slots';

const app: App = {
  appId,
  routes,
  slots,
  defaultConfig: {
    // Hides the per-field visibility controls, leaving the account-wide setting in charge.
    DISABLE_VISIBILITY_EDITING: false,
    // The Learner Record micro-frontend, which has no route role to resolve.  The View My
    // Records button is hidden when it is unset.
    CREDENTIALS_BASE_URL: null,
  },
};

export default app;
