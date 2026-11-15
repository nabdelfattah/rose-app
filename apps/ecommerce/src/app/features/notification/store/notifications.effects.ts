import { inject } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, of, switchMap } from "rxjs";
import { notificationsActions } from "./notifications.actions";
import { NotificationsService } from "../services/notifications.service";

// keep the store serializable: store the message, not the HttpErrorResponse
const toMessage = (error: HttpErrorResponse, fallback: string): string =>
  error.error?.message || error.message || fallback;

// GET
export const loadNotifications = createEffect(
  (
    actions$ = inject(Actions),
    notificationService = inject(NotificationsService),
  ) => {
    return actions$.pipe(
      ofType(notificationsActions.loadNotifications),
      switchMap(() => {
        return notificationService.getNotifications().pipe(
          map((res) =>
            notificationsActions.loadNotificationsSuccess({
              notifications: res.payload.data,
            }),
          ),
          catchError((err: HttpErrorResponse) =>
            of(
              notificationsActions.loadNotificationsFailure({
                error: toMessage(err, "Failed to load notifications"),
              }),
            ),
          ),
        );
      }),
    );
  },
  { functional: true },
);

// GET count
export const GetCount = createEffect(
  (
    actions$ = inject(Actions),
    notificationsService = inject(NotificationsService),
  ) => {
    return actions$.pipe(
      ofType(notificationsActions.getCount),
      switchMap(() => {
        return notificationsService.getUnreadCount().pipe(
          map((res) =>
            notificationsActions.getCountSuccess({
              count: res.payload.unreadCount,
            }),
          ),
          catchError((err: HttpErrorResponse) =>
            of(
              notificationsActions.getCountFailure({
                error: toMessage(err, "Failed to load unread count"),
              }),
            ),
          ),
        );
      }),
    );
  },
  { functional: true },
);

// Refresh the unread count after a single item changes on the server
export const refreshCount = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(
        notificationsActions.editItemSuccess,
        notificationsActions.deleteItemSuccess,
      ),
      map(() => notificationsActions.getCount()),
    );
  },
  { functional: true },
);

// Edit one (mark as read)
export const markAsRead = createEffect(
  (
    actions$ = inject(Actions),
    notificationService = inject(NotificationsService),
  ) => {
    return actions$.pipe(
      ofType(notificationsActions.editItem),
      mergeMap(({ id }) => {
        return notificationService.markAsRead(id).pipe(
          map((res) =>
            notificationsActions.editItemSuccess({
              notification: res.payload.notification,
            }),
          ),
          catchError((err: HttpErrorResponse) =>
            of(
              notificationsActions.editItemFail({
                error: toMessage(err, "Failed to mark notification as read"),
              }),
            ),
          ),
        );
      }),
    );
  },
  { functional: true },
);

// Edit All (mark all as read)
export const markAllAsRead = createEffect(
  (
    actions$ = inject(Actions),
    notificationService = inject(NotificationsService),
  ) => {
    return actions$.pipe(
      ofType(notificationsActions.editAll),
      switchMap(() => {
        return notificationService.markAllRead().pipe(
          map(() => notificationsActions.editAllSuccess()),
          catchError((err: HttpErrorResponse) =>
            of(
              notificationsActions.editAllFail({
                error: toMessage(err, "Failed to mark all as read"),
              }),
            ),
          ),
        );
      }),
    );
  },
  { functional: true },
);

// DELETE one
export const deleteNotification = createEffect(
  (
    actions$ = inject(Actions),
    notificationService = inject(NotificationsService),
  ) => {
    return actions$.pipe(
      ofType(notificationsActions.deleteItem),
      mergeMap(({ id }) => {
        return notificationService.deleteNotification(id).pipe(
          map(() => notificationsActions.deleteItemSuccess({ id })),
          catchError((err: HttpErrorResponse) =>
            of(
              notificationsActions.deleteItemFail({
                error: toMessage(err, "Failed to delete notification"),
              }),
            ),
          ),
        );
      }),
    );
  },
  { functional: true },
);

// DELETE All
export const deleteAllNotifications = createEffect(
  (
    actions$ = inject(Actions),
    notificationService = inject(NotificationsService),
  ) => {
    return actions$.pipe(
      ofType(notificationsActions.deleteBulk),
      switchMap(() => {
        return notificationService.clearNotifications().pipe(
          map(() => notificationsActions.deleteBulkSuccess()),
          catchError((err: HttpErrorResponse) =>
            of(
              notificationsActions.deleteBulkFail({
                error: toMessage(err, "Failed to clear notifications"),
              }),
            ),
          ),
        );
      }),
    );
  },
  { functional: true },
);
