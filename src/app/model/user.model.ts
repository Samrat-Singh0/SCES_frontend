import {RoleModel} from './role.model';
import {ActiveStatus} from '../enum/active-status.enum';

export interface User {
  code: string;
  email: string,
  firstName: string,
  middleName: string,
  lastName: string,
  address: string,
  phoneNumber: string,
  role: string,
  newRole: RoleModel,
  activeStatus: ActiveStatus
}
