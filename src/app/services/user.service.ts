import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../models/user.model';
import {Observable} from 'rxjs';
import {ChangePassword} from '../models/change-password.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = "http://localhost:8080";

  constructor(private http: HttpClient) { }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/api/auth/signup`, user);
  }

  initialPasswordChange(initialData: ChangePassword){
    return this.http.post(`${this.baseUrl}/api/auth/change-password`, initialData);
  }
}
