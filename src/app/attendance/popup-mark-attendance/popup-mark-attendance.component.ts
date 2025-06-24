import {Component, Inject, OnInit} from '@angular/core';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Student} from '../../model/student.model';
import {StudentService} from '../../services/student.service';
import {CourseService} from '../../services/course.service';
import {Course} from '../../model/course.model';
import {ActivatedRoute} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NgForOf, NgStyle} from '@angular/common';
import {JoinNameService} from '../../shared/join-name.service';
import {FormsModule} from '@angular/forms';
import {
  MatButtonToggle,
  MatButtonToggleChange,
  MatButtonToggleGroup
} from '@angular/material/button-toggle';
import {AttendanceStatus} from '../../enum/attendance-status.enum';
import {Attendance} from '../../model/attendance.model';
import {AttendanceService} from '../../services/attendance.service';

@Component({
  selector: 'app-popup-mark-attendance',
  imports: [
    MatIcon,
    MatIconButton,
    NgForOf,
    MatButtonToggleGroup,
    FormsModule,
    MatButtonToggle,
    MatButton,
    NgStyle
  ],
  templateUrl: './popup-mark-attendance.component.html',
  styleUrl: './popup-mark-attendance.component.css'
})
export class PopupMarkAttendanceComponent implements OnInit{

  students: Student[] = [];
  course!: Course;
  attendanceMap: Map<string, Attendance>;
  toggleValue: string = 'absent';

  constructor(
    private studentService: StudentService,
    private courseService: CourseService,
    public dialogRef: MatDialogRef<PopupMarkAttendanceComponent>,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    public joinService: JoinNameService,
    private attendanceService: AttendanceService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.attendanceMap = new Map<string, Attendance>();
  }

  ngOnInit() {
    let code = this.route.snapshot.paramMap.get('code')!;
    this.getCourse(this.data.courseCode);
  }

  getCourse(code: string) {
    this.courseService.getCourse(code).subscribe({
      next: res => {
        this.course = res.body;
        this.populateStudent();
      }, error: err=>{
        this.snackBar.open(err.message, "Close", {duration: 3000});
      }
    });
  }

  populateStudent() {
    this.studentService.getStudentsPerCourse(this.course).subscribe({
      next: res => {
        this.students = res.body;
        this.students.sort((a,b)=>a.user.firstName.localeCompare(b.user.firstName));
      }, error: err => {
        this.snackBar.open(err.message, "Close", {duration: 3000});
      }
    });
  }

  getTodayDate(): string {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();

    return mm + '/' + dd + '/' + yyyy;
  }

  markAttendance(event: MatButtonToggleChange, student: Student): void {
    const attendance: Attendance = {
      code: '',
      student: student,
      course: this.course,
      attendanceStatus: event.value === "present" ? AttendanceStatus.PRESENT : AttendanceStatus.ABSENT
    }

    this.attendanceMap.set(student.code, attendance);
  }

  confirmAttendance() {
    this.attendanceService.saveAttendance(Array.from(this.attendanceMap.values())).subscribe({
      next: res => {
        this.dialogRef.close();
        this.snackBar.open(res.message, "Close", {duration: 3000});
      }, error: err => {
        this.snackBar.open(err.message, "Close", {duration: 3000});
      }
    });
  }

}
