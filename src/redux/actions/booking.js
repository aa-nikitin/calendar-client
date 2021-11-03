import { createActions } from 'redux-actions';

const {
  booking: { add: addBooking, delete: deleteBooking },
  loadPrice: { request: loadPriceRequest, success: loadPriceSuccess, error: loadPriceError },
  send: { request: sendBookingRequest, success: sendBookingSuccess, error: sendBookingError }
} = createActions({
  BOOKING: {
    ADD: null,
    DELETE: null
  },
  LOAD_PRICE: {
    REQUEST: null,
    SUCCESS: null,
    ERROR: null
  },
  SEND: {
    REQUEST: null,
    SUCCESS: null,
    ERROR: null
  }
});

export {
  addBooking,
  deleteBooking,
  loadPriceRequest,
  loadPriceSuccess,
  loadPriceError,
  sendBookingRequest,
  sendBookingSuccess,
  sendBookingError
};
