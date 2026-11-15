import { Component, OnInit, inject, signal, viewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import { TranslatePipe } from "@ngx-translate/core";
import { Popover } from "@openng/optimus-ui/popover";
import { Menu, MenuModule } from "@openng/optimus-ui/menu";
import { MenuItem } from "@openng/optimus-ui/api";
import {
  LucideBellOff,
  LucideCheck,
  LucideEllipsisVertical,
  LucideTrash,
} from "@lucide/angular";

import { Session } from "../../core/services/session";
import { selectID } from "../auth/store/user.selector";
import { Notification } from "./model/notifications";
import { notificationsActions } from "./store/notifications.actions";
import {
  selectNotifications,
  selectUnreadNotificationsCount,
} from "./store/notifications.selector";

@Component({
  selector: "app-notifications",
  imports: [
    Popover,
    TranslatePipe,
    LucideBellOff,
    LucideCheck,
    LucideEllipsisVertical,
    LucideTrash,
    MenuModule,
  ],
  templateUrl: "./notifications.html",
  styleUrl: "./notifications.css",
})
export class Notifications implements OnInit {
  private readonly popover = viewChild<Popover>("notificationsPopover");
  private readonly rowMenu = viewChild.required<Menu>("rowMenu");

  readonly rowMenuItems = signal<MenuItem[]>([]);
  readonly activeRowMenuId = signal<string | null>(null);

  private readonly store = inject(Store);
  private readonly session = inject(Session);

  private readonly userId = this.store.selectSignal(selectID);
  readonly notifications = this.store.selectSignal(selectNotifications);
  readonly unreadCount = this.store.selectSignal(
    selectUnreadNotificationsCount,
  );

  private isAuthenticated(): boolean {
    return !!this.userId() || this.session.hasToken();
  }

  ngOnInit(): void {
    if (this.isAuthenticated()) {
      this.store.dispatch(notificationsActions.loadNotifications());
      this.store.dispatch(notificationsActions.getCount());
    }
  }

  // Popover control (used by the header)
  toggle(event: Event): void {
    this.popover()?.toggle(event);
  }

  hide(): void {
    this.popover()?.hide();
    this.rowMenu().hide();
  }

  toggleRowMenu(item: Notification, event: MouseEvent): void {
    event.stopPropagation();

    // Same row clicked again → close
    if (this.activeRowMenuId() === item.id) {
      this.rowMenu().hide();
      return;
    }

    // Build this row's items
    this.rowMenuItems.set([
      ...(!item.isRead
        ? [
            {
              label: "notifications.mark-as-read",
              icon: "check",
              command: () => this.markNotificationAsRead(item),
            },
          ]
        : []),
      {
        label: "notifications.delete",
        icon: "trash",
        command: () => this.deleteNotification(item),
      },
    ]);

    this.activeRowMenuId.set(item.id);
    this.rowMenu().show(event);
  }

  markAllAsRead(): void {
    this.rowMenu().hide();
    this.store.dispatch(notificationsActions.editAll());
  }

  clearAllNotifications(): void {
    this.rowMenu().hide();
    this.store.dispatch(notificationsActions.deleteBulk());
  }

  markNotificationAsRead(item: Notification): void {
    this.store.dispatch(notificationsActions.editItem({ id: item.id }));
  }

  deleteNotification(item: Notification): void {
    this.store.dispatch(notificationsActions.deleteItem({ id: item.id }));
  }
}
