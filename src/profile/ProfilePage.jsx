import React, {
  useEffect, useContext, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { sendTrackingLogEvent } from '@edx/frontend-platform/analytics';
import { ensureConfig } from '@edx/frontend-platform';
import { AppContext } from '@edx/frontend-platform/react';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Alert, OverlayTrigger, Tooltip,
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
import ProfileStatusCards from './ProfileStatusCards';
import ProfileStatusActions from './ProfileStatusActions';
import Name from './forms/Name';
import Country from './forms/Country';
import PreferredLanguage from './forms/PreferredLanguage';
import Education from './forms/Education';
import SocialLinks from './forms/SocialLinks';
import Bio from './forms/Bio';
import PageLoading from './PageLoading';
import Certificates from './Certificates';

import { profilePageSelector } from './data/selectors';
import messages from './ProfilePage.messages';
import withParams from '../utils/hoc';
import {
  useCourseCompletionCounts,
  useIsOnMobileScreen,
  useIsOnTabletScreen,
} from './data/hooks';

import AdditionalProfileFieldsSlot from '../plugin-slots/AdditionalProfileFieldsSlot';

ensureConfig(['ACCOUNT_SETTINGS_URL'], 'ProfilePage');

// Directory-sourced names carry an org suffix, e.g. "Jane Cruz (SSED-EXT-CEB)",
// which is noise in the profile header.
const getDisplayName = (fullName) => {
  if (typeof fullName !== 'string') {
    return fullName;
  }
  const [beforeSuffix] = fullName.split(/[([{]/);
  return beforeSuffix.trim() || fullName.trim();
};

const ProfilePage = ({ params }) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const context = useContext(AppContext);
  const {
    courseCertificates,
    name,
    email,
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
  const isMobileView = useIsOnMobileScreen();
  const isTabletView = useIsOnTabletScreen();

  useEffect(() => {
    dispatch(fetchProfile(params.username));
    sendTrackingLogEvent('edx.profile.viewed', {
      username: params.username,
    });
  }, [dispatch, params.username]);

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

  const isAuthenticatedUserProfile = params.username === authenticatedUserName;

  const {
    counts: statusCounts,
    isLoading: isLoadingStatusCounts,
  } = useCourseCompletionCounts(isAuthenticatedUserProfile);

  const displayEmail = email || (
    isAuthenticatedUserProfile ? context.authenticatedUser?.email : null
  );

  const isBlockVisible = (blockInfo) => isAuthenticatedUserProfile || Boolean(blockInfo);

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
              'profile-page-header w-100',
              isMobileView ? 'pt-4 pb-3' : 'pt-5 pb-4',
            )}
          >
            <div className="profile-header-card">
              <div
                className={classNames(
                  'profile-header-card__identity',
                  isMobileView || isTabletView
                    ? 'flex-column'
                    : 'flex-row',
                )}
              >
                <ProfileAvatar
                  src={profileImage.src}
                  isDefault={profileImage.isDefault}
                  onSave={handleSaveProfilePhoto}
                  onDelete={handleDeleteProfilePhoto}
                  savePhotoState={savePhotoState}
                  isEditable={isAuthenticatedUserProfile}
                />
                <div className="profile-identity">
                  <p className="profile-identity__name m-0 text-truncate">
                    {isBlockVisible(name) ? getDisplayName(name) : params.username}
                  </p>
                  {displayEmail && (
                    <p className="profile-identity__email m-0 text-truncate">
                      {displayEmail}
                    </p>
                  )}
                  {isAuthenticatedUserProfile && (
                    <ProfileStatusCards
                      counts={statusCounts}
                      isLoading={isLoadingStatusCounts}
                    />
                  )}
                </div>
              </div>
              {isAuthenticatedUserProfile && (
                <ProfileStatusActions
                  overdueCount={statusCounts.overdue}
                  isLoading={isLoadingStatusCounts}
                />
              )}
              {renderPhotoUploadErrorMessage()}
            </div>
          </div>
          <div
            className={classNames([
              'col d-inline-flex h-100 w-100 align-items-start justify-content-start g-3rem',
              isMobileView ? 'py-4' : 'py-6',
            ])}
          >
            <div className="w-100 p-0">
              <div className="col justify-content-start align-items-start p-0">
                <div className="col align-self-stretch height-42px justify-content-start align-items-start p-0">
                  <p className="font-weight-bold text-primary-500 m-0 h2">
                    {intl.formatMessage(
                      isMobileView
                        ? messages['profile.profile.information.mobile']
                        : messages['profile.profile.information'],
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

                  <AdditionalProfileFieldsSlot />
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
              isMobileView ? 'py-4' : 'py-6',
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
};

export default withParams(ProfilePage);
