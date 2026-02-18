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

  // Stations Management
  stations = {
    list: API_BASE_URL + 'Stations/list',
    add: API_BASE_URL + 'Stations/add',
    edit: (id: number) => API_BASE_URL + 'Stations/edit/' + id,
    delete: (id: number) => API_BASE_URL + 'Stations/delete/' + id,
  };

  // Subscribers Management
  subscribers = {
    list: API_BASE_URL + 'Subscribers/list',
    add: API_BASE_URL + 'Subscribers/add',
    edit: (id: number) => API_BASE_URL + 'Subscribers/edit/' + id,
    delete: (id: number) => API_BASE_URL + 'Subscribers/delete/' + id,
    import: API_BASE_URL + 'Subscribers/import',
    ping: (ip: string) => API_BASE_URL + 'Subscribers/ping/' + ip,
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
