import { Injectable } from '@angular/core';
import {Semester} from '../model/semester.model';

@Injectable({
  providedIn: 'root'
})
export class SemesterStateService {
  private semesterToEdit: Semester | null = null;

  setSemester(semester: Semester): void {
    this.semesterToEdit = semester;
  }

  getSemester(): Semester | null{
    return this.semesterToEdit;
  }

  clearSemester(): void {
    this.semesterToEdit = null;
  }
}
