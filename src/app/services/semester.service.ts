import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Semester} from '../model/semester.model';
import {ApiResponse} from '../model/api-response.model';
import {SemesterEndpoints} from '../shared/api-endpoints';
import {ActiveStatus} from '../enum/active-status.enum';

@Injectable({
  providedIn: 'root'
})
export class SemesterService {
  private readonly semesterEndpoint = SemesterEndpoints;

  constructor(private http: HttpClient) {}

  getAll(status: ActiveStatus): Observable<ApiResponse<Semester[]>> {
    return this.http.get<ApiResponse<Semester[]>>(this.semesterEndpoint.GET_ALL_SEMESTER + '/' + status);
  }

  add(semester: Semester): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.semesterEndpoint.ADD_SEMESTER,semester);
  }

  update(semester: Semester): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(this.semesterEndpoint.UPDATE_SEMESTER, semester);
  }

  delete(label: String): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(this.semesterEndpoint.DELETE_SEMESTER+`${label}`);
  }
}
