import {User} from './user.model';
import {EnrollmentStatus} from '../enum/enrollment-status.enum';

export interface Student {
  code: string;
  user: User;
  enrollStatus: EnrollmentStatus;
}
