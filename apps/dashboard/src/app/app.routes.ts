import { Route } from "@angular/router";
import { adminGuard } from "./core/guards/admin-gaurd/admin-guard";

export const appRoutes: Route[] = [
  {
    path: "",
    canActivate: [adminGuard],
    loadComponent: () =>
      import("./layout/main-layout/main-layout").then((c) => c.MainLayout),
    data: { breadcrumb: "dashboard.sidebar.dashboard" },
    children: [
      {
        path: "",
        redirectTo: "overview",
        pathMatch: "full",
      },
      {
        path: "overview",
        loadComponent: () =>
          import("./features/overview/overview").then((c) => c.Overview),
        title: "Overview",
      },
      {
        path: "categories",
        loadComponent: () =>
          import("./features/categories/categories").then((c) => c.Categories),
        title: "Categories",
        data: { breadcrumb: "dashboard.sidebar.categories" },
      },
      {
        path: "occasions",
        loadComponent: () =>
          import("./features/occasions/occasions").then((c) => c.Occasions),
        title: "Occasions",
        data: { breadcrumb: "dashboard.sidebar.occasions" },
      },
      {
        path: "products",
        loadComponent: () =>
          import("./features/products/products").then((c) => c.Products),
        title: "Products",
        data: { breadcrumb: "dashboard.sidebar.products" },
      },
      {
        path: "account",
        loadComponent: () =>
          import("./features/account/account").then((c) => c.Account),
        title: "Account",
        data: { breadcrumb: "dashboard.sidebar.account" },
      },
    ],
  },

  // Error Pages
  {
    path: "unauthorized",
    loadComponent: () =>
      import("./pages/errors/unauthorized/unauthorized").then(
        (c) => c.Unauthorized,
      ),
    title: "Unauthorized",
  },
  {
    path: "server-error",
    loadComponent: () =>
      import("./layout/main-layout/main-layout").then((c) => c.MainLayout),
    children: [
      {
        path: "",
        loadComponent: () =>
          import("./pages/errors/server-error/server-error").then(
            (c) => c.ServerError,
          ),
        title: "Server Error",
      },
    ],
  },
  {
    path: "**",
    loadComponent: () =>
      import("./layout/main-layout/main-layout").then((c) => c.MainLayout),
    children: [
      {
        path: "",
        loadComponent: () =>
          import("./pages/errors/not-found/not-found").then((c) => c.NotFound),
        title: "Not Found",
      },
    ],
  },
];
