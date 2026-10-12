import { createReducer, on } from "@ngrx/store";
import { UserState } from "../models/user-state";
import { userActions } from "./user.actions";
import { USER_KEY } from "../../../core/constants/storage-keys";

// the logged-out state, used by logout
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

// start from the saved user (if any) so a refresh doesn't empty the store
function loadUserFromStorage(): UserState {
  // localStorage doesn't exist on the server
  if (typeof localStorage === "undefined") return emptyUserState;
  try {
    const saved = localStorage.getItem(USER_KEY);
    return saved
      ? { ...emptyUserState, ...JSON.parse(saved), isLoading: false }
      : emptyUserState;
  } catch {
    return emptyUserState; // of broken JSON => treat as logged out
  }
}

export const initialUserState: UserState = loadUserFromStorage();

export const userReducer = createReducer(
  initialUserState,
  on(userActions.register, (state) => ({ ...state, isLoading: true })),
  on(userActions.registerSuccessfully, (state, { user }) => ({
    ...state,
    ...user,
    isLoading: false,
  })),
  on(userActions.loginFailed, (state) => ({ ...state, isLoading: false })),

  on(userActions.login, (state) => ({ ...state, isLoading: true })),
  on(userActions.loginSuccessfully, (state, { user }) => ({
    ...state,
    ...user,
    isLoading: false,
  })),
  on(userActions.loginFailed, (state) => ({ ...state, isLoading: false })),

  on(userActions.logout, () => emptyUserState),
);
