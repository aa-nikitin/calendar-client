import { takeLatest, put, call, select } from 'redux-saga/effects';

import {
  loadPriceRequest,
  loadPriceSuccess,
  loadPriceError,
  sendBookingRequest,
  sendBookingSuccess,
  sendBookingError
} from '../redux/actions';
import { fetchPost } from '../api';
import { site } from '../config';
import { getParams, getBooking } from '../redux/reducers';

function* getPriceForBooking() {
  try {
    const { selected } = yield select(getBooking);
    const { query } = yield select(getParams);
    const selectedKeys = Object.keys(selected);
    const keyOrderWithoutPrice = selectedKeys.filter((item) => {
      const minutesFrom = selected[item].minutes;
      const minutesTo = minutesFrom + selected[item].minutesBusy;
      // console.log(selected[item].date, query.dateClick);
      return (
        query.minutesClick >= minutesFrom &&
        query.minutesClick < minutesTo &&
        selected[item].date === query.dateClick
      );
    })[0];
    const clickBooking = {
      ...selected[keyOrderWithoutPrice],
      key: keyOrderWithoutPrice
    };
    // console.log(selected);
    const price = yield call(fetchPost, `${site}api/booking-price`, {
      ...clickBooking,
      purpose: query.purpose
    });
    // yield put(changePriceBooking(price));
    // if (selectedKeys.length > 5) return;
    yield put(loadPriceSuccess(price));
  } catch (error) {
    yield put(loadPriceError(error));
  }
}

function* orderSend() {
  try {
    const { form } = yield select(getBooking);
    // const result = yield call(fetchPost, `${site}api/halls`);
    console.log(form);
    yield put(sendBookingSuccess({}));
  } catch (error) {
    yield put(sendBookingError(error));
  }
}

export function* bookingWatch() {
  yield takeLatest(loadPriceRequest, getPriceForBooking);
  yield takeLatest(sendBookingRequest, orderSend);
}
