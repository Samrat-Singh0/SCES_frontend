import {Component, OnInit} from '@angular/core';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {ActivatedRoute, Router} from '@angular/router';
import {JoinNameService} from '../../shared/join-name.service';
import {Student} from '../../model/student.model';
import {StudentService} from '../../services/student.service';
import {Course} from '../../model/course.model';
import {CourseService} from '../../services/course.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NgClass, NgForOf} from '@angular/common';
import {Attendance} from '../../model/attendance.model';
import {AttendanceStatus} from '../../enum/attendance-status.enum';
import {AttendanceService} from '../../services/attendance.service';
import {MatFormField, MatInput, MatSuffix} from '@angular/material/input';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {FormsModule} from '@angular/forms';
import {FormatDateService} from '../../shared/format-date.service';
import {AttendanceRate} from '../../model/attendanceRate.model';

@Component({
  selector: 'app-save-attendance',
  imports: [
    MatIcon,
    MatIconButton,
    NgForOf,
    MatFormField,
    MatInput,
    MatDatepickerInput,
    FormsModule,
    MatDatepickerToggle,
    MatSuffix,
    MatDatepicker,
    NgClass,
  ],
  templateUrl: './save-attendance.component.html',
  styleUrl: './save-attendance.component.css'
})
export class SaveAttendanceComponent implements OnInit{

  students: Student[] = [];
  course!: Course;
  attendance: Attendance[] = [];
  selectedDate: Date = new Date();
  attendanceMap = new Map<string, AttendanceStatus>();
  attendanceRate: AttendanceRate[] = [];


  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    public joinName: JoinNameService,
    private studentService: StudentService,
    private route: ActivatedRoute,
    private courseService: CourseService,
    private attendanceService: AttendanceService,
    private formatDate: FormatDateService
  ) {
  }


  ngOnInit() {
    let code = this.route.snapshot.paramMap.get('code')!;
    this.getCourse(code);
  }

  getCourse(code: string) {
    this.courseService.getCourse(code).subscribe({
      next: res => {
        this.course = res.body;
        this.populateAttendance();
      }, error: err=>{
        this.snackBar.open(err.message, "Close", {duration: 3000});
      }
    });
  }

  populateAttendance() {
    const formattedDate = this.formatDate.formatDateWithoutTimezone(this.selectedDate);
    this.attendanceService.getAttendanceOfDate(this.course.code, formattedDate).subscribe({
      next: res => {
        this.attendance = res.body;
        this.populateStudent();
        this.populateAttendanceRate();
      }, error: err => {
        this.snackBar.open(err.message, "Close", {duration: 3000});
    }
    });
  }

  populateStudent() {
    this.studentService.getStudentsPerCourse(this.course).subscribe({
      next: res => {
        this.students = res.body;
        this.attendanceMap = new Map(
          this.attendance.map(a => [a.student.code, a.attendanceStatus])
        )

        this.students.sort((a,b)=>a.user.firstName.localeCompare(b.user.firstName));
      }, error: err => {
        this.snackBar.open(err.message, "Close", {duration: 3000});
      }
    });
  }

  populateAttendanceRate() {
    this.attendanceService.getAttendanceRate(this.course.code).subscribe({
      next: res => {
        this.attendanceRate = res.body;
      }, error: err => {
        this.snackBar.open(err.message, "Close", {duration: 3000});
      }
    });
  }

  goBack() {
    this.router.navigate(['instructor/attendance/view']);
  }

  getStatus(student: Student): string {
    const status = this.attendanceMap.get(student.code);
    switch (status){
      case AttendanceStatus.PRESENT:
        return 'Present';
      case AttendanceStatus.ABSENT:
        return 'Absent';
      default:
        return 'Not Marked';
    }
  }

  getStatusClass(status: string):string {
    switch (status) {
      case 'Present':
        return 'status-green';
      case 'Absent':
        return 'status-red';
      default:
        return '';
    }
  }

  getAttendanceRate(studentCode: string): number {

    const student = this.attendanceRate.find(student => student.studentCode === studentCode);

    if(!student || student?.totalDays === 0){
      return 0;
    }
    return (student.presentDays / student.totalDays) * 100;
  }
}
