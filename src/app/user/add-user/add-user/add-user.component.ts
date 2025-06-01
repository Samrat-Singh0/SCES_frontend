import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import generator from 'generate-password-ts';
import {User} from '../../../models/user.model';
import {UserService} from '../../../services/user.service';
import {catchError, tap, throwError} from 'rxjs';

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

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.myForm = this.fb.group({
      firstName: ['Samrat', [Validators.required, Validators.minLength(3)]],
      middleName: [''],
      lastName: ['Singh', [Validators.required, Validators.minLength(3)]],
      email: ['samrat@gmail.com', [Validators.required, Validators.email, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]],
      password: [''],
      address: ['Dallu', [Validators.required, Validators.pattern("^[A-Za-z ]+$")]],
      phoneNumber: ['9860111111', [Validators.required, Validators.minLength(10)]],
      role: ['Student']
    })
  }

  ngOnInit() {
    this.generatePass()
  }

  onSubmit() {
    if (this.myForm.valid) {
      const form = this.myForm.value;
      const fullName: string = this.concatName(form.firstName, form.middleName, form.lastName);
      const user: User = {
        email: form.email,
        password: form.password,
        fullName: fullName,
        address: form.address,
        phoneNumber: form.phoneNumber,
        role: form.role == "Instructor"? "ADMIN" : "USER"
      }

      this.userService.addUser(user)
      .pipe(
        tap(res => console.log("User Saved:::", res)),
        catchError(error => {
          console.error("ERROR:::::::::::::", error);
          return throwError(()=> error)
        })
      ).subscribe();

      // console.log(user);


    }

  }

  generatePass(): void {
    const password = generator.generate({
      length: 30,
      numbers: true,
      symbols: true
    })

    this.myForm.controls['password'].setValue(password);
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


}
