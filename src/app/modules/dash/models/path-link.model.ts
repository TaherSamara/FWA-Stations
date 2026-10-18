import { DeviceType } from './device.model';

export interface PathEndpoint {
  sub_device_id: number;
  sub_device_name?: string;
  slot?: string;
  port?: string;
  device_id: number;
  device_name?: string;
  device_type?: DeviceType;
}

export interface PathLinkOdf {
  order: number;
  endpoint: PathEndpoint;
}

export interface PathLink {
  id: number;
  from: PathEndpoint;
  to: PathEndpoint;
  odfs: PathLinkOdf[];
  insert_date?: string;
  update_date?: string;
}

export interface PathEndpointSelection {
  device_type: DeviceType | null;
  device_id: number | null;
  slot: string | null;
  sub_device_id: number | null;
}

export interface LookupDevice {
  id: number;
  name: string;
}

export interface LookupPort {
  id: number;
  port: string;
  name: string;
}
