import * as yup from 'yup';

export const deliveryRequestValidationSchema = yup.object().shape({
  status: yup.string().required(),
  delivery_partner_id: yup.string().nullable(),
  restaurant_id: yup.string().nullable(),
});
