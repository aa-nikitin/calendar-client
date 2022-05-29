import { takeLatest, call, put } from 'redux-saga/effects';
import moment from 'moment';

import {
  hallsGetRequest,
  hallsGetSuccess,
  hallsGetError,
  setPurposes,
  sheduleGetRequest
} from '../redux/actions';
import { fetchGet } from '../api';
import { site, formatDate } from '../config';

function* hallsGet() {
  try {
    const today = moment().format(formatDate);
    const halls = yield call(fetchGet, `${site}api/halls`);
    const hallsPurpose = yield call(fetchGet, `${site}api/halls-purpose`);

    yield put(
      sheduleGetRequest({
        date: today,
        idHall: document.getElementById('root').getAttribute('data-num-room'),
        purpose: Object.keys(hallsPurpose)[0]
      })
    );
    yield put(setPurposes(hallsPurpose));
    yield put(hallsGetSuccess(halls));
  } catch (error) {
    yield put(hallsGetError(error));
  }
}

export function* hallsWatch() {
  yield takeLatest(hallsGetRequest, hallsGet);
}
