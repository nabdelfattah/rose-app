import { createActionGroup, emptyProps, props } from "@ngrx/store";
import {
  LoginPayload,
  RegisterPayload,
  VerifyEmailPayload,
  ConfirmEmailPayload,
} from "../models/payloads";
import { UserState } from "../models/user-state";

export const userActions = createActionGroup({
  source: "User",
  events: {
    Login: props<{ payload: LoginPayload }>(),
    "Login Successfully": props<{ user: Omit<UserState, "isLoading"> }>(),
    "Login Failed": props<{ error: string }>(),
    Register: props<{ payload: RegisterPayload }>(),
    "Verify Email": props<{ payload: VerifyEmailPayload }>(),
    "Verify Email Successfully": emptyProps(),
    "Verify Email Failed": props<{ error: string }>(),
    "Confirm Email": props<{ payload: ConfirmEmailPayload }>(),
    "Confirm Email Successfully": emptyProps(),
    "Confirm Email Failed": props<{ error: string }>(),
    "Register Successfully": props<{ user: Omit<UserState, "isLoading"> }>(),
    "Register Failed": props<{ error: string }>(),
    "Restore Session": props<{ user: Omit<UserState, "isLoading"> }>(),
    Logout: emptyProps(),
  },
});
