import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UserState } from "../models/user-state";

const selectUserState = createFeatureSelector<UserState>("user");

const selectID = createSelector(selectUserState, (state) => state.id);
const selectRole = createSelector(selectUserState, (state) => state.role);
const selectEmail = createSelector(selectUserState, (state) => state.email);
const selectVerifiedEmail = createSelector(
  selectUserState,
  (state) => state.emailVerified,
);
const selectuserName = createSelector(
  selectUserState,
  (state) => state.username,
);
const selectFirstName = createSelector(
  selectUserState,
  (state) => state.firstName,
);
const selectLastName = createSelector(
  selectUserState,
  (state) => state.lastName,
);
const selectPhone = createSelector(selectUserState, (state) => state.phone);
const selectVerifiedPhone = createSelector(
  selectUserState,
  (state) => state.phoneVerified,
);
const selectGender = createSelector(selectUserState, (state) => state.gender);
