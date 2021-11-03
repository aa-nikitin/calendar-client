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
import { site, countOrders } from '../config';
import { getBooking, getBookingInfoPrice } from '../redux/reducers';

function* getPriceForBooking() {
  try {
    const { selected, params } = yield select(getBooking);
    // const { query } = yield select(getParams);
    const selectedKeys = Object.keys(selected);
    if (selectedKeys.length > countOrders)
      yield put(loadPriceSuccess({ value: params, refresh: false }));
    else {
      const keyOrderWithoutPrice = selectedKeys.filter((item) => {
        const minutesFrom = selected[item].minutes;
        const minutesTo = minutesFrom + selected[item].minutesBusy;
        // console.log(selected[item].date, query.dateClick);
        return (
          params.minutes >= minutesFrom &&
          params.minutes < minutesTo &&
          selected[item].date === params.date
        );
      })[0];
      // console.log(selected[keyOrderWithoutPrice], selected[`${params.date}-${params.minutes}`]);
      // console.log(selected[keyOrderWithoutPrice]);
      const clickBooking = {
        ...selected[keyOrderWithoutPrice],
        key: keyOrderWithoutPrice
      };
      // console.log(selected);
      const price = yield call(fetchPost, `${site}api/booking-price`, {
        ...clickBooking
      });
      yield put(loadPriceSuccess({ value: price, refresh: true }));
    }
    // yield put(changePriceBooking(price));
  } catch (error) {
    yield put(loadPriceError(error));
  }
}

function* orderSend() {
  try {
    const { form } = yield select(getBooking);
    const { price } = yield select(getBookingInfoPrice);
    const result = yield call(fetchPost, `${site}api/booking-fetch`, { ...form, price });
    // console.log(price);
    // window.open(result.invoice_url, '_blank');
    window.location.href = result.invoice_url;
    yield put(sendBookingSuccess({}));
  } catch (error) {
    yield put(sendBookingError(error));
  }
}

export function* bookingWatch() {
  yield takeLatest(loadPriceRequest, getPriceForBooking);
  yield takeLatest(sendBookingRequest, orderSend);
}
