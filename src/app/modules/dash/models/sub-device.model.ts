import { Device } from './device.model';

export interface SubDevice {
  id: number;
  name: string;
  station_name?: string;
  line_code: string;
  order_number?: string;
  unit_type?: string;
  unit_direction?: string;
  link_mac_address?: string;
  connection_type?: string;
  speed?: string;
  management_ip?: string;
  management_vlan?: string;
  wan_ip?: string;
  mikrotik_id?: string;
  mikrotik_mac_address?: string;
  sas_port?: string;
  odf_name?: string;
  odf_port?: string;
  customer_address?: string;
  contact_person?: string;
  contact_person_phone_no?: string;
  other_details?: string;
  device_id: number;
  device?: Device;
  insert_date?: string;
  update_date?: string;
}
