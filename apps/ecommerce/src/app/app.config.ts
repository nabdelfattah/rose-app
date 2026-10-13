import {
  ApplicationConfig,
  isDevMode,
  provideBrowserGlobalErrorListeners,
} from "@angular/core";

import { provideRouter } from "@angular/router";
import { appRoutes } from "./app.routes";
import {
  provideClientHydration,
  withEventReplay,
} from "@angular/platform-browser";
import { provideStore } from "@ngrx/store";
import { provideStoreDevtools } from "@ngrx/store-devtools";
import { provideTranslateService } from "@ngx-translate/core";
import { provideTranslateHttpLoader } from "@ngx-translate/http-loader";

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideStore(),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideTranslateService({
      loader:provideTranslateHttpLoader({
        prefix:"/i18n/",
        suffix: ".json",
      }),
      fallbackLang:"en",
      lang:"en"
    }),
  ],
};
