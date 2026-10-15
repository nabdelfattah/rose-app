import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { LoginPayload, RegisterPayload } from "../models/payloads";
import { UserState } from "../models/user-state";

export const userActions = createActionGroup({
  source: "User",
  events: {
    Login: props<{ payload: LoginPayload }>(),
    "Login Successfully": props<{ user: Omit<UserState, "isLoading"> }>(),
    "Login Failed": props<{ error: string }>(),
    Register: props<{ payload: RegisterPayload }>(),
    "Register Successfully": props<{ user: Omit<UserState, "isLoading"> }>(),
    "Register Failed": props<{ error: string }>(),
    "Restore Session": props<{ user: Omit<UserState, "isLoading"> }>(),
    Logout: emptyProps(),
  },
});
