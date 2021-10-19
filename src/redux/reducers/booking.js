import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';
import { createSelector } from 'reselect';
import produce from 'immer';

import { addBooking, deleteBooking } from '../actions';

const selected = handleActions(
  {
    [addBooking]: (state, { payload }) => {
      const { date, minutes, minutesStep, idHall } = payload;
      const stateKeys = Object.keys(state);
      // const neighbors = [];
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
      // console.log(state, payload);
      let newBooking = { date, minutes, minutesBusy: minutesStep, idHall };
      neighbors.forEach((item) => {
        const minutesBusy = Number(state[item].minutesBusy) + Number(newBooking.minutesBusy);
        const commonBooking =
          newBooking.minutes > state[item].minutes ? { ...state[item] } : { ...newBooking };
        newBooking = produce(newBooking, (draft) => {
          draft[`date`] = commonBooking.date;
          draft[`minutes`] = commonBooking.minutes;
          draft[`minutesBusy`] = minutesBusy;
          draft[`idHall`] = idHall;
        });
      });
      // console.log(neighbors);
      const nextState = produce(state, (draft) => {
        neighbors.forEach((item) => {
          delete draft[item];
        });
        // console.log(idHall, newBooking);
        draft[`${newBooking.date}-${newBooking.minutes}`] = newBooking;
      });
      // console.log(nextState);
      return nextState;
    },
    [deleteBooking]: (state, { payload }) =>
      produce(state, (draft) => {
        delete draft[payload];
      })
  },
  {}
);

export const getBooking = ({ booking }) => booking;

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

    return Object.fromEntries(newObjBooking);
  }
);

export default combineReducers({ selected });
