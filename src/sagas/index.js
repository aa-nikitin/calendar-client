import { fork } from 'redux-saga/effects';

import { paramsWatch } from './params';
import { hallsWatch } from './halls';
import { bookingWatch } from './booking';

export function* sagas() {
  yield fork(paramsWatch);
  yield fork(hallsWatch);
  yield fork(bookingWatch);
}
