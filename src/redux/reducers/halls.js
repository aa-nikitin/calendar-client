import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';
import { createSelector } from 'reselect';

import {
  hallsGetRequest,
  hallsGetSuccess,
  hallsGetError,
  hallsChangeStep,
  hallsChangePlace,
  setPurposes
} from '../actions';

const list = handleActions(
  {
    [hallsGetRequest]: (_state) => [],
    [hallsGetSuccess]: (_state, { payload }) => payload,
    [hallsGetError]: (_state) => []
  },
  []
);
const error = handleActions(
  {
    [hallsGetRequest]: (_state) => null,
    [hallsGetSuccess]: (_state) => null,
    [hallsGetError]: (_state, { payload }) => payload
  },
  null
);
const loading = handleActions(
  {
    [hallsGetRequest]: (_state) => true,
    [hallsGetSuccess]: (_state) => false,
    [hallsGetError]: (_state) => false
  },
  false
);
const hallsStep = handleActions(
  {
    [hallsChangeStep]: (_state, { payload }) => payload
  },
  4
);
const hallsPlace = handleActions(
  {
    [hallsChangePlace]: (_state, { payload }) => payload
  },
  0
);
const purposes = handleActions(
  {
    [setPurposes]: (_state, { payload }) => payload
  },
  []
);
export const getHalls = ({ halls }) => halls;
export const getHallsRange = createSelector(
  (state) => state.halls.list,
  (state) => state.halls.hallsStep,
  (state) => state.halls.hallsPlace,
  (state) => state.halls.purposes[state.params.query.purpose],
  (halls, hallsStep, hallsPlace, purpose) => {
    // console.log(halls.length <= hallsPlace + hallsStep);
    const purposeList = purpose ? purpose.list : [];

    return {
      list: halls.filter(
        (item, key) =>
          key >= hallsPlace && key < hallsPlace + hallsStep && purposeList.includes(item._id)
      ),
      firstActiveBtn: hallsPlace <= 0,
      lastActiveBtn: halls.length <= hallsPlace + hallsStep,
      showBtns: halls.length > hallsStep
    };
  }
);
export const getHallsObj = createSelector(
  (state) => state.halls.list,
  (state) => state.booking.selected,
  (halls, booking) => {
    // console.log(halls, booking);
    const bookingKeys = Object.keys(booking);
    const hallsObj = halls.reduce((newObj, item) => {
      newObj[item._id] = item;
      return newObj;
    }, {});
    const bookingHalls = {};
    bookingKeys.forEach((item) => {
      const idHall = booking[item].idHall;
      console.log(!!bookingHalls[idHall]);
      if (!bookingHalls[idHall])
        bookingHalls[idHall] = { ...hallsObj[idHall], list: [{ ...booking[item] }] };
      else {
        bookingHalls[idHall].list.push({ ...booking[item] });
      }

      // bookingHalls[booking[item].idHall].list.pull({ ...booking[item] });
      // console.log(bookingHalls[booking[item].idHall].list);
    });
    // console.log(bookingHalls);
    return bookingHalls;
  }
);
// ({ halls }) => {
//   return halls.list.filter((_, key) => key >= 0 && key <= 1);
// };

export default combineReducers({ list, error, loading, hallsStep, hallsPlace, purposes });
