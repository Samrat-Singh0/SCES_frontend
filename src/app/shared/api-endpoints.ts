export const API_BASE_URL = 'http://localhost:8080/api';
export const SUPER_API_BASE_URL = API_BASE_URL + `/super`;

export const SUPER_USER_API_URL = SUPER_API_BASE_URL + '/user';
export const USER_API_URL = API_BASE_URL + '/user';
export const API_AUTH_URL = API_BASE_URL + `/auth`;
export const INSTRUCTOR_API_URL = API_BASE_URL + '/instructor';

export const SEMESTER_API_URL = SUPER_API_BASE_URL + `/semester`;
export const PASSWORD_POLICY_API_URL = SUPER_API_BASE_URL + '/password';
export const COURSE_API_URL = SUPER_API_BASE_URL + '/course';
export const ENROLLMENT_API_URL = USER_API_URL + '/enrollment';
export const GRADE_API_URL = API_BASE_URL + '/grade';
export const ATTENDANCE_API_URL = API_BASE_URL + '/attendance';
export const FEE_API_URL = API_BASE_URL + '/fee';
export const REPORT_API_URL = API_BASE_URL + '/main/report';
export const ANALYTICS_API_URL = API_BASE_URL + '/main/analytics';

export const TEST_REPORT_API_URL = API_BASE_URL + '/main/report/';

export const AuthEndpoints = {
  LOGIN: `${API_AUTH_URL}/login`,
  CHANGE_PASSWORD: `${API_AUTH_URL}/change-password`
}

export const UserEndpoints = {
  GET_PAGED_USERS: `${SUPER_USER_API_URL}/paged`,
  GET_ALL_USERS : `${SUPER_USER_API_URL}/list`,
  ADD_USER : `${SUPER_USER_API_URL}/add`,
  UPDATE_USER : `${SUPER_USER_API_URL}/update`,
  DELETE_USER : `${SUPER_USER_API_URL}/delete`,
  SEARCH_USER : `${SUPER_USER_API_URL}/search`
}

export const SemesterEndpoints = {
  GET_SEMESTER : `${SEMESTER_API_URL}`,
  GET_ALL_SEMESTER: `${SEMESTER_API_URL}/list`,
  ADD_SEMESTER: `${SEMESTER_API_URL}/add`,
  UPDATE_SEMESTER: `${SEMESTER_API_URL}/update`,
  DELETE_SEMESTER: `${SEMESTER_API_URL}/delete`
}

export const PolicyEndpoints = {
  GET_ALL_POLICY : PASSWORD_POLICY_API_URL + `/list`,
  GET_ACTIVE_POLICY : PASSWORD_POLICY_API_URL + '/active',
  UPDATE_POLICY : PASSWORD_POLICY_API_URL + '/update'
}

export const CourseEndpoints = {
  GET_COURSE : COURSE_API_URL,
  GET_ALL_COURSE : COURSE_API_URL + '/list',
  ADD_COURSE : COURSE_API_URL + '/add',
  DELETE_COURSE : COURSE_API_URL + '/delete',
  UPDATE_COURSE : COURSE_API_URL + '/update',
  SEARCH_COURSE : COURSE_API_URL + "/search",
  PENDING_COURSE: COURSE_API_URL + "/list/pending",
  GET_COURSE_BASED_ON_ROLE : COURSE_API_URL + "/list/role",
  GET_PAGED_LIST: COURSE_API_URL + "/paged/list"
}

export const InstructorEndpoints = {
  GET_ALL : SUPER_API_BASE_URL + '/instructor/list'
}

export const EnrollmentEndpoints = {
  GET_ALL : ENROLLMENT_API_URL + '/list',
  ENROLL: ENROLLMENT_API_URL + '/enroll',
  UPDATE: ENROLLMENT_API_URL + '/update',
  GET_PENDING: ENROLLMENT_API_URL + '/list/pending'
}

export const StudentEndpoints = {
  GET_STUDENT_PER_COURSE: INSTRUCTOR_API_URL + "/list/student"
}

export const GradeEndpoints = {
  SAVE_GRADE : GRADE_API_URL + "/add",
  GET_GRADES_INSTRUCTOR: GRADE_API_URL + "/list/instructor",
  GET_GRADES_STUDENT: GRADE_API_URL + "/list/student"
}
export const AttendanceEndpoints = {
  GET_ATTENDANCE_TODAY: ATTENDANCE_API_URL + "/get/today",
  GET_ATTENDANCE_DATE: ATTENDANCE_API_URL + "/get/date",
  SAVE_ATTENDANCE : ATTENDANCE_API_URL + "/save",
  GET_RATE : ATTENDANCE_API_URL + '/rate'
}

export const FeeEndpoints = {
  PAY_FEE: FEE_API_URL + '/pay'
}

export const ReportEndpoints = {
  GET_COURSE_REPORT_TEST: 'http:localhost:8081/api/main/report/course',
  GET_COURSE_REPORT: REPORT_API_URL + '/course',
  GET_GRADE_REPORT: REPORT_API_URL + '/grade'
}

export const AnalyticsEndpoints = {
  GET_ANALYTICS_DATA: ANALYTICS_API_URL + '/list'
}
