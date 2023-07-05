import { DeliveryRequestInterface } from 'interfaces/delivery-request';
import { MenuItemInterface } from 'interfaces/menu-item';
import { OperatingHourInterface } from 'interfaces/operating-hour';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface RestaurantInterface {
  id?: string;
  description?: string;
  image?: string;
  name: string;
  created_at?: any;
  updated_at?: any;
  user_id: string;
  tenant_id: string;
  delivery_request?: DeliveryRequestInterface[];
  menu_item?: MenuItemInterface[];
  operating_hour?: OperatingHourInterface[];
  user?: UserInterface;
  _count?: {
    delivery_request?: number;
    menu_item?: number;
    operating_hour?: number;
  };
}

export interface RestaurantGetQueryInterface extends GetQueryInterface {
  id?: string;
  description?: string;
  image?: string;
  name?: string;
  user_id?: string;
  tenant_id?: string;
}
