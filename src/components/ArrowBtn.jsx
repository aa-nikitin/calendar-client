import React from 'react';

const ArrowBtn = ({ typeBtn, isActive, onClick, className }) => {
  return (
    <button
      className={`arrow-btn arrow-btn--${typeBtn} ${!isActive ? 'arrow-btn--no-active' : ''} ${
        className ? className : ''
      }`}
      onClick={onClick}></button>
  );
};

export { ArrowBtn };
