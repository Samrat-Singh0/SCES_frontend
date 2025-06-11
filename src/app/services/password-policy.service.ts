import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PasswordPolicy} from '../model/password-policy.model';
import {UpdatePasswordPolicy} from '../model/update-password-policy.model';
import {PolicyEndpoints} from '../shared/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class PasswordPolicyService {
  private readonly policyEndpoints = PolicyEndpoints;

  constructor(private http: HttpClient) { }

  getAllPolicies(): Observable<PasswordPolicy[]> {
    return this.http.get<PasswordPolicy[]>(this.policyEndpoints.GET_ALL_POLICY);
  }

  getActivePolicies(): Observable<PasswordPolicy[]> {
    return this.http.get<PasswordPolicy[]>(this.policyEndpoints.GET_ACTIVE_POLICY);
  }

  updatePolicies(policies: UpdatePasswordPolicy[]): Observable<any> {
    return this.http.put(this.policyEndpoints.UPDATE_POLICY, policies);
  }


}
