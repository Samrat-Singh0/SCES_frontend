export interface ApiResponse<T> {
  status: string;
  message: string;
  body: T
}
