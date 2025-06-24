import {Component, OnInit} from '@angular/core';
import {Course} from '../../model/course.model';
import {CourseService} from '../../services/course.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {NgForOf} from '@angular/common';
import {Attendance} from '../../model/attendance.model';
import {AttendanceService} from '../../services/attendance.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {
  PopupMarkAttendanceComponent
} from '../popup-mark-attendance/popup-mark-attendance.component';
import {AttendanceStatus} from '../../enum/attendance-status.enum';

@Component({
  selector: 'app-view-attendance-instructor',
  imports: [
    MatCard,
    MatCardContent,
    MatCardTitle,
    NgForOf
  ],
  templateUrl: './view-attendance-instructor.component.html',
  styleUrl: './view-attendance-instructor.component.css'
})
export class ViewAttendanceInstructorComponent implements OnInit{

  courses: Course[] = [];
  attendance: Attendance[] = [];

  constructor(
    private courseService: CourseService,
    private snackBar: MatSnackBar,
    private router: Router,
    private attendanceService: AttendanceService,
    private dialog: MatDialog
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
        this.snackBar.open(err.message, "Close", {duration: 3000});
      }
    });
  }

  populateAttendance(course: Course) {
    const formattedTodayDate = this.formatDateWithoutTimezone(new Date());
    this.attendanceService.getAttendanceOfDate(course.code, formattedTodayDate).subscribe({
      next: res => {
        this.attendance = res.body;

        if(this.isAttendanceDone()) {
          this.router.navigate(['instructor/attendance/save/'+''+course.code]);
        }else {
          const dialogConfig = new MatDialogConfig();
          dialogConfig.width = '2000px';
          dialogConfig.height = '756px';
          dialogConfig.backdropClass = 'cdk-overlay-dark-backdrop';
          dialogConfig.disableClose = true;
          dialogConfig.data = {
            courseCode : course.code
          }
          this.dialog.open(PopupMarkAttendanceComponent, dialogConfig);
          this.attendance.length = 0;

          // this.router.navigate(['instructor/attendance/mark']);
        }
      }, error: err => {
        this.snackBar.open(err.message, "Close", {duration: 3000});
      }
    });
  }

  saveAttendance(course: Course) {
    this.populateAttendance(course);
  }

  isAttendanceDone():boolean {
    return this.attendance.length > 0;
  }

  formatDateWithoutTimezone(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return year + '-' + month + '-' + day;
  }

}
