import React from 'react';

function PageLoading() {
  return (
    <div>
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
