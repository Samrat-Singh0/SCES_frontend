import {Component, OnInit} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {ActivatedRoute, Router} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton, MatMiniFabButton} from '@angular/material/button';
import {SemesterService} from '../../services/semester.service';
import {NgForOf, NgIf} from '@angular/common';
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
import {SaveCourseComponent} from '../../course/save-course/save-course.component';
import {MatDialog} from '@angular/material/dialog';
import {SaveUserComponent} from '../../user/save-user/save-user.component';
import {Role} from '../../enum/role.enum';
import {SemesterStateService} from '../../shared/semester-state.service';

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
  mode: 'add' | 'edit' = 'add';
  addForm: FormGroup;
  availableCourses: Course[] = [];
  selectedCourse: string[] = [];
  availableInstructors: Instructor[] = [];
  renderCourseField: number = 0;
  renderInstructorField: number = 0;
  label: string | null = null;
  semester: Semester | null = null;
  selectedInstructor: Map<String, Instructor[]> = new Map();

  constructor(
    private router: Router,
    private builder: FormBuilder,
    private semesterService: SemesterService,
    private toastr: ToastrMsgService,
    private courseService: CourseService,
    private instructorService: InstructorService,
    public joinName: JoinNameService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private semesterState: SemesterStateService,
  ) {
    this.addForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.getSemester();
    this.loadCourses();
    this.loadInstructor();
    this.buildForm();
  }

  getSemester() {
    this.route.paramMap.subscribe(paramMap => {
      this.label = paramMap.get('label');
      this.mode = this.label ? 'edit' : 'add';

      if(this.mode === 'edit') {
        this.semester = this.semesterState.getSemester();
        if(!this.semester) {
          this.toastr.error("Semester data not found");
          this.router.navigate(['super/semester/view']);
        }
      }
    })
  }

  buildForm() {
    const today = new Date().toISOString().split('T')[0];

    this.addForm = this.builder.group({
      label: [
        { value: this.semester?.label || '', disabled: this.mode === 'edit' },
        [Validators.required, Validators.pattern("^[A-Za-z]+$"), Validators.minLength(5)]
      ],
      fee: [this.semester?.fee || '', [Validators.required, Validators.pattern("^[0-9]+$")]],
      startDate: [this.semester?.startDate || today, [Validators.required]],
      endDate: [this.semester?.endDate || today, [Validators.required]],
      courses: this.builder.array([])
    });

    if (this.mode === 'edit') {
      this.setCourses();
    }

    this.addCourse(null);
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

  setCourses() {
    const courseArray = this.courses;
    let index = 0;
    console.log(this.semester);
    this.semester?.course?.forEach(course => {
      this.renderCourseField++;
      this.availableCourses.push(course);

      const courseGroup = this.builder.group({
        course: [course, [Validators.required]],
        instructors: this.builder.array([])
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
      this.availableInstructors.push(instructor);

      const instructorGroup = this.builder.group({
        instructor: [instructor, [Validators.required]],
      });

      instructorArray.push(instructorGroup);
    })
  }

  get courses() {
    return this.addForm.get('courses') as FormArray;
  }

  getInstructors(courseIndex: number) {
    return this.courses.at(courseIndex).get('instructors') as FormArray;
  }

  addCourse(course: Course | null) {
    this.renderCourseField++;
    const courseForm = this.builder.group({
      course: [course || '', [Validators.required]],
      instructors: this.builder.array([])
    })

    this.courses.push(courseForm);
  }

  addInstructor(courseIndex: number, instructor: Instructor | null) {
    this.renderInstructorField++;
    const instructorForm = this.builder.group({
      instructor: [instructor || '', [Validators.required]],
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
    if(this.addForm.invalid) {
      this.toastr.error('Please fill all the fields that are required.');
    }else{
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

    const oldCode = this.selectedCourse.splice(index, 1);
    if(oldCode) {
      this.selectedCourse.splice(index, 1);
    }
    this.selectedCourse.push(event.value.code);
  }

  isCourseSelected(course: Course): boolean {
    return this.selectedCourse.includes(course.code);
  }

  onInstructorSelect(event: MatSelectChange, courseIndex: number) {
    const courseCode = this.selectedCourse[courseIndex];
    if(courseCode) {
      const selectedList = this.selectedInstructor.get(courseCode) || [];
      const alreadySelected = selectedList.some(instr => instr.code === courseCode);
      if(!alreadySelected) {
        selectedList.push(event.value);
        this.selectedInstructor.set(courseCode, selectedList);
      }
    }
  }

  isInstructorSelected(courseIndex: number, instructor: Instructor): boolean {
    const courseCode = this.selectedCourse[courseIndex];
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

  resetForm() {
    this.getSemester();
    this.loadCourses();
    this.loadInstructor();
    this.buildForm();
  }

}
