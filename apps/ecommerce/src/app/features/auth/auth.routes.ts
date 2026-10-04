import { Route } from "@angular/router";
import { Login } from "./login/login";
import { Register } from "./register/register";

export const authRoutes: Route[] = [
  {
    path: "register",
    component: Register,
  },
  {
    path: "login",
    component: Login,
  },
  {
    path: "forget-password",
    loadComponent: () =>
      import("./forget-password/forget-password").then((c) => c.ForgetPassword),
  },
  {
    path: "reset-password",
    loadComponent: () =>
      import("./reset-password/reset-password").then((c) => c.ResetPassword),
  },
];
