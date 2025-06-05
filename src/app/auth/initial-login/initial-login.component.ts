import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {ChangePassword} from '../../models/change-password.model';
import {ActivatedRoute, Router} from '@angular/router';
import {passwordMatchValidator} from '../validators/password-match.validator';
import {PasswordPolicy} from '../../models/password-policy.model';
import {PasswordPolicyService} from '../../services/password-policy.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-initial-login',
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgClass,
    NgForOf
  ],
  templateUrl: './initial-login.component.html',
  styleUrl: './initial-login.component.css'
})
export class InitialLoginComponent implements OnInit {
  passwordPolicies: PasswordPolicy[] = [];
  hide: Boolean = false;
  email!: string;
  regexPattern: string = '';

  changePasswordForm = new FormGroup({
      newPassword: new FormControl(''),
      confirmPassword: new FormControl('', [Validators.required])
    }, {
      validators: passwordMatchValidator()
    }
  );

  constructor(private authService: AuthService,
              private route: ActivatedRoute,
              private router: Router,
              private passwordPolicyService: PasswordPolicyService) {
  }

  ngOnInit() {

    this.route.queryParamMap.subscribe(params => {
      this.email = params.get('email')!;
    })

    this.passwordPolicyService.getActivePolicies().subscribe(
      data => {
        this.passwordPolicies = data;
        this.regexPattern = this.buildRegexPattern();
        this.changePasswordForm.get('newPassword')?.setValidators([
          Validators.required,
          Validators.pattern(this.regexPattern)
        ]);
        this.changePasswordForm.get('newPassword')?.updateValueAndValidity();
      }
    );
  }

  onSubmit() {
    if (this.changePasswordForm.valid) {
      const form = this.changePasswordForm.value;
      const initialData: ChangePassword = {
        email: this.email,
        newPassword: form.newPassword!
      }
      this.authService.initialPasswordChange(initialData)
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

  buildRegexPattern(): string {
    const pattern = this.passwordPolicies.map(
      policy => {
        let regex = policy.regex;
        if (regex.startsWith('^')) regex = regex.substring(1);
        if (regex.endsWith('$')) regex = regex.substring(0, regex.length - 1);

        return `(?=${regex})`;
      }
    ).join('');

    console.log(`^${pattern}.*$`);
    return `^${pattern}.*$`;
  }

  getPasswordErrors(): string[] {
    const password = this.changePasswordForm.get('newPassword')?.value || '';
    const failedPolicies: string[] = [];

    this.passwordPolicies.forEach(policy => {
      const regex = new RegExp(policy.regex);
      if(!regex.test(password)) {
        failedPolicies.push(policy.parameters);
      }
    });

    return failedPolicies;
  }
}
