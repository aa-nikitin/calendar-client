import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Loading, TimeScale } from '../components';
import { getParams, getShedule, getBookingInfo } from '../redux/reducers';
import { addBooking, deleteBooking, sheduleChangeDayweek } from '../redux/actions';

const Shedule = ({ today }) => {
  const dispatch = useDispatch();
  const { query, loading, shedule, dayweek, sizeWindow, controlPoints } = useSelector((state) =>
    getParams(state)
  );
  const sheduleWork = useSelector((state) => getShedule(state));

  // const { selected } = useSelector((state) => getBooking(state));
  const selected = useSelector((state) => getBookingInfo(state));
  // console.log(selected);
  const sheduleWorkAll = shedule.sheduleWork ? shedule.sheduleWork : {};
  const minutesStep = shedule.minutesStep ? shedule.minutesStep : 0;
  const sheduleKeys = Object.keys(sheduleWork);
  const sheduleKeysAll = Object.keys(sheduleWorkAll);
  // console.log(sheduleWork);
  const handleClickItemShedule = (date, params, idHall) => () => {
    if (!params.busy) dispatch(addBooking({ ...params, date, minutesStep, idHall }));
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
          <TimeScale timeArr={timeArr} className="shedule__time-scale" />

          {sheduleKeys.map((itemShedule) => {
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
                      height: selectedItem['heightBusy']
                    };
                    if (rowLen === key + 1) return <div key={itemSheduleList}></div>;

                    return (
                      <div className={`shedule__item`} key={itemSheduleList}>
                        {thisTime['busy'] ? (
                          ''
                        ) : (
                          <button
                            className="shedule__item-btn"
                            data-value={`${sheduleWork[itemShedule]['dayWeek']} / ${thisTime.timeH}:${thisTime.timeM}`}
                            onClick={handleClickItemShedule(
                              itemShedule,
                              thisTime,
                              sheduleWork[itemShedule].idHall
                            )}></button>
                        )}

                        {activeItem && (
                          <div
                            className={`shedule__item-active ${
                              selectedItem.idHall !== query.idHall ? 'shedule--item-no-active' : ''
                            }`}
                            style={style}
                            onClick={handleRemoveItemShedule(
                              `${itemShedule}-${thisTime.minutes}`,
                              selectedItem.idHall
                            )}>
                            {selectedItem.rangeTime}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          <TimeScale timeArr={timeArr} className="shedule__time-scale" />
        </div>
      </div>

      {loading && <Loading />}
    </>
  );
};

export { Shedule };
