import {Injectable} from '@angular/core';
import {AttendanceEndpoints} from '../shared/api-endpoints';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiResponse} from '../model/api-response.model';
import {Attendance} from '../model/attendance.model';
import {AttendanceRate} from '../model/attendanceRate.model';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private readonly attendanceEndpoints = AttendanceEndpoints;
  constructor(private http:HttpClient) { }

  saveAttendance(attendance: Attendance[]): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.attendanceEndpoints.SAVE_ATTENDANCE, attendance);
  }

  getAttendanceOfDate(courseCode: string, date: string): Observable<ApiResponse<Attendance[]>> {
    const params = {
      courseCode: courseCode,
      date: date
    };

    return this.http.get<ApiResponse<Attendance[]>>(this.attendanceEndpoints.GET_ATTENDANCE_DATE, { params });
  }

  getAttendanceRateOfStudent(courseCode: string): Observable<ApiResponse<AttendanceRate[]>> {
    return this.http.get<ApiResponse<AttendanceRate[]>>(this.attendanceEndpoints.GET_RATE_OF_STUDENT+`/${courseCode}`);
  }

  getAttendanceRateOfCourse(): Observable<ApiResponse<AttendanceRate[]>> {
    return this.http.get<ApiResponse<AttendanceRate[]>>(this.attendanceEndpoints.GET_RATE_OF_COURSE);
  }
}
