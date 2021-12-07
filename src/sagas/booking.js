import { takeLatest, put, call, select } from 'redux-saga/effects';
import moment from 'moment';

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
    const { selected } = yield select(getBooking);
    const dateOrderFormat = moment(form.dateOrder).format('DD.MM.YYYY HH:mm');

    const result = yield call(fetchPost, `${site}api/booking-add-orders`, {
      ...form,
      price,
      selected,
      dateOrderFormat
    });
    const sendResult = yield call(fetchPost, `${site}api/booking-fetch`, {
      listOrders: result,
      price,
      form: { ...form }
    });
    // console.log(sendResult);
    if (!sendResult.error) {
      // window.open(sendResult.invoice_url);
      // window.location.reload();
      window.location.href = sendResult.invoice_url;
    } else {
      alert(
        'Заказ добавлен но с оплатой что-то пошло не так, свяжитесь с нами для оплаты указав причину'
      );
    }
    // window.open(sendResult.invoice_url, '_blank');
    // window.location.href = result.invoice_url;
    yield put(sendBookingSuccess(result));
  } catch (error) {
    yield put(sendBookingError(error));
  }
}

export function* bookingWatch() {
  yield takeLatest(loadPriceRequest, getPriceForBooking);
  yield takeLatest(sendBookingRequest, orderSend);
}
