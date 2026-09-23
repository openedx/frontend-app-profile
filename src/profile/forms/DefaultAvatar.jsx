import React from 'react';
import PropTypes from 'prop-types';

/**
 * The placeholder shown until a learner uploads a photo.
 *
 * Inlined rather than imported from `../assets/avatar.svg`: the shape fills with `currentColor`,
 * which an SVG referenced through an `<img>` src cannot resolve against this page, and a viewBox
 * with no width or height only stretches to its container while the element is in this document.
 */
const DefaultAvatar = ({ className = undefined }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-hidden
    focusable="false"
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M4.10255106,18.1351061 C4.7170266,16.0581859 8.01891846,14.4720277 12,14.4720277 C15.9810815,14.4720277 19.2829734,16.0581859 19.8974489,18.1351061 C21.215206,16.4412566 22,14.3122775 22,12 C22,6.4771525 17.5228475,2 12,2 C6.4771525,2 2,6.4771525 2,12 C2,14.3122775 2.78479405,16.4412566 4.10255106,18.1351061 Z M12,24 C5.372583,24 0,18.627417 0,12 C0,5.372583 5.372583,0 12,0 C18.627417,0 24,5.372583 24,12 C24,18.627417 18.627417,24 12,24 Z M12,13 C9.790861,13 8,11.209139 8,9 C8,6.790861 9.790861,5 12,5 C14.209139,5 16,6.790861 16,9 C16,11.209139 14.209139,13 12,13 Z"
    />
  </svg>
);

DefaultAvatar.propTypes = {
  className: PropTypes.string,
};

export default DefaultAvatar;
