import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { logError } from '@edx/frontend-platform/logging';
import {
  getAccount,
  patchProfile,
  postProfilePhoto,
  deleteProfilePhoto,
  getPreferences,
  patchPreferences,
  getCourseCertificates,
  getCountryList,
} from './services';

import { FIELD_LABELS } from './constants';

import { camelCaseObject, snakeCaseObject, convertKeyNames } from '../utils';

// --- Mocks ---
jest.mock('@edx/frontend-platform', () => ({
  ensureConfig: jest.fn(),
  getConfig: jest.fn(() => ({ LMS_BASE_URL: 'http://fake-lms' })),
}));

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: jest.fn(),
}));

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

jest.mock('../utils', () => ({
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
describe('services', () => {
  describe('getAccount', () => {
    it('should return processed account data', async () => {
      const mockData = { name: 'John Doe', socialLinks: [] };
      mockHttpClient.get.mockResolvedValue({ data: mockData });

      const result = await getAccount('john');
      expect(result).toMatchObject(mockData);
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        'http://fake-lms/api/user/v1/accounts/john',
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
  });

  describe('deleteProfilePhoto', () => {
    it('should delete photo and return updated profile image', async () => {
      mockHttpClient.delete.mockResolvedValue({});
      mockHttpClient.get.mockResolvedValue({
        data: { profileImage: { url: 'deleted.png' } },
      });

      const result = await deleteProfilePhoto('john');
      expect(result).toEqual({ url: 'deleted.png' });
    });
  });

  describe('getPreferences', () => {
    it('should return camelCased preferences', async () => {
      mockHttpClient.get.mockResolvedValue({ data: { pref: 1 } });

      const result = await getPreferences('john');
      expect(result).toMatchObject({ pref: 1 });
      expect(camelCaseObject).toHaveBeenCalledWith({ pref: 1 });
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
    });

    it('should log error and return empty array on failure', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('fail'));
      const result = await getCountryList();
      expect(result).toEqual([]);
      expect(logError).toHaveBeenCalled();
    });
  });
});
