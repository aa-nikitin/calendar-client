import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Loading, ArrowBtn } from '../components';
import { getHalls, getHallsRange, getParams } from '../redux/reducers';
import { sheduleGetRequest, hallsChangePlace } from '../redux/actions';
import { site } from '../config';

const Halls = ({ children }) => {
  const dispatch = useDispatch();
  const { loading, hallsStep, hallsPlace, purposes } = useSelector((state) => getHalls(state));
  const { list, firstActiveBtn, lastActiveBtn, showBtns } = useSelector((state) =>
    getHallsRange(state)
  );
  const {
    query: { idHall, purpose }
  } = useSelector((state) => getParams(state));
  // console.log(showBtns);
  const changeHall = (idHall) => () => {
    dispatch(
      sheduleGetRequest({
        idHall
      })
    );
  };
  const changePurpose = (purpose) => () => {
    dispatch(
      sheduleGetRequest({
        purpose
      })
    );
  };
  const handleBtnArroeClick = (stepHall) => () => {
    if (!(stepHall < 0 && firstActiveBtn) && !(stepHall > 0 && lastActiveBtn)) {
      dispatch(hallsChangePlace(hallsPlace + stepHall));
    }
  };
  // console.log(purpose);
  return (
    <>
      <div className="purposes">
        {Object.values(purposes).map((item) => {
          return (
            <div
              key={item.value}
              onClick={changePurpose(item.value)}
              className={`purposes__item ${purpose === item.value ? 'purposes--active' : ''}`}>
              {item.name}
            </div>
          );
        })}
      </div>
      <div className="halls">
        <h3 className="halls__header">{children}</h3>
        <div className="halls__list">
          {list &&
            list.map((item) => {
              const { _id, name, cover } = item;
              // console.log(_id);
              return (
                <div className="halls__item-wrap" key={_id}>
                  <div
                    className={`halls__item ${idHall === _id ? 'halls--active' : ''}`}
                    onClick={changeHall(_id)}>
                    <div className="halls__image">
                      <img
                        className="halls__img"
                        src={`${site}${
                          cover ? cover.pathResize : './files/common/no-image-340x200.jpg'
                        }`}
                        alt=""
                      />
                    </div>
                    <div className="halls__name">{name}</div>
                  </div>
                </div>
              );
            })}
        </div>
        {showBtns && (
          <div className="halls__btns-arrow">
            <ArrowBtn
              typeBtn="left"
              isActive={!firstActiveBtn}
              onClick={handleBtnArroeClick(hallsStep * -1)}
            />
            <ArrowBtn
              typeBtn="right"
              isActive={!lastActiveBtn}
              onClick={handleBtnArroeClick(hallsStep)}
            />
          </div>
        )}
      </div>
      {loading && <Loading />}
    </>
  );
};

export { Halls };
