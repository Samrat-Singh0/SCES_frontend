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
import {ActiveStatus} from '../../enum/active-status.enum';

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
  standalone: true,
  styleUrl: './save-enrollment.component.css'
})
export class SaveEnrollmentComponent implements OnInit{
  enrollForm : FormGroup;
  semesters: Semester[] = [];
  allCourses: Course[] = [];
  coursePerSemester: Course[] = [];
  coursesMap: Map<string, Course> = new Map();

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
  }

  ngOnInit() {

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
    this.semesterService.getAll(ActiveStatus.ACTIVE).subscribe({
      next: res => {
        if(res.success){
          this.semesters = res.body;
          this.enrollForm.patchValue({semester: this.semesters[0]})
          this.populateCourses();
        }else {
          this.toastr.error(res.message);
        }
      },
      error: err =>
        this.toastr.error(''),
    });
  }

  populateCourses() {
    this.courseService.getCourses().subscribe({
      next: res => {
        if(res.success){
          this.allCourses = res.body;
          const selectedSem: Semester = this.enrollForm.value.semester;
          if (selectedSem) {
            this.onSemesterChange(selectedSem);
          }
        }else {
          this.toastr.error(res.message);
        }
      }, error: err => {
        this.toastr.error('');
      }
    });
  }

  enroll() {
    if(this.coursesMap.size === 0){
      this.toastr.error('Please select at least one course');
      return;
    }
    const enrolledData = {
      semester: this.enrollForm.value.semester,
      courses: Array.from(this.coursesMap.values())
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
            if(res.success){
              this.toastr.success(res.message);
            }else{
              this.toastr.error(res.message);
            }
            this.goBack();
          }, error: err => {
            this.toastr.error('');
          }
        });
      }
    });
  }

  goBack() {
    this.router.navigate(['student/enroll']);
  }

  onSemesterChange(semester: Semester){
    this.coursesMap.clear();
    this.coursePerSemester = this.allCourses.filter(
      (course) => course.semester?.label === semester?.label
    );
  }

  selectCourse(course: Course) {
    if(this.coursesMap.has(course.code)){
      this.coursesMap.delete(course.code);
    }else{
      this.coursesMap.set(course.code,course);
    }
  }

}
