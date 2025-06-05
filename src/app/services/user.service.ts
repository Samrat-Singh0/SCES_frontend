import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../models/user.model';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/api/auth/signup`, user);
  }

  getAllUser(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/api/super/user/get`);
  }

  updateUser(user: User): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/super/user/update`, user);
  }

  deleteUser(userCode: string) {
    return this.http.delete(`${this.baseUrl}/api/super/user/delete/${userCode}`);
  }
}
