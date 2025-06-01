import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl="http://localhost:8080";

  constructor(private http: HttpClient) {
  }

  login(userEmail: string, userPassword: string) {
    return this.http.post(`${this.baseUrl}/api/auth/login`, {
      "email": userEmail,
      "password": userPassword
    },{
      observe: "response",
      responseType: 'json',
    })
  }
}
