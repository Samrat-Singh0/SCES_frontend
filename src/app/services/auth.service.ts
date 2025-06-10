import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {ChangePassword} from '../model/change-password.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl= environment.apiBaseUrl;

  constructor(private http: HttpClient) {
  }

  login(userEmail: string, userPassword: string){
    return this.http.post(`${this.baseUrl}/api/auth/login`, {
      "email": userEmail,
      "password": userPassword
    },{
      observe: "response",
      responseType: 'json',
    })
  }

  initialPasswordChange(initialData: ChangePassword) {
    return this.http.post(`${this.baseUrl}/api/auth/change-password`, initialData);
  }

}
