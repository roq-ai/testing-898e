import { DeliveryRequestInterface } from 'interfaces/delivery-request';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface DeliveryPartnerInterface {
  id?: string;
  availability_status: boolean;
  user_id?: string;
  created_at?: any;
  updated_at?: any;
  delivery_request?: DeliveryRequestInterface[];
  user?: UserInterface;
  _count?: {
    delivery_request?: number;
  };
}

export interface DeliveryPartnerGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
}
