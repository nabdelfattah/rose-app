import {
  Component,
  computed,
  ElementRef,
  inject,
  input,
  signal,
} from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import {
  LucideUser,
  LucideLogOut,
  LucideEllipsisVertical,
  LucideMenu,
  LucideX,
} from "@lucide/angular";
import { Session } from "../../../core/services/session";

@Component({
  selector: "app-user-menu",
  imports: [
    RouterLink,
    LucideUser,
    LucideLogOut,
    LucideEllipsisVertical,
    LucideMenu,
    LucideX,
  ],
  templateUrl: "./user-menu.html",
  styleUrl: "./user-menu.css",
})
export class UserMenu {
  private readonly session = inject(Session);
  private readonly router = inject(Router);
  private host = inject<ElementRef<HTMLElement>>(ElementRef);

  firstName = input<string | undefined>();
  lastName = input<string | undefined>();
  email = input<string | undefined>();
  userPhoto = input<string | null>();
  variant = input<"sidebar" | "navbar">("sidebar");
  menuOpen = signal(false);

  userCharacters = computed(() => {
    const first = this.firstName()?.trim().charAt(0) ?? "";
    const last = this.lastName()?.trim().charAt(0) ?? "";

    return `${first}${last}`.toUpperCase();
  });

  toggleMenu() {
    this.menuOpen.update((v) => !v);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }

  logout() {
    this.session.clear();
    this.router.navigateByUrl("/login");
  }

  onDocumentClick(e: MouseEvent) {
    if (!this.host.nativeElement.contains(e.target as Node)) {
      this.closeMenu();
    }
  }

  panelClasses() {
    const open = this.menuOpen();
    const base =
      "absolute z-50 rounded-2xl border border-zinc-200 bg-white shadow-lg transition duration-300 ease-out";

    if (this.variant() === "sidebar") {
      return `${base} bottom-full inset-s-1/2 -translate-x-1/2 mb-2 w-[80%] origin-bottom ${
        open
          ? "translate-y-0 scale-100 opacity-100"
          : "pointer-events-none translate-y-4 scale-95 opacity-0"
      }`;
    }

    return `${base} end-0 top-full mt-2 w-48 origin-top-right ${
      open
        ? "translate-y-0 scale-100 opacity-100"
        : "pointer-events-none -translate-y-2 scale-95 opacity-0"
    }`;
  }
}
