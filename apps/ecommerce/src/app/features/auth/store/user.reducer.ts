import { createReducer, on } from "@ngrx/store";
import { UserState } from "../models/user-state";
import { userActions } from "./user.actions";

export const initialUserState: UserState = {
  id: "",
  username: "",
  email: "",
  phone: "",
  firstName: "",
  lastName: "",
  gender: "FEMALE",
  role: "USER",
  emailVerified: null,
  phoneVerified: null,
  profilePhoto: "",
  token: "",
};

export const userReducer = createReducer(
  initialUserState,
  on(userActions.registerSuccessfully, (state, { user }) => ({
    ...state,
    ...user,
  })),
);
