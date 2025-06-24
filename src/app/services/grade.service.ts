import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GradeEndpoints} from '../shared/api-endpoints';
import {Grade} from '../model/grade.model';
import {Observable} from 'rxjs';
import {ApiResponse} from '../model/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class GradeService {

  private readonly gradeEndpoint = GradeEndpoints;
  constructor(private http: HttpClient) { }

  getGradesInstructor(courseCode: string): Observable<ApiResponse<Grade[]>> {
    return  this.http.get<ApiResponse<Grade[]>>(this.gradeEndpoint.GET_GRADES_INSTRUCTOR+`/${courseCode}`);
  }

  getGradesStudent(): Observable<ApiResponse<Grade[]>> {
    return this.http.get<ApiResponse<Grade[]>>(this.gradeEndpoint.GET_GRADES_STUDENT);
  }

  saveGrade(grade: Grade): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.gradeEndpoint.SAVE_GRADE, grade);
  }


}
