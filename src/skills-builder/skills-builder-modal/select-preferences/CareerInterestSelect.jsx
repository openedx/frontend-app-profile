import React from 'react';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import messages from './messages';

const CareerInterestSelect = () => (
  <div>
    <h4>
      <FormattedMessage {...messages.careerInterestPrompt} />
    </h4>
    <p>
      JobTitleAutosuggest component can be reused here
    </p>
  </div>
);

export default CareerInterestSelect;
