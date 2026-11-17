import { createFeatureSelector, createSelector } from "@ngrx/store";
import { NotificationsState } from "./notifications.reducer";

export const selectNotificationsState =
  createFeatureSelector<NotificationsState>("notifications");

export const selectNotifications = createSelector(
  selectNotificationsState,
  (state) => state.notifications,
);

export const selectUnreadNotificationsCount = createSelector(
  selectNotificationsState,
  (state) => state.unReadCount,
);

export const selectNotificationsError = createSelector(
  selectNotificationsState,
  (state) => state.error,
);
