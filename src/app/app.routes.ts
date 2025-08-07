import {Routes} from '@angular/router';
import {LoginComponent} from './auth/login/login.component';
import {SignupComponent} from './auth/signup/signup.component';
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
import {PendingEnrollmentComponent} from './pending-enrollment/pending-enrollment.component';
import {ViewGradesComponent} from './grade/view-grades/view-grades.component';
import {SaveGradeComponent} from './grade/save-grade/save-grade.component';
import {
  ViewAttendanceInstructorComponent
} from './attendance/view-attendance-instructor/view-attendance-instructor.component';
import {
  ViewAttendanceStudentComponent
} from './attendance/view-attendance-student/view-attendance-student.component';
import {
  PopupMarkAttendanceComponent
} from './attendance/popup-mark-attendance/popup-mark-attendance.component';
import {AnalyticComponent} from './analytic/analytic.component';
import {AttendanceComponent} from './attendance/attendance.component';
import {RoleComponent} from './role/role.component';
import {
  ViewGradesInstructorComponent
} from './grade/view-grades-instructor/view-grades-instructor.component';
import {DashboardComponent} from './dashboard/dashboard.component';

export const routes: Routes = [
  {path: "", component: LoginComponent},
  {path: "login", component: LoginComponent},
  {path: "initial-login/:email", component: InitialLoginComponent},
  {path: "signup", component: SignupComponent},
  {path: "super", component:DashboardComponent, children: [
      {path: "role", component: RoleComponent},
      {path: "user/add", component: SaveUserComponent},
      {path: "user", component: ViewUserComponent},
      {path: "password-policy", component: PasswordPolicyComponent},
      {path: "semester", component: SemesterComponent},
      {path: "semester/edit", component: EditSemesterComponent},
      {path: "semester/edit/:label", component: AddSemesterComponent},
      {path: "semester/add", component: AddSemesterComponent},
      {path: "course", component: ViewCourseComponent},
      {path: "course/save", component: SaveCourseComponent},
      {path:"pending/course", component: PendingCourseComponent},
      {path: "enroll", component: ViewEnrollmentComponent},
      {path: "pending/enroll", component: PendingEnrollmentComponent},
      {path: "view/grade", component: ViewGradesComponent},
      {path: "manage/grade", component: ViewGradesInstructorComponent},
      {path: "grade/save/:label/:code", component: SaveGradeComponent},
      {path: "view/attendance", component: ViewAttendanceStudentComponent},
      {path: "manage/attendance", component: AttendanceComponent},
      {path: "attendance/save/:code", component: ViewAttendanceInstructorComponent},
      {path: "attendance/mark", component: PopupMarkAttendanceComponent},
      {path: "analytic", component: AnalyticComponent},
      {path: "", component: AnalyticComponent}
    ]}
];
