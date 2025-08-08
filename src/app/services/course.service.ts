import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiResponse} from '../model/api-response.model';
import {Course} from '../model/course.model';
import {CourseEndpoints} from '../shared/api-endpoints';
import {SearchCourse} from '../model/search.model';
import {PageResponse} from '../model/page-response.model';

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

  getPagedCourses(searchCriteria: SearchCourse, page: number, size: number): Observable<ApiResponse<PageResponse<Course>>> {
    return this.http.post<ApiResponse<PageResponse<Course>>>(this.courseEndpoints.GET_PAGED_LIST+`?page=${page}&size=${size}&sort=id,desc`, searchCriteria);
  }

  getCoursesBasedOnRole(): Observable<ApiResponse<Course[]>> {
    return this.http.get<ApiResponse<Course[]>>(this.courseEndpoints.GET_COURSE_BASED_ON_ROLE);
  }

  getPendingCourses(): Observable<ApiResponse<Course[]>> {
    return this.http.get<ApiResponse<any>>(this.courseEndpoints.PENDING_COURSE);
  }

  getCoursesWithNoSemester(): Observable<ApiResponse<Course[]>> {
    return this.http.get<ApiResponse<Course[]>>(this.courseEndpoints.GET_COURSES_WITH_NO_SEMESTER);
  }

  deleteCourse(code: string, remarks: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.courseEndpoints.DELETE_COURSE +`/${code}`,remarks);
  }

  updateCourse(course: Course): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.courseEndpoints.UPDATE_COURSE, course);
  }
}
