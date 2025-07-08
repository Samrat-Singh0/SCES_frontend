import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ChangePassword} from '../model/change-password.model';
import {AuthEndpoints} from '../shared/api-endpoints';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly authEndpoints = AuthEndpoints;

  constructor(private http: HttpClient) {
  }

  login(userEmail: string, userPassword: string){
    return this.http.post(this.authEndpoints.LOGIN, {
      "email": userEmail,
      "password": userPassword
    },{
      observe: "response",
      responseType: 'json',
    })
  }

  initialPasswordChange(initialData: ChangePassword) {
    return this.http.post(this.authEndpoints.CHANGE_PASSWORD, initialData);
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post(this.authEndpoints.REFRESH_TOKEN, {}, {
      headers: {
        'X-Refresh-Token' : refreshToken || ''
      },
      observe: 'response'
    })
  }
}
