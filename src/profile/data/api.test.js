import {
  camelCaseObject,
  convertKeyNames,
  getAuthenticatedHttpClient,
  logError,
  snakeCaseObject,
} from '@openedx/frontend-base';
import {
  getAccount,
  patchProfile,
  postProfilePhoto,
  deleteProfilePhoto,
  getPreferences,
  patchPreferences,
  getCourseCertificates,
  getCountryList,
} from '@src/profile/data/api';

import { FIELD_LABELS } from '@src/profile/data/constants';

// --- Mocks ---
jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  getSiteConfig: jest.fn(() => ({ lmsBaseUrl: 'http://fake-lms' })),
  getAuthenticatedHttpClient: jest.fn(),
  logError: jest.fn(),
  camelCaseObject: jest.fn((obj) => obj),
  snakeCaseObject: jest.fn((obj) => obj),
  convertKeyNames: jest.fn((obj) => obj),
}));

const mockHttpClient = {
  get: jest.fn(),
  patch: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
  getAuthenticatedHttpClient.mockReturnValue(mockHttpClient);
});

// --- Tests ---
describe('api', () => {
  describe('getAccount', () => {
    it('should return processed account data', async () => {
      const mockData = { name: 'John Doe', socialLinks: [] };
      mockHttpClient.get.mockResolvedValue({ data: mockData });

      const result = await getAccount('john');
      expect(result).toMatchObject(mockData);
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        'http://fake-lms/api/user/v2/accounts/john/',
      );
    });
  });

  describe('patchProfile', () => {
    it('should patch and return processed data', async () => {
      const mockData = { bio: 'New Bio' };
      mockHttpClient.patch.mockResolvedValue({ data: mockData });

      const result = await patchProfile('john', { bio: 'New Bio' });
      expect(result).toMatchObject(mockData);
      expect(snakeCaseObject).toHaveBeenCalledWith({ bio: 'New Bio' });
    });

    it('should throw processed error on failure', async () => {
      const error = { response: { data: { some: 'error' } } };
      mockHttpClient.patch.mockRejectedValue(error);

      await expect(patchProfile('john', {})).rejects.toMatchObject(error);
    });

    it('should turn the v2 error body into one message per form', async () => {
      camelCaseObject.mockImplementationOnce(jest.requireActual('@openedx/frontend-base').camelCaseObject);
      mockHttpClient.patch.mockRejectedValue({
        response: {
          data: {
            errors: {
              bio: ['Ensure this field has no more than 300 characters.'],
              'social_links[0].social_link': ['This field is required.'],
              'social_links[1].platform': ['"myspace" is not a valid choice.'],
            },
          },
        },
      });

      await expect(patchProfile('john', {})).rejects.toMatchObject({
        processedData: {
          fieldErrors: {
            bio: { userMessage: 'Ensure this field has no more than 300 characters.' },
            socialLinks: { userMessage: 'This field is required. "myspace" is not a valid choice.' },
          },
        },
      });
      expect(mockHttpClient.patch).toHaveBeenCalledWith(
        'http://fake-lms/api/user/v2/accounts/john/',
        {},
        { headers: { 'Content-Type': 'application/merge-patch+json' } },
      );
    });
  });

  describe('postProfilePhoto', () => {
    it('should post photo and return updated profile image', async () => {
      mockHttpClient.post.mockResolvedValue({});
      mockHttpClient.get.mockResolvedValue({
        data: { profileImage: { url: 'img.png' } },
      });

      const result = await postProfilePhoto('john', new FormData());
      expect(result).toEqual({ url: 'img.png' });
    });

    it('should throw error if API fails', async () => {
      const error = { response: { data: { error: 'fail' } } };
      mockHttpClient.post.mockRejectedValue(error);
      await expect(postProfilePhoto('john', new FormData())).rejects.toMatchObject(error);
    });

    it('should show the message v2 gives for the file', async () => {
      mockHttpClient.post.mockRejectedValue({
        response: {
          data: {
            detail: 'file: The file must be smaller than 1 MB in size.',
            errors: { file: ['The file must be smaller than 1 MB in size.'] },
          },
        },
      });

      await expect(postProfilePhoto('john', new FormData())).rejects.toMatchObject({
        processedData: { userMessage: 'The file must be smaller than 1 MB in size.' },
      });
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        'http://fake-lms/api/user/v2/accounts/john/profile_image/',
        expect.any(FormData),
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
    });
  });

  describe('deleteProfilePhoto', () => {
    it('should delete photo and return updated profile image', async () => {
      mockHttpClient.delete.mockResolvedValue({});
      mockHttpClient.get.mockResolvedValue({
        data: { profileImage: { url: 'deleted.png' } },
      });

      const result = await deleteProfilePhoto('john');
      expect(result).toEqual({ url: 'deleted.png' });
      expect(mockHttpClient.delete).toHaveBeenCalledWith('http://fake-lms/api/user/v2/accounts/john/profile_image/');
    });
  });

  describe('getPreferences', () => {
    it('should return camelCased preferences', async () => {
      mockHttpClient.get.mockResolvedValue({ data: { pref: 1 } });

      const result = await getPreferences('john');
      expect(result).toMatchObject({ pref: 1 });
      expect(camelCaseObject).toHaveBeenCalledWith({ pref: 1 });
      expect(mockHttpClient.get).toHaveBeenCalledWith('http://fake-lms/api/user/v2/accounts/john/preferences/');
    });
  });

  describe('patchPreferences', () => {
    it('should patch preferences and return params', async () => {
      mockHttpClient.patch.mockResolvedValue({});
      const params = { visibility_bio: true };

      const result = await patchPreferences('john', params);
      expect(result).toBe(params);
      expect(snakeCaseObject).toHaveBeenCalledWith(params);
      expect(convertKeyNames).toHaveBeenCalled();
      expect(mockHttpClient.patch).toHaveBeenCalledWith(
        'http://fake-lms/api/user/v2/accounts/john/preferences/',
        params,
        { headers: { 'Content-Type': 'application/merge-patch+json' } },
      );
    });
  });

  describe('getCourseCertificates', () => {
    it('should return transformed certificates', async () => {
      mockHttpClient.get.mockResolvedValue({
        data: [{ download_url: '/path', certificate_type: 'type' }],
      });

      const result = await getCourseCertificates('john');
      expect(result[0]).toHaveProperty('downloadUrl', 'http://fake-lms/path');
    });

    it('should log error and return empty array on failure', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('fail'));
      const result = await getCourseCertificates('john');
      expect(result).toEqual([]);
      expect(logError).toHaveBeenCalled();
    });
  });

  describe('getCountryList', () => {
    it('should extract country list', async () => {
      mockHttpClient.get.mockResolvedValue({
        data: {
          fields: [
            { name: FIELD_LABELS.COUNTRY, options: [{ value: 'US' }, { value: 'CA' }] },
          ],
        },
      });

      const result = await getCountryList();
      expect(result).toEqual(['US', 'CA']);
      expect(mockHttpClient.get).toHaveBeenCalledWith('http://fake-lms/api/user/v2/registrations/');
    });

    it('should log error and return empty array on failure', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('fail'));
      const result = await getCountryList();
      expect(result).toEqual([]);
      expect(logError).toHaveBeenCalled();
    });
  });
});
