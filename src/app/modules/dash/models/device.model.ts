export interface Device {
  id: number;
  name: string;
  type: DeviceType;
  insert_date?: string;
  update_date?: string;
}

export enum DeviceType {
  TransmissionODF = 10,
  TransmissionNode = 20,
  FTTHNode = 30,
  ISAM = 40,
  Router = 50,
  SAS = 60,
  Station = 70,
}

export interface DeviceTypeTab {
  type: DeviceType;
  slug: string;
  label: string;
  icon: string;
}

export const DEVICE_TYPE_TABS: DeviceTypeTab[] = [
  { type: DeviceType.TransmissionODF, slug: 'transmission-odf', label: 'Transmission ODF', icon: 'fe-git-merge' },
  { type: DeviceType.TransmissionNode, slug: 'transmission-node', label: 'Transmission Node', icon: 'fe-git-branch' },
  { type: DeviceType.FTTHNode, slug: 'ftth-node', label: 'FTTH Node', icon: 'fe-home' },
  { type: DeviceType.ISAM, slug: 'isam', label: 'ISAM', icon: 'fe-hard-drive' },
  { type: DeviceType.Router, slug: 'router', label: 'Router', icon: 'fe-share-2' },
  { type: DeviceType.SAS, slug: 'sas', label: 'SAS', icon: 'fe-database' },
  { type: DeviceType.Station, slug: 'station', label: 'Station', icon: 'fe-radio' },
];

export function getDeviceTypeTab(type: DeviceType): DeviceTypeTab | undefined {
  return DEVICE_TYPE_TABS.find((tab) => tab.type === type);
}
