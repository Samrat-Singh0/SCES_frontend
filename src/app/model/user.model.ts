import {RoleModel} from './role.model';

export interface User {
  code: string;
  email: string,
  firstName: string,
  middleName: string,
  lastName: string,
  address: string,
  phoneNumber: string,
  role: string,
  newRole: RoleModel
}
