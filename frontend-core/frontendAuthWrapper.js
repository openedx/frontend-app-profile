import { fetchUserAccount as _fetchUserAccount, UserAccountApiService } from '@edx/frontend-auth';

let userAccountApiService = null;

export const configureUserAccountApiService = (configuration, apiClient) => {
  userAccountApiService = new UserAccountApiService(apiClient, configuration.LMS_BASE_URL);
};

export const fetchUserAccount = username => _fetchUserAccount(userAccountApiService, username);

export const getAuthentication = (apiClient) => {
  const { authentication } = apiClient.getAuthenticationState();
  return {
    userId: authentication.userId,
    username: authentication.username,
    administrator: authentication.administrator,
  };
};
