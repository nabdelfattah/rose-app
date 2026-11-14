export interface UserProfile {
  id: string;
  username: string;
  email: string;
  phone: string | null;
  firstName: string;
  lastName: string;
  gender: string | null;
  photo: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProfileResponse {
  status: boolean;
  code: number;
  payload: {
    user: UserProfile;
  };
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  photo?: string;
  phone?: string;
}

export interface UploadResponse {
  status: boolean;
  code: number;
  payload: {
    url: string;
  };
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  status?: boolean;
  message?: string;
}

