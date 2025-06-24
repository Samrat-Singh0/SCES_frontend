import {Course} from './course.model';
import {Student} from './student.model';
import {AttendanceStatus} from '../enum/attendance-status.enum';

export interface Attendance {
  code: string;
  student: Student;
  course: Course;
  attendanceStatus: AttendanceStatus;
}
