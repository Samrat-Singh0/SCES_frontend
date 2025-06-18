export const API_BASE_URL = 'http://localhost:8080/api';
export const SUPER_API_BASE_URL = API_BASE_URL + `/super`;

export const SUPER_USER_API_URL = SUPER_API_BASE_URL + '/user';
export const USER_API_URL = API_BASE_URL + '/user';
export const API_AUTH_URL = API_BASE_URL + `/auth`;

export const SEMESTER_URL = SUPER_API_BASE_URL + `/semester`;
export const PASSWORD_POLICY_URL = SUPER_API_BASE_URL + '/password';
export const COURSE_API = SUPER_API_BASE_URL + '/course';
export const ENROLLMENT_API = USER_API_URL + '/enrollment';

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
  GET_SEMESTER : `${SEMESTER_URL}`,
  GET_ALL_SEMESTER: `${SEMESTER_URL}/list`,
  ADD_SEMESTER: `${SEMESTER_URL}/add`,
  UPDATE_SEMESTER: `${SEMESTER_URL}/update`,
  DELETE_SEMESTER: `${SEMESTER_URL}/delete`
}

export const PolicyEndpoints = {
  GET_ALL_POLICY : PASSWORD_POLICY_URL + `/list`,
  GET_ACTIVE_POLICY : PASSWORD_POLICY_URL + '/active',
  UPDATE_POLICY : PASSWORD_POLICY_URL + '/update'
}

export const CourseEndpoints = {
  GET_COURSE : COURSE_API,
  GET_ALL_COURSE : COURSE_API + '/list',
  ADD_COURSE : COURSE_API + '/add',
  DELETE_COURSE : COURSE_API + '/delete',
  UPDATE_COURSE : COURSE_API + '/update',
  SEARCH_COURSE : COURSE_API + "/search",
  PENDING_COURSE: COURSE_API + "/list/pending",
  GET_COURSE_BASED_ON_ROLE : COURSE_API + "/list/role"
}

export const InstructorEndpoints = {
  GET_ALL : SUPER_API_BASE_URL + '/instructor/list'
}

export const EnrollmentEndpoints = {
  GET_ALL : ENROLLMENT_API + '/list',
  ENROLL: ENROLLMENT_API + '/enroll',
  UPDATE: ENROLLMENT_API + '/update',
  GET_PENDING: ENROLLMENT_API + '/list/pending'
}
