import { combineReducers } from 'redux';
// import pizzas from './pizzas';
import params from './params';
import booking from './booking';
import halls from './halls';

export * from './params';
export * from './booking';
export * from './halls';

export default combineReducers({ params, booking, halls });
