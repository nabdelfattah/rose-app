import { inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { CanActivateFn, Router } from "@angular/router";
import { TOKEN_KEY } from "../constants/storage-keys";

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  // session storage doesn't exist on the server, let the browser decide
  if (!isPlatformBrowser(inject(PLATFORM_ID))) return true;

  // TODO: get it from session storage
  if (localStorage.getItem(TOKEN_KEY)) {
    return true;
  }
  // stop the current routing and navigate the user to /login
  return router.parseUrl("/login");
};
