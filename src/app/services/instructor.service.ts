import { Injectable } from '@angular/core';
import {InstructorEndpoints} from '../shared/api-endpoints';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiResponse} from '../model/api-response.model';
import {Instructor} from '../model/instructor.model';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {
  private readonly instructorEndpoints = InstructorEndpoints;

  constructor(private http: HttpClient) { }

  getAll(): Observable<ApiResponse<Instructor[]>> {
    return this.http.get<ApiResponse<Instructor[]>>(this.instructorEndpoints.GET_ALL);
  }

  getInstructor(email: string): Observable<ApiResponse<Instructor>> {
    return this.http.post<ApiResponse<Instructor>>(`${this.instructorEndpoints.GET_INSTRUCTOR}`, email);
  }
}
