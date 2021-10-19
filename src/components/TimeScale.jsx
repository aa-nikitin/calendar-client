import React from 'react';

const TimeScale = ({ timeArr, className }) => {
  return (
    <div className={`time-scale ${className}`}>
      {timeArr.map((item) => (
        <div className="time-scale__item" key={item.minutes}>
          <div className="time-scale__wrap">
            <span className="time-scale__hours">{item.timeH === '24' ? '00' : item.timeH}</span>
            <span className="time-scale__minutes">{item.timeM}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export { TimeScale };
