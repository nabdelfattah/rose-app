import {
  ApplicationConfig,
  isDevMode,
  provideBrowserGlobalErrorListeners,
} from "@angular/core";
import { provideRouter, withComponentInputBinding } from "@angular/router";
import { appRoutes } from "./app.routes";
import {
  provideClientHydration,
  withEventReplay,
} from "@angular/platform-browser";
// essentional for ngModel of optimus UI.
import "@angular/forms";
import { provideOptimus } from "@openng/optimus-ui/config";
import Aura from "@openng/optimus-ui-themes/aura";
import { provideStoreDevtools } from "@ngrx/store-devtools";
import { provideEffects } from "@ngrx/effects";
import { provideStore } from "@ngrx/store";
import { provideTranslateService } from "@ngx-translate/core";
import { provideTranslateHttpLoader } from "@ngx-translate/http-loader";
import { provideLucideConfig } from "@lucide/angular";

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes, withComponentInputBinding()),

    provideOptimus({
      theme: {
        preset: Aura,
        options: {
          // Follow ThemeService's `.dark` class on <html> instead of the OS theme.
          darkModeSelector: ".dark",
        },
      },
    }),
    provideLucideConfig({ strokeWidth: 1.5 }),
    provideStore(),
    provideEffects(),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: "/i18n/",
        suffix: ".json",
      }),
      fallbackLang: "en",
      lang: "en",
    }),
  ],
};
