import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import EditButton from './EditButton';
import { Visibility } from './Visibility';
import { useIsOnMobileScreen } from '../../data/hooks';

const EditableItemHeader = ({
  content = '',
  showVisibility = false,
  visibility = 'private',
  showEditButton = false,
  onClickEdit = () => {},
  headingId = null,
}) => {
  const isMobileView = useIsOnMobileScreen();
  return (
    <>
      <div className="row m-0 p-0 d-flex flex-nowrap align-items-center">
        <div
          className={classNames([
            'm-0 p-0 col-auto',
            isMobileView ? 'w-90' : '',
          ])}
        >
          <h4
            className="edit-section-header text-gray-700"
            id={headingId}
          >
            {content}
          </h4>
        </div>
        <div
          className={classNames([
            'col-auto m-0 p-0 d-flex align-items-center',
            isMobileView ? 'col-1' : 'col-auto',
          ])}
        >
          {showEditButton ? <EditButton className="p-1.5" onClick={onClickEdit} /> : null}
        </div>
      </div>
      <div className="row m-0 p-0">
        {showVisibility ? <p className="mb-0"><Visibility to={visibility} /></p> : null}
      </div>
    </>
  );
};

export default EditableItemHeader;

EditableItemHeader.propTypes = {
  onClickEdit: PropTypes.func,
  showVisibility: PropTypes.bool,
  showEditButton: PropTypes.bool,
  content: PropTypes.node,
  visibility: PropTypes.oneOf(['private', 'all_users']),
  headingId: PropTypes.string,
};
