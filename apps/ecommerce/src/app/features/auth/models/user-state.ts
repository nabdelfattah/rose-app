export interface UserState {
  id: string;
  username: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  gender?: string;
  role: string;
  emailVerified: boolean | null;
  phoneVerified: boolean | null;
  token: string;
  profilePhoto?: string;
  isLoading: boolean;
}
