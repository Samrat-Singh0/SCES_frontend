import { Component } from '@angular/core';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {NgForOf} from '@angular/common';
import {Course} from '../model/course.model';
import {Attendance} from '../model/attendance.model';
import {CourseService} from '../services/course.service';
import {ToastrMsgService} from '../shared/toastr-msg.service';
import {Router} from '@angular/router';
import {AttendanceService} from '../services/attendance.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {FormatDateService} from '../shared/format-date.service';
import {
  PopupMarkAttendanceComponent
} from './popup-mark-attendance/popup-mark-attendance.component';

@Component({
  selector: 'app-attendance',
  imports: [
    MatCard,
    MatCardContent,
    MatCardTitle,
    NgForOf
  ],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.css'
})
export class AttendanceComponent {

  courses: Course[] = [];
  attendance: Attendance[] = [];

  constructor(
    private courseService: CourseService,
    private toastr: ToastrMsgService,
    private router: Router,
    private attendanceService: AttendanceService,
    private dialog: MatDialog,
    private formatDate: FormatDateService
  ) {
  }

  ngOnInit() {
    this.populateCourses();
  }

  populateCourses() {
    this.courseService.getCoursesBasedOnRole().subscribe({
      next: res => {
        this.courses = res.body;
      }, error: err => {
        this.toastr.error('');
      }
    });
  }

  populateAttendance(course: Course) {
    const formattedTodayDate = this.formatDate.formatDateWithoutTimezone(new Date());
    this.attendanceService.getAttendanceOfDate(course.code, formattedTodayDate).subscribe({
      next: res => {
        this.attendance = res.body;

        if(this.isAttendanceDone()) {
          this.router.navigate(['instructor/attendance/save/'+''+course.code]);
        }else {
          const dialogConfig = new MatDialogConfig();
          dialogConfig.width = '2000px';
          dialogConfig.height = '756px';
          dialogConfig.backdropClass = 'cdk-overlay-dark-backdrop';       //dark-shade in the background.
          dialogConfig.disableClose = true;
          dialogConfig.data = {
            courseCode : course.code
          }
          this.dialog.open(PopupMarkAttendanceComponent, dialogConfig);
          this.attendance.length = 0;

        }
      }, error: err => {
        this.toastr.error('');
      }
    });
  }

  saveAttendance(course: Course) {
    this.populateAttendance(course);
  }

  isAttendanceDone():boolean {
    return this.attendance.length > 0;
  }

}
