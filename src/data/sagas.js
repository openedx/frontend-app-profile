import { all } from 'redux-saga/effects';
import { getConfig } from '@edx/frontend-platform';
import { saga as profileSaga } from '../profile';
import { saga as newProfileSaga } from '../profile-v2';

const isNewProfileEnabled = getConfig().ENABLE_NEW_PROFILE_VIEW;

export default function* rootSaga() {
  yield all([
    isNewProfileEnabled ? newProfileSaga() : profileSaga(),
  ]);
}
