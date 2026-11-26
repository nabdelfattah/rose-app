import { Component, inject } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import {
  LucideFlower,
  LucideCalendarHeart,
  LucideClipboardList,
  LucideLayoutDashboard,
  LucidePackage,
} from "@lucide/angular";
import { UserMenu } from "../../shared/components/user-menu/user-menu";
import { Session } from "../../core/services/session";
import { TranslatePipe } from "@ngx-translate/core";
@Component({
  selector: "app-sidebar",
  imports: [
    RouterLink,
    RouterLinkActive,
    UserMenu,
    LucideFlower,
    LucideLayoutDashboard,
    LucideClipboardList,
    LucideCalendarHeart,
    LucidePackage,
    TranslatePipe
  ],
  templateUrl: "./sidebar.html",
  styleUrl: "./sidebar.css",
})
export class Sidebar {

  private readonly session = inject(Session);

  readonly user = this.session.getUser();
}
