import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Loading, TimeScale } from '../components';
import { getParams, getShedule, getBookingInfo, getBooking } from '../redux/reducers';
import {
  addBooking,
  deleteBooking,
  sheduleChangeDayweek,
  loadPriceRequest
} from '../redux/actions';

const Shedule = ({ today }) => {
  const dispatch = useDispatch();
  const { query, loading, shedule, dayweek, sizeWindow, controlPoints } = useSelector((state) =>
    getParams(state)
  );
  const { loading: loadingBooking } = useSelector((state) => getBooking(state));
  const sheduleWork = useSelector((state) => getShedule(state));
  // const { selected } = useSelector((state) => getBooking(state));
  const selected = useSelector((state) => getBookingInfo(state));
  const sheduleWorkAll = shedule.sheduleWork ? shedule.sheduleWork : {};
  const minutesStep = shedule.minutesStep ? shedule.minutesStep : 0;
  const sheduleKeys = Object.keys(sheduleWork);
  const sheduleKeysAll = Object.keys(sheduleWorkAll);
  // console.log(sheduleWork);
  const handleClickItemShedule = (date, params, idHall) => () => {
    if (!params.busy) {
      // dispatch(sheduleChangeQuery({ minutesClick: params.minutes, dateClick: date }));
      dispatch(addBooking({ ...params, date, minutesStep, idHall, purpose: query.purpose }));
      // if (Object.keys(selected).length !== 5)
      // console.log(query.purpose);
      dispatch(
        loadPriceRequest({
          ...params,
          date,
          minutes: params.minutes,
          persons: 1,
          minutesStep,
          idHall,
          purpose: query.purpose
        })
      );
      // console.log({ ...params, date, minutesStep, idHall });
      // console.log({ ...params, date, minutesStep, idHall });
    }
  };
  const handleRemoveItemShedule = (keyBookedShedule, idHall) => () => {
    if (query.idHall === idHall) dispatch(deleteBooking(keyBookedShedule));
  };

  const timeArr = !!sheduleWork[sheduleKeys[0]]
    ? Object.values(sheduleWork[sheduleKeys[0]]['list'])
    : [];
  const handleDayWeekClick = (date) => () => {
    if (sizeWindow < controlPoints) dispatch(sheduleChangeDayweek(date));
  };

  // console.log(Object.keys(selected).length);
  // console.log(!!ref.current && (ref.current.offsetWidth - (10 * 7 * 2 - 20)) / 7);
  return (
    <>
      <div className="shedule">
        <div className="shedule__head-row">
          <div className="shedule__time-scale"></div>
          {sheduleKeysAll.map((item) => {
            return (
              <div className={`shedule__head-wrap`} key={item}>
                <div
                  className={`shedule__head ${today === item ? 'shedule--head-active' : ''} ${
                    dayweek === item ? 'shedule--head-active-click' : ''
                  }`}
                  onClick={handleDayWeekClick(item)}>
                  {sheduleWorkAll[item]['dayWeek']}
                </div>
              </div>
            );
          })}
          <div className="shedule__time-scale"></div>
        </div>
        <div className="shedule__row">
          <TimeScale minutesStep={minutesStep} timeArr={timeArr} className="shedule__time-scale" />

          {sheduleKeys.map((itemShedule) => {
            // console.log(minutesStep);
            const itemSheduleKeys = Object.keys(sheduleWork[itemShedule]['list']);
            const rowLen = itemSheduleKeys.length;
            return (
              <div className="shedule__column" key={itemShedule}>
                {/* <div className="shedule__head">{sheduleWork[itemShedule]['dayWeek']}</div> */}
                <div className="shedule__column-body">
                  {itemSheduleKeys.map((itemSheduleList, key) => {
                    const thisTime = sheduleWork[itemShedule]['list'][itemSheduleList];
                    const selectedItem = selected[`${itemShedule}-${thisTime.minutes}`];

                    const activeItem = selected ? selectedItem : false;
                    // console.log(selected);
                    const style = !!selectedItem && {
                      height:
                        minutesStep === 30
                          ? selectedItem['heightBusy'] / 2
                          : selectedItem['heightBusy']
                    };
                    if (rowLen === key + 1) return <div key={itemSheduleList}></div>;

                    return (
                      <div
                        className={`shedule__item ${
                          minutesStep === 30 ? 'shedule--item-half' : ''
                        }  ${
                          minutesStep === 30 && thisTime.timeM !== '30'
                            ? 'shedule--item-btn-half'
                            : ''
                        }`}
                        key={itemSheduleList}>
                        {thisTime['busy'] ? (
                          ''
                        ) : (
                          <button
                            className={`shedule__item-btn`}
                            data-value={`${sheduleWork[itemShedule]['dayWeek']} / ${thisTime.timeH}:${thisTime.timeM}`}
                            onClick={handleClickItemShedule(
                              itemShedule,
                              thisTime,
                              sheduleWork[itemShedule].idHall
                            )}></button>
                        )}

                        {activeItem && (
                          <div
                            className={`shedule__item-active shedule--item-column ${
                              selectedItem.idHall !== query.idHall ? 'shedule--item-no-active' : ''
                            }`}
                            style={style}
                            onClick={handleRemoveItemShedule(
                              `${itemShedule}-${thisTime.minutes}`,
                              selectedItem.idHall
                            )}>
                            <div className="shedule__range-time">{selectedItem.rangeTime}</div>
                            <div className="shedule__price">{selectedItem.priceText} руб.</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          <TimeScale minutesStep={minutesStep} timeArr={timeArr} className="shedule__time-scale" />
        </div>
      </div>

      {loading || (loadingBooking && <Loading />)}
    </>
  );
};

export { Shedule };
