import axios from 'axios';
import queryString from 'query-string';
import { DeliveryPartnerInterface, DeliveryPartnerGetQueryInterface } from 'interfaces/delivery-partner';
import { GetQueryInterface } from '../../interfaces';

export const getDeliveryPartners = async (query?: DeliveryPartnerGetQueryInterface) => {
  const response = await axios.get(`/api/delivery-partners${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createDeliveryPartner = async (deliveryPartner: DeliveryPartnerInterface) => {
  const response = await axios.post('/api/delivery-partners', deliveryPartner);
  return response.data;
};

export const updateDeliveryPartnerById = async (id: string, deliveryPartner: DeliveryPartnerInterface) => {
  const response = await axios.put(`/api/delivery-partners/${id}`, deliveryPartner);
  return response.data;
};

export const getDeliveryPartnerById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/delivery-partners/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteDeliveryPartnerById = async (id: string) => {
  const response = await axios.delete(`/api/delivery-partners/${id}`);
  return response.data;
};
