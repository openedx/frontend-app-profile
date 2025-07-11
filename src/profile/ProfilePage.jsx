import React, {
  useEffect, useState, useContext, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { sendTrackingLogEvent } from '@edx/frontend-platform/analytics';
import { ensureConfig } from '@edx/frontend-platform';
import { AppContext } from '@edx/frontend-platform/react';
import { FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';
import {
  Alert, Hyperlink, OverlayTrigger, Tooltip,
} from '@openedx/paragon';
import { InfoOutline } from '@openedx/paragon/icons';
import classNames from 'classnames';

import {
  fetchProfile,
  saveProfile,
  saveProfilePhoto,
  deleteProfilePhoto,
  openForm,
  closeForm,
  updateDraft,
} from './data/actions';

import ProfileAvatar from './forms/ProfileAvatar';
import Name from './forms/Name';
import Country from './forms/Country';
import PreferredLanguage from './forms/PreferredLanguage';
import Education from './forms/Education';
import SocialLinks from './forms/SocialLinks';
import Bio from './forms/Bio';
import DateJoined from './DateJoined';
import UserCertificateSummary from './UserCertificateSummary';
import PageLoading from './PageLoading';
import Certificates from './Certificates';

import { profilePageSelector } from './data/selectors';
import messages from './ProfilePage.messages';
import withParams from '../utils/hoc';
import { useIsOnMobileScreen, useIsOnTabletScreen } from './data/hooks';

ensureConfig(['CREDENTIALS_BASE_URL', 'LMS_BASE_URL', 'ACCOUNT_SETTINGS_URL'], 'ProfilePage');

const ProfilePage = ({ params }) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const context = useContext(AppContext);
  const {
    dateJoined,
    courseCertificates,
    name,
    visibilityName,
    profileImage,
    savePhotoState,
    isLoadingProfile,
    photoUploadError,
    country,
    visibilityCountry,
    levelOfEducation,
    visibilityLevelOfEducation,
    socialLinks,
    draftSocialLinksByPlatform,
    visibilitySocialLinks,
    languageProficiencies,
    visibilityLanguageProficiencies,
    bio,
    visibilityBio,
    saveState,
    username,
  } = useSelector(profilePageSelector);

  const navigate = useNavigate();
  const [viewMyRecordsUrl, setViewMyRecordsUrl] = useState(null);
  const isMobileView = useIsOnMobileScreen();
  const isTabletView = useIsOnTabletScreen();

  useEffect(() => {
    const { CREDENTIALS_BASE_URL } = context.config;
    if (CREDENTIALS_BASE_URL) {
      setViewMyRecordsUrl(`${CREDENTIALS_BASE_URL}/records`);
    }

    dispatch(fetchProfile(params.username));
    sendTrackingLogEvent('edx.profile.viewed', {
      username: params.username,
    });
  }, [dispatch, params.username, context.config]);

  useEffect(() => {
    if (!username && saveState === 'error' && navigate) {
      navigate('/notfound');
    }
  }, [username, saveState, navigate]);

  const authenticatedUserName = context.authenticatedUser.username;

  const handleSaveProfilePhoto = useCallback((formData) => {
    dispatch(saveProfilePhoto(authenticatedUserName, formData));
  }, [dispatch, authenticatedUserName]);

  const handleDeleteProfilePhoto = useCallback(() => {
    dispatch(deleteProfilePhoto(authenticatedUserName));
  }, [dispatch, authenticatedUserName]);

  const handleClose = useCallback((formId) => {
    dispatch(closeForm(formId));
  }, [dispatch]);

  const handleOpen = useCallback((formId) => {
    dispatch(openForm(formId));
  }, [dispatch]);

  const handleSubmit = useCallback((formId) => {
    dispatch(saveProfile(formId, authenticatedUserName));
  }, [dispatch, authenticatedUserName]);

  const handleChange = useCallback((fieldName, value) => {
    dispatch(updateDraft(fieldName, value));
  }, [dispatch]);

  const isAuthenticatedUserProfile = () => params.username === authenticatedUserName;

  const isBlockVisible = (blockInfo) => isAuthenticatedUserProfile()
      || (!isAuthenticatedUserProfile() && Boolean(blockInfo));

  const renderViewMyRecordsButton = () => {
    if (!(viewMyRecordsUrl && isAuthenticatedUserProfile())) {
      return null;
    }

    return (
      <Hyperlink
        className={classNames(
          'btn btn-brand bg-brand-500 btn-rounded font-weight-normal px-4 py-10px text-nowrap',
          { 'w-100': isMobileView },
        )}
        target="_blank"
        showLaunchIcon={false}
        destination={viewMyRecordsUrl}
      >
        {intl.formatMessage(messages['profile.viewMyRecords'])}
      </Hyperlink>
    );
  };

  const renderPhotoUploadErrorMessage = () => (
    photoUploadError && (
      <div className="row">
        <div className="col-md-4 col-lg-3">
          <Alert variant="danger" dismissible={false} show>
            {photoUploadError.userMessage}
          </Alert>
        </div>
      </div>
    )
  );

  const commonFormProps = {
    openHandler: handleOpen,
    closeHandler: handleClose,
    submitHandler: handleSubmit,
    changeHandler: handleChange,
  };

  return (
    <div className="profile-page">
      {isLoadingProfile ? (
        <PageLoading srMessage={intl.formatMessage(messages['profile.loading'])} />
      ) : (
        <>
          <div
            className={classNames(
              'profile-page-bg-banner bg-primary d-md-block align-items-center h-100 w-100',
              { 'px-3 py-4': isMobileView },
              { 'px-120px py-5.5': !isMobileView },
            )}
          >
            <div
              className={classNames([
                'col container-fluid w-100 h-100 bg-white py-0 rounded-75',
                {
                  'px-3': isMobileView,
                  'px-40px': !isMobileView,
                },
              ])}
            >
              <div
                className={classNames([
                  'col h-100 w-100 px-0 justify-content-start g-15rem',
                  {
                    'py-4': isMobileView,
                    'py-36px': !isMobileView,
                  },
                ])}
              >
                <div
                  className={classNames([
                    'row-auto d-flex flex-wrap align-items-center h-100 w-100 justify-content-start g-15rem',
                    isMobileView || isTabletView ? 'flex-column' : 'flex-row',
                  ])}
                >
                  <ProfileAvatar
                    className="col p-0"
                    src={profileImage.src}
                    isDefault={profileImage.isDefault}
                    onSave={handleSaveProfilePhoto}
                    onDelete={handleDeleteProfilePhoto}
                    savePhotoState={savePhotoState}
                    isEditable={isAuthenticatedUserProfile()}
                  />
                  <div
                    className={classNames([
                      'col h-100 w-100 m-0 p-0',
                      isMobileView || isTabletView
                        ? 'd-flex flex-column justify-content-center align-items-center'
                        : 'justify-content-start align-items-start',
                    ])}
                  >
                    <p className="row m-0 font-weight-bold text-truncate text-primary-500 h3">
                      {params.username}
                    </p>
                    {isBlockVisible(name) && (
                    <p className="row pt-2 text-gray-800 font-weight-normal m-0 p">
                      {name}
                    </p>
                    )}
                    <div className={classNames(
                      'row pt-2 m-0',
                      isMobileView
                        ? 'd-flex justify-content-center align-items-center flex-column'
                        : 'g-1rem',
                    )}
                    >
                      <DateJoined date={dateJoined} />
                      <UserCertificateSummary count={courseCertificates?.length || 0} />
                    </div>
                  </div>
                  <div className={classNames([
                    'p-0 ',
                    isMobileView || isTabletView ? 'col d-flex justify-content-center' : 'col-auto',
                  ])}
                  >
                    {renderViewMyRecordsButton()}
                  </div>
                </div>
              </div>
              <div className="ml-auto">
                {renderPhotoUploadErrorMessage()}
              </div>
            </div>
          </div>
          <div
            className={classNames([
              'col d-inline-flex h-100 w-100 align-items-start justify-content-start g-3rem',
              isMobileView ? 'py-4 px-3' : 'px-120px py-6',
            ])}
          >
            <div className="w-100 p-0">
              <div className="col justify-content-start align-items-start p-0">
                <div className="col align-self-stretch height-42px justify-content-start align-items-start p-0">
                  <p className="font-weight-bold text-primary-500 m-0 h2">
                    {isMobileView ? (
                      <FormattedMessage
                        id="profile.profile.information"
                        defaultMessage="Profile"
                        description="heading for the editable profile section in mobile view"
                      />
                    )
                      : (
                        <FormattedMessage
                          id="profile.profile.information"
                          defaultMessage="Profile information"
                          description="heading for the editable profile section"
                        />
                      )}
                  </p>
                </div>
              </div>
              <div
                className={classNames([
                  'row m-0 px-0 w-100 d-inline-flex align-items-start justify-content-start',
                  isMobileView ? 'pt-4' : 'pt-5.5',
                ])}
              >
                <div
                  className={classNames([
                    'col p-0',
                    isMobileView ? 'col-12' : 'col-6',
                  ])}
                >
                  <div className="m-0">
                    <div className="row m-0 pb-1.5 align-items-center">
                      <p data-hj-suppress className="h5 font-weight-bold m-0">
                        {intl.formatMessage(messages['profile.username'])}
                      </p>
                      <OverlayTrigger
                        key="top"
                        placement="top"
                        overlay={(
                          <Tooltip variant="light" id="tooltip-top">
                            <p className="h5 font-weight-normal m-0 p-0">
                              {intl.formatMessage(messages['profile.username.tooltip'])}
                            </p>
                          </Tooltip>
                          )}
                      >
                        <InfoOutline className="m-0 info-icon" />
                      </OverlayTrigger>
                    </div>
                    <h4 className="edit-section-header text-gray-700">
                      {params.username}
                    </h4>
                  </div>
                  {isBlockVisible(name) && (
                  <Name
                    name={name}
                    accountSettingsUrl={context.config.ACCOUNT_SETTINGS_URL}
                    visibilityName={visibilityName}
                    formId="name"
                    {...commonFormProps}
                  />
                  )}
                  {isBlockVisible(country) && (
                  <Country
                    country={country}
                    visibilityCountry={visibilityCountry}
                    formId="country"
                    {...commonFormProps}
                  />
                  )}
                  {isBlockVisible((languageProficiencies || []).length) && (
                  <PreferredLanguage
                    languageProficiencies={languageProficiencies || []}
                    visibilityLanguageProficiencies={visibilityLanguageProficiencies}
                    formId="languageProficiencies"
                    {...commonFormProps}
                  />
                  )}
                  {isBlockVisible(levelOfEducation) && (
                  <Education
                    levelOfEducation={levelOfEducation}
                    visibilityLevelOfEducation={visibilityLevelOfEducation}
                    formId="levelOfEducation"
                    {...commonFormProps}
                  />
                  )}
                </div>
                <div
                  className={classNames([
                    'col m-0 pr-0',
                    isMobileView ? 'pl-0 col-12' : 'pl-40px col-6',
                  ])}
                >
                  {isBlockVisible(bio) && (
                  <Bio
                    bio={bio}
                    visibilityBio={visibilityBio}
                    formId="bio"
                    {...commonFormProps}
                  />
                  )}
                  {isBlockVisible((socialLinks || []).some((link) => link?.socialLink !== null)) && (
                  <SocialLinks
                    socialLinks={socialLinks || []}
                    draftSocialLinksByPlatform={draftSocialLinksByPlatform || {}}
                    visibilitySocialLinks={visibilitySocialLinks}
                    formId="socialLinks"
                    {...commonFormProps}
                  />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div
            className={classNames([
              'col container-fluid d-inline-flex bg-color-grey-FBFAF9 h-100 w-100 align-items-start justify-content-start g-3rem',
              isMobileView ? 'py-4 px-3' : 'px-120px py-6',
            ])}
          >
            {isBlockVisible((courseCertificates || []).length) && (
            <Certificates
              certificates={courseCertificates || []}
              formId="certificates"
            />
            )}
          </div>
        </>
      )}
    </div>
  );
};

ProfilePage.propTypes = {
  params: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }).isRequired,
  requiresParentalConsent: PropTypes.bool,
  dateJoined: PropTypes.string,
  username: PropTypes.string,
  bio: PropTypes.string,
  visibilityBio: PropTypes.string,
  courseCertificates: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
  })),
  country: PropTypes.string,
  visibilityCountry: PropTypes.string,
  levelOfEducation: PropTypes.string,
  visibilityLevelOfEducation: PropTypes.string,
  languageProficiencies: PropTypes.arrayOf(PropTypes.shape({
    code: PropTypes.string.isRequired,
  })),
  visibilityLanguageProficiencies: PropTypes.string,
  name: PropTypes.string,
  visibilityName: PropTypes.string,
  socialLinks: PropTypes.arrayOf(PropTypes.shape({
    platform: PropTypes.string,
    socialLink: PropTypes.string,
  })),
  draftSocialLinksByPlatform: PropTypes.objectOf(PropTypes.shape({
    platform: PropTypes.string,
    socialLink: PropTypes.string,
  })),
  visibilitySocialLinks: PropTypes.string,
  profileImage: PropTypes.shape({
    src: PropTypes.string,
    isDefault: PropTypes.bool,
  }),
  saveState: PropTypes.oneOf([null, 'pending', 'complete', 'error']),
  savePhotoState: PropTypes.oneOf([null, 'pending', 'complete', 'error']),
  isLoadingProfile: PropTypes.bool,
  photoUploadError: PropTypes.objectOf(PropTypes.string),
};

ProfilePage.defaultProps = {
  saveState: null,
  username: '',
  savePhotoState: null,
  photoUploadError: {},
  profileImage: {},
  name: null,
  levelOfEducation: null,
  country: null,
  socialLinks: [],
  draftSocialLinksByPlatform: {},
  bio: null,
  languageProficiencies: [],
  courseCertificates: [],
  requiresParentalConsent: null,
  dateJoined: null,
  visibilityName: null,
  visibilityCountry: null,
  visibilityLevelOfEducation: null,
  visibilitySocialLinks: null,
  visibilityLanguageProficiencies: null,
  visibilityBio: null,
  isLoadingProfile: false,
};

export default withParams(ProfilePage);
