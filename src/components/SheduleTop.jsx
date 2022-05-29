import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import { getParams } from '../redux/reducers';
import { sheduleGetRequest, sheduleChangeDayweek } from '../redux/actions';
import { formatDate } from '../config';
import { ArrowBtn } from '../components';

const SheduleTop = ({ children }) => {
  const dispatch = useDispatch();
  const { shedule } = useSelector((state) => getParams(state));
  const beforeNowDate = moment(shedule.firstDate, formatDate).isSameOrBefore(moment());

  const changeWeek = (manipulate) => () => {
    let today = moment(shedule.firstDate, formatDate);
    switch (manipulate) {
      case 'today':
        today = moment();
        break;
      case 'inc':
        today.add(7, 'days');
        break;
      case 'dec':
        today.subtract(7, 'days');
        break;

      default:
        break;
    }

    if (!(beforeNowDate && manipulate === 'dec')) {
      dispatch(sheduleChangeDayweek(today.format(formatDate)));
      dispatch(
        sheduleGetRequest({
          date: today.format(formatDate)
        })
      );
    }
  };

  return (
    <div className="shedule-top">
      <h3 className="shedule-top__header">{children}</h3>
      <div className="shedule-top__wrap">
        <button className="shedule-top__today" onClick={changeWeek('today')}>
          Сегодня
        </button>
        <div className="shedule-top__nav">
          <ArrowBtn
            typeBtn="left"
            isActive={beforeNowDate ? false : true}
            onClick={changeWeek('dec')}
          />
          <ArrowBtn typeBtn="right" isActive={true} onClick={changeWeek('inc')} />
        </div>
        <div className="shedule-top__date">{shedule.rangeDate}</div>
      </div>
    </div>
  );
};

export { SheduleTop };
