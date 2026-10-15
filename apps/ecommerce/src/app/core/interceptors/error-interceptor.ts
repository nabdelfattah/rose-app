import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { MessageService } from "@openng/optimus-ui/api";
import { Store } from "@ngrx/store";
import { catchError, throwError } from "rxjs";
import { userActions } from "../../features/auth/store/user.actions";

const AUTH_PATHS = [
  "/login",
  "/register",
  "/forget-password",
  "/check-email",
  "/reset-password",
];

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);
  const router = inject(Router);
  const store = inject(Store);
  const isAuthPage = AUTH_PATHS.some((path) => router.url.startsWith(path));

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      // if unauthorized (token expired) log the user out and redirect to /login
      // (skipped on auth pages: a wrong password can also return 401)
      if (err.status === 401 && !isAuthPage) {
        store.dispatch(userActions.logout());
      }

      messageService.add({
        severity: "error",
        detail: err.error?.message ?? "Something went wrong!",
      });

      return throwError(() => err);
    }),
  );
};
