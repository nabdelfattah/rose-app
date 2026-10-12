import { inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { CanActivateFn, Router } from "@angular/router";
import { TOKEN_KEY } from "../constants/storage-keys";

export const guestGuard: CanActivateFn = () => {
  const router = inject(Router);

  // session storage doesn't exist on the server, let the browser decide
  if (!isPlatformBrowser(inject(PLATFORM_ID))) return true;

  // TODO: get it from session storage
  if (localStorage.getItem(TOKEN_KEY)) {
    return router.parseUrl("/");
  }
  return true;
};
