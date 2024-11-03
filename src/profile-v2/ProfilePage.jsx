import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { sendTrackingLogEvent } from '@edx/frontend-platform/analytics';
import { ensureConfig, getConfig } from '@edx/frontend-platform';
import { AppContext } from '@edx/frontend-platform/react';
import { injectIntl } from '@edx/frontend-platform/i18n';
import { Alert, Hyperlink } from '@openedx/paragon';
import {
  fetchProfile,
  saveProfilePhoto,
  deleteProfilePhoto,
} from './data/actions';
import ProfileAvatar from './forms/ProfileAvatar';
import Certificates from './Certificates';
import DateJoined from './DateJoined';
import CertificateCount from './CertificateCount';
import UsernameDescription from './UsernameDescription';
import PageLoading from './PageLoading';
import { profilePageSelector } from './data/selectors';
import messages from './ProfilePage.messages';
import withParams from '../utils/hoc';

ensureConfig(['CREDENTIALS_BASE_URL', 'LMS_BASE_URL'], 'ProfilePage');

const ProfilePage = ({ params, intl }) => {
  const dispatch = useDispatch();
  const context = useContext(AppContext);
  const {
    requiresParentalConsent,
    dateJoined,
    yearOfBirth,
    courseCertificates,
    name,
    profileImage,
    savePhotoState,
    isLoadingProfile,
    photoUploadError,
  } = useSelector(profilePageSelector);

  const [viewMyRecordsUrl, setViewMyRecordsUrl] = useState(null);

  useEffect(() => {
    const credentialsBaseUrl = context.config.CREDENTIALS_BASE_URL;
    if (credentialsBaseUrl) {
      setViewMyRecordsUrl(`${credentialsBaseUrl}/records`);
    }

    dispatch(fetchProfile(params.username));
    sendTrackingLogEvent('edx.profile.viewed', {
      username: params.username,
    });
  }, [dispatch, params.username, context.config.CREDENTIALS_BASE_URL]);

  const handleSaveProfilePhoto = (formData) => {
    dispatch(saveProfilePhoto(context.authenticatedUser.username, formData));
  };

  const handleDeleteProfilePhoto = () => {
    dispatch(deleteProfilePhoto(context.authenticatedUser.username));
  };

  const isYOBDisabled = () => {
    const currentYear = new Date().getFullYear();
    const isAgeOrNotCompliant = !yearOfBirth || ((currentYear - yearOfBirth) < 13);
    return isAgeOrNotCompliant && getConfig().COLLECT_YEAR_OF_BIRTH !== 'true';
  };

  const isAuthenticatedUserProfile = () => params.username === context.authenticatedUser.username;

  const isBlockVisible = (blockInfo) => isAuthenticatedUserProfile()
      || (!isAuthenticatedUserProfile() && Boolean(blockInfo));

  const renderViewMyRecordsButton = () => {
    if (!(viewMyRecordsUrl && isAuthenticatedUserProfile())) {
      return null;
    }

    return (
      <Hyperlink className="btn btn-brand btn-rounded font-weight-normal px-4 py-0625rem text-nowrap" target="_blank" showLaunchIcon={false} destination={viewMyRecordsUrl}>
        {intl.formatMessage(messages['profile.viewMyRecords'])}
      </Hyperlink>
    );
  };

  const renderPhotoUploadErrorMessage = () => {
    if (photoUploadError === null) {
      return null;
    }

    return (
      <div className="row">
        <div className="col-md-4 col-lg-3">
          <Alert variant="danger" dismissible={false} show>
            {photoUploadError.userMessage}
          </Alert>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (isLoadingProfile) {
      return <PageLoading srMessage={intl.formatMessage(messages['profile.loading'])} />;
    }

    return (
      <>
        <div className="profile-page-bg-banner bg-primary d-md-block align-items-center px-75rem py-4rem h-100 w-100">
          <div className="col container-fluid w-100 h-100 bg-white py-0 pl-25rem pr-25rem rounded-75">
            <div className="col h-100 w-100 py-4 px-0 justify-content-start g-15rem">
              <div className="row-auto d-flex flex-wrap align-items-center h-100 w-100 justify-content-start g-15rem">
                <ProfileAvatar
                  className="col p-0"
                  src={profileImage.src}
                  isDefault={profileImage.isDefault}
                  onSave={handleSaveProfilePhoto}
                  onDelete={handleDeleteProfilePhoto}
                  savePhotoState={savePhotoState}
                  isEditable={isAuthenticatedUserProfile() && !requiresParentalConsent}
                />
                <div className="col justify-content-start align-items-start h-100 w-100 m-0 p-0">
                  <h1 className="row h3 m-0 font-weight-bold text-truncate text-primary-500">{params.username}</h1>
                  {isBlockVisible(name) && (
                  <p className="row pt-2 text-gray-800 font-weight-normal m-0">{name}</p>
                  )}
                  <div className="row pt-2 m-0 g-1rem">
                    <DateJoined date={dateJoined} />
                    <CertificateCount count={courseCertificates.length} />
                  </div>
                </div>
                <div className="col-auto p-0">
                  {renderViewMyRecordsButton()}
                </div>
              </div>
              <div className="row-auto d-flex align-items-center h-100 w-100 justify-content-start m-0 pt-4">
                {isYOBDisabled() && <UsernameDescription />}
              </div>
            </div>
            <div className="ml-auto">
              {renderPhotoUploadErrorMessage()}
            </div>
          </div>
        </div>
        <div className="col container-fluid d-inline-flex px-75rem pt-4rem pb-6 h-100 w-100 align-items-start justify-content-center g-3rem">
          {isBlockVisible(courseCertificates.length) && (
          <Certificates
            certificates={courseCertificates}
            formId="certificates"
          />
          )}
        </div>
      </>
    );
  };

  return (
    <div className="profile-page">
      {renderContent()}
    </div>
  );
};

ProfilePage.propTypes = {
  params: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
};

export default injectIntl(withParams(ProfilePage));
