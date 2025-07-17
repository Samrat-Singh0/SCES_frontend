import {Component, OnInit} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {Router} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton, MatMiniFabButton} from '@angular/material/button';
import {SemesterService} from '../../services/semester.service';
import {NgForOf, NgIf} from '@angular/common';
import {futureDateValidator} from '../../auth/validators/future-date.validator';
import {ToastrMsgService} from '../../shared/toastr-msg.service';
import {Course} from '../../model/course.model';
import {CourseService} from '../../services/course.service';
import {MatFormField, MatLabel} from '@angular/material/input';
import {MatOption, MatSelect, MatSelectChange} from '@angular/material/select';
import {Semester} from '../../model/semester.model';
import {MatTooltip} from '@angular/material/tooltip';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {Instructor} from '../../model/instructor.model';
import {InstructorService} from '../../services/instructor.service';
import {JoinNameService} from '../../shared/join-name.service';

@Component({
  selector: 'app-add-semester',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatIcon,
    MatIconButton,
    NgIf,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    NgForOf,
    MatMiniFabButton,
    MatTooltip,
    MatCardTitle,
    MatCard,
    MatCardContent,
  ],
  templateUrl: './add-semester.component.html',
  standalone: true,
  styleUrl: './add-semester.component.css'
})
export class AddSemesterComponent implements OnInit {
  addForm: FormGroup;
  availableCourses: Course[] = [];
  selectedCourse: string[] = [];
  previousSelectedCourses: string[] = [];
  availableInstructors: Instructor[] = [];
  renderCourseField: number = 0;
  renderInstructorField: number = 0;

  constructor(
    private router: Router,
    private builder: FormBuilder,
    private semesterService: SemesterService,
    private toastr: ToastrMsgService,
    private courseService: CourseService,
    private instructorService: InstructorService,
    public joinName: JoinNameService
  ) {
    this.addForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.loadCourses();
    this.buildForm();
    this.loadInstructor();
  }

  buildForm() {
    const today = new Date().toISOString().split('T')[0];

    this.addForm = this.builder.group({
      label: ['', [Validators.required, Validators.pattern("^[A-Za-z]+$"), Validators.minLength(5)]],
      fee: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
      startDate: [today, [Validators.required, futureDateValidator()]],
      endDate: [today, [Validators.required, futureDateValidator()]],
      courses: this.builder.array([])
    });
  }

  loadCourses() {
    this.courseService.getCoursesWithNoSemester().subscribe({
      next: res => {
        this.availableCourses = res.body;
      }, error: err => {
        this.toastr.error('');
      }
    });
  }

  loadInstructor() {
    this.instructorService.getAll().subscribe({
      next: res => {
        this.availableInstructors = res.body;
      }, error: err => {
        this.toastr.error('');
      }
    });
  }

  get courses() {
    return this.addForm.get('courses') as FormArray;
  }

  getInstructors(courseIndex: number) {
    return this.courses.at(courseIndex).get('instructors') as FormArray;
  }

  addCourse() {
    this.renderCourseField++;
    const courseForm = this.builder.group({
      course: [''],
      instructors: this.builder.array([])
    })

    this.courses.push(courseForm);
  }

  addInstructor(courseIndex: number) {
    this.renderInstructorField++;
    const instructorForm = this.builder.group({
      instructor: ['']
    })
    this.getInstructors(courseIndex).push(instructorForm);
  }

  removeCourse(index: number) {
    this.renderCourseField--;
    const removedCourseCode = this.courses.at(index).get('course')?.value?.code;

    if (removedCourseCode) {
      const codeIndex = this.selectedCourse.indexOf(removedCourseCode);
      if (codeIndex !== -1) {
        this.selectedCourse.splice(codeIndex, 1);
      }
    }
    this.courses.removeAt(index);
  }

  removeInstructor(courseIndex: number, instructorIndex: number) {
    this.renderInstructorField--;
    this.getInstructors(courseIndex).removeAt(instructorIndex);
  }

  saveSemester() {
    const semesterData: Semester = {
      label: this.addForm.get('label')?.value,
      fee: this.addForm.get('fee')?.value,
      startDate: this.addForm.get('startDate')?.value,
      endDate: this.addForm.get('endDate')?.value,
      course: this.courses.controls.map(courseControl => {
        const course = courseControl.get('course')?.value;

        const instructors = (courseControl.get('instructors') as FormArray).controls
          .map(instructorControl => instructorControl.get('instructor')?.value);

        return {
          ...course,
          instructors: instructors,
        }
      })
    }

    if (!this.addForm.invalid) {
      this.semesterService.add(semesterData).subscribe({
        next: res => {
          this.router.navigate(['super/semester/view']);
          this.toastr.success(res.message);
        }, error: err => {
          this.toastr.error(err.message);
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['super/semester/view']);
  }

  onCourseSelect(event: MatSelectChange, index: number) {
    const newCode = event.value.code;
    const oldCode = this.previousSelectedCourses[index];

    if (oldCode) {
      const oldIndex = this.selectedCourse.indexOf(oldCode);
      if (oldIndex !== -1) {
        this.selectedCourse.splice(oldIndex, 1);
      }
    }

    this.previousSelectedCourses[index] = newCode;

    if (!this.selectedCourse.includes(newCode)) {
      this.selectedCourse.push(newCode);
    }
  }

  isCourseSelected(course: Course): boolean {
    return this.selectedCourse.includes(course.code);
  }


}
