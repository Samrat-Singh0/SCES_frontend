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
import {SaveCourseComponent} from '../../course/save-course/save-course.component';
import {MatDialog} from '@angular/material/dialog';
import {SaveUserComponent} from '../../user/save-user/save-user.component';
import {Role} from '../../enum/role.enum';

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
  availableInstructors: Instructor[] = [];
  selectedCourseCodes: string[] = [];
  renderCourseField: number = 0;
  renderInstructorField: number = 0;
  selectedInstructor: Map<String, Instructor[]> = new Map();


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
    private dialog: MatDialog,
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
        this.availableInstructors = this.availableInstructors.concat(res.body);
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
    const selectedInstructors: Instructor[] = [];

    course?.instructors?.forEach(instructor => {
      this.renderInstructorField++;

      // this.availableInstructors.push(instructor);
      selectedInstructors.push(instructor);

      const instructorGroup = this.formBuilder.group({
        instructor: [instructor],
      });

      instructorArray.push(instructorGroup);
    });
    if(course?.code) {
      this.selectedInstructor.set(course.code, selectedInstructors);
    }
  }

  concatArrays(): any {
    this.availableCourses = this.availableCourses.concat(this.selectedCourses);
    this.selectedCourseCodes = this.selectedCourses.map(course => course.code);
  }


  addCourse(course: Course | null) {
    this.renderCourseField++;
    const courseForm = this.formBuilder.group({
      course: [course || ''],
      instructors: this.formBuilder.array([])
    })

    this.courses.push(courseForm);
  }

  addInstructor(courseIndex: number, instructor: Instructor | null) {
    this.renderInstructorField++;
    const instructorForm = this.formBuilder.group({
      instructor: [instructor || '']
    })
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

    const oldCode = this.selectedCourses.splice(index, 1);
    if(oldCode) {
      this.selectedCourses.splice(index, 1);
    }
    this.selectedCourses.push(event.value.code);
  }

  isCourseSelected(course: Course): boolean {
    return this.selectedCourseCodes.includes(course.code);
  }

  onInstructorSelect(event: MatSelectChange, courseIndex: number) {
    const courseCode = this.selectedCourses[courseIndex].code;
    if(courseCode) {
      const selectedList = this.selectedInstructor.get(courseCode) || [];
      const alreadySelected = selectedList.some(instr => instr.code === event.value.code);
      if (!alreadySelected) {
        selectedList.push(event.value);
        this.selectedInstructor.set(courseCode, selectedList);
      }
    }
  }

  isInstructorSelected(courseIndex: number, instructor: Instructor): boolean {
    const courseCode = this.selectedCourses[courseIndex]?.code;
    if(courseCode) {
      const selected = this.selectedInstructor.get(courseCode) || [];
      for(let i = 0; i < selected.length; i++) {
        if(selected[i].code === instructor.code) {
          return true;
        }
      }
    }
    return false;
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

  addNewCourse() {
    const dialog = this.dialog.open(SaveCourseComponent, {
      width: '1000px'
    })

    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.availableCourses.push(result);
        this.addCourse(result);
      }
    })
  }

  addNewInstructor() {
    const dialog = this.dialog.open(SaveUserComponent, {
      width: '1000px',
      height: '800px',
      data: {
        firstName: undefined,
        middleName: undefined,
        lastName: undefined,
        role: Role.INSTRUCTOR,
        phoneNumber: undefined,
        forSemester: true
      }
    });

    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.instructorService.getAll().subscribe({
          next: res => {
            this.availableInstructors = res.body;

            const newlyAddedInstructor = this.availableInstructors.find(
              instructor => instructor.user.email === result.user.email
            );


            if (newlyAddedInstructor) {
              const lastCourseIndex = this.courses.length - 1;
              this.addInstructor(lastCourseIndex, newlyAddedInstructor);
            }
          },
          error: err => {
            this.toastr.error('Failed to load instructors.');
          }
        });
      }
    });
  }

  compareByCode = (a: Course, b: Course): boolean => {
    return a && b ? a.code === b.code : a === b;
  }

  compareByEmail = (a: Instructor, b: Instructor): boolean => {
    return a && b ? a.user.email === b.user.email : a === b;
  }

}
