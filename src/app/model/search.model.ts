export interface SearchUser {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  role: string | null;
  phoneNumber: string | null;
}

export interface SearchCourse {
  name: string;
  instructor: string;
  semester: string;
}
