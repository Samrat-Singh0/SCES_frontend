import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-initial-login',
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './initial-login.component.html',
  styleUrl: './initial-login.component.css'
})
export class InitialLoginComponent {

  isOldPasswordValid: Boolean = false;

  changePasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required,  Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]),
    oldPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required, Validators.pattern("^(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$\n")]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  onSubmit() {
    if(this.changePasswordForm.valid){
      console.log("VAlIDDDDDDDD");
    }else {
      console.log("Invaliddddddd");
    }
  }
}
