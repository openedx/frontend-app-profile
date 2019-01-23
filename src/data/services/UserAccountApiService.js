class UserAccountApiService {
  constructor(apiClient, baseUrl) {
    this.apiClient = apiClient;
    this.apiBaseUrl = `${baseUrl}/api/user/v1/accounts`;
  }

  saveUserAccount(username, data) {
    return this.apiClient.patch(`${this.apiBaseUrl}/${username}`, data);
  }

  saveUserProfilePhoto(username, formData) {
    return this.apiClient.post(
      `${this.apiBaseUrl}/${username}/image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
  }

  deleteUserProfilePhoto(username) {
    return this.apiClient.delete(`${this.apiBaseUrl}/${username}/image`);
  }
}

export default UserAccountApiService;
