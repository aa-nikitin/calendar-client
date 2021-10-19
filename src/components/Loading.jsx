import React from 'react';
import logo from '../assets/img/refresh.svg';

const Loading = () => {
  return (
    <div className="loading">
      <div className="loading__wrap">
        <img src={logo} className="loading__icon" alt="" />
      </div>
    </div>
  );
};

export { Loading };
