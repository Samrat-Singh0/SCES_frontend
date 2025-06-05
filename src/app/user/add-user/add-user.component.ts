import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {User} from '../../models/user.model';
import {UserService} from '../../services/user.service';
import {catchError, tap, throwError} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-user',
  imports: [
    ReactiveFormsModule,
    NgIf,
    MatIconModule,
  ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})
export class AddUserComponent implements OnInit {
  myForm: FormGroup;
  isEditMode = false;
  parts: string[] = [];
  fullName!: string;
  middleName!: string;
  lastName!: string;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<AddUserComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = !!this.data;
    this.myForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    if (this.isEditMode) {
      this.splitName(this.data.fullName);
    }
    this.myForm = this.fb.group({
      userCode:[this.data?.userCode || ''],
      firstName: [this.parts[0] || '',[
          Validators.required,
          Validators.minLength(3),
          Validators.pattern("^[A-Za-z]+$")
      ]],
      middleName:
        [this.parts.length === 3 ? this.parts[1] : '',
        [Validators.pattern("^[A-Za-z]+$")]],
      lastName:
        [this.parts.length > 1 ? this.parts.length >= 2 ? this.parts[1] : this.parts[2] : '',
        [
          Validators.required, Validators.minLength(3),
          Validators.pattern("^[A-Za-z]+$")
        ]],
      email: [this.data?.email || '', [Validators.required, Validators.email, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]],
      address: [this.data?.address || '', [Validators.required, Validators.pattern("^[A-Za-z ]+$")]],
      phoneNumber: [this.data?.phoneNumber || '', [Validators.required, Validators.minLength(10)]],
      role: [this.data?.role || 'Student']
    })
  }

  onSubmit() {
    if (this.myForm.valid) {
      const form = this.myForm.value;
      const fullName: string = this.concatName(form.firstName, form.middleName, form.lastName);
      const user: User = {
        userCode: this.data?.userCode || '',
        email: form.email,
        fullName: fullName,
        address: form.address,
        phoneNumber: form.phoneNumber,
        role: form.role == "Instructor" ? "ADMIN" : "USER"
      }

      if(this.isEditMode){
        this.userService.updateUser(user).subscribe({
          next: (res) => {
            this.snackBar.open("User Updated.", "Close", {duration:3000})
            this.dialogRef.close();
          }, error: (err)=> {
            console.log(err);
            this.snackBar.open("Error when updating user", "Close", {duration:3000})
        }
        })
      }else {
        this.userService.addUser(user)
        .pipe(
          tap(res => console.log("User Saved:::", res)),
          catchError(error => {
            this.snackBar.open("Error occurred!", "Close", {duration: 3000})
            return throwError(() => error)
          })
        ).subscribe({
          next: () => {
            this.snackBar.open("User Added Successfully.", "Close", {duration: 3000});
            this.dialogRef.close();
          }
        });
      }
    }
  }

  concatName(firstName: string, middleName: string, lastName: string): string {
    // let fullName = "";
    // if(middleName === "" || middleName === " "){
    //   fullName = firstName.concat(" " + lastName);
    // }else{
    //   fullName = firstName + " " + middleName + " " + lastName;
    // }
    //
    // return fullName;
    return [firstName, middleName, lastName]
    .filter(Boolean)
    .join(' ')
  }

  splitName(fullName: string) {
    this.parts = fullName.split(' ');
  }


}
