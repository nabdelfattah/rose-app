import { Route } from "@angular/router";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { AuthService, provideIamAuth } from "@nabdelfattah/ngx-iam-auth";
import { provideState } from "@ngrx/store";
import { provideEffects } from "@ngrx/effects";
import { MessageService } from "@openng/optimus-ui/api";
import { provideTranslateService } from "@ngx-translate/core";
import { provideTranslateHttpLoader } from "@ngx-translate/http-loader";
import { LanguageService } from "@rose-app/ui";
import { Home } from "./features/home/home";
import { MainLayout } from "./layout/main-layout/main-layout";
import { AuthLayout } from "./layout/auth-layout/auth-layout";
import { EcommerceRoot } from "./layout/ecommerce-root/ecommerce-root";
import { authGuard } from "./core/guards/auth-guard";
import { guestGuard } from "./core/guards/guest-guard";
import { headerInterceptor } from "./core/interceptors/header-interceptor";
import { errorInterceptor } from "./core/interceptors/error-interceptor";
import { userReducer } from "./features/auth/store/user.reducer";
import * as userEffects from "./features/auth/store/user.effects";
import { productsReducer } from "./features/products/store/products.reducer";
import * as productsEffects from "./features/products/store/products.effects";
import { ReviewsService } from "./features/products/service/reviews.service";
import {
  ngxSpinnerInterceptor,
  provideNgxSpinnerHttpConfig,
} from "ngx-spinner";

export const appRoutes: Route[] = [
  {
    path: "",
    component: EcommerceRoot,
    // every provider from ecommerce needs to live here to work both inside the shell and ecommerce.
    providers: [
      provideHttpClient(
        withInterceptors([
          errorInterceptor,
          headerInterceptor,
          ngxSpinnerInterceptor,
        ]),
      ),
      provideNgxSpinnerHttpConfig({ spinner: { type: "ball-scale-multiple" } }),
      provideIamAuth({
        baseUrl: "https://rose-app.elevate-bootcamp.cloud/api/",
      }),
      // Providing AuthService here creates it in this route's injector, so it uses the HttpClient + interceptors above.
      AuthService,
      // The reviews endpoints need the token from headerInterceptor.
      ReviewsService,
      provideState({ name: "user", reducer: userReducer }),
      provideEffects(userEffects),
      provideState({ name: "products", reducer: productsReducer }),
      provideEffects(productsEffects),
      MessageService,
      // Translation
      provideTranslateService({
        loader: provideTranslateHttpLoader({
          prefix: "/i18n/",
          suffix: ".json",
        }),
        fallbackLang: "en",
        lang: "en",
      }),
      // LanguageService is here as it uses TranslateService
      LanguageService,
    ],
    children: [
      {
        path: "",
        component: MainLayout,
        // canActivate: [authGuard],
        children: [
          { path: "", component: Home, pathMatch: "full" },
          {
            path: "account",
            loadComponent: () =>
              import("./features/account/account").then((c) => c.Account),
          },
          {
            path: "cart",
            loadComponent: () =>
              import("./features/cart/cart").then((c) => c.Cart),
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
            path: "products/:id",
            loadComponent: () =>
              import("./features/products/pages/product-details/product-details").then(
                (c) => c.ProductDetails,
              ),
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
        canActivate: [guestGuard],
        loadChildren: () =>
          import("./features/auth/auth.routes").then((c) => c.authRoutes),
      },
      {
        path: "**",
        loadComponent: () =>
          import("./features/not-found/not-found").then((c) => c.NotFound),
      },
    ],
  },
];
