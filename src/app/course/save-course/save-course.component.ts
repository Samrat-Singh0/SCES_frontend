import {Component, OnInit} from '@angular/core';
import {MatIconButton} from '@angular/material/button';
import {NgIf} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Semester} from '../../model/semester.model';
import {Instructor} from '../../model/instructor.model';
import {SemesterService} from '../../services/semester.service';
import {InstructorService} from '../../services/instructor.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CourseService} from '../../services/course.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {JoinNameService} from '../../shared/join-name.service';

@Component({
  selector: 'app-save-course',
  imports: [
    MatIcon,
    MatIconButton,
    MatOption,
    MatSelect,
    NgIf,
    ReactiveFormsModule,

  ],
  templateUrl: './save-course.component.html',
  styleUrl: './save-course.component.css'
})
export class SaveCourseComponent implements OnInit{
  courseForm: FormGroup;
  semesters: Semester[] = [];
  instructors: Instructor[] = [];
  isEditable: boolean = false;
  code: string = '';


  constructor(
    private builder: FormBuilder,
    private semesterService: SemesterService,
    private instructorService: InstructorService,
    private snackBar: MatSnackBar,
    private courseService: CourseService,
    private router: Router,
    private route: ActivatedRoute,
    public joinName: JoinNameService
  ) {
    this.courseForm = new FormGroup({});
  }

  ngOnInit() {
    this.buildForm();
    this.isFormAddOrUpdate();
    this.populateSemester();
    this.populateInstructor();
  }

  isFormAddOrUpdate() {
    this.route.queryParamMap.subscribe(params => {
      this.isEditable = !!params.get('code');
      this.code = params.get('code') || '';
      if (this.isEditable) {
        this.loadCourseDate(this.code);
      }
    });
  }

  loadCourseDate(code: string) {
    this.courseService.getCourse(this.code).subscribe({
      next: res => {
        this.courseForm.patchValue(res.body);
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

      instructor: ['', [Validators.required]],
      semester: ['', Validators.required],
      checked: [null]
    });
  }

  populateSemester() {
    this.semesterService.getAll().subscribe({
      next: res => {
        this.semesters = res.body;
      }, error: err => {
        this.snackBar.open(err.message, "CLose", {duration: 3000});
      }
    });
  }

  populateInstructor() {
    this.instructorService.getAll().subscribe({
      next: res => {
        this.instructors = res.body;
      }, error: err => {
        this.snackBar.open(err.message, "Close", {duration: 3000})
      }
    });
  }

  onSubmit() {
    if (this.isEditable) {
      const updatedCourse = {
        code: this.code,
        name: this.courseForm.value.name,
        creditHours: this.courseForm.value.creditHours,
        fullMarks: this.courseForm.value.fullMarks,
        instructor: this.courseForm.value.instructor,
        semester: this.courseForm.value.semester,
        checked: this.courseForm.value.checked
      }
      this.courseService.updateCourse(updatedCourse).subscribe({
        next: res => {
          this.router.navigate(['super/course/view']);
        }, error: err => {
          this.snackBar.open(err.message, "Close", {duration: 3000});
        }
      });
    } else {
      if (this.courseForm.valid) {
        this.courseService.addCourse(this.courseForm.value).subscribe({
          next: res => {
            this.router.navigate(['super/course/view']);
            this.snackBar.open(res.message, "Close", {duration: 3000});
          }, error: err => {
            this.snackBar.open(err.message, "Close", {duration: 3000});
          }
        });
      }
    }

  }

  goBack() {
    this.router.navigate(['super/course/view']);
  }

  instructorMapper(a: Instructor, b: Instructor): boolean {
    return (a.user.code === b.user.code);
  }

  semesterMapper(a: Semester, b: Semester): boolean {
    return(a.label === b.label);
  }
}
