import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass, NgIf} from '@angular/common';
import {UserService} from '../../services/user.service';
import {ChangePassword} from '../../models/change-password.model';
import {ActivatedRoute, Router} from '@angular/router';
import {passwordMatchValidator} from '../validators/password-match.validator';
import {classNames} from '@angular/cdk/schematics';

@Component({
  selector: 'app-initial-login',
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgClass
  ],
  templateUrl: './initial-login.component.html',
  styleUrl: './initial-login.component.css'
})
export class InitialLoginComponent implements OnInit {

  hide: Boolean = false;
  email!: string;

  constructor(private userService: UserService, private route: ActivatedRoute,private router: Router) {
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.email = params.get('email')!;
    })
  }

  changePasswordForm = new FormGroup({
      newPassword: new FormControl('', [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_\\-+=.?/\\\\])[A-Za-z\\d!@#$%^&*()_\\-+=.?/\\\\]{8,}$")]),
      confirmPassword: new FormControl('', [Validators.required])
    }, {
      validators: passwordMatchValidator()
    }
  );

  onSubmit() {
    if (this.changePasswordForm.valid) {
      const form = this.changePasswordForm.value;
      const initialData: ChangePassword = {
        email: this.email,
        newPassword: form.newPassword!
      }
      this.userService.initialPasswordChange(initialData)
      .subscribe({
        next: res => {
          this.router.navigate(['login']);
        },
        error: err => {
          console.log(err);
        }
      })
    }
  }

  protected readonly classNames = classNames;
}
