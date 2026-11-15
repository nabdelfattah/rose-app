import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import {
  TranslateLoader,
  TranslationObject,
  provideTranslateService,
} from "@ngx-translate/core";
import { Menu } from "@openng/optimus-ui/menu";
import { Observable, of } from "rxjs";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

import { Notifications } from "./notifications";
import { Notification } from "./model/notifications";
import { notificationsActions } from "./store/notifications.actions";
import {
  selectNotifications,
  selectUnreadNotificationsCount,
} from "./store/notifications.selector";
import { selectID } from "../auth/store/user.selector";
import { Session } from "../../core/services/session";

class MockTranslateLoader implements TranslateLoader {
  getTranslation(): Observable<TranslationObject> {
    return of({
      notifications: {
        title: "Notifications",
        "mark-as-read": "Mark as read",
        delete: "Delete",
      },
    });
  }
}

// replace your values with some of these values
const makeNotification = (overrides: Partial<Notification> = {}) =>
  ({
    id: "n-1",
    userId: "user-1",
    type: "ORDER",
    title: "Order shipped",
    message: "Your order is on the way",
    isRead: false,
    link: "/orders/1",
    createdAt: "2026-11-01T10:00:00.000Z",
    updatedAt: "2026-11-01T10:00:00.000Z",
    ...overrides,
  }) satisfies Notification;

describe("Notifications", () => {
  let component: Notifications;
  let fixture: ComponentFixture<Notifications>;
  let store: MockStore;
  let sessionMock: { hasToken: ReturnType<typeof vi.fn> };

  // userId: the logged-in user's id in the store (null = logged out)
  const setup = async ({
    userId = "user-1" as string | null,
    hasToken = true,
  } = {}) => {
    sessionMock = { hasToken: vi.fn().mockReturnValue(hasToken) };

    await TestBed.configureTestingModule({
      imports: [Notifications],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectID, value: userId },
            { selector: selectNotifications, value: [] },
            { selector: selectUnreadNotificationsCount, value: 0 },
          ],
        }),
        provideTranslateService({
          loader: { provide: TranslateLoader, useClass: MockTranslateLoader },
          fallbackLang: "en",
        }),
        { provide: Session, useValue: sessionMock },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    // spy before the first change detection, so ngOnInit dispatches are recorded
    vi.spyOn(store, "dispatch");

    fixture = TestBed.createComponent(Notifications);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  // the row menu is a popup: don't let it touch the DOM in tests
  let showSpy: ReturnType<typeof vi.spyOn>;
  let hideSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    showSpy = vi.spyOn(Menu.prototype, "show").mockImplementation(() => {});
    hideSpy = vi.spyOn(Menu.prototype, "hide").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("on init", () => {
    it("should create", async () => {
      await setup();
      expect(component).toBeTruthy();
    });

    it("should load notifications and the unread count when userId or token exist", async () => {
      await setup({ userId: "user-1", hasToken: false });

      expect(store.dispatch).toHaveBeenCalledWith(
        notificationsActions.loadNotifications(),
      );
      expect(store.dispatch).toHaveBeenCalledWith(
        notificationsActions.getCount(),
      );
    });

    it("should not load anything when the user is logged out", async () => {
      await setup({ userId: null, hasToken: false });

      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe("row menu", () => {
    beforeEach(async () => {
      await setup();
      vi.mocked(store.dispatch).mockClear();
    });

    it("should show 'mark as read' and 'delete' for an unread notification", () => {
      const item = makeNotification({ isRead: false });
      const event = new MouseEvent("click");

      component.toggleRowMenu(item, event);

      const labels = component.rowMenuItems().map((i) => i.label);
      expect(labels).toEqual([
        "notifications.mark-as-read",
        "notifications.delete",
      ]);
      expect(component.activeRowMenuId()).toBe(item.id);
      expect(showSpy).toHaveBeenCalledWith(event);
    });

    it("should show only 'delete' for a read notification", () => {
      component.toggleRowMenu(
        makeNotification({ isRead: true }),
        new MouseEvent("click"),
      );

      const labels = component.rowMenuItems().map((i) => i.label);
      expect(labels).toEqual(["notifications.delete"]);
    });

    it("menu commands should dispatch the matching actions", () => {
      const item = makeNotification({ id: "n-9", isRead: false });
      component.toggleRowMenu(item, new MouseEvent("click"));

      const [markAsRead, remove] = component.rowMenuItems();
      markAsRead.command?.({});
      remove.command?.({});

      expect(store.dispatch).toHaveBeenCalledWith(
        notificationsActions.editItem({ id: "n-9" }),
      );
      expect(store.dispatch).toHaveBeenCalledWith(
        notificationsActions.deleteItem({ id: "n-9" }),
      );
    });
  });
});
