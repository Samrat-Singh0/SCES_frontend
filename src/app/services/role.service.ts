import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RolesEndpoints} from '../shared/api-endpoints';
import {Observable} from 'rxjs';
import {ApiResponse} from '../model/api-response.model';
import {RolePermission} from '../model/role-permission.model';
import {RoleModel} from '../model/role.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

    private rolesEndpoints = RolesEndpoints;

  constructor(private http: HttpClient) { }

  getAllRoles(): Observable<ApiResponse<RolePermission>> {
    return this.http.get<ApiResponse<RolePermission>>(this.rolesEndpoints.GET_ROLES);
  }

  addNewRole(newRole: RoleModel): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.rolesEndpoints.ADD_NEW_ROLE, newRole);
  }

  saveRolesWithPermissions(updatedRoles:Map<String, String[]>): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.rolesEndpoints.SAVE_ROLES, Object.fromEntries(updatedRoles));
  }

  getSavedRoles(): Observable<ApiResponse<RoleModel[]>> {
    return this.http.get<ApiResponse<RoleModel[]>>(this.rolesEndpoints.GET_SAVED_ROLES);
  }

}
