import { inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { CanActivateFn, Router } from "@angular/router";
import { Session } from "../services/session";

export const guestGuard: CanActivateFn = () => {
  const router = inject(Router);
  const platform = inject(PLATFORM_ID);
  const session = inject(Session);

  // cookies aren't read on the server.
  if (!isPlatformBrowser(platform)) return true;

  if (session.hasToken()) {
    return router.parseUrl("/");
  }
  return true;
};
