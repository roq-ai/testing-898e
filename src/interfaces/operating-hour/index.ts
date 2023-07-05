import { RestaurantInterface } from 'interfaces/restaurant';
import { GetQueryInterface } from 'interfaces';

export interface OperatingHourInterface {
  id?: string;
  day_of_week: number;
  open_time: any;
  close_time: any;
  restaurant_id?: string;
  created_at?: any;
  updated_at?: any;

  restaurant?: RestaurantInterface;
  _count?: {};
}

export interface OperatingHourGetQueryInterface extends GetQueryInterface {
  id?: string;
  restaurant_id?: string;
}
