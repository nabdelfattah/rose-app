import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { LoginPayload, RegisterPayload } from "../models/payloads";
import { UserState } from "../models/user-state";

export const userActions = createActionGroup({
  source: "User",
  events: {
    Login: props<{ payload: LoginPayload }>(),
    Register: props<{ payload: RegisterPayload }>(),
    "Register Successfully": props<{ user: UserState }>(),
    "Register Failed": props<{ error: string }>(),
    Logout: emptyProps(),
  },
});
