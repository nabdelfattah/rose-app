import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, NavigationEnd, Router } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { filter, map, startWith } from "rxjs";
import { MenuItem } from "@openng/optimus-ui/api";

interface Crumb {
  label: string;
  url: string;
}

@Injectable({ providedIn: "root" })
export class BreadcrumbService {
  private router = inject(Router);

  readonly items = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      startWith(null),
      map(() =>
        this.toMenuItems(this.build(this.router.routerState.snapshot.root)),
      ),
    ),
    { initialValue: [] as MenuItem[] },
  );

  private build(
    route: ActivatedRouteSnapshot,
    url = "",
    crumbs: Crumb[] = [],
  ): Crumb[] {
    const segment = route.url.map((s) => s.path).join("/");
    const nextUrl = segment ? `${url}/${segment}` : url;
    const label = route.routeConfig?.data?.["breadcrumb"];

    if (label) crumbs.push({ label, url: nextUrl || "/" });

    return route.firstChild
      ? this.build(route.firstChild, nextUrl, crumbs)
      : crumbs;
  }

  private toMenuItems(crumbs: Crumb[]): MenuItem[] {
    return crumbs.map((c, i) => {
      const isLast = i === crumbs.length - 1;
      return isLast
        ? { label: c.label, labelClass: "text-maroon-600" }
        : {
            label: c.label,
            routerLink: c.url,
            labelClass: "text-zinc-500 hover:text-zinc-700",
          };
    });
  }
}
