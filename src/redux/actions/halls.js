import { createActions } from 'redux-actions';

const {
  halls: { request: hallsGetRequest, success: hallsGetSuccess, error: hallsGetError },
  hallsParams: { changeStep: hallsChangeStep, changePlace: hallsChangePlace },
  set: { purposes: setPurposes }
} = createActions({
  HALLS: {
    REQUEST: null,
    SUCCESS: null,
    ERROR: null
  },
  HALLS_PARAMS: {
    CHANGE_STEP: null,
    CHANGE_PLACE: null
  },
  SET: {
    PURPOSES: null
  }
});

export {
  hallsGetRequest,
  hallsGetSuccess,
  hallsGetError,
  hallsChangeStep,
  hallsChangePlace,
  setPurposes
};
