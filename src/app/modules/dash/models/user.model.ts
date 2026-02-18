import { Permission } from './permission.model';

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  image?: string;
  permissions?: Permission[];
}
