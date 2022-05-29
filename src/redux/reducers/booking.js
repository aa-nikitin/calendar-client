import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';
import { createSelector } from 'reselect';
import produce from 'immer';

import {
  addBooking,
  deleteBooking,
  loadPriceRequest,
  loadPriceSuccess,
  loadPriceError,
  sendBookingRequest,
  sendBookingSuccess,
  sendBookingError
} from '../actions';

const params = handleActions(
  {
    [loadPriceRequest]: (_state, { payload }) => payload,
    [loadPriceSuccess]: () => ({}),
    [loadPriceError]: () => ({})
  },
  {}
);
const error = handleActions(
  {
    [loadPriceRequest]: () => null,
    [loadPriceSuccess]: () => null,
    [loadPriceError]: (_state, { payload }) => payload,
    [sendBookingRequest]: () => null,
    [sendBookingSuccess]: () => null,
    [sendBookingError]: (_state, { payload }) => payload
  },
  null
);
const loading = handleActions(
  {
    [loadPriceRequest]: () => true,
    [loadPriceSuccess]: () => false,
    [loadPriceError]: () => false,
    [sendBookingRequest]: () => true,
    [sendBookingSuccess]: () => false,
    [sendBookingError]: () => false
  },
  false
);
const form = handleActions(
  {
    [sendBookingRequest]: (_state, { payload }) => payload,
    [sendBookingSuccess]: () => ({}),
    [sendBookingError]: () => ({})
  },
  {}
);
const selected = handleActions(
  {
    [addBooking]: (state, { payload }) => {
      const { date, minutes, minutesStep, idHall } = payload;
      const stateKeys = Object.keys(state);
      const neighbors = stateKeys.filter((item) => {
        return (
          state[item].date === payload.date &&
          state[item].idHall === idHall &&
          (payload.minutes - state[item].minutes === -1 * payload.minutesStep ||
            payload.minutes -
              (state[item].minutes + state[item].minutesBusy - payload.minutesStep) ===
              payload.minutesStep)
        );
      });
      let newBooking = {
        date,
        minutes,
        minutesBusy: minutesStep,
        idHall,
        persons: 1,
        purpose: payload.purpose
      };
      neighbors.forEach((item) => {
        const minutesBusy = Number(state[item].minutesBusy) + Number(newBooking.minutesBusy);
        const commonBooking =
          newBooking.minutes > state[item].minutes ? { ...state[item] } : { ...newBooking };
        newBooking = produce(newBooking, (draft) => {
          draft[`date`] = commonBooking.date;
          draft[`minutes`] = commonBooking.minutes;
          draft[`minutesBusy`] = minutesBusy;
          draft[`idHall`] = idHall;
          draft[`purpose`] = payload.purpose;
        });
      });
      const nextState = produce(state, (draft) => {
        neighbors.forEach((item) => {
          delete draft[item];
        });
        draft[`${newBooking.date}-${newBooking.minutes}`] = newBooking;
      });

      return nextState;
    },
    [deleteBooking]: (state, { payload }) =>
      produce(state, (draft) => {
        delete draft[payload];
      }),
    [loadPriceSuccess]: (state, { payload: { value, refresh } }) => {
      if (!refresh) {
        const nextState = produce(state, (draft) => {
          delete draft[`${value.date}-${value.minutes}`];
        });

        return nextState;
      }
      const nextState = !!value.key
        ? produce(state, (draft) => {
            draft[value.key].price = value.price;
            draft[value.key].priceText = value.priceText;
            draft[value.key].discount = value.discount;
            draft[value.key].discountText = value.discountText;
            draft[value.key].purposeText = value.purposeText;
            draft[value.key].timeRange = value.timeRange;
            draft[value.key].timeBusy = value.timeBusy;
          })
        : state;
      return nextState;
    },
    [loadPriceRequest]: (state, { payload }) => {
      const selectedKeys = Object.keys(state);
      const keyOrderWithoutPrice = selectedKeys.filter((item) => {
        const minutesFrom = state[item].minutes;
        const minutesTo = minutesFrom + state[item].minutesBusy;

        return (
          payload.minutes >= minutesFrom &&
          payload.minutes < minutesTo &&
          state[item].date === payload.date
        );
      })[0];
      const nextState = produce(state, (draft) => {
        draft[keyOrderWithoutPrice].persons = payload.persons;
      });

      return nextState;
    }
  },
  {}
);

export const getBooking = ({ booking }) => booking;
export const getBookingCount = createSelector(
  (state) => state.booking.selected,
  (items) => {
    const itemsKeys = Object.keys(items);

    return itemsKeys.length;
  }
);

const minutesToTime = (minutes, hourSize) => {
  let hoursTime = Math.floor(minutes / hourSize);
  const minutesTime = minutes - hoursTime * hourSize;
  hoursTime = hoursTime === 24 ? '0' : hoursTime;
  return `${hoursTime.toString().padStart(2, '0')}:${minutesTime.toString().padStart(2, '0')}`;
};

export const getBookingInfo = createSelector(
  (state) => state.booking.selected,
  (state) => state.params.shedule,
  (items, paramsShedule) => {
    const { hourSize, minutesStep, heightCell } = paramsShedule;
    const itemsKeys = Object.keys(items);
    const newObjBooking = itemsKeys.map((item) => {
      const { minutes, minutesBusy } = items[item];

      const timeFrom = minutesToTime(minutes, hourSize);
      const timeTo = minutesToTime(minutes + minutesBusy, hourSize);

      const heightBusy = Math.ceil(minutesBusy / minutesStep) * heightCell;

      return [item, { ...items[item], rangeTime: `${timeFrom}-${timeTo}`, heightBusy }];
    });
    const resultObjBooking = newObjBooking.reduce(function (target, key, index) {
      target[key[0]] = key[1];
      return target;
    }, {});

    return resultObjBooking;
  }
);

export const getBookingInfoPrice = createSelector(
  (state) => state.booking.selected,
  (booking) => {
    const bookingKeys = Object.keys(booking);
    let sumPrice = 0;
    let sumDiscount = 0;
    bookingKeys.forEach((item) => {
      sumPrice += !!booking[item].price ? booking[item].price : 0;
      sumDiscount += !!booking[item].discount ? booking[item].discount : 0;
    });

    return {
      price: sumPrice,
      discount: sumDiscount,
      bookingCount: bookingKeys.length,
      priceFormat: sumPrice.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 '),
      discountFormat: sumDiscount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')
    };
  }
);

export default combineReducers({ selected, error, loading, form, params });
