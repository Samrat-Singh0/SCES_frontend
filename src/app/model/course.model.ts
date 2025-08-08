import {RoleModel} from './role.model';

export interface Course {
  code: string;
  name: string;
  creditHours: number;
  fullMarks: number;
  checked: string | null;
  instructors: [{
    code: string;
    user: {
      code: string;
      firstName: string;
      middleName: string;
      lastName: string;
      email: string;
      address: string;
      phoneNumber: string;
      role: string;
      mustChangePassword: boolean;
      newRole: RoleModel
    }
  }] | null;
  semester: {
    label: string;
    fee: number;
    startDate: Date;
    endDate: Date;
  };
  addedBy?: {
      userCode: string;
      firstName: string;
      middleName: string;
      lastName: string;
      email: string;
      address: string;
      phoneNumber: string;
      role: string;
      mustChangePassword: boolean;
  }
  isStudentEnrolled: boolean | null;
}
