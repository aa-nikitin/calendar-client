import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';
import { createSelector } from 'reselect';

import {
  setWindowSize,
  sheduleGetRequest,
  sheduleGetSuccess,
  sheduleGetError,
  sheduleChangeDayweek,
  sheduleChangeQuery
} from '../actions';

const sizeWindow = handleActions(
  {
    [setWindowSize]: (_state, { payload }) => payload
  },
  {}
);
const shedule = handleActions(
  {
    [sheduleGetRequest]: (_state) => {},
    [sheduleGetSuccess]: (_state, { payload }) => ({ ...payload, heightCell: 40 }),
    [sheduleGetError]: (_state) => {}
  },
  {}
);
const error = handleActions(
  {
    [sheduleGetRequest]: (_state) => null,
    [sheduleGetSuccess]: (_state) => null,
    [sheduleGetError]: (_state, { payload }) => payload
  },
  null
);
const query = handleActions(
  {
    [sheduleGetRequest]: (state, { payload }) => ({
      date: payload.date ? payload.date : state.date,
      idHall: payload.idHall ? payload.idHall : state.idHall,
      purpose: payload.purpose ? payload.purpose : state.purpose
    }),
    [sheduleChangeQuery]: (state, { payload }) => ({
      date: payload.date ? payload.date : state.date,
      idHall: payload.idHall ? payload.idHall : state.idHall,
      purpose: payload.purpose ? payload.purpose : state.purpose
      // minutesClick: payload.minutesClick ? payload.minutesClick : state.minutesClick,
      // dateClick: payload.dateClick ? payload.dateClick : state.dateClick
    })
  },
  {}
);

const loading = handleActions(
  {
    [sheduleGetRequest]: (_state) => true,
    [sheduleGetSuccess]: (_state) => false,
    [sheduleGetError]: (_state) => false
  },
  false
);

const dayweek = handleActions(
  {
    [sheduleChangeDayweek]: (_state, { payload }) => payload
  },
  ''
);

const controlPoints = handleActions({}, 992);

export const getParams = ({ params }) => params;
export const getShedule = createSelector(
  (state) => state.params.shedule,
  (state) => state.params,
  (shedule, params) => {
    if (params.sizeWindow < params.controlPoints)
      return shedule.sheduleWork
        ? {
            [shedule.sheduleWork[params.dayweek]['dateShort']]: {
              ...shedule.sheduleWork[params.dayweek]
            }
          }
        : {};
    else return shedule.sheduleWork ? shedule.sheduleWork : {};
  }
);
export const getPrepayment = createSelector(
  (state) => state.params.shedule,
  (shedule) => {
    return { hours: shedule.prepaymentHours, percent: shedule.prepaymentPercent };
  }
);

export default combineReducers({
  sizeWindow,
  shedule,
  error,
  loading,
  query,
  dayweek,
  controlPoints
});
