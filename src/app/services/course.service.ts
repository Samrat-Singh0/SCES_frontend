import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiResponse} from '../model/api-response.model';
import {Course} from '../model/course.model';
import {CourseEndpoints} from '../shared/api-endpoints';
import {SearchCourse} from '../model/search.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private readonly courseEndpoints = CourseEndpoints;

  constructor(private http: HttpClient) {}

  getCourse(code: string): Observable<ApiResponse<Course>> {
    return this.http.get<ApiResponse<Course>>(this.courseEndpoints.GET_COURSE + '/' + code );
  }

  getCourses():Observable<ApiResponse<Course[]>> {
    return this.http.get<ApiResponse<Course[]>>(this.courseEndpoints.GET_ALL_COURSE);
  }

  getPendingCourses(): Observable<ApiResponse<Course[]>> {
    return this.http.get<ApiResponse<any>>(this.courseEndpoints.PENDING_COURSE);
  }

  addCourse(course: Course): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.courseEndpoints.ADD_COURSE, course);
  }

  deleteCourse(code: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(this.courseEndpoints.DELETE_COURSE +`/${code}`);
  }

  updateCourse(course: Course): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.courseEndpoints.UPDATE_COURSE, course);
  }

  searchCourse(searchCriteria: SearchCourse): Observable<ApiResponse<Course[]>> {
    return this.http.post<ApiResponse<Course[]>>(this.courseEndpoints.SEARCH_COURSE, searchCriteria);
  }
}
