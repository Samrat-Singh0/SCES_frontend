import {Student} from './student.model';
import {Course} from './course.model';

export interface Grade {
  code: string | undefined;
  student: Student;
  course: Course;
  grade: number;
  remark: string;
}
