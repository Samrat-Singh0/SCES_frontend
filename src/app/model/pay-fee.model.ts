import {Enrollment} from './enrollment.model';

export interface PayFee {
  enrollmentPayload: Enrollment;
  amount: number;
}
