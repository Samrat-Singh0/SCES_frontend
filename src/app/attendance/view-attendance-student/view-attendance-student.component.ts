import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {Course} from '../../model/course.model';
import {CourseService} from '../../services/course.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Attendance} from '../../model/attendance.model';
import {AttendanceService} from '../../services/attendance.service';
import {AttendanceStatus} from '../../enum/attendance-status.enum';
import {MatFormField, MatInput, MatSuffix} from '@angular/material/input';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-view-attendance-student',
  imports: [
    NgForOf,
    NgClass,
    MatFormField,
    MatInput,
    MatDatepickerInput,
    FormsModule,
    MatDatepickerToggle,
    MatSuffix,
    MatDatepicker,
    NgIf
  ],
  templateUrl: './view-attendance-student.component.html',
  styleUrl: './view-attendance-student.component.css'
})
export class ViewAttendanceStudentComponent implements OnInit{
  courses: Course[] = [];
  attendances: Attendance[] =[];
  selectedDate: Date = new Date();

  constructor(
    private courseService: CourseService,
    private snackBar: MatSnackBar,
    private attendanceService: AttendanceService
  ) {
  }

  ngOnInit(): void {
    this.populateCourses();
  }

  populateCourses() {
    this.courseService.getCoursesBasedOnRole().subscribe({
      next: res => {
        this.courses = res.body;
        this.populateAttendance();
      }, error: err => {
        this.snackBar.open(err.message, "Close", {duration: 3000});
      }
    });
  }

  populateAttendance() {
    const formattedDate = this.formatDateWithoutTimezone(this.selectedDate);
    this.attendanceService.getAttendanceOfDate('', formattedDate).subscribe({
      next: res => {
        this.attendances = res.body;
      }, error: err => {
        this.snackBar.open(err.message, "Close", {duration: 3000});
    }
    });
  }

  formatDateWithoutTimezone(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return year + '-' + month + '-' + day;
  }

  getAttendanceClass(status: AttendanceStatus): string {
    switch (status) {
      case 'PRESENT':
        return 'status-green';
      case 'ABSENT':
        return 'status-red';
      default:
        return '';
    }
  }

  isAttendanceEmpty():boolean {
    return this.attendances.length < 1;
  }
}
