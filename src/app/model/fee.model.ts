import {Enrollment} from './enrollment.model';

export interface Fee {
  enrollmentPayload: Enrollment;
  amount: number;
}
