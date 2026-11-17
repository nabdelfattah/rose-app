import { createReducer, on } from "@ngrx/store";
import { notificationsActions } from "./notifications.actions";
import { Notification } from "../model/notifications";
import { userActions } from "../../auth/store/user.actions";

export interface NotificationsState {
  notifications: Notification[];
  unReadCount: number;
  error: string | null;
}

export const notificationsInitialState: NotificationsState = {
  notifications: [],
  unReadCount: 0,
  error: null,
};

export const notificationsReducer = createReducer(
  notificationsInitialState,

  // hide previous user's notifications after logout
  on(userActions.logout, () => notificationsInitialState),

  // GET
  on(notificationsActions.loadNotifications, (state) => ({
    ...state,
    error: null,
  })),
  on(
    notificationsActions.loadNotificationsSuccess,
    (state, { notifications }) => ({
      ...state,
      notifications,
      error: null,
    }),
  ),
  on(notificationsActions.loadNotificationsFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  // GET Count
  on(notificationsActions.getCount, (state) => ({
    ...state,
    error: null,
  })),
  on(notificationsActions.getCountSuccess, (state, { count }) => ({
    ...state,
    unReadCount: count,
    error: null,
  })),
  on(notificationsActions.getCountFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  // PATCH one
  on(notificationsActions.editItem, (state) => ({ ...state, error: null })),
  on(notificationsActions.editItemSuccess, (state, { notification }) => ({
    ...state,
    notifications: state.notifications.map((item) => {
      return item.id == notification.id ? notification : item;
    }),
    error: null,
  })),
  on(notificationsActions.editItemFail, (state, { error }) => ({
    ...state,
    error,
  })),

  // PATCH all (mark all as read)
  on(notificationsActions.editAll, (state) => ({ ...state, error: null })),
  on(notificationsActions.editAllSuccess, (state) => ({
    ...state,
    notifications: state.notifications.map((item) => ({
      ...item,
      isRead: true,
    })),
    unReadCount: 0,
    error: null,
  })),
  on(notificationsActions.editAllFail, (state, { error }) => ({
    ...state,
    error,
  })),

  // DELETE one
  on(notificationsActions.deleteItem, (state) => ({
    ...state,
    error: null,
  })),
  on(notificationsActions.deleteItemSuccess, (state, { id }) => ({
    ...state,
    notifications: state.notifications.filter((obj) => obj.id != id),
    error: null,
  })),
  on(notificationsActions.deleteItemFail, (state, { error }) => ({
    ...state,
    error,
  })),

  // DELETE bulk
  on(notificationsActions.deleteBulk, (state) => ({
    ...state,
    error: null,
  })),
  on(notificationsActions.deleteBulkSuccess, (state) => ({
    ...state,
    notifications: [],
    unReadCount: 0,
    error: null,
  })),
  on(notificationsActions.deleteBulkFail, (state, { error }) => ({
    ...state,
    error,
  })),
);
