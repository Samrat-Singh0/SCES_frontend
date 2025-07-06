import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass, NgIf} from '@angular/common';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {MatIconModule} from '@angular/material/icon';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CurrentUserService} from '../../shared/current-user.service';

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
export class LoginComponent implements OnInit{

  hide:Boolean = true;
  errorMessage: string = '';
  loginForm : FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private currentUser: CurrentUserService
  ) {
    this.loginForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(){
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    })
  }



  onLogin() {
    if(this.loginForm.valid){
      this.authService.login(this.loginForm.value.email!, this.loginForm.value.password!).subscribe({
        next: (response: any) => {
          const token = response.headers.get('Authorization');
          const body = response.body;

          if(token){
            localStorage.setItem('token',token);
            localStorage.setItem('role', body.body.role);
            localStorage.setItem('loggedInUser', JSON.stringify(body.body));
            this.currentUser.getUser();
          }

          this.errorMessage = '';

          if(body.body === null){
            this.snackBar.open(response.body.message, "Close", {duration: 3000});
            return;
          }


          if(body.body.mustChangePassword){
            this.router.navigate(['initial-login/'+''+body.body.email]);
            return;
          }

          switch (body.body.role) {
            case "SUPER_ADMIN": {
              this.router.navigate(['super']);
              break;
            }
            case "INSTRUCTOR": {
              this.router.navigate(['instructor']);
              break;
            }
            case "STUDENT":{
              this.router.navigate(['student'])
              break;
            }
          }
        },
        error:(err) => {
          this.errorMessage = err.message;
        }
      })
    }
  }

}
