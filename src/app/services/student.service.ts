import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiResponse} from '../model/api-response.model';
import {Student} from '../model/student.model';
import {StudentEndpoints} from '../shared/api-endpoints';
import {Course} from '../model/course.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private readonly studentEndpoint = StudentEndpoints;

  constructor(private http: HttpClient) { }

  getStudentsPerCourse(course: Course): Observable<ApiResponse<Student[]>>{
    return this.http.get<ApiResponse<Student[]>>(this.studentEndpoint.GET_STUDENT_PER_COURSE+`/${course.code}`);
  }
}
