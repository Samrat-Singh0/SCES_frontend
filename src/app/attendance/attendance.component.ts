import {Component, OnInit} from '@angular/core';
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
export class AttendanceComponent implements OnInit{

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
        if(res.success){
          this.courses = res.body;
        }else {
          this.toastr.error(res.message);
        }
      }, error: err => {
        this.toastr.error('');
      }
    });
  }

  populateAttendance(course: Course) {
    const formattedTodayDate = this.formatDate.formatDateWithoutTimezone(new Date());
    this.attendanceService.getAttendanceOfDate(course.code, formattedTodayDate).subscribe({
      next: res => {
        if(res.success){
          this.attendance = res.body;

          if(!course.isStudentEnrolled){
            this.toastr.error("No any student enrolled in this course.");
            return;
          }

          if(this.isAttendanceDone()) {
            this.attendanceDone(course);
          }else {
            this.attendanceNotDone(course);
          }
        }else {
          this.toastr.error(res.message);
        }
      }, error: err => {
        this.toastr.error('');
      }
    });
  }

  attendanceDone(course: Course) {
    this.router.navigate(['super/attendance/save/'+''+course.code]);
  }

  attendanceNotDone(course: Course) {
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


  saveAttendance(course: Course) {
    this.populateAttendance(course);
  }

  isAttendanceDone():boolean {
    return this.attendance?.length > 0;
  }

}
