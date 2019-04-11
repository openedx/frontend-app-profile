import { all } from 'redux-saga/effects';

import { profileSaga } from './profile';

export default function* rootSaga() {
  yield all([
    profileSaga(),
  ]);
}
