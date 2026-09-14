import { Device } from './device.model';

export enum ServiceType {
  None = 0,
  Mobadara = 10,
  PTP = 20,
  BaseStation = 30,
}

export interface SubDevice {
  id: number;
  name: string;
  line_code: string;
  unit_type?: string;
  link_mac_address?: string;
  unit_direction?: string;
  management_ip?: string;
  mikrotik_id?: string;
  mikrotik_mac_address?: string;
  sas_name?: string;
  sas_port?: string;
  odf_name?: string;
  odf_port?: string;
  management_vlan?: string;
  service_type: ServiceType;
  notes?: string;
  device_id: number;
  device?: Device;
  insert_date?: string;
  update_date?: string;
}
