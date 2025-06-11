export const API_BASE_URL = 'http://localhost:8080/api';
export const SUPER_API_BASE_URL = API_BASE_URL + `/super`
export const API_AUTH_URL = API_BASE_URL + `/auth`;
export const SEMESTER_URL = SUPER_API_BASE_URL + `/semester`
export const PASSWORD_POLICY_URL = SUPER_API_BASE_URL + '/password'
export const COURSE_API = SUPER_API_BASE_URL + '/course';

export const AuthEndpoints = {
  LOGIN: `${API_AUTH_URL}/login`,
  CHANGE_PASSWORD: `${API_AUTH_URL}/change-password`
}

export const UserEndpoints = {
  GET_ALL_USERS : `${SUPER_API_BASE_URL}/user/list`,
  ADD_USER : `${SUPER_API_BASE_URL}/user/add`,
  UPDATE_USER : `${SUPER_API_BASE_URL}/user/update`,
  DELETE_USER : `${SUPER_API_BASE_URL}/user/delete`,
  SEARCH_USER : `${SUPER_API_BASE_URL}/user/search`
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
  UPDATE_POLICY : PASSWORD_POLICY_URL + 'update'
}

export const CourseEndpoints = {
  GET_ALL_COURSE : COURSE_API + '/list',
  ADD_COURSE : COURSE_API + '/add'
}

export const InstructorEndpoints = {
  GET_ALL : SUPER_API_BASE_URL + '/instructor/list'
}
