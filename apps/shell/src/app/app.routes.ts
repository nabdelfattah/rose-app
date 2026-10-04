import { loadRemoteModule } from "@angular-architects/native-federation";
import { Route } from "@angular/router";

export const appRoutes: Route[] = [
  {
    path: "",
    loadChildren: () =>
      typeof window === "undefined"
        ? //لو إحنا على الـ Server، متحاولش تحمّل routes بتاعة ecommerce باستخدام Module Federation؛ اقبل أي URL، رجّع الـ Shell، وسيب الـ Browser هو اللي يحمّل الـ remote ويحدد الـ route الصحيح.
          Promise.resolve([{ path: "**", children: [] }])
        : loadRemoteModule("ecommerce", "./routes").then((m) => m.appRoutes),
  },
];
