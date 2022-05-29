import React from 'react';

const TimeScale = ({ timeArr, className, minutesStep }) => {
  return (
    <div className={`time-scale ${className}`}>
      {timeArr.map((item) => {
        return (
          <div
            className={`time-scale__item ${minutesStep === 30 ? 'time-scale--item-half' : ''}`}
            key={item.minutes}>
            {(minutesStep !== 30 || item.timeM !== '30') && (
              <div className="time-scale__wrap">
                <span className="time-scale__hours">{item.timeH === '24' ? '00' : item.timeH}</span>
                <span className="time-scale__minutes">{item.timeM}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export { TimeScale };
