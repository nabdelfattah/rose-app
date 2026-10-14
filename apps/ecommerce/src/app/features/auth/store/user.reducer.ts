import { createReducer, on } from "@ngrx/store";
import { UserState } from "../models/user-state";
import { userActions } from "./user.actions";

// the logged-out state
export const emptyUserState: UserState = {
  id: "",
  username: "",
  email: "",
  phone: "",
  firstName: "",
  lastName: "",
  gender: "",
  role: "",
  emailVerified: null,
  phoneVerified: null,
  profilePhoto: "",
  token: "",
  isLoading: false,
};

// the saved user (if any) is restored by the restoreSession effect
export const initialUserState: UserState = emptyUserState;

export const userReducer = createReducer(
  initialUserState,
  on(userActions.register, (state) => ({ ...state, isLoading: true })),
  on(userActions.registerSuccessfully, (state, { user }) => ({
    ...state,
    ...user,
    isLoading: false,
  })),
  on(userActions.registerFailed, (state) => ({ ...state, isLoading: false })),
  on(userActions.verifyEmail, (state) => ({ ...state, isLoading: true })),
  on(userActions.verifyEmailSuccessfully, (state) => ({
    ...state,
    isLoading: false,
  })),
  on(userActions.verifyEmailFailed, (state) => ({
    ...state,
    isLoading: false,
  })),

  on(userActions.confirmEmail, (state) => ({ ...state, isLoading: true })),
  on(userActions.confirmEmailSuccessfully, (state) => ({
    ...state,
    isLoading: false,
  })),
  on(userActions.confirmEmailFailed, (state) => ({
    ...state,
    isLoading: false,
  })),
  on(userActions.login, (state) => ({ ...state, isLoading: true })),
  on(userActions.loginSuccessfully, (state, { user }) => ({
    ...state,
    ...user,
    isLoading: false,
  })),
  on(userActions.loginFailed, (state) => ({ ...state, isLoading: false })),

  on(userActions.restoreSession, (state, { user }) => ({ ...state, ...user })),

  on(userActions.logout, () => emptyUserState),
);
