import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getDeliveryRequestById, updateDeliveryRequestById } from 'apiSdk/delivery-requests';
import { Error } from 'components/error';
import { deliveryRequestValidationSchema } from 'validationSchema/delivery-requests';
import { DeliveryRequestInterface } from 'interfaces/delivery-request';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { DeliveryPartnerInterface } from 'interfaces/delivery-partner';
import { RestaurantInterface } from 'interfaces/restaurant';
import { getDeliveryPartners } from 'apiSdk/delivery-partners';
import { getRestaurants } from 'apiSdk/restaurants';

function DeliveryRequestEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<DeliveryRequestInterface>(
    () => (id ? `/delivery-requests/${id}` : null),
    () => getDeliveryRequestById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: DeliveryRequestInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateDeliveryRequestById(id, values);
      mutate(updated);
      resetForm();
      router.push('/delivery-requests');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<DeliveryRequestInterface>({
    initialValues: data,
    validationSchema: deliveryRequestValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Delivery Request
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="status" mb="4" isInvalid={!!formik.errors?.status}>
              <FormLabel>Status</FormLabel>
              <Input type="text" name="status" value={formik.values?.status} onChange={formik.handleChange} />
              {formik.errors.status && <FormErrorMessage>{formik.errors?.status}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<DeliveryPartnerInterface>
              formik={formik}
              name={'delivery_partner_id'}
              label={'Select Delivery Partner'}
              placeholder={'Select Delivery Partner'}
              fetcher={getDeliveryPartners}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.availability_status}
                </option>
              )}
            />
            <AsyncSelect<RestaurantInterface>
              formik={formik}
              name={'restaurant_id'}
              label={'Select Restaurant'}
              placeholder={'Select Restaurant'}
              fetcher={getRestaurants}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'delivery_request',
    operation: AccessOperationEnum.UPDATE,
  }),
)(DeliveryRequestEditPage);
