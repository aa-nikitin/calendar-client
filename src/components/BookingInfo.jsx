import React from 'react';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';

import { countOrders } from '../config';
import { getBookingInfoPrice /*, getBookingInfo, getHallsObj */ } from '../redux/reducers';

const BookingInfo = ({ handleClickShowForm }) => {
  const bookingPriceInfo = useSelector((state) => getBookingInfoPrice(state));

  return (
    bookingPriceInfo.bookingCount > 0 && (
      <div className="booking-order-info">
        <div className="booking-order-info__item booking-order-info--count">
          Всего заказов: {bookingPriceInfo.bookingCount}
        </div>
        <div className="booking-order-info__item booking-order-info--info">
          За один раз количество заказов не может быть более чем {countOrders}
        </div>
        <div className="booking-order-info__item">
          <div className="booking-order-info__price">{bookingPriceInfo.priceFormat} руб.</div>
          <div className="booking-order-info__price-discount">
            Включая скидку {bookingPriceInfo.discountFormat} руб.
          </div>
        </div>
        <div className="booking-order-info__item">
          <Button onClick={handleClickShowForm} variant="contained">
            Забронировать
          </Button>
        </div>
      </div>
    )
  );
};

export { BookingInfo };
