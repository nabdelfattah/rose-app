import { Route } from "@angular/router";
import { Home } from "./features/home/home";
import { MainLayout } from "./layout/main-layout/main-layout";
import { AuthLayout } from "./layout/auth-layout/auth-layout";

export const appRoutes: Route[] = [
  {
    path: "",
    component: MainLayout,
    children: [
      { path: "", component: Home, pathMatch: "full" },
      {
        path: "account",
        loadComponent: () =>
          import("./features/account/account").then((c) => c.Account),
      },
      {
        path: "cart",
        loadComponent: () => import("./features/cart/cart").then((c) => c.Cart),
      },
      {
        path: "checkout",
        loadComponent: () =>
          import("./features/checkout/checkout").then((c) => c.Checkout),
      },
      {
        path: "orders",
        loadComponent: () =>
          import("./features/orders/orders").then((c) => c.Orders),
      },
      {
        path: "products",
        loadComponent: () =>
          import("./features/products/products").then((c) => c.Products),
      },
      {
        path: "wishlist",
        loadComponent: () =>
          import("./features/wishlist/wishlist").then((c) => c.Wishlist),
      },
    ],
  },
  {
    path: "",
    component: AuthLayout,
    loadChildren: () =>
      import("./features/auth/auth.routes").then((c) => c.authRoutes),
  },
  {
    path: "**",
    loadComponent: () =>
      import("./features/not-found/not-found").then((c) => c.NotFound),
  },
];
