import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiResponse} from '../model/api-response.model';
import {Enrollment} from '../model/enrollment.model';
import {EnrollmentEndpoints} from '../shared/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {

  private readonly enrollmentEndpoint = EnrollmentEndpoints;

  constructor(private http:HttpClient) { }

  getEnrollments(): Observable<ApiResponse<Enrollment[]>> {
    return this.http.get<ApiResponse<Enrollment[]>>(this.enrollmentEndpoint.GET_ALL);
  }

  getPendingEnrollments(): Observable<ApiResponse<Enrollment[]>> {
    return this.http.get<ApiResponse<Enrollment[]>>(this.enrollmentEndpoint.GET_PENDING);
  }

  enroll(enrollment: any): Observable<ApiResponse<any>>{
    return this.http.post<ApiResponse<any>>(this.enrollmentEndpoint.ENROLL, enrollment);
  }

  updateEnroll(enrollment: Enrollment): Observable<ApiResponse<any>>{
    return this.http.post<ApiResponse<any>>(this.enrollmentEndpoint.UPDATE, enrollment);
  }
}
