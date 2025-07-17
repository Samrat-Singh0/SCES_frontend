import {Course} from './course.model';

export interface Semester {
  label: string;
  fee: number;
  startDate: Date;
  endDate: Date;
  course: Course[] | null;
}
