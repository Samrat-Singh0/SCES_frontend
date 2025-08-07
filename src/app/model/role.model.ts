import {Permission} from './permission.model';

export interface RoleModel {
  code: string;
  roleName: string;
  roleType: string;
  permissions: Permission[];
}
