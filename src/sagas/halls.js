import { takeLatest, call, put } from 'redux-saga/effects';

import { hallsGetRequest, hallsGetSuccess, hallsGetError } from '../redux/actions';
import { fetchGet } from '../api';
import { site } from '../config';

function* hallsGet() {
  try {
    const halls = yield call(fetchGet, `${site}api/halls`);

    yield put(hallsGetSuccess(halls));
  } catch (error) {
    yield put(hallsGetError(error));
  }
}

export function* hallsWatch() {
  yield takeLatest(hallsGetRequest, hallsGet);
}
