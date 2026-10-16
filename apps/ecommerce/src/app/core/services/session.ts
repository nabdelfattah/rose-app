import { inject, Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { UserState } from "../../features/auth/models/user-state";
import { TOKEN_KEY, USER_KEY } from "../constants/storage-keys";

type SavedUser = Omit<UserState, "isLoading">;

// Keeps the logged-in session in cookies.
// No expiry date => session cookies, the browser removes them when it closes.
// "Remember me" => the cookies live for REMEMBER_ME_DAYS instead.
// path "/" => readable from every route (and from both the shell and ecommerce ports).
const COOKIE_OPTIONS = { path: "/", sameSite: "Strict" as const };
const REMEMBER_ME_DAYS = 90;

@Injectable({ providedIn: "root" })
export class Session {
  private readonly cookies = inject(CookieService);

  getToken(): string {
    return this.cookies.get(TOKEN_KEY);
  }

  hasToken(): boolean {
    return this.cookies.check(TOKEN_KEY);
  }

  getUser(): SavedUser | null {
    const saved = this.cookies.get(USER_KEY);
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      return null; // broken JSON => treat as logged out
    }
  }

  save(user: SavedUser, rememberMe = false) {
    const options = rememberMe
      ? { ...COOKIE_OPTIONS, expires: REMEMBER_ME_DAYS }
      : COOKIE_OPTIONS;
    this.cookies.set(TOKEN_KEY, user.token, options);
    this.cookies.set(USER_KEY, JSON.stringify(user), options);
  }

  clear() {
    this.cookies.delete(TOKEN_KEY, "/");
    this.cookies.delete(USER_KEY, "/");
  }
}
