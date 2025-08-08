import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {ChangePassword} from '../../model/change-password.model';
import {ActivatedRoute, Router} from '@angular/router';
import {passwordMatchValidator} from '../validators/password-match.validator';
import {PasswordPolicy} from '../../model/password-policy.model';
import {PasswordPolicyService} from '../../services/password-policy.service';
import {AuthService} from '../../services/auth.service';
import {ToastrMsgService} from '../../shared/toastr-msg.service';

@Component({
  selector: 'app-initial-login',
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgClass,
    NgForOf
  ],
  templateUrl: './initial-login.component.html',
  standalone: true,
  styleUrl: './initial-login.component.css'
})
export class InitialLoginComponent implements OnInit {
  passwordPolicies: PasswordPolicy[] = [];
  passedPolicies: PasswordPolicy[] = [];
  hide: Boolean = false;
  email!: string;
  regexPattern: string = '';
  changePasswordForm: FormGroup;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private passwordPolicyService: PasswordPolicyService,
    private toastr: ToastrMsgService,
  ) {
    this.changePasswordForm = new FormGroup({});
  }

  ngOnInit() {
    this.email = this.route.snapshot.paramMap.get('email')!;
    this.buildForm();
    this.getPasswordPolicies();
  }

  getPasswordPolicies() {
    this.passwordPolicyService.getActivePolicies().subscribe(
      res => {
        if(res.success){
          this.passwordPolicies = res.body;
          this.regexPattern = this.buildRegexPattern();
          this.changePasswordForm.get('newPassword')?.setValidators([
            Validators.required,
            Validators.pattern(this.regexPattern)
          ]);
          this.changePasswordForm.get('newPassword')?.updateValueAndValidity();
        }else{
          this.toastr.error(res.message);
        }

      }
    );
  }

  buildForm() {
    this.changePasswordForm = new FormGroup({
        newPassword: new FormControl(''),
        confirmPassword: new FormControl('', [Validators.required])
      }, {
        validators: passwordMatchValidator()
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
          this.toastr.error(err.message);
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

    return `^${pattern}.*$`;
  }

  getActiveStatus() {
    if(this.changePasswordForm.valid) {
      return "submit-btn-active";
    }else {
      return "submit-btn-inactive";
    }
  }

  testRegex() {
    const password = this.changePasswordForm.get('newPassword')?.value || '';
    this.passwordPolicies.forEach(policy => {
      const regex = new RegExp(policy.regex);
      if(regex.test(password)) {
        if(!this.passedPolicies.includes(policy)){
          this.passedPolicies.push(policy);
        }
      }else {
        if(this.passedPolicies.includes(policy)){
          const index = this.passedPolicies.indexOf(policy);
          this.passedPolicies.splice(index, 1);
        }
      }
    })
  }

  getErrorClass(policy: PasswordPolicy): string {
    if(this.passedPolicies.includes(policy)){
      return 'passed-policy';
    }else {
      return 'failed-policy';
    }
  }


}
