import {Routes} from '@angular/router';
import {LoginComponent} from './auth/login/login.component';
import {SignupComponent} from './auth/signup/signup.component';
import {
  SuperAdminDashboardComponent
} from './dashboard/super-admin/super-admin-dashboard/super-admin-dashboard.component';
import {AdminDashboardComponent} from './dashboard/admin/admin-dashboard/admin-dashboard.component';
import {UserDashboardComponent} from './dashboard/user/user-dashboard/user-dashboard.component';
import {InitialLoginComponent} from './auth/initial-login/initial-login.component';
import {SaveUserComponent} from './user/save-user/save-user.component';
import {ViewUserComponent} from './user/view-user/view-user.component';
import {PasswordPolicyComponent} from './password-policy/password-policy.component';
import {SemesterComponent} from './semester/semester.component';
import {EditSemesterComponent} from './semester/edit-semester/edit-semester.component';
import {AddSemesterComponent} from './semester/add-semester/add-semester.component';

export const routes: Routes = [
  {path: "", component: LoginComponent},
  {path: "login", component: LoginComponent},
  {path: "initial-login", component: InitialLoginComponent},
  {path: "signup", component: SignupComponent},
  {path: "super", component:SuperAdminDashboardComponent, children: [
      {path: "add-user", component: SaveUserComponent},
      {path: "view-user", component: ViewUserComponent},
      {path: "password-policy", component: PasswordPolicyComponent},
      {path: "semester", component: SemesterComponent},
      {path: "edit", component: EditSemesterComponent},
      {path: "add", component: AddSemesterComponent},
      {path:"", component: ViewUserComponent},

    ]},
  {path: "admin", component:AdminDashboardComponent},
  {path: "user", component: UserDashboardComponent}
];
