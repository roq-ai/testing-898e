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
import { getDeliveryPartnerById, updateDeliveryPartnerById } from 'apiSdk/delivery-partners';
import { Error } from 'components/error';
import { deliveryPartnerValidationSchema } from 'validationSchema/delivery-partners';
import { DeliveryPartnerInterface } from 'interfaces/delivery-partner';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function DeliveryPartnerEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<DeliveryPartnerInterface>(
    () => (id ? `/delivery-partners/${id}` : null),
    () => getDeliveryPartnerById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: DeliveryPartnerInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateDeliveryPartnerById(id, values);
      mutate(updated);
      resetForm();
      router.push('/delivery-partners');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<DeliveryPartnerInterface>({
    initialValues: data,
    validationSchema: deliveryPartnerValidationSchema,
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
            Edit Delivery Partner
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
            <FormControl
              id="availability_status"
              display="flex"
              alignItems="center"
              mb="4"
              isInvalid={!!formik.errors?.availability_status}
            >
              <FormLabel htmlFor="switch-availability_status">Availability Status</FormLabel>
              <Switch
                id="switch-availability_status"
                name="availability_status"
                onChange={formik.handleChange}
                value={formik.values?.availability_status ? 1 : 0}
              />
              {formik.errors?.availability_status && (
                <FormErrorMessage>{formik.errors?.availability_status}</FormErrorMessage>
              )}
            </FormControl>
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'user_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
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
    entity: 'delivery_partner',
    operation: AccessOperationEnum.UPDATE,
  }),
)(DeliveryPartnerEditPage);
