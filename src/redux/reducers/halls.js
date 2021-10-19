import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';
import { createSelector } from 'reselect';

import {
  hallsGetRequest,
  hallsGetSuccess,
  hallsGetError,
  hallsChangeStep,
  hallsChangePlace
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
export const getHalls = ({ halls }) => halls;
export const getHallsRange = createSelector(
  (state) => state.halls.list,
  (state) => state.halls.hallsStep,
  (state) => state.halls.hallsPlace,
  (halls, hallsStep, hallsPlace) => {
    // console.log(halls.length <= hallsPlace + hallsStep);
    return {
      list: halls.filter((_, key) => key >= hallsPlace && key < hallsPlace + hallsStep),
      firstActiveBtn: hallsPlace <= 0,
      lastActiveBtn: halls.length <= hallsPlace + hallsStep,
      showBtns: halls.length > hallsStep
    };
  }
);
// ({ halls }) => {
//   return halls.list.filter((_, key) => key >= 0 && key <= 1);
// };

export default combineReducers({ list, error, loading, hallsStep, hallsPlace });
