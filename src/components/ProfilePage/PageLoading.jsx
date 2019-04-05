import React from 'react';

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
        <div className="spinner-border text-primary" role="status" />
      </div>
    </div>
  );
}

export default PageLoading;
