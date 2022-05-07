export interface ResponseWrapper<T> {
  success: boolean;
  data?: T;
}
