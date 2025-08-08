export interface ApiResponse<T> {
  status: string;
  success: boolean;
  message: string;
  body: T
}
