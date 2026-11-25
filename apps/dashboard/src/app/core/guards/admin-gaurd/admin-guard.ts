import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { Session } from "../../services/session";

export const adminGuard: CanActivateFn = () => {
  const session = inject(Session);
  const router = inject(Router);

  const user = session.getUser();

  if (session.hasToken() && user?.role === "ADMIN") {
    return true;
  }

  return router.createUrlTree(["/dashboard/unauthorized"]);
};