import { all } from 'redux-saga/effects';

import { saga as profileSaga } from '../profile-v2';

export default function* rootSaga() {
  yield all([
    profileSaga(),
  ]);
}
