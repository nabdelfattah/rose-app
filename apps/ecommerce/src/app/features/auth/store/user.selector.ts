import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UserState } from "../models/user-state";

export const selectUserState = createFeatureSelector<UserState>("user");

export const selectLoading = createSelector(
  selectUserState,
  (state) => state.isLoading,
);
export const selectID = createSelector(selectUserState, (state) => state.id);
export const selectRole = createSelector(
  selectUserState,
  (state) => state.role,
);
export const selectEmail = createSelector(
  selectUserState,
  (state) => state.email,
);
export const selectVerifiedEmail = createSelector(
  selectUserState,
  (state) => state.emailVerified,
);
export const selectuserName = createSelector(
  selectUserState,
  (state) => state.username,
);
export const selectFirstName = createSelector(
  selectUserState,
  (state) => state.firstName,
);
export const selectLastName = createSelector(
  selectUserState,
  (state) => state.lastName,
);
export const selectPhone = createSelector(
  selectUserState,
  (state) => state.phone,
);
export const selectVerifiedPhone = createSelector(
  selectUserState,
  (state) => state.phoneVerified,
);
export const selectGender = createSelector(
  selectUserState,
  (state) => state.gender,
);
