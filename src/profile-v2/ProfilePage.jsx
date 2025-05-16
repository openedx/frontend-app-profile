import React, {
  useEffect, useState, useContext, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { sendTrackingLogEvent } from '@edx/frontend-platform/analytics';
import { ensureConfig } from '@edx/frontend-platform';
import { AppContext } from '@edx/frontend-platform/react';
import { FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';
import { Alert, Hyperlink } from '@openedx/paragon';
import classNames from 'classnames';

// Actions
import {
  fetchProfile,
  saveProfile,
  saveProfilePhoto,
  deleteProfilePhoto,
  openForm,
  closeForm,
  updateDraft,
} from './data/actions';

// Components
import ProfileAvatar from './forms/ProfileAvatar';
import Name from './forms/Name';
import Country from './forms/Country';
import PreferredLanguage from './forms/PreferredLanguage';
import Education from './forms/Education';
import SocialLinks from './forms/SocialLinks';
import Bio from './forms/Bio';
import DateJoined from './DateJoined';
import UserCertificateSummary from './UserCertificateSummary';
import UsernameDescription from './UsernameDescription';
import PageLoading from './PageLoading';
import Certificates from './Certificates';

// Selectors
import { profilePageSelector } from './data/selectors';
import messages from './ProfilePage.messages';
import withParams from '../utils/hoc';
import { useIsOnMobileScreen, useIsOnTabletScreen } from './data/hooks';

ensureConfig(['CREDENTIALS_BASE_URL', 'LMS_BASE_URL'], 'ProfilePage');

const ProfilePage = ({ params, navigate }) => {
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

  const handleSaveProfilePhoto = useCallback((formData) => {
    dispatch(saveProfilePhoto(context.authenticatedUser.username, formData));
  }, [dispatch, context.authenticatedUser.username]);

  const handleDeleteProfilePhoto = useCallback(() => {
    dispatch(deleteProfilePhoto(context.authenticatedUser.username));
  }, [dispatch, context.authenticatedUser.username]);

  const handleClose = useCallback((formId) => {
    dispatch(closeForm(formId));
  }, [dispatch]);

  const handleOpen = useCallback((formId) => {
    dispatch(openForm(formId));
  }, [dispatch]);

  const handleSubmit = useCallback((formId) => {
    dispatch(saveProfile(formId, context.authenticatedUser.username));
  }, [dispatch, context.authenticatedUser.username]);

  const handleChange = useCallback((fieldName, value) => {
    dispatch(updateDraft(fieldName, value));
  }, [dispatch]);

  const isAuthenticatedUserProfile = () => params.username === context.authenticatedUser.username;

  const isBlockVisible = (blockInfo) => isAuthenticatedUserProfile()
      || (!isAuthenticatedUserProfile() && Boolean(blockInfo));

  const renderViewMyRecordsButton = () => {
    if (!(viewMyRecordsUrl && isAuthenticatedUserProfile())) {
      return null;
    }

    return (
      <Hyperlink
        className={classNames(
          'btn btn-brand btn-rounded font-weight-normal px-4 py-0625rem text-nowrap',
          { 'btn-sm': isMobileView },
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
              'profile-page-bg-banner bg-primary d-md-block align-items-center py-4rem h-100 w-100',
              { 'px-4.5': isMobileView },
              { 'px-75rem': !isMobileView },
            )}
          >
            <div className="col container-fluid w-100 h-100 bg-white py-0 px-25rem rounded-75">
              <div className="col h-100 w-100 py-4 px-0 justify-content-start g-15rem">
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
                    <p className={classNames([
                      'row m-0 font-weight-bold text-truncate text-primary-500',
                      isMobileView ? 'h4' : 'h3',
                    ])}
                    >
                      {params.username}
                    </p>
                    {isBlockVisible(name) && (
                    <p className={classNames([
                      'row pt-2 text-gray-800 font-weight-normal m-0',
                      isMobileView ? 'h5' : 'p',
                    ])}
                    >
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
                      <UserCertificateSummary count={(courseCertificates || []).length} />
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
                <div className="row-auto d-flex align-items-center h-100 w-100 justify-content-start m-0 pt-4">
                  <UsernameDescription />
                </div>
              </div>
              <div className="ml-auto">
                {renderPhotoUploadErrorMessage()}
              </div>
            </div>
          </div>
          <div className="col d-inline-flex px-75rem pt-4rem pb-6 h-100 w-100 align-items-start justify-content-start g-3rem">
            <div>
              <div className="col justify-content-start align-items-start g-5rem p-0">
                <div className="col align-self-stretch height-2625rem justify-content-start align-items-start p-0">
                  <p className={classNames([
                    'font-weight-bold text-primary-500 m-0',
                    isMobileView ? 'h3' : 'h2',
                  ])}
                  >
                    <FormattedMessage
                      id="profile.profile.information"
                      defaultMessage="Profile information"
                      description="heading for the editable profile section"
                    />
                  </p>
                </div>
              </div>
              <div className="row w-100 d-inline-flex pt-4rem align-items-start justify-content-start">
                <div className="col col-6">
                  {isBlockVisible(name) && (
                  <Name
                    name={name}
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
                <div className="col col-6">
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
            className="col container-fluid d-inline-flex bg-color-grey-FBFAF9 px-75rem pt-4rem pb-6 h-100 w-100 align-items-start justify-content-start g-3rem"
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
  navigate: PropTypes.func.isRequired,
  // Account data
  requiresParentalConsent: PropTypes.bool,
  dateJoined: PropTypes.string,
  username: PropTypes.string,
  // Bio form data
  bio: PropTypes.string,
  visibilityBio: PropTypes.string,
  // Certificates data
  courseCertificates: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
  })),
  // Country form data
  country: PropTypes.string,
  visibilityCountry: PropTypes.string,
  // Education form data
  levelOfEducation: PropTypes.string,
  visibilityLevelOfEducation: PropTypes.string,
  // Language proficiency form data
  languageProficiencies: PropTypes.arrayOf(PropTypes.shape({
    code: PropTypes.string.isRequired,
  })),
  visibilityLanguageProficiencies: PropTypes.string,
  // Name form data
  name: PropTypes.string,
  visibilityName: PropTypes.string,
  // Social links form data
  socialLinks: PropTypes.arrayOf(PropTypes.shape({
    platform: PropTypes.string,
    socialLink: PropTypes.string,
  })),
  draftSocialLinksByPlatform: PropTypes.objectOf(PropTypes.shape({
    platform: PropTypes.string,
    socialLink: PropTypes.string,
  })),
  visibilitySocialLinks: PropTypes.string,
  // Other data
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
