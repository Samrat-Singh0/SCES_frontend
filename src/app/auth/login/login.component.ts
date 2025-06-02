import {Component} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass, NgIf} from '@angular/common';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    MatIconModule,
    NgClass
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  hide:Boolean = true;

  constructor(private authService: AuthService, private router: Router) {
  }

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  })



  onLogin() {
    if(this.loginForm.valid){
      this.authService.login(this.loginForm.value.email!, this.loginForm.value.password!).subscribe({
        next: (response: any) => {
          const token = response.headers.get('Authorization');
          const body = response.body;

          localStorage.setItem('token',token);

          if(body.mustChangePassword){
            this.router.navigate(['initial-login'], {
              queryParams: {email: body.email}
            });
            return;
          }

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
        },
        error: (err) => {
          console.log("error:::", err);
        }
      })
    }
  }

}
