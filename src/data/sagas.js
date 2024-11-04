import { all } from 'redux-saga/effects';
import { saga as profileSaga } from '../profile';
import { saga as NewProfileSaga } from '../profile-v2';

const isNewProfileEnabled = process.env.ENABLE_NEW_PROFILE_VIEW === 'true';

export default function* rootSaga() {
  yield all([
    isNewProfileEnabled ? NewProfileSaga() : profileSaga(),
  ]);
}
