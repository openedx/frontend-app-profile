import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

import {
  ErrorPage,
  FormattedMessage,
  getAppConfig,
  sendTrackingLogEvent,
  useIntl,
} from '@openedx/frontend-base';
import {
  Alert, Hyperlink, OverlayTrigger, Tooltip,
} from '@openedx/paragon';
import { InfoOutline } from '@openedx/paragon/icons';
import classNames from 'classnames';

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
import NotFoundPage from './NotFoundPage';

import messages from './ProfilePage.messages';
import { ProfileFormProvider, useProfileForm } from './data/FormContext';
import {
  useDeleteProfilePhoto,
  useIsOnMobileScreen,
  useIsOnTabletScreen,
  useMigrateAccountPrivacy,
  useProfileData,
  useSaveProfilePhoto,
} from './data/hooks';

import AdditionalProfileFieldsSlot from '@src/slots/AdditionalProfileFieldsSlot';

import { appId } from '@src/constants';
import { getAccountSettingsUrl } from '@src/utils';

const ProfilePageContent = () => {
  const intl = useIntl();
  const {
    username,
    isOwnProfile,
    openForm,
    closeForm,
    updateDraft,
    saveProfile,
  } = useProfileForm();
  const {
    isPending,
    isNotFound,
    isError,
    accountPrivacy,
    dateJoined,
    courseCertificates,
    name,
    visibilityName,
    profileImage,
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
  } = useProfileData();
  const savePhoto = useSaveProfilePhoto(username);
  const deletePhoto = useDeleteProfilePhoto(username);
  const migrateAccountPrivacy = useMigrateAccountPrivacy(username);
  const hasMigratedPrivacy = useRef(false);

  const isMobileView = useIsOnMobileScreen();
  const isTabletView = useIsOnTabletScreen();

  const { CREDENTIALS_BASE_URL: credentialsBaseUrl } = getAppConfig(appId);
  const viewMyRecordsUrl = credentialsBaseUrl ? `${credentialsBaseUrl}/records` : null;

  useEffect(() => {
    sendTrackingLogEvent('edx.profile.viewed', { username });
  }, [username]);

  // Accounts still on the legacy "everything public" privacy setting are moved to the per-field
  // model on first view, once; the ref keeps StrictMode's doubled effects from doing it twice.
  const { mutate: migratePrivacy } = migrateAccountPrivacy;
  useEffect(() => {
    if (isOwnProfile && accountPrivacy === 'all_users' && !hasMigratedPrivacy.current) {
      hasMigratedPrivacy.current = true;
      migratePrivacy();
    }
  }, [isOwnProfile, accountPrivacy, migratePrivacy]);

  if (isNotFound) {
    return <NotFoundPage />;
  }
  if (isError) {
    return <ErrorPage />;
  }

  const savePhotoState = savePhoto.isPending || deletePhoto.isPending ? 'pending' : null;
  const photoUploadError = savePhoto.error?.processedData ?? null;

  const handleDeleteProfilePhoto = () => {
    // The error of a rejected upload is about a photo that is going away.
    savePhoto.reset();
    deletePhoto.mutate();
  };

  const isBlockVisible = (blockInfo) => isOwnProfile || Boolean(blockInfo);

  const renderViewMyRecordsButton = () => {
    if (!(viewMyRecordsUrl && isOwnProfile)) {
      return null;
    }

    return (
      <Hyperlink
        className={classNames(
          'btn btn-brand bg-brand-500 font-weight-normal px-4 py-10px text-nowrap',
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
    openHandler: openForm,
    closeHandler: closeForm,
    submitHandler: saveProfile,
    changeHandler: updateDraft,
  };

  return (
    <div className="profile-page">
      {isPending ? (
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
                    onSave={savePhoto.mutate}
                    onDelete={handleDeleteProfilePhoto}
                    savePhotoState={savePhotoState}
                    isEditable={isOwnProfile}
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
                      {username}
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
                      {username}
                    </h4>
                  </div>
                  {isBlockVisible(name) && (
                  <Name
                    name={name}
                    accountSettingsUrl={getAccountSettingsUrl()}
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
              isMobileView ? 'py-4 px-3' : 'px-120px py-6',
            ])}
          >
            {isBlockVisible((courseCertificates || []).length) && (
            <Certificates certificates={courseCertificates || []} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

/**
 * The profile of the user named in the route. The form state is keyed on the username, so
 * navigating from one profile to another starts it afresh.
 */
const ProfilePage = () => {
  const { username } = useParams();
  return (
    <ProfileFormProvider key={username} username={username}>
      <ProfilePageContent />
    </ProfileFormProvider>
  );
};

export default ProfilePage;
