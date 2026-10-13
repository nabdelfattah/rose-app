import { inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { CanActivateFn, Router } from "@angular/router";
import { Session } from "../services/session";

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const platform = inject(PLATFORM_ID);
  const session = inject(Session);

  // cookies aren't read on the serve
  if (!isPlatformBrowser(platform)) return true;

  if (session.hasToken()) {
    return true;
  }
  // stop the current routing and navigate the user to /login
  return router.parseUrl("/login");
};
