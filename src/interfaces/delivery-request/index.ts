import { DeliveryPartnerInterface } from 'interfaces/delivery-partner';
import { RestaurantInterface } from 'interfaces/restaurant';
import { GetQueryInterface } from 'interfaces';

export interface DeliveryRequestInterface {
  id?: string;
  status: string;
  delivery_partner_id?: string;
  restaurant_id?: string;
  created_at?: any;
  updated_at?: any;

  delivery_partner?: DeliveryPartnerInterface;
  restaurant?: RestaurantInterface;
  _count?: {};
}

export interface DeliveryRequestGetQueryInterface extends GetQueryInterface {
  id?: string;
  status?: string;
  delivery_partner_id?: string;
  restaurant_id?: string;
}
