import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Semester} from '../model/semester.model';
import {ApiResponse} from '../model/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class SemesterService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {
  }

  getSemester(label: string): Observable<ApiResponse<Semester>> {
    return this.http.get<ApiResponse<Semester>>(`${this.baseUrl}/api/super/semester/${label}`);
  }

  getAll(): Observable<ApiResponse<Semester[]>> {
    return this.http.get<ApiResponse<Semester[]>>(`${this.baseUrl}/api/super/semester/list`);
  }

  add(semester: Semester): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/api/super/semester/add`,semester);
  }

  update(semester: Semester): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/api/super/semester/update`, semester);
  }

  delete(label: String): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/api/super/semester/delete/${label}`);
  }
}
