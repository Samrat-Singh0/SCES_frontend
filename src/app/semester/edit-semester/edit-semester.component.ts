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
import {ConfirmationComponent} from '../../shared/confirmation/confirmation.component';
import {feeValidator} from '../../auth/validators/fee.validator';

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
        if(res.success){
          if(res.success){
            this.availableCourses = res.body;
            this.concatArrays();
          }else {
            this.toastr.error(res.message);
          }
        }else{
          this.toastr.error(res.message);
          this.router.navigate(['super/semester/view']);
        }

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
      fee: [this.semester?.fee, [Validators.required, Validators.pattern("^[0-9]+$"), feeValidator()]],
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

      const instructorGroup = this.formBuilder.group({
        instructor: [instructor],
      });

      instructorArray.push(instructorGroup);
    });
  }

  concatArrays(): any {
    this.availableCourses = this.availableCourses.concat(this.selectedCourses);
    this.selectedCourseCodes = this.selectedCourses.map(course => course.code);
  }


  addCourse(course: Course | null) {
    this.renderCourseField++;
    const courseForm = this.formBuilder.group({
      course: [course || '', [Validators.required]],
      instructors: this.formBuilder.array([])
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
    const instructorForm = this.formBuilder.group({
      instructor: [instructor || '', [Validators.required]],
    })
    this.getInstructors(courseIndex).push(instructorForm);
  }

  removeInstructor(courseIndex: number, instructorIndex: number) {
    this.renderInstructorField--;
    this.getInstructors(courseIndex).removeAt(instructorIndex);

  }

  removeCourse(index: number) {
    this.renderCourseField--;
    this.courses.removeAt(index);
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

    if(JSON.stringify(this.semester) === JSON.stringify(updatedSemester)) {
      this.toastr.info("No any changes detected.");
      return;
    }

    if(this.editForm.invalid){
      this.toastr.error("Please fill all the fields that are required");
      return;
    }

    if(this.selectedCourses.length === 0){
      this.toastr.error("Please select at least one course.")
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
        this.semesterService.update(updatedSemester).subscribe({
          next: (res) => {
            if(res.success){
              this.router.navigate(['super/semester']);
              this.toastr.success(res.message);
            }else {
              this.toastr.error(res.message);
            }

          }, error: (err) => {
            this.toastr.error(err.message);
          }
        });
      }
    })

  }


  isFormEmpty(): boolean {
    return !this.semesterState.getSemester();
  }

  goBack() {
    this.router.navigate(['super/semester']);
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

  courseMapper(a: Course, b: Course) {
    return(a.code === b.code);
  }

  compareByEmail = (a: Instructor, b: Instructor): boolean => {
    return a && b ? a.user.email === b.user.email : a === b;
  }

  resetForm() {
    this.renderContent()
  }

  isAddCourseButtonDisabled(): boolean {
    return (this.availableCourses.length === this.courses.length);
  }

  isAddInstructorButtonDisabled(courseIndex: number): boolean {
    const selected = this.getInstructors(courseIndex)?.length || 0;
    return selected === 3;
  }
}
