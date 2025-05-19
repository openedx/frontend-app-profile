import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

export async function getExtendedProfileFields() {
  const url = `${getConfig().LMS_BASE_URL}/user_api/v1/account/registration/`;

  const { data } = await getAuthenticatedHttpClient()
    .get(
      url,
    )
    .catch((e) => {
      throw (e);
    });

  return { fields: data.fields };
}
