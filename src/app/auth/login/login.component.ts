import {Component} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private authService: AuthService, private router: Router) {
  }

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  })



  onLogin() {
    if(this.loginForm.valid){
      // console.log(this.loginForm.valid);
      this.authService.login(this.loginForm.value.email!, this.loginForm.value.password!).subscribe({
        next: (response: any) => {
          const token = response.headers.get('Authorization');
          const body = response.body;

          localStorage.setItem('token',token);

          switch (body.role) {
            case "SUPER_ADMIN": {
              this.router.navigate(['super-admin-dashboard']);
              break;
            }
            case "ADMIN": {
              this.router.navigate(['admin-dashboard']);
              break;
            }
            case "USER":{
              this.router.navigate(['user-dashboard'])
              break;
            }
          }
          // this.router.navigate(['/super-admin-dashboard']);
        },
        error: (err) => {
          console.log("error:::", err);
        }
      })
    }
  }

}
