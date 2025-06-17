import {Semester} from './semester.model';
import {Course} from './course.model';
import {Student} from './student.model';
import {PaidStatus} from '../enum/paid-status.enum';
import {CompletionStatus} from '../enum/completion-status.enum';

export interface Enrollment {
  semester: Semester;
  enrolledDate: Date;
  outstandingFee: number;
  courses: Course[];
  code: string;
  student: Student[];
  completionStatus: CompletionStatus;
  completionDate: Date;
  paidStatus: PaidStatus;
}


