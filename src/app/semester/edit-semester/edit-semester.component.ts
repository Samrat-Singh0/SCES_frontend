import {Component, OnInit} from '@angular/core';
import {Semester} from '../../model/semester.model';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {SemesterStateService} from '../../shared/semester-state.service';
import {MatIcon} from '@angular/material/icon';
import {SemesterService} from '../../services/semester.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {MatIconButton} from '@angular/material/button';
import {NgIf} from '@angular/common';
import {futureDateValidator} from '../../auth/validators/future-date.validator';

@Component({
  selector: 'app-edit-semester',
  imports: [
    ReactiveFormsModule,
    MatIcon,
    MatIconButton,
    NgIf
  ],
  templateUrl: './edit-semester.component.html',
  styleUrl: './edit-semester.component.css'
})
export class EditSemesterComponent implements OnInit {

  semester: Semester | null = null;
  editForm: FormGroup;
  label: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private semesterState: SemesterStateService,
    private formBuilder: FormBuilder,
    private semesterService: SemesterService,
    private snackBar: MatSnackBar,
    private router: Router,
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
        this.getSemester();
      });
    }else{
      this.getSemAndBuildForm();
    }

  }

  getSemester() {
    this.semesterService.getSemester(this.label!).subscribe({
      next: res => {
        this.semesterState.setSemester(res.body);
        this.getSemAndBuildForm();
      }, error: err => {
        this.snackBar.open(err.message,"Close", {duration:3000});
      }
    });
  }

  getSemAndBuildForm() {
    this.semester = this.semesterState.getSemester();
    this.buildForm();
  }

  buildForm() {
    this.editForm = this.formBuilder.group({
      label: [{value: this.semester?.label, disabled: true}, [Validators.required,Validators.pattern("^[A-Za-z]+$"), Validators.minLength(5)]],
      fee: [this.semester?.fee, [Validators.required, Validators.pattern("^[0-9]+$")]],
      startDate: [this.semester?.startDate, [Validators.required]],
      endDate: [this.semester?.endDate, [Validators.required]]
    });

    // const formattedStartDate = this.editForm.get('startDate')?.value;
    // const formattedEndDate = this.editForm.get('endDate')?.value;

    // if (formattedStartDate) {
    //   const formatted = formattedStartDate.replace(/\//g, '-');
    //   console.log(formattedStartDate)
    //   console.log(formatted);
    //   this.editForm.get('startDate')?.setValue(formatted);
    // }
    //
    // if (formattedEndDate) {
    //   const formatted = formattedEndDate.replace(/\//g, '-');
    //   this.editForm.get('endDate')?.setValue(formatted);
    // }
  }



  update() {
    if(!this.semester) {
      this.snackBar.open("Semester data is missing", "Close", {duration: 3000});
      return;
    }

    const updatedSemester: Semester = {
      ...this.semester,
      fee: this.editForm.get('fee')?.value,
      startDate: this.editForm.get('startDate')?.value,
      endDate: this.editForm.get('endDate')?.value,
    }
    this.semesterService.update(updatedSemester).subscribe({
        next: (res) => {
          this.router.navigate(['super/semester']);
          this.snackBar.open(res.message, "Close", {duration: 3000});

        }, error: (err) => {
          this.snackBar.open(err.message, "Close", {duration: 3000});
        }
      });
  }


  isFormEmpty(): boolean {
    return !this.semesterState.getSemester();
  }

  goBack() {
    this.router.navigate(['super/semester/view']);
  }


}
