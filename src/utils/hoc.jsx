import React from 'react';

import { useParams } from 'react-router-dom';

const withParams = (WrappedComponent) => {
  const WithParamsComponent = (props) => <WrappedComponent params={useParams()} {...props} />;
  return WithParamsComponent;
};

export default withParams;
