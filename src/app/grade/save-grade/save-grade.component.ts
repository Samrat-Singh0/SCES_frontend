import {Component, OnInit} from '@angular/core';
import {Student} from '../../model/student.model';
import {MatIconButton, MatMiniFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {ActivatedRoute, Router} from '@angular/router';
import {StudentService} from '../../services/student.service';
import {NgForOf} from '@angular/common';
import {JoinNameService} from '../../shared/join-name.service';
import {MatFormField, MatInput, MatSuffix} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {Grade} from '../../model/grade.model';
import {Course} from '../../model/course.model';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationComponent} from '../../shared/confirmation/confirmation.component';
import {GradeService} from '../../services/grade.service';
import {CourseService} from '../../services/course.service';
import {ToastrMsgService} from '../../shared/toastr-msg.service';

@Component({
  selector: 'app-save-grade',
  imports: [
    MatIcon,
    MatIconButton,
    NgForOf,
    MatFormField,
    MatInput,
    FormsModule,
    MatSuffix,
    MatMiniFabButton,
  ],
  templateUrl: './save-grade.component.html',
  standalone: true,
  styleUrl: './save-grade.component.css'
})
export class SaveGradeComponent implements OnInit {
  students: Student[] = [];
  course!: Course;
  gradeInput: number[] = [];
  grades: Grade[] = [];
  isGradesValid: boolean = false;

  constructor(
    private router: Router,
    private studentService: StudentService,
    private toastr: ToastrMsgService,
    public joinName: JoinNameService,
    private courseService: CourseService,
    private dialogRef: MatDialog,
    private gradeService: GradeService,
    private route: ActivatedRoute
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
        this.populateStudent();
      }, error: err=>{
        this.toastr.error('');
      }
    });
  }

  populateStudent() {
    this.studentService.getStudentsPerCourse(this.course).subscribe({
      next: res => {
        this.students = res.body;
        this.populateGrades();
      }, error: err => {
        this.toastr.error('');
      }
    });
  }

  populateGrades() {
    this.gradeService.getGradesInstructor(this.course.code).subscribe({
      next: value => {
        this.grades = value.body;

        this.students.forEach((student, index) => {           //populate the grade field if exists
          const foundGrade = this.grades.find(
            g => g.student.code === student.code
          );
          this.gradeInput[index] = foundGrade ? foundGrade.grade : 0;
        });
      }, error: err => {
        this.toastr.error('');
      }
    });
  }

  openSaveDialog(student: Student, i: number) {
    if(!this.checkGradeValidity()){
      this.toastr.error("Grade Invalid!!")
      return;
    }
    const dialogRef = this.dialogRef.open(ConfirmationComponent, {
      width: '600px',
      maxWidth: 'none',
      disableClose: true,
      data: {
        title: 'Confirm Grade',
        message: 'Are you sure about the grade?(If yes, add a remark for the student.)',
        requireRemarks: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result?.confirmed){
        this.saveGrade(student, i, result?.remarks);
      }
    })
  }

  saveGrade(student: Student, position: number, remarks: string){


    const grade: Grade = {
      code: undefined,
      student: student,
      course: this.course!,
      grade: this.gradeInput[position],
      remark: remarks
    }

    this.gradeService.saveGrade(grade).subscribe({
      next: value => {
        this.ngOnInit();
        this.toastr.success("Student Graded.");
      }, error: err => {
        this.toastr.error('');
      }
    });

  }

  goBack() {
    this.router.navigate(['instructor/grade/view']);
  }

  checkGradeValidity() {
    if(this.gradeInput.some(grade => grade < 0)) {
      return false;
    }
    if(this.gradeInput.some(grade => grade === null || undefined)){
      return false;
    }
    if(this.gradeInput.some(grade => grade > 60)) {
      return false;
    }
    return true;
  }

}
