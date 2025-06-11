import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiResponse} from '../model/api-response.model';
import {Course} from '../model/course.model';
import {CourseEndpoints} from '../shared/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private readonly courseEndpoints = CourseEndpoints;

  constructor(private http: HttpClient) {}

  getCourses():Observable<ApiResponse<Course[]>> {
    return this.http.get<ApiResponse<Course[]>>(this.courseEndpoints.GET_ALL_COURSE);
  }

  addCourse(course: Course): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.courseEndpoints.ADD_COURSE, course);
  }
}
