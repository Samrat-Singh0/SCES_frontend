import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {SemesterService} from '../../services/semester.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NgIf} from '@angular/common';
import {futureDateValidator} from '../../auth/validators/future-date.validator';

@Component({
  selector: 'app-add-semester',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatIcon,
    MatIconButton,
    NgIf,
  ],
  templateUrl: './add-semester.component.html',
  styleUrl: './add-semester.component.css'
})
export class AddSemesterComponent implements OnInit {
  addForm: FormGroup;

  constructor(
    private router: Router,
    private builder: FormBuilder,
    private semesterService: SemesterService,
    private snackBar: MatSnackBar
  ) {
    this.addForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    const today = new Date().toISOString().split('T')[0];

    this.addForm = this.builder.group({
      label: ['', [Validators.required, Validators.pattern("^[A-Za-z]+$"), Validators.minLength(5)]],
      fee: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
      startDate: [today, [Validators.required, futureDateValidator()]],
      endDate: [today, [Validators.required, futureDateValidator()]],
    });
  }

  add() {
    if(!this.addForm.invalid){
      this.semesterService.add(this.addForm.value).subscribe({
        next: res => {
          this.router.navigate(['super/semester/view']);
          this.snackBar.open(res.message, "Close", {duration: 3000});
        }, error: err => {
          this.snackBar.open(err.message, "Close", {duration: 3000});
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['super/semester/view']);
  }
}
