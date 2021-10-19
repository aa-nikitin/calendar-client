import { takeLatest, call, put, select } from 'redux-saga/effects';

import { sheduleGetRequest, sheduleGetSuccess, sheduleGetError } from '../redux/actions';
import { fetchPost } from '../api';
import { getParams } from '../redux/reducers';
import { site } from '../config';

function* sheduleGet() {
  try {
    const { query } = yield select(getParams);
    const shedule = yield call(fetchPost, `${site}api/booking-plan-week`, query);

    yield put(sheduleGetSuccess(shedule));
  } catch (error) {
    yield put(sheduleGetError(error));
  }
}

export function* paramsWatch() {
  yield takeLatest(sheduleGetRequest, sheduleGet);
}
