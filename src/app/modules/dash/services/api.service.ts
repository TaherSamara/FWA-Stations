import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const API_BASE_URL = `${environment.apiUrl}/api/`;

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // Users Management
  users = {
    list: API_BASE_URL + 'Users/list',
    get: (id: number) => API_BASE_URL + 'Users/get/' + id,
    add: API_BASE_URL + 'Users/add',
    edit: (id: number) => API_BASE_URL + 'Users/edit/' + id,
    delete: (id: number) => API_BASE_URL + 'Users/delete/' + id,
  };

  // Devices Management
  devices = {
    list: API_BASE_URL + 'Devices/list',
    add: API_BASE_URL + 'Devices/add',
    edit: (id: number) => API_BASE_URL + 'Devices/edit/' + id,
    delete: (id: number) => API_BASE_URL + 'Devices/delete/' + id,
  };

  // Sub Devices Management
  subDevices = {
    list: API_BASE_URL + 'SubDevices/list',
    details: (id: number) => API_BASE_URL + 'SubDevices/details/' + id,
    add: API_BASE_URL + 'SubDevices/add',
    edit: (id: number) => API_BASE_URL + 'SubDevices/edit/' + id,
    delete: (id: number) => API_BASE_URL + 'SubDevices/delete/' + id,
    ping: (ip: string) => API_BASE_URL + 'SubDevices/ping/' + ip,
  };

  // Warehouse Management
  warehouse = {
    list: API_BASE_URL + 'Warehouse/list',
    add: API_BASE_URL + 'Warehouse/add',
    edit: (id: number) => API_BASE_URL + 'Warehouse/edit/' + id,
    delete: (id: number) => API_BASE_URL + 'Warehouse/delete/' + id,
    import: API_BASE_URL + 'Warehouse/import',
    updateCustomerLineCode: (id: number) =>
      API_BASE_URL + 'Warehouse/update-customer-line-code/' + id,
  };

  // Common Management
  common = {
    permissions: API_BASE_URL + 'common/permissions',
  };

  // Search
  Search = API_BASE_URL + 'common/search';
}
