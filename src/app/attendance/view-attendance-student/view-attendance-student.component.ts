import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {Course} from '../../model/course.model';
import {CourseService} from '../../services/course.service';
import {Attendance} from '../../model/attendance.model';
import {AttendanceService} from '../../services/attendance.service';
import {AttendanceStatus} from '../../enum/attendance-status.enum';
import {MatFormField, MatInput, MatSuffix} from '@angular/material/input';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {FormsModule} from '@angular/forms';
import {FormatDateService} from '../../shared/format-date.service';
import {ToastrMsgService} from '../../shared/toastr-msg.service';

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
  standalone: true,
  styleUrl: './view-attendance-student.component.css'
})
export class ViewAttendanceStudentComponent implements OnInit{
  courses: Course[] = [];
  attendances: Attendance[] =[];
  selectedDate: Date = new Date();
  today: Date = new Date();

  constructor(
    private courseService: CourseService,
    private toastr: ToastrMsgService,
    private attendanceService: AttendanceService,
    private formatDate: FormatDateService
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
        this.toastr.error('');
      }
    });
  }

  populateAttendance() {
    const formattedDate = this.formatDate.formatDateWithoutTimezone(this.selectedDate);
    this.attendanceService.getAttendanceOfDate('', formattedDate).subscribe({
      next: res => {
        this.attendances = res.body;
      }, error: err => {
        this.toastr.error('');
    }
    });
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
