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
import {ToastrMsgService} from '../../shared/toastr-msg.service';
import {Course} from '../../model/course.model';
import {CourseService} from '../../services/course.service';
import {MatFormField, MatLabel} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
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
import {ConfirmationComponent} from '../../shared/confirmation/confirmation.component';
import {futureDateValidator} from '../../auth/validators/future-date.validator';
import {ActiveStatus} from '../../enum/active-status.enum';
import {feeValidator} from '../../auth/validators/fee.validator';

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
  inactiveSemesters: Semester[] = []
  addForm: FormGroup;
  availableCourses: Course[] = [];
  availableInstructors: Instructor[] = [];
  renderCourseField: number = 0;
  renderInstructorField: number = 0;
  label: string | null = null;
  semester: Semester | null = null;
  validDate: string = '';

  constructor(
    private router: Router,
    private builder: FormBuilder,
    private semesterService: SemesterService,
    private toastr: ToastrMsgService,
    private courseService: CourseService,
    private instructorService: InstructorService,
    public joinName: JoinNameService,
    private dialog: MatDialog,
  ) {
    this.addForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.getInactiveSemester();
    this.loadCourses();
    this.loadInstructor();
    this.buildForm();

  }

  getInactiveSemester() {
    this.semesterService.getAll(ActiveStatus.INACTIVE).subscribe({
      next: res => {
        if(res.success) {
          this.inactiveSemesters = res.body;
        }else{
          this.toastr.error(res.message);
        }
      }, error: err => {
        this.toastr.error(err.message);
      }
    });
  }

  buildForm() {
    const unformattedStartDate: Date = new Date();
    unformattedStartDate.setDate(unformattedStartDate.getDate() + 1);

    const unformattedEndDate: Date = new Date();
    unformattedEndDate.setMonth(unformattedStartDate.getMonth() + 6);

    const startDate = unformattedStartDate.toISOString().split('T')[0];
    const endDate = unformattedEndDate.toISOString().split('T')[0];

    this.validDate = startDate;

    this.addForm = this.builder.group({
      label: [
        { value: this.semester?.label || this.inactiveSemesters[0]?.label, disabled: this.mode === 'edit' },
        [Validators.required, Validators.pattern("^[A-Za-z]+$"), Validators.minLength(5)]
      ],
      fee: [this.semester?.fee || '', [Validators.required, Validators.pattern("^[0-9]+$"), feeValidator()]],
      startDate: [this.semester?.startDate || startDate, [Validators.required, futureDateValidator()]],
      endDate: [this.semester?.endDate || endDate, [Validators.required, futureDateValidator()]],
      courses: this.builder.array([])
    });

    if (this.mode === 'edit') {
      this.setCourses();
    }

  }

  loadCourses() {
    this.courseService.getCoursesWithNoSemester().subscribe({
      next: res => {
        if(res.success){
          this.availableCourses = res.body;

        }else {
          this.toastr.error(res.message);
        }
      }, error: err => {
        this.toastr.error('');
      }
    });
  }

  loadInstructor() {
    this.instructorService.getAll().subscribe({
      next: res => {
        if(res.success){
          this.availableInstructors = res.body;

        }else {
          this.toastr.error(res.message);
        }
      }, error: err => {
        this.toastr.error('');
      }
    });
  }

  setCourses() {
    const courseArray = this.courses;
    let index = 0;
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
    const courseCode = this.courses.at(courseIndex).value.course.code;
    if(!courseCode){
      this.toastr.error('Select at least one course');
      return;
    }

    this.renderInstructorField++;
    const instructorForm = this.builder.group({
      instructor: [instructor || '', [Validators.required]],
    })
    this.getInstructors(courseIndex).push(instructorForm);
  }

  removeCourse(index: number) {
    this.renderCourseField--;
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
      return;
    }
    if(this.courses.length === 0) {
      this.toastr.error("Please add at least one course.");
      return;
    }

    for(let i = 0 ; i < this.courses.length ; i++) {
      if(this.getInstructors(i).length === 0){
        this.toastr.error("Please add at least one instructor in selected courses");
        return;
      }
    }

    const dialog = this.dialog.open(ConfirmationComponent, {
      width: '600px',
      maxWidth: 'none',
      disableClose: true,
      data: {
        title: 'Confirm Save',
        message:"Are you sure you want to create a new semester? Some of the details cannot be changed after saving.",
        requireRemarks: false
      }
    })
    dialog.afterClosed().subscribe(result => {
      if(result?.confirmed) {
        this.semesterService.add(semesterData).subscribe({
          next: res => {
            if(res.success){
              this.router.navigate(['super/semester']);
              this.toastr.success(res.message);
            }else {
              this.toastr.error(res.message);
            }
          }, error: err => {
            this.toastr.error(err.message);
          }
        });
      }
    })
  }

  goBack() {
    this.router.navigate(['super/semester']);
  }

  isCourseSelected(course: Course): boolean {
    for(let i = 0 ; i < this.courses.length ; i++) {
      if(this.courses.at(i).value.course.code === course.code) {
        return true;
      }
    }
    return false;
  }

  isInstructorSelected(courseIndex: number, instructor: Instructor): boolean {
    for(let i = 0 ; i < this.getInstructors(courseIndex).length ; i++) {
      if(this.getInstructors(courseIndex).at(i).value.instructor.code === instructor.code){
        return true;
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
        result.code = result.name;
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
            if(res.success){
              this.availableInstructors = res.body;

              const newlyAddedInstructor = this.availableInstructors.find(
                instructor => instructor.user.email === result.user.email
              );

              if (newlyAddedInstructor) {
                const lastCourseIndex = this.courses.length - 1;
                this.addInstructor(lastCourseIndex, newlyAddedInstructor);
              }
            }else {
              this.toastr.error(res.message);
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
    return a.code === b.code;
  }

  compareByEmail = (a: Instructor, b: Instructor): boolean => {
    if(!a || !b){
      return false;
    }
    return a.user.email === b.user.email;
  }

  resetForm() {
    this.loadCourses();
    this.loadInstructor();
    this.buildForm();
  }

  isAddCourseButtonDisabled(): boolean {
    return (this.availableCourses.length === this.courses.length);
  }

  isAddInstructorButtonDisabled(courseIndex: number): boolean {
    const selected = this.getInstructors(courseIndex)?.length || 0;
    return selected === 3;
  }
}
