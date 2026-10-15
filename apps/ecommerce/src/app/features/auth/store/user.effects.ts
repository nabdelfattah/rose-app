import { inject } from "@angular/core";
import { AuthService } from "@nabdelfattah/ngx-iam-auth";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, EMPTY, map, of, switchMap, tap } from "rxjs";
import { userActions } from "./user.actions";
import { Session } from "../../../core/services/session";
import { MessageService } from "@openng/optimus-ui/api";
import { Router } from "@angular/router";

// send the request
export const registerUser = createEffect(
  (actions$ = inject(Actions), authService = inject(AuthService)) => {
    return actions$.pipe(
      ofType(userActions.register),
      switchMap(({ payload }) =>
        authService.register(payload).pipe(
          map((user) => {
            return userActions.registerSuccessfully({ user });
          }),
          catchError((err) =>
            of(
              userActions.registerFailed({
                error:
                  err?.error?.message ?? err?.message ?? "Registration failed",
              }),
            ),
          ),
        ),
      ),
    );
  },
  { functional: true },
);

// send the request
export const logUserIn = createEffect(
  (actions$ = inject(Actions), authService = inject(AuthService)) => {
    return actions$.pipe(
      ofType(userActions.login),
      switchMap(({ payload }) =>
        authService.login(payload).pipe(
          map((user) => {
            return userActions.loginSuccessfully({ user });
          }),
          catchError((err) =>
            of(
              userActions.loginFailed({
                error: err?.error?.message ?? err?.message ?? "Login failed",
              }),
            ),
          ),
        ),
      ),
    );
  },
  { functional: true },
);

// set the token and redirect the user
export const loginRedirect = createEffect(
  (
    actions$ = inject(Actions),
    router = inject(Router),
    messageService = inject(MessageService),
    session = inject(Session),
  ) =>
    actions$.pipe(
      ofType(userActions.loginSuccessfully),
      tap(({ user }) => {
        session.save(user);
        messageService.add({
          severity: "success",
          detail: "Logged in successfully!",
        });
        router.navigate(["/"]);
      }),
    ),
  { functional: true, dispatch: false },
);

// clear the saved session and send the user to login
export const logout = createEffect(
  (
    actions$ = inject(Actions),
    router = inject(Router),
    session = inject(Session),
  ) =>
    actions$.pipe(
      ofType(userActions.logout),
      tap(() => {
        session.clear();
        router.navigate(["/login"]);
      }),
    ),
  { functional: true, dispatch: false },
);

// restore the saved user once when ecommerce loads, so a refresh doesn't empty the store
export const restoreSession = createEffect(
  (session = inject(Session)) => {
    const user = session.getUser();
    return user ? of(userActions.restoreSession({ user })) : EMPTY;
  },
  { functional: true },
);
