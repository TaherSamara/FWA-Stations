import { User } from './user.model';

export interface WarehouseDevice {
  id: number;
  device_type: string;
  serial_number: string;
  source_location?: string;
  destination_location?: string;
  customer_line_code?: string;
  notes?: string;
  assigned_user_id?: number;
  assigned_user?: User;
  insert_date?: string;
  update_date?: string;
}
