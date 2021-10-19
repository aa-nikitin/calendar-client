import { createActions } from 'redux-actions';

const {
  booking: { add: addBooking, delete: deleteBooking }
} = createActions({
  BOOKING: {
    ADD: null,
    DELETE: null
  }
});

export { addBooking, deleteBooking };
