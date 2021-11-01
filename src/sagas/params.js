import { takeLatest, call, put, select } from 'redux-saga/effects';

import {
  sheduleGetRequest,
  sheduleGetSuccess,
  sheduleGetError,
  sheduleChangeQuery
} from '../redux/actions';
import { fetchPost } from '../api';
import { getParams, getHallsRange } from '../redux/reducers';
import { site } from '../config';

function* sheduleGet() {
  try {
    const { query } = yield select(getParams);
    const { list } = yield select(getHallsRange);
    const isUpdate = list.filter((item) => item._id === query.idHall).length === 0;
    const newIdHall = list[0] ? list[0]._id : '';

    if (isUpdate && !!newIdHall) yield put(sheduleChangeQuery({ idHall: newIdHall }));
    const newQuery = isUpdate && !!newIdHall ? { ...query, idHall: newIdHall } : query;

    const shedule = yield call(fetchPost, `${site}api/booking-plan-week`, newQuery);
    yield put(sheduleGetSuccess(shedule));
  } catch (error) {
    yield put(sheduleGetError(error));
  }
}

export function* paramsWatch() {
  yield takeLatest(sheduleGetRequest, sheduleGet);
}
