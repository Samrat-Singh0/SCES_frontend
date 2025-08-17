import {Component, Inject, OnInit, Optional} from '@angular/core';
import {NgClass, NgIf} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Semester} from '../../model/semester.model';
import {Instructor} from '../../model/instructor.model';
import {SemesterService} from '../../services/semester.service';
import {InstructorService} from '../../services/instructor.service';
import {CourseService} from '../../services/course.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {JoinNameService} from '../../shared/join-name.service';
import {ToastrMsgService} from '../../shared/toastr-msg.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ActiveStatus} from '../../enum/active-status.enum';
import {Course} from '../../model/course.model';

@Component({
  selector: 'app-save-course',
  imports: [
    MatIcon,
    NgIf,
    ReactiveFormsModule,
    NgClass,

  ],
  templateUrl: './save-course.component.html',
  standalone: true,
  styleUrl: './save-course.component.css'
})
export class SaveCourseComponent implements OnInit{
  courseForm: FormGroup;
  semesters: Semester[] = [];
  instructors: Instructor[] = [];
  isEditable: boolean = false;
  code: string = '';
  oldData: Course | null = null;

  constructor(
    private builder: FormBuilder,
    private semesterService: SemesterService,
    private instructorService: InstructorService,
    private toastr: ToastrMsgService,
    private courseService: CourseService,
    private router: Router,
    private route: ActivatedRoute,
    public joinName: JoinNameService,
    @Optional() private dialogRef: MatDialogRef<SaveCourseComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.courseForm = new FormGroup({});
  }

  ngOnInit() {
    this.isDialog();
    this.buildForm();
    this.isFormAddOrUpdate();
    this.populateSemester();
    this.populateInstructor();
  }

  isDialog(): boolean {
    return !!this.dialogRef;
  }

  isFormAddOrUpdate() {
    this.route.queryParamMap.subscribe(params => {
      this.isEditable = !!params.get('code');
      this.code = params.get('code') || '';
      if (this.isEditable) {
        this.loadCourseDate();
      }
    });
  }

  loadCourseDate() {
    this.courseService.getCourse(this.code).subscribe({
      next: res => {
        if(res.success){
          this.courseForm.patchValue(res.body);
          this.oldData = res.body;
        }else {
          this.toastr.error(res.message);
        }
      }
    });
  }

  buildForm() {
    this.courseForm = this.builder.group({
      name: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      creditHours: ['', [Validators.required]],
      fullMarks: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]+$/)],
      ],
      checked: [null]
    });
  }

  populateSemester() {
    this.semesterService.getAll(ActiveStatus.ACTIVE).subscribe({
      next: res => {
        if(res.success){
          this.semesters = res.body;

          if(!this.isEditable && this.semesters.length > 0){
            this.courseForm.patchValue({semester: this.semesters[0]})
          }
        }else {
          this.toastr.error(res.message);
        }
      }, error: err => {
        this.toastr.error('');
      }
    });
  }

  populateInstructor() {
    this.instructorService.getAll().subscribe({
      next: res=> {
        if(res.success){
          this.instructors = res.body;
        }else {
          this.toastr.error(res.message);
        }
      }, error: err => {
        this.toastr.error('');
      }
    });
  }

  onSubmit() {
    if (this.courseForm.valid) {
      if (this.isEditable) {
        const updatedCourse = {
          code: this.code,
          name: this.courseForm.value.name,
          creditHours: this.courseForm.value.creditHours,
          fullMarks: this.courseForm.value.fullMarks,
          instructors: this.courseForm.value.instructor || null,
          semester: this.courseForm.value.semester,
          checked: this.courseForm.value.checked,
          isStudentEnrolled: null
        }

        this.courseService.updateCourse(updatedCourse).subscribe({
          next: res => {
            if(res.success){
              this.router.navigate(['super/course']);
              this.toastr.success(res.message);
            }else {
              this.toastr.error(res.message);
            }
          }, error: err => {
            this.toastr.error('');
          }
        });
      }else {
        this.dialogRef.close(this.courseForm.value);
      }
    }
  }

  closeForm() {
    this.dialogRef.close();
  }

  resetForm() {
    this.ngOnInit();
  }

  goBack() {
    this.router.navigate(['super/course']);
  }
}
