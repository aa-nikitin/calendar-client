import React from 'react';
import Button from '@mui/material/Button';
import { useSelector, useDispatch } from 'react-redux';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import * as yup from 'yup';
import InputMask from 'react-input-mask';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import { getHallsObj, getBookingInfoPrice, getBooking, getBookingCount } from '../redux/reducers';
import { sendBookingRequest, loadPriceRequest, deleteBooking } from '../redux/actions';
import { Loading } from '../components';

const validationSchema = yup.object({
  firstName: yup
    .string('Введите Имя')
    .min(2, 'Поле должно содержать минимум 2 буквы')
    .required('Имя обязательно для заполнения'),
  phone: yup.string('Введите Телефон').required('Имя обязательно для заполнения'),
  mail: yup
    .string('Введите E-mail')
    .email('Введите корректный email')
    .required('Имя обязательно для заполнения'),
  comment: yup.string('Введите Комментарий'),
  typePay: yup.string('Тип оплаты')
});

const BookingForm = ({ handleClickShowForm, setShowBookingForm }) => {
  const dispatch = useDispatch();
  //   const dispatch = useDispatch();
  const bookingPriceInfo = useSelector((state) => getBookingInfoPrice(state));
  const countSelected = useSelector((state) => getBookingCount(state));
  const { loading: loadingBooking } = useSelector((state) => getBooking(state));
  //   const selected = useSelector((state) => getBookingInfo(state));
  const hallsObj = useSelector((state) => getHallsObj(state));

  const hallsObjKeys = Object.keys(hallsObj);

  const handleOrder = (values) => {
    dispatch(sendBookingRequest(values));
  };

  const formik = useFormik({
    initialValues: {
      firstName: '',
      phone: '',
      mail: '',
      comment: '',
      typePay: 'online'
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleOrder(values);
      //   console.log(values);
      //   onClick(values);
    }
  });

  const handleChange =
    (params) =>
    ({ target }) => {
      const newParams = { ...params, persons: Number(target.value) };
      dispatch(loadPriceRequest(newParams));

      // console.log(newParams);
    };

  const handleDelete = (item) => () => {
    dispatch(deleteBooking(`${item.date}-${item.minutes}`));
    if (countSelected <= 1) setShowBookingForm(false);
    console.log(countSelected);
  };

  return (
    <>
      <div className="booking-order-form">
        <div className="booking-order-form__top">
          <div className="booking-order-form__name">Оформление заказа</div>
          <Button onClick={handleClickShowForm} variant="outlined">
            Назад
          </Button>
        </div>
        <div className="booking-order-form__header">
          Бронь фотостудии KAMORKA.STUDIO ФОТО | ВИДЕО | ПРОСТРАНСТВО
        </div>
        <div className="booking-order-form__halls">
          {hallsObjKeys.map((key) => {
            return (
              <div key={key} className="booking-order-form__halls-item">
                <div className="booking-order-form__halls-name">{hallsObj[key].name}</div>
                <div className="booking-order-form__booking">
                  {hallsObj[key].list.map((item) => {
                    return (
                      <div
                        key={`${item.minutes}${item.date}`}
                        className="booking-order-form__booking-item">
                        <div className="booking-order-form__booking-item-left">
                          {item.date} {item.timeRange},{item.timeBusy} (для {item.purposeText})
                        </div>
                        <div className="booking-order-form__booking-item-right">
                          <div className="booking-order-form__booking-right-price">
                            {item.priceText} руб.
                          </div>
                          <div className="booking-order-form__booking-right-persons">
                            <TextField
                              label="кол-во человек"
                              variant="standard"
                              defaultValue={item.persons}
                              onChange={handleChange(item)}
                            />
                          </div>
                          <button onClick={handleDelete(item)}>Удалить</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div className="booking-order-form__total">Итого: {bookingPriceInfo.priceFormat} руб.</div>
        <div className="booking-order-form__fields">
          <form className="form-box" onSubmit={formik.handleSubmit}>
            <div className="form-box__row">
              <div className="form-box__item">
                <TextField
                  fullWidth
                  id="firstName"
                  name="firstName"
                  label="Имя"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                  helperText={formik.touched.firstName && formik.errors.firstName}
                />
              </div>
              <div className="form-box__item">
                <InputMask
                  mask="+7 (999) 999-99-99"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  disabled={false}
                  error={formik.touched.phone && Boolean(formik.errors.phone)}
                  helperText={formik.touched.phone && formik.errors.phone}>
                  <TextField fullWidth id="phone" name="phone" label="Телефон" />
                </InputMask>
              </div>

              <div className="form-box__item">
                <TextField
                  fullWidth
                  id="mail"
                  name="mail"
                  label="E-mail"
                  value={formik.values.mail}
                  onChange={formik.handleChange}
                  error={formik.touched.mail && Boolean(formik.errors.mail)}
                  helperText={formik.touched.mail && formik.errors.mail}
                />
              </div>
            </div>
            <div className="form-box__item-row">
              <TextField
                fullWidth
                id="comment"
                multiline
                name="comment"
                label="Комментарий"
                value={formik.values.comment}
                onChange={formik.handleChange}
                error={formik.touched.comment && Boolean(formik.errors.comment)}
                helperText={formik.touched.comment && formik.errors.comment}
              />
            </div>
            <RadioGroup
              value={formik.values.typePay}
              name="typePay"
              id="typePay"
              onChange={formik.handleChange}>
              <FormControlLabel value="online" control={<Radio />} label="Безналичный платеж" />
              <FormControlLabel value="offline" control={<Radio />} label="Наличный платеж" />
            </RadioGroup>
            <Button variant="outlined" color="primary" type="submit">
              Отправить заявку
            </Button>
          </form>
        </div>
      </div>
      {loadingBooking && <Loading />}
    </>
  );
};

export { BookingForm };
