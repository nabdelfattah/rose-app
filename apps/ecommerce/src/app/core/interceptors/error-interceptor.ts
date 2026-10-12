import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { Router } from "@angular/router";
import { MessageService } from "@openng/optimus-ui/api";
import { catchError, throwError } from "rxjs";
import { TOKEN_KEY, USER_KEY } from "../constants/storage-keys";

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
  const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  const isAuthPage = AUTH_PATHS.some((path) => router.url.startsWith(path));

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      // if unauthorized (token expired) log the user out and redirect to /login
      if (err.status === 401 && isBrowser) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        if (!isAuthPage) router.navigate(["/login"]);
      }

      messageService.add({
        severity: "error",
        detail: err.error?.message ?? "Something went wrong!",
      });

      return throwError(() => err);
    }),
  );
};
