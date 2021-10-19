import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import {
  sheduleGetRequest,
  hallsGetRequest,
  hallsChangeStep,
  sheduleChangeDayweek,
  setWindowSize
} from './redux/actions';
import { Shedule, SheduleTop, Halls } from './components';
import { formatDate } from './config';
import useWindowDimensions from './hooks/useWindowDimensions';
import { getParams } from './redux/reducers';

function App() {
  const dispatch = useDispatch();
  const today = moment().format(formatDate);
  const { controlPoints } = useSelector((state) => getParams(state));
  const { width } = useWindowDimensions();
  useEffect(() => {
    // console.log(width);

    dispatch(setWindowSize(width));
    if (width < controlPoints) dispatch(hallsChangeStep(1));
    else dispatch(hallsChangeStep(4));
    dispatch(sheduleChangeDayweek(today));
    dispatch(
      sheduleGetRequest({
        date: today,
        idHall: document.getElementById('root').getAttribute('data-num-room')
      })
    );
    dispatch(hallsGetRequest());
  }, [dispatch, today, width, controlPoints]);
  return (
    <div className="content-main">
      <Halls>Выберите зал</Halls>
      <SheduleTop>Выберите свободное время</SheduleTop>
      <Shedule today={today} />
    </div>
  );
}

export default App;
