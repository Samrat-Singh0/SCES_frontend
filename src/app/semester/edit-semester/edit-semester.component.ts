import {Component, OnInit} from '@angular/core';
import {Semester} from '../../model/semester.model';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {SemesterStateService} from '../../shared/semester-state.service';
import {MatIcon} from '@angular/material/icon';
import {SemesterService} from '../../services/semester.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatIconButton, MatMiniFabButton} from '@angular/material/button';
import {NgForOf, NgIf} from '@angular/common';
import {ToastrMsgService} from '../../shared/toastr-msg.service';
import {MatFormField, MatLabel} from '@angular/material/input';
import {MatOption, MatSelect, MatSelectChange} from '@angular/material/select';
import {Course} from '../../model/course.model';
import {CourseService} from '../../services/course.service';
import {MatTooltip} from '@angular/material/tooltip';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {Instructor} from '../../model/instructor.model';
import {JoinNameService} from '../../shared/join-name.service';
import {InstructorService} from '../../services/instructor.service';

@Component({
  selector: 'app-edit-semester',
  imports: [
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
    MatCardContent,
    MatCard,
    MatCardTitle
  ],
  templateUrl: './edit-semester.component.html',
  standalone: true,
  styleUrl: './edit-semester.component.css'
})
export class EditSemesterComponent implements OnInit {

  semester: Semester | null = null;
  editForm: FormGroup;
  label: string | null = null;
  availableCourses: Course[] = [];
  selectedCourses: Course[] = [];
  assignedInstructors: Instructor[] = [];
  availableInstructors: Instructor[] = [];
  selectedCourseCodes: string[] = [];
  previousSelectedCourses: string[]= [];
  renderCourseField: number = 0;
  renderInstructorField: number = 0;


  constructor(
    private route: ActivatedRoute,
    private semesterState: SemesterStateService,
    private formBuilder: FormBuilder,
    private semesterService: SemesterService,
    private toastr: ToastrMsgService,
    private courseService: CourseService,
    private router: Router,
    public joinName: JoinNameService,
    private instructorService: InstructorService,
  ) {
    this.editForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.renderContent();

  }

  renderContent() {
    if (this.isFormEmpty()) {
      this.route.queryParamMap.subscribe(params => {
        this.label = params.get('label');
      });
    }else{
      this.getSemAndBuildForm();
    }

  }

  getSemAndBuildForm() {
    this.semester = this.semesterState.getSemester();
    this.populateAvailableCourses();
    this.populateAvailableInstructors();
    this.buildForm();
  }

  populateAvailableCourses() {
    this.courseService.getCoursesWithNoSemester().subscribe({
      next: res => {
        this.availableCourses = res.body;
        this.concatArrays();

      }, error: err => {
        this.toastr.error('');
      }
    });
  }

  populateAvailableInstructors() {
    this.instructorService.getAll().subscribe({
      next: res => {
        this.assignedInstructors = this.assignedInstructors.concat(res.body);
      }
    });
  }

  buildForm() {
    this.editForm = this.formBuilder.group({
      label: [
        {value: this.semester?.label, disabled: true},
        [Validators.required,Validators.pattern("^[A-Za-z]+$"),
          Validators.minLength(5)]],
      fee: [this.semester?.fee, [Validators.required, Validators.pattern("^[0-9]+$")]],
      startDate: [this.semester?.startDate, [Validators.required]],
      endDate: [this.semester?.endDate, [Validators.required]],
      courses: this.formBuilder.array([])
    });

    this.setCourses();
  }

  get courses() {
    return this.editForm.get('courses') as FormArray;
  }

  getInstructors(courseIndex: number) {
    return this.courses.at(courseIndex).get('instructors') as FormArray;
  }

  setCourses() {
    const courseArray = this.courses;
    let index = 0;
    this.semester?.course?.forEach(course => {
      this.renderCourseField++;
      this.selectedCourses.push(course);

      const courseGroup = this.formBuilder.group({
        course: [course],
        instructors: this.formBuilder.array([])
      });

      courseArray.push(courseGroup);
      this.setInstructors(index);
      index++;
    });
  }

  setInstructors(courseIndex: number) {
    const instructorArray = this.getInstructors(courseIndex);

    const course = this.semester?.course?.[courseIndex];

    course?.instructors?.forEach(instructor => {
      this.renderInstructorField++;
      this.assignedInstructors.push(instructor);

      const instructorGroup = this.formBuilder.group({
        instructor: [instructor],
      });

      instructorArray.push(instructorGroup);
    })
    console.log(instructorArray.value);
  }

  concatArrays(): any {
    this.availableCourses = this.availableCourses.concat(this.selectedCourses);
    this.selectedCourseCodes = this.selectedCourses.map(course => course.code);
  }


  addCourse() {
    this.renderCourseField++;
    const courseForm = this.formBuilder.group({
      course: [''],
      instructors: this.formBuilder.array([])
    })

    this.courses.push(courseForm);
  }

  addInstructor(courseIndex: number) {
    this.renderInstructorField++;
    const instructorForm = this.formBuilder.group({
      instructor: ['']
    });
    this.getInstructors(courseIndex).push(instructorForm);

  }

  removeInstructor(courseIndex: number, instructorIndex: number) {
    this.renderInstructorField--;
    this.getInstructors(courseIndex).removeAt(instructorIndex);
  }

  removeCourse(index: number) {
    this.renderCourseField--;
    const removedCourseCode = this.courses.at(index).get('course')?.value?.code;

    if (removedCourseCode) {
      const codeIndex = this.selectedCourseCodes.indexOf(removedCourseCode);
      if (codeIndex !== -1) {
        this.selectedCourseCodes.splice(codeIndex, 1);
      }
    }
    this.courses.removeAt(index);
  }

  onCourseSelect(event: MatSelectChange, index: number) {
    const newCode = event.value.code;
    const oldCode = this.previousSelectedCourses[index];

    if (oldCode) {
      const oldIndex = this.selectedCourseCodes.indexOf(oldCode);
      if (oldIndex !== -1) {
        this.selectedCourseCodes.splice(oldIndex, 1);
      }
    }

    this.previousSelectedCourses[index] = newCode;

    if (!this.selectedCourseCodes.includes(newCode)) {
      this.selectedCourseCodes.push(newCode);
    }
  }

  isCourseSelected(course: Course): boolean {
    return this.selectedCourseCodes.includes(course.code);
  }


  update() {
    if(!this.semester) {
      this.toastr.error("Semester data is missing");
      return;
    }

    const updatedSemester: Semester = {
      ...this.semester,
      fee: this.editForm.get('fee')?.value,
      startDate: this.editForm.get('startDate')?.value,
      endDate: this.editForm.get('endDate')?.value,
      course: this.courses.controls.map(control => control.get('course')?.value)
    }

    this.semesterService.update(updatedSemester).subscribe({
        next: (res) => {
          this.router.navigate(['super/semester/view']);
          this.toastr.success(res.message);

        }, error: (err) => {
          this.toastr.error(err.message);
        }
      });
  }


  isFormEmpty(): boolean {
    return !this.semesterState.getSemester();
  }

  goBack() {
    this.router.navigate(['super/semester/view']);
  }

  courseMapper(a: Course, b: Course) {
    return(a.code === b.code);
  }
}
