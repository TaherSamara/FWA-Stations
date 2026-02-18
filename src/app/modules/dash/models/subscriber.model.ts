import { Station } from './station.model';

export enum ServiceType {
  Mobadara = 10,
  PTP = 20,
  BaseStation = 30,
}

export interface Subscriber {
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
  station_id: number;
  station?: Station;
  insert_date?: string;
  update_date?: string;
}
