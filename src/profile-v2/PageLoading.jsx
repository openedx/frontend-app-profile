import React from 'react';
import PropTypes from 'prop-types';

const PageLoading = ({ srMessage }) => (
  <div>
    <div className="d-flex justify-content-center align-items-center flex-column height-50vh">
      <div className="spinner-border text-primary" role="status">
        {srMessage && <span className="sr-only">{srMessage}</span>}
      </div>
    </div>
  </div>
);

PageLoading.propTypes = {
  srMessage: PropTypes.string.isRequired,
};

export default PageLoading;
