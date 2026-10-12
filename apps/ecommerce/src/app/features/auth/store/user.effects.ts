import { inject } from "@angular/core";
import { AuthService } from "@nabdelfattah/ngx-iam-auth";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap } from "rxjs";
import { userActions } from "./user.actions";

export const registerUser = createEffect(
  (actions$ = inject(Actions), authService = inject(AuthService)) => {
    return actions$.pipe(
      ofType(userActions.register),
      switchMap(({ payload }) =>
        authService.register(payload).pipe(
          map((user) => {
            console.log(user);
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
