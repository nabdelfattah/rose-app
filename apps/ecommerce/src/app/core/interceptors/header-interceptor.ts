import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Session } from "../services/session";
import { Language } from "@rose-app/ui";

export const headerInterceptor: HttpInterceptorFn = (req, next) => {
  const session = inject(Session);
  const lang: Language = "en";
  const token = session.getToken(); // returns "" on the server, so no header is added there
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}`, "Accept-Language": lang },
    });
  }
  return next(req);
};
