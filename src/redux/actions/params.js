import { createActions } from 'redux-actions';

const {
  params: {
    windowSize: setWindowSize,
    shedule: { request: sheduleGetRequest, success: sheduleGetSuccess, error: sheduleGetError },
    sheduleQuery: { changeDayweek: sheduleChangeDayweek }
  }
} = createActions({
  PARAMS: {
    WINDOW_SIZE: null,
    SHEDULE: {
      REQUEST: null,
      SUCCESS: null,
      ERROR: null
    },
    SHEDULE_QUERY: {
      CHANGE_DAYWEEK: null
    }
  }
});

export {
  setWindowSize,
  sheduleGetRequest,
  sheduleGetSuccess,
  sheduleGetError,
  sheduleChangeDayweek
};
