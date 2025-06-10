import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {PasswordPolicy} from '../model/password-policy.model';
import {UpdatePasswordPolicy} from '../model/update-password-policy.model';

@Injectable({
  providedIn: 'root'
})
export class PasswordPolicyService {

  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  getAllPolicies(): Observable<PasswordPolicy[]> {
    return this.http.get<PasswordPolicy[]>(`${this.baseUrl}/api/super-admin/password-policy/getAllPolicy`);
  }

  getActivePolicies(): Observable<PasswordPolicy[]> {
    return this.http.get<PasswordPolicy[]>(`${this.baseUrl}/api/super-admin/password-policy/active`);
  }

  updatePolicies(policies: UpdatePasswordPolicy[]): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/super-admin/password-policy/update`, policies);
  }


}
