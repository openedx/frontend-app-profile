import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';

import { mergeAppConfig, sendTrackingLogEvent } from '@openedx/frontend-base';

import { appId } from '@src/constants';
import * as api from '@src/profile/data/api';
import { CUSTOM_ALL_USERS_PREFERENCES } from '@src/profile/data/hooks';
import { profileKeys } from '@src/profile/data/queryKeys';
import ProfilePage from '@src/profile/ProfilePage';
import { createTestQueryClient, renderWithProviders } from '@src/tests/renderWithProviders';

jest.mock('@src/profile/data/api');
jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  sendTrackingLogEvent: jest.fn(),
}));

const account = {
  username: 'staff',
  name: 'Lemon Seltzer',
  bio: 'This is my bio',
  country: 'ME',
  levelOfEducation: 'el',
  languageProficiencies: [{ code: 'yo' }],
  socialLinks: [{ platform: 'facebook', socialLink: 'https://www.facebook.com/aloha' }],
  profileImage: { imageUrlFull: 'http://img/full.jpg', hasImage: true },
  dateJoined: '2017-06-07T00:44:23Z',
  accountPrivacy: 'custom',
  extendedProfile: [],
};
const preferences = {
  accountPrivacy: 'custom',
  visibilityName: 'private',
  visibilityBio: 'all_users',
  visibilityCountry: 'all_users',
  visibilityLevelOfEducation: 'private',
  visibilityLanguageProficiencies: 'all_users',
  visibilitySocialLinks: 'all_users',
};
const certificates = [{
  courseId: 'course-v1:edX+DemoX+Demo_Course',
  courseDisplayName: 'edX Demonstration Course',
  courseOrganization: 'edX',
  certificateType: 'verified',
  modifiedDate: '2019-03-04T19:31:39.930255Z',
  downloadUrl: 'http://www.example.com/',
  uuid: 'abc',
}];

// `setupTest` signs in `staff`, so a route username of `staff` is the learner's own profile.
const renderPage = ({ username = 'staff', config = {}, ...options } = {}) => {
  mergeAppConfig(appId, {
    CREDENTIALS_BASE_URL: 'http://credentials.example.com',
    ...config,
  });
  return renderWithProviders(<ProfilePage />, {
    route: `/profile/u/${username}`,
    path: '/profile/u/:username',
    ...options,
  });
};

beforeEach(() => {
  jest.clearAllMocks();
  api.getAccount.mockResolvedValue(account);
  api.getPreferences.mockResolvedValue(preferences);
  api.getCourseCertificates.mockResolvedValue(certificates);
  api.getCountryList.mockResolvedValue(['US', 'CA']);
});

describe('<ProfilePage />', () => {
  it('shows a spinner while the profile loads', () => {
    api.getAccount.mockReturnValue(new Promise(() => {}));
    renderPage();

    expect(screen.getByRole('status')).toHaveTextContent('Profile loading...');
  });

  it("shows the learner's own profile with its editing controls", async () => {
    renderPage();

    // The name shows in the banner and in its own field.
    expect(await screen.findAllByText('Lemon Seltzer')).toHaveLength(2);
    expect(screen.getAllByText('staff').length).toBeGreaterThan(0);
    expect(screen.getByText('This is my bio')).toBeInTheDocument();
    expect(screen.getByText('Montenegro')).toBeInTheDocument();
    expect(screen.getByText('Elementary/primary school')).toBeInTheDocument();
    expect(screen.getByText('edX Demonstration Course')).toBeInTheDocument();
    expect(screen.getByText(/Member since/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View My Records' }))
      .toHaveAttribute('href', 'http://credentials.example.com/records');
    // Only the owner sees who can see each field.
    expect(screen.getAllByText('Just me').length).toBeGreaterThan(0);
    expect(api.getPreferences).toHaveBeenCalledWith('staff');
  });

  it('starts cold on a revisit, so a name the Account app changed is never painted stale', async () => {
    // A client that keeps queries around, as the shell's does; the profile's own opt out of it.
    const queryClient = createTestQueryClient({ gcTime: 5 * 60 * 1000 });

    const firstVisit = renderPage({ queryClient });
    expect(await screen.findAllByText('Lemon Seltzer')).toHaveLength(2);
    firstVisit.unmount();

    await waitFor(() => {
      expect(queryClient.getQueryData(profileKeys.account('staff'))).toBeUndefined();
      expect(queryClient.getQueryData(profileKeys.preferences('staff'))).toBeUndefined();
    });

    // The learner renames themselves in Account, then comes back.
    api.getAccount.mockResolvedValue({ ...account, name: 'Sparkling Water' });
    renderPage({ queryClient });

    expect(screen.getByRole('status')).toHaveTextContent('Profile loading...');
    expect(screen.queryByText('Lemon Seltzer')).not.toBeInTheDocument();
    expect(await screen.findAllByText('Sparkling Water')).toHaveLength(2);
  });

  it('edits and saves a field', async () => {
    api.getAccount.mockResolvedValue({ ...account, bio: null });
    api.patchProfile.mockResolvedValue({ bio: 'Hello there' });
    renderPage();

    fireEvent.click(await screen.findByRole('button', { name: /Add a short bio/ }));
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Hello there' } });
    expect(textarea).toHaveValue('Hello there');
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => expect(api.patchProfile).toHaveBeenCalledWith('staff', { bio: 'Hello there' }));
    expect(await screen.findByRole('button', { name: 'Saved' })).toBeInTheDocument();
  });

  it("shows someone else's public fields without controls", async () => {
    api.getAccount.mockResolvedValue({
      ...account, username: 'verified', name: 'Verified User', levelOfEducation: null,
    });
    renderPage({ username: 'verified' });

    expect(await screen.findAllByText('Verified User')).toHaveLength(2);
    expect(screen.getByText('This is my bio')).toBeInTheDocument();
    expect(screen.queryByText('Just me')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Add / })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'View My Records' })).not.toBeInTheDocument();
    expect(api.getPreferences).not.toHaveBeenCalled();
  });

  it('hides the records link without a credentials service', async () => {
    renderPage({ config: { CREDENTIALS_BASE_URL: '' } });

    await screen.findAllByText('Lemon Seltzer');
    expect(screen.queryByRole('link', { name: 'View My Records' })).not.toBeInTheDocument();
  });

  it('shows the not-found page for an unknown user, without retrying', async () => {
    api.getAccount.mockRejectedValue({ response: { status: 404 } });
    renderPage({ username: 'nobody' });

    expect(await screen.findByText(/The page you're looking for is unavailable/)).toBeInTheDocument();
    expect(api.getAccount).toHaveBeenCalledTimes(1);
  });

  it('shows an error page when the profile cannot be loaded', async () => {
    api.getAccount.mockRejectedValue({ response: { status: 500 } });
    renderPage();

    expect(await screen.findByText(/An unexpected error occurred/)).toBeInTheDocument();
  });

  it('records the profile view once', async () => {
    renderPage({ username: 'test-username' });

    await screen.findAllByText('Lemon Seltzer');
    expect(sendTrackingLogEvent).toHaveBeenCalledTimes(1);
    expect(sendTrackingLogEvent).toHaveBeenCalledWith('edx.profile.viewed', { username: 'test-username' });
  });

  it('moves a legacy public account to per-field privacy, once', async () => {
    api.getAccount.mockResolvedValue({ ...account, accountPrivacy: 'all_users' });
    api.patchPreferences.mockResolvedValue({});
    renderPage();

    await waitFor(() => expect(api.patchPreferences).toHaveBeenCalledWith('staff', CUSTOM_ALL_USERS_PREFERENCES));
    await screen.findAllByText('Lemon Seltzer');
    expect(api.patchPreferences).toHaveBeenCalledTimes(1);
  });

  it("does not touch someone else's privacy settings", async () => {
    api.getAccount.mockResolvedValue({ ...account, username: 'other', accountPrivacy: 'all_users' });
    renderPage({ username: 'other' });

    await screen.findAllByText('Lemon Seltzer');
    expect(api.patchPreferences).not.toHaveBeenCalled();
  });

  it('shows the message of a rejected photo upload', async () => {
    const error = new Error('Bad Request');
    error.processedData = { userMessage: 'The file must be smaller than 1 MB in size.' };
    api.postProfilePhoto.mockRejectedValue(error);
    const { container } = renderPage();

    await screen.findAllByText('Lemon Seltzer');
    const file = new File(['photo'], 'photo.png', { type: 'image/png' });
    fireEvent.change(container.querySelector('#photo-file'), { target: { files: [file] } });

    expect(await screen.findByText('The file must be smaller than 1 MB in size.')).toBeInTheDocument();
    expect(api.postProfilePhoto).toHaveBeenCalledWith('staff', expect.any(FormData));
  });

  it('drops the upload error along with the photo', async () => {
    const error = new Error('Bad Request');
    error.processedData = { userMessage: 'The file must be smaller than 1 MB in size.' };
    api.postProfilePhoto.mockRejectedValue(error);
    api.deleteProfilePhoto.mockResolvedValue({ imageUrlFull: 'http://img/default.jpg', hasImage: false });
    const { container } = renderPage();

    await screen.findAllByText('Lemon Seltzer');
    fireEvent.change(container.querySelector('#photo-file'), {
      target: { files: [new File(['photo'], 'photo.png', { type: 'image/png' })] },
    });
    await screen.findByText('The file must be smaller than 1 MB in size.');

    fireEvent.click(container.querySelector('#dropdown-toggle-with-iconbutton'));
    fireEvent.click(await screen.findByRole('button', { name: 'Remove photo' }));

    await waitFor(() => expect(api.deleteProfilePhoto).toHaveBeenCalledWith('staff'));
    await waitFor(() => {
      expect(screen.queryByText('The file must be smaller than 1 MB in size.')).not.toBeInTheDocument();
    });
  });
});
