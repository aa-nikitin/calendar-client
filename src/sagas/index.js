import { fork } from 'redux-saga/effects';

import { paramsWatch } from './params';
import { hallsWatch } from './halls';

export function* sagas() {
  yield fork(paramsWatch);
  yield fork(hallsWatch);
}
