import {
  ApplicationConfig,
  isDevMode,
  provideBrowserGlobalErrorListeners,
} from "@angular/core";

import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { provideIamAuth } from "@nabdelfattah/ngx-iam-auth";
import { appRoutes } from "./app.routes";
import {
  provideClientHydration,
  withEventReplay,
} from "@angular/platform-browser";
import { provideEffects } from "@ngrx/effects";
import { provideState, provideStore } from "@ngrx/store";
import { provideStoreDevtools } from "@ngrx/store-devtools";
import { userReducer } from "./features/auth/store/user.reducer";
import * as userEffects from "./features/auth/store/user.effects";

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideHttpClient(),
    provideIamAuth({ baseUrl: "https://rose-app.elevate-bootcamp.cloud/api/" }),
    provideStore(),
    provideState({ name: "user", reducer: userReducer }),
    provideEffects(userEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
