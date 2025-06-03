import {Routes} from '@angular/router';
import {LoginComponent} from './auth/login/login.component';
import {SignupComponent} from './auth/signup/signup.component';
import {
  SuperAdminDashboardComponent
} from './dashboard/super-admin/super-admin-dashboard/super-admin-dashboard.component';
import {AdminDashboardComponent} from './dashboard/admin/admin-dashboard/admin-dashboard.component';
import {UserDashboardComponent} from './dashboard/user/user-dashboard/user-dashboard.component';
import {InitialLoginComponent} from './auth/initial-login/initial-login.component';
import {AddUserComponent} from './user/add-user/add-user.component';
import {ViewUserComponent} from './user/view-user/view-user.component';
import {PasswordPolicyComponent} from './password-policy/password-policy.component';

export const routes: Routes = [
  {path: "", component: LoginComponent},
  {path: "login", component: LoginComponent},
  {path: "initial-login", component: InitialLoginComponent},
  {path: "signup", component: SignupComponent},
  {path: "super-admin-dashboard", component: SuperAdminDashboardComponent},
  {path: "super-admin-dashboard", component:SuperAdminDashboardComponent, children: [
      {path: "add-user", component: AddUserComponent},
      {path: "view-user", component: ViewUserComponent},
      {path: "password-policy", component: PasswordPolicyComponent},
      {path:"", component: ViewUserComponent},
    ]},
  {path: "admin-dashboard", component:AdminDashboardComponent},
  {path: "user-dashboard", component: UserDashboardComponent}
];
