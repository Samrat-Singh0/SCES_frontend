import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../model/user.model';
import {Observable} from 'rxjs';
import {SearchUser} from '../model/search.model';
import {ApiResponse} from '../model/api-response.model';
import {UserEndpoints} from '../shared/api-endpoints';
import {PageResponse} from '../model/page-response.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly userEndpoints = UserEndpoints;

  constructor(private http: HttpClient) {
  }


  addUser(user: User): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(this.userEndpoints.ADD_USER, user);
  }

  getPagedUsers(page: number, size: number): Observable<ApiResponse<PageResponse<User>>> {
    return this.http.get<ApiResponse<PageResponse<User>>>(this.userEndpoints.GET_PAGED_USERS + `?page=${page}&size=${size}&sort=firstName,asc`);
  }

  getAllUser(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(this.userEndpoints.GET_ALL_USERS);
  }

  updateUser(user: User): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(this.userEndpoints.UPDATE_USER, user);
  }

  deleteUser(code: string, remarks: String): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.userEndpoints.DELETE_USER+`/${code}`, remarks);
  }

  searchUser(searchCriteria: SearchUser): Observable<ApiResponse<User[]>> {
    return this.http.post<ApiResponse<User[]>>(this.userEndpoints.SEARCH_USER, searchCriteria);
  }
}
