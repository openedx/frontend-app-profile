import React from 'react';

import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router';

const withParams = (WrappedComponent) => {
  const WithParamsComponent = (props) => <WrappedComponent params={useParams()} {...props} />;
  return WithParamsComponent;
};

const withNavigate = (Component) => {
  const WithNavigateComponent = (props) => {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
  return WithNavigateComponent;
};


export default withParams;
export { withNavigate };
