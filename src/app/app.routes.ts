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
import {ViewCourseComponent} from './course/view-course/view-course.component';
import {SaveCourseComponent} from './course/save-course/save-course.component';
import {PendingCourseComponent} from './pending-course/pending-course.component';
import {ViewEnrollmentComponent} from './enrollment/view-enrollment/view-enrollment.component';
import {SaveEnrollmentComponent} from './enrollment/save-enrollment/save-enrollment.component';
import {PendingEnrollmentComponent} from './pending-enrollment/pending-enrollment.component';
import {ViewGradesComponent} from './grade/view-grades/view-grades.component';
import {
  ViewGradeInstructorComponent
} from './grade/view-grade-instructor/view-grade-instructor.component';
import {SaveGradeComponent} from './grade/save-grade/save-grade.component';
import {
  ViewAttendanceInstructorComponent
} from './attendance/view-attendance-instructor/view-attendance-instructor.component';
import {
  ViewAttendanceStudentComponent
} from './attendance/view-attendance-student/view-attendance-student.component';
import {SaveAttendanceComponent} from './attendance/save-attendance/save-attendance.component';
import {
  PopupMarkAttendanceComponent
} from './attendance/popup-mark-attendance/popup-mark-attendance.component';

export const routes: Routes = [
  {path: "", component: LoginComponent},
  {path: "login", component: LoginComponent},
  {path: "initial-login/:email", component: InitialLoginComponent},
  {path: "signup", component: SignupComponent},
  {path: "super", component:SuperAdminDashboardComponent, children: [
      {path: "add-user", component: SaveUserComponent},
      {path: "view-user", component: ViewUserComponent},
      {path: "password-policy", component: PasswordPolicyComponent},
      {path: "semester", component: SemesterComponent},
      {path: "edit", component: EditSemesterComponent},
      {path: "add", component: AddSemesterComponent},
      {path: "course/view", component: ViewCourseComponent},
      {path: "course/save", component: SaveCourseComponent},
      {path:"course/pending", component: PendingCourseComponent},
      {path: "enroll/view", component: ViewEnrollmentComponent},
      {path: "enroll/pending", component: PendingEnrollmentComponent},
      {path:"", component: ViewUserComponent},
    ]},
  {path: "instructor", component:AdminDashboardComponent,children:[
      {path: "grade/view", component: ViewGradeInstructorComponent},
      {path: "grade/save/:code", component: SaveGradeComponent},
      {path: "attendance/view", component: ViewAttendanceInstructorComponent},
      {path: "attendance/save/:code", component: SaveAttendanceComponent},
      {path: "attendance/mark", component: PopupMarkAttendanceComponent},
      {path: "", component: ViewGradeInstructorComponent}
    ]},

  {path: "student", component: UserDashboardComponent, children:[
      {path: "enroll/view", component: ViewEnrollmentComponent},
      {path: "enroll/save", component: SaveEnrollmentComponent},
      {path: "grade/view", component: ViewGradesComponent},
      {path: "attendance/view", component: ViewAttendanceStudentComponent},
      {path: "", component: ViewEnrollmentComponent}
    ]}
];
