import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import {
  sheduleGetRequest,
  hallsGetRequest,
  hallsChangeStep,
  sheduleChangeDayweek,
  setWindowSize
} from './redux/actions';
import { Shedule, SheduleTop, Halls, BookingInfo, BookingForm } from './components';
import { formatDate } from './config';
import useWindowDimensions from './hooks/useWindowDimensions';
import { getParams } from './redux/reducers';

function App() {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const dispatch = useDispatch();
  const today = moment().format(formatDate);
  const { controlPoints } = useSelector((state) => getParams(state));
  const { width } = useWindowDimensions();

  const handleClickShowForm = () => setShowBookingForm(!showBookingForm);

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
      {!showBookingForm && (
        <>
          <Halls>Выберите зал</Halls>
          <SheduleTop>Выберите свободное время</SheduleTop>
          <Shedule today={today} />
          <BookingInfo handleClickShowForm={handleClickShowForm} />
        </>
      )}
      {showBookingForm && <BookingForm handleClickShowForm={handleClickShowForm} />}
    </div>
  );
}

export default App;
