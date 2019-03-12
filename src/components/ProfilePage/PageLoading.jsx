import React from 'react';
import { Spinner } from 'reactstrap';

import Banner from './elements/Banner';

function PageLoading() {
  return (
    <div>
      <Banner />
      <div
        className="d-flex justify-content-center align-items-center flex-column"
        style={{
          height: '50vh',
        }}
      >
        <Spinner color="primary" />
      </div>
    </div>
  );
}

export default PageLoading;
