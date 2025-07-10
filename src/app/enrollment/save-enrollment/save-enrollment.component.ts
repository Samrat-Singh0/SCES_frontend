import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Semester} from '../../model/semester.model';
import {Course} from '../../model/course.model';
import {SemesterService} from '../../services/semester.service';
import {MatSelectModule} from '@angular/material/select';
import {CourseService} from '../../services/course.service';
import {MatIconModule} from '@angular/material/icon';
import {Router} from '@angular/router';
import {MatIconButton} from '@angular/material/button';
import {NgClass, NgForOf} from '@angular/common';
import {JoinNameService} from '../../shared/join-name.service';
import {EnrollmentService} from '../../services/enrollment.service';
import {ToastrMsgService} from '../../shared/toastr-msg.service';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationComponent} from '../../shared/confirmation/confirmation.component';

@Component({
  selector: 'app-add-enrollment',
  imports: [
    MatSelectModule,
    ReactiveFormsModule,
    MatIconModule,
    MatIconButton,
    NgForOf,
    NgClass

  ],
  templateUrl: './save-enrollment.component.html',
  styleUrl: './save-enrollment.component.css'
})
export class SaveEnrollmentComponent implements OnInit{
  enrollForm : FormGroup;
  semesters: Semester[] = [];
  allCourses: Course[] = [];
  coursePerSemester: Course[] = [];
  selectedCourses: Course[] = [];
  coursesMap: Map<string, Course>;

  constructor(
    private builder: FormBuilder,
    private semesterService: SemesterService,
    private courseService: CourseService,
    private enrollmentService: EnrollmentService,
    private toastr: ToastrMsgService,
    public joinName: JoinNameService,
    private router: Router,
    private dialogRef: MatDialog
  ) {
    this.enrollForm = new FormGroup({});
    this.coursesMap = new Map<string, Course>();
  }

  ngOnInit() {
    this.populateCourses();
    this.populateSemester();
    this.buildForm();
  }

  buildForm() {
    this.enrollForm = this.builder.group({
      semester: ['', [Validators.required]],
      course:[[''], Validators.required],
      outstandingFee: ['']
    });
  }

  populateSemester() {
    this.semesterService.getAll().subscribe({
      next: res => {
        this.semesters = res.body;

        this.enrollForm.patchValue({semester: this.semesters[0]})

      },
      error: err =>
        this.toastr.error(''),
    });
  }

  populateCourses() {
    this.courseService.getCourses().subscribe({
      next: res => {
        this.allCourses = res.body;

        const selectedSem: Semester = this.enrollForm.value.semester;
        if (selectedSem) {
          this.onSemesterChange(selectedSem);
        }
      }, error: err => {
        this.toastr.error('');
      }
    });
  }

  enroll() {
    const enrolledData = {
      semester: this.enrollForm.value.semester,
      courses: this.selectedCourses,
    };

    const dialog = this.dialogRef.open(ConfirmationComponent, {
      width: '600px',
      maxWidth: 'none',
      disableClose: true,
      data: {
        title: 'Confirm Enroll',
        message:"Are you sure you want to enroll in this semester?",
        requireRemarks: false
      }
    });

    dialog.afterClosed().subscribe(result=>{
      if(result?.confirmed) {
        this.enrollmentService.enroll(enrolledData).subscribe({
          next: res => {

            this.toastr.info(res.message);
            this.goBack();
          }, error: err => {
            this.toastr.error('');
          }
        });

      }
    });

  }

  goBack() {
    this.router.navigate(['student/enroll/view']);
  }

  onSemesterChange(semester: Semester){
    this.coursePerSemester = this.allCourses.filter(
      (course) => course.semester.label === semester.label
    );
  }

  selectCourse(course: Course) {

    if(this.coursesMap.has(course.code)){
      this.coursesMap.delete(course.code);
    }else {
      this.coursesMap.set(course.code, course);
    }

    this.selectedCourses = Array.from(this.coursesMap.values());
  }
}
