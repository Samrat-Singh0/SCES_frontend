import {RoleModel} from './role.model';
import {Permission} from './permission.model';

export interface RolePermission {
  roles: RoleModel[];
  permissions: Permission[];
}
