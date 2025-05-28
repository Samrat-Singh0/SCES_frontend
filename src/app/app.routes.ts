import { Routes } from '@angular/router';
import {LoginComponent} from './auth/login/login.component';
import {SignupComponent} from './auth/signup/signup.component';
import {
  SuperAdminDashboardComponent
} from './dashboard/super-admin/super-admin-dashboard/super-admin-dashboard.component';
import {AdminDashboardComponent} from './dashboard/admin/admin-dashboard/admin-dashboard.component';
import {UserDashboardComponent} from './dashboard/user/user-dashboard/user-dashboard.component';
import {UserComponent} from './user/user/user.component';

export const routes: Routes = [
  {path: "", component: LoginComponent},
  {path: "login", component: LoginComponent},
  {path: "signup", component: SignupComponent},
  {path: "super-admin-dashboard", component:SuperAdminDashboardComponent, children: [
      {path: "user", component: UserComponent}
    ]},
  {path: "admin-dashboard", component:AdminDashboardComponent},
  {path: "user-dashboard", component: UserDashboardComponent}
];
