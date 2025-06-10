import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../model/user.model';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {SearchUser} from '../model/search-user.model';
import {ApiResponse} from '../model/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  addUser(user: User): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(`${this.baseUrl}/api/super/user/add`, user);
  }

  getAllUser(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(`${this.baseUrl}/api/super/user/list`);
  }

  updateUser(user: User): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/api/super/user/update`, user);
  }

  deleteUser(userCode: string):Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/api/super/user/delete/${userCode}`);
  }

  searchUser(searchCriteria: SearchUser): Observable<ApiResponse<User[]>> {
    return this.http.post<ApiResponse<User[]>>(`${this.baseUrl}/api/super/user/search`, searchCriteria);
  }
}
