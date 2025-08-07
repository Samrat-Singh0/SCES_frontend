import {Component, OnInit} from '@angular/core';
import {Course} from '../../model/course.model';
import {CourseService} from '../../services/course.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgClass, NgForOf} from '@angular/common';
import {Attendance} from '../../model/attendance.model';
import {AttendanceService} from '../../services/attendance.service';
import {FormatDateService} from '../../shared/format-date.service';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatIconButton} from '@angular/material/button';
import {MatFormField, MatInput, MatSuffix} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Student} from '../../model/student.model';
import {AttendanceStatus} from '../../enum/attendance-status.enum';
import {AttendanceRate} from '../../model/attendanceRate.model';
import {ToastrService} from 'ngx-toastr';
import {JoinNameService} from '../../shared/join-name.service';
import {StudentService} from '../../services/student.service';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-view-attendance-instructor',
  imports: [
    NgForOf,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatSuffix,
    ReactiveFormsModule,
    FormsModule,
    NgClass
  ],
  templateUrl: './view-attendance-instructor.component.html',
  standalone: true,
  styleUrl: './view-attendance-instructor.component.css'
})
export class ViewAttendanceInstructorComponent implements OnInit{

  students: Student[] = [];
  course!: Course;
  attendance: Attendance[] = [];
  selectedDate: Date = new Date();
  attendanceMap = new Map<string, AttendanceStatus>();
  attendanceRate: AttendanceRate[] = [];
  today: Date = new Date();
  minimumDateOfAttendance: Date = new Date();

  constructor(
    private router: Router,
    private toastr: ToastrService,
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
        if(res.success){
          this.course = res.body;
          this.populateAttendance()
        }else {
          this.toastr.error(res.message);
        }
      }, error: err=>{
        this.toastr.error('');
      }
    });
  }

  populateAttendance() {
    const formattedDate = this.formatDate.formatDateWithoutTimezone(this.selectedDate);
    this.attendanceService.getAttendanceOfDate(this.course.code, formattedDate).subscribe({
      next: res => {
        if(res.success){
          this.attendance = res.body;
          this.populateStudent();
          this.populateAttendanceRate();
        }else {
          this.toastr.error(res.message);
        }
      }, error: err => {
        this.toastr.error('');
      }
    });
  }

  populateStudent() {
    this.studentService.getStudentsPerCourse(this.course).subscribe({
      next: res => {
        if(res.success){
          this.students = res.body;
          this.attendanceMap = new Map(
            this.attendance.map(a => [a.student.code, a.attendanceStatus])
          )
          this.students.sort((a,b)=>a.user.firstName.localeCompare(b.user.firstName));
        }else {
          this.toastr.error(res.message);
        }

      }, error: err => {
        this.toastr.error('');
      }
    });
  }

  populateAttendanceRate() {
    this.attendanceService.getAttendanceRateOfStudent(this.course.code).subscribe({
      next: res => {
        if(res.success){
          this.attendanceRate = res.body;
          this.minimumDateOfAttendance = this.attendanceRate[0].startDate;
        }else {
          this.toastr.error(res.message);
        }
      }, error: err => {
        this.toastr.error('');
      }
    });
  }

  goBack() {
    this.router.navigate(['super/manage/attendance']);
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

  getAttendanceRate(studentCode: string): string {


    const student = this.attendanceRate.find(student => student.studentCode === studentCode);

    if(!student || student?.totalDays === 0){
      return '0.00';
    }
    return ((student.presentDays / student.totalDays) * 100).toFixed(2);
  }
}
