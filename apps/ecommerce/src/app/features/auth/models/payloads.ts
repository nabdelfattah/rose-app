export interface LoginPayload {
  username: string;
  password: string;
}
export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
  gender?: string;
}
export interface VerifyEmailPayload {
  email: string;
}
export interface ConfirmEmailPayload {
  email: string;
  code: string;
}
export interface ForgetPasswordPayload {
  email: string;
  redirectUrl: string;
}
export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
  confirmPassword: string;
}
