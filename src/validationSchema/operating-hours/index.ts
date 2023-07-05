import * as yup from 'yup';

export const operatingHourValidationSchema = yup.object().shape({
  day_of_week: yup.number().integer().required(),
  open_time: yup.date().required(),
  close_time: yup.date().required(),
  restaurant_id: yup.string().nullable(),
});
