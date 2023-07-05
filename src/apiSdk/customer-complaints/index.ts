import axios from 'axios';
import queryString from 'query-string';
import { CustomerComplaintInterface, CustomerComplaintGetQueryInterface } from 'interfaces/customer-complaint';
import { GetQueryInterface } from '../../interfaces';

export const getCustomerComplaints = async (query?: CustomerComplaintGetQueryInterface) => {
  const response = await axios.get(`/api/customer-complaints${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createCustomerComplaint = async (customerComplaint: CustomerComplaintInterface) => {
  const response = await axios.post('/api/customer-complaints', customerComplaint);
  return response.data;
};

export const updateCustomerComplaintById = async (id: string, customerComplaint: CustomerComplaintInterface) => {
  const response = await axios.put(`/api/customer-complaints/${id}`, customerComplaint);
  return response.data;
};

export const getCustomerComplaintById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/customer-complaints/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteCustomerComplaintById = async (id: string) => {
  const response = await axios.delete(`/api/customer-complaints/${id}`);
  return response.data;
};
