import {
  Component,
  HostListener,
  OnInit,
  ViewChild,
  computed,
  inject,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import {
  LucideBell,
  LucideBellOff,
  LucideCheck,
  LucideChevronDown,
  LucideClipboardList,
  LucideEllipsisVertical,
  LucideEye,
  LucideEyeOff,
  LucideGift,
  LucideHeadset,
  LucideHeart,
  LucideHouse,
  LucideInfo,
  LucideLayoutDashboard,
  LucideLoaderCircle,
  LucideLogOut,
  LucideMapPin,
  LucideMenu,
  LucideMoon,
  LucidePackage,
  LucidePartyPopper,
  LucideSearch,
  LucideShoppingCart,
  LucideSun,
  LucideTrash,
  LucideUser,
  LucideStar,
} from "@lucide/angular";

import { Popover } from "@openng/optimus-ui/popover";

import { LanguageService, ThemeService } from "@rose-app/ui";
import { Session } from "../../core/services/session";
import {
  NotificationItem,
  NotificationService,
} from "../../core/services/notification.service";
import { userActions } from "../../features/auth/store/user.actions";
import {
  selectFirstName,
  selectID,
  selectLoading,
  selectuserName,
  selectUserState,
} from "../../features/auth/store/user.selector";
import { selectCartItemsCount } from "../../features/cart/store/cart.selectors";
import { selectWishlistProducts } from "../../features/wishlist/store/wishlist.selector";
import { selectSearchResults } from "../../features/products/store/products.selectors";
import { ProductsActions } from "../../features/products/store/products.actions";
import { Product } from "../../features/products/model/product";
import {
  AutoComplete,
  AutoCompleteCompleteEvent,
  AutoCompleteSelectEvent,
} from "@openng/optimus-ui/autocomplete";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [
    TranslatePipe,
    AutoComplete,
    CommonModule,
    RouterLink,
    RouterLinkActive,
    FormsModule,
    Popover,
    LucideStar,
    LucideBell,
    LucideBellOff,
    LucideCheck,
    LucideChevronDown,
    LucideClipboardList,
    LucideEllipsisVertical,
    LucideEye,
    LucideEyeOff,
    LucideGift,
    LucideHeadset,
    LucideHeart,
    LucideHouse,
    LucideInfo,
    LucideLayoutDashboard,
    LucideLoaderCircle,
    LucideLogOut,
    LucideMapPin,
    LucideMenu,
    LucideMoon,
    LucidePackage,
    LucidePartyPopper,
    LucideSearch,
    LucideShoppingCart,
    LucideSun,
    LucideTrash,
    LucideUser,
  ],
  providers: [NotificationService],
  templateUrl: "./header.html",
  styleUrl: "./header.css",
})
export class Header implements OnInit {
  @ViewChild("userPopover") userPopover?: Popover;
  @ViewChild("loginPopover") loginPopover?: Popover;
  @ViewChild("notificationsPopover") notificationsPopover?: Popover;

  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);
  private readonly session = inject(Session);
  private readonly router = inject(Router);
  readonly languageService = inject(LanguageService);
  readonly themeService = inject(ThemeService);
  readonly notificationService = inject(NotificationService);

  readonly searchResults = this.store.selectSignal(selectSearchResults);

  // Auth State from NgRx Store & Session
  readonly userState = this.store.selectSignal(selectUserState);
  readonly userId = this.store.selectSignal(selectID);
  readonly userFirstName = this.store.selectSignal(selectFirstName);
  readonly userName = this.store.selectSignal(selectuserName);
  readonly isAuthLoading = this.store.selectSignal(selectLoading);
  readonly selectWishlistProducts = this.store.selectSignal(
    selectWishlistProducts,
  );
  readonly cartItemsCount = this.store.selectSignal(selectCartItemsCount);

  readonly isAuthenticated = computed(() => {
    return !!this.userId() || this.session.hasToken();
  });

  readonly displayName = computed(() => {
    const first = this.userFirstName();
    if (first) return first;
    const user = this.userName();
    if (user) return user;
    const saved = this.session.getUser();
    if (saved?.firstName) return saved.firstName;
    if (saved?.username) return saved.username;
    return "Jonathan";
  });

  readonly isArabic = computed(
    () => this.languageService.currentLang() === "ar",
  );

  //search
  onSearch(event: AutoCompleteCompleteEvent): void {
    this.store.dispatch(ProductsActions.searchProducts({ query: event.query }));
  }

  onSelect(event: AutoCompleteSelectEvent): void {
    const product = event.value as Product;
    this.closeAllOverlays();
    this.searchQuery.set("");
    this.clear();
    this.router.navigate(["/products", product.id]);
  }

  clear(): void {
    this.store.dispatch(ProductsActions.clearSearch());
  }

  // Mobile Drawer State
  readonly isMobileDrawerOpen = signal(false);

  // Notifications Row Actions Menu
  readonly activeRowMenuId = signal<string | null>(null);

  // Login Form State
  readonly loginUsername = signal("");
  readonly loginPassword = signal("");
  readonly showPassword = signal(false);
  readonly isSubmittingLogin = signal(false);
  readonly loginError = signal<string | null>(null);
  readonly activeAuthTab = signal<"login" | "register">("login");

  // Notifications State
  readonly notifications = signal<NotificationItem[]>([]);
  readonly unreadCount = signal(0);
  readonly isLoadingNotifications = signal(false);

  // Search Query (string while typing; the Product once a suggestion is picked)
  readonly searchQuery = signal<string | Product>("");

  constructor() {
    // Listen for Auth events to update local Header state
    this.actions$
      .pipe(ofType(userActions.loginSuccessfully), takeUntilDestroyed())
      .subscribe(() => {
        this.isSubmittingLogin.set(false);
        this.loginError.set(null);
        this.closeAllOverlays();
        this.loginUsername.set("");
        this.loginPassword.set("");
        this.loadNotifications();
      });

    this.actions$
      .pipe(ofType(userActions.loginFailed), takeUntilDestroyed())
      .subscribe(({ error }) => {
        this.isSubmittingLogin.set(false);
        this.loginError.set(
          error || "Login failed. Please check your credentials.",
        );
      });

    this.actions$
      .pipe(ofType(userActions.logout), takeUntilDestroyed())
      .subscribe(() => {
        this.notifications.set([]);
        this.unreadCount.set(0);
        this.closeAllOverlays();
      });
  }

  ngOnInit(): void {
    if (this.isAuthenticated()) {
      this.loadNotifications();
    }
  }

  // Overlay Management (Ensures only one overlay is open at a time)
  closeAllPopovers(): void {
    this.userPopover?.hide();
    this.loginPopover?.hide();
    this.notificationsPopover?.hide();
    this.activeRowMenuId.set(null);
  }

  closeAllOverlays(): void {
    this.closeAllPopovers();
    this.closeMobileMenu();
  }

  toggleUserPopover(event: Event): void {
    this.loginPopover?.hide();
    this.notificationsPopover?.hide();
    this.isMobileDrawerOpen.set(false);
    this.userPopover?.toggle(event);
  }

  toggleLoginPopover(event: Event): void {
    this.userPopover?.hide();
    this.notificationsPopover?.hide();
    this.isMobileDrawerOpen.set(false);
    this.loginPopover?.toggle(event);
  }

  toggleNotificationsPopover(event: Event): void {
    this.userPopover?.hide();
    this.loginPopover?.hide();
    this.isMobileDrawerOpen.set(false);
    this.notificationsPopover?.toggle(event);
    if (this.isAuthenticated()) {
      this.loadNotifications();
    }
  }

  closeMobileMenu(): void {
    this.isMobileDrawerOpen.set(false);
  }

  toggleMobileDrawer(): void {
    this.closeAllPopovers();
    this.isMobileDrawerOpen.update((open) => !open);
  }

  @HostListener("document:keydown.escape")
  onEscapeKey(): void {
    if (this.isMobileDrawerOpen()) {
      this.closeMobileMenu();
    }
  }

  toggleRowMenu(id: string, event: MouseEvent): void {
    event.stopPropagation();
    this.activeRowMenuId.update((current) => (current === id ? null : id));
  }

  // Language & Theme
  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  // Authentication Actions
  setAuthTab(tab: "login" | "register"): void {
    this.activeAuthTab.set(tab);
    if (tab === "register") {
      this.closeAllOverlays();
      this.router.navigate(["/register"]);
    }
  }

  submitLogin(): void {
    const username = this.loginUsername().trim();
    const password = this.loginPassword();

    if (!username || !password || this.isSubmittingLogin()) {
      return;
    }

    this.isSubmittingLogin.set(true);
    this.loginError.set(null);

    this.store.dispatch(
      userActions.login({
        payload: { username, password },
        rememberMe: true,
      }),
    );
  }

  logout(): void {
    this.closeAllOverlays();
    this.store.dispatch(userActions.logout());
  }

  // Notification Actions
  loadNotifications(): void {
    if (!this.isAuthenticated()) {
      this.notifications.set([]);
      this.unreadCount.set(0);
      return;
    }

    this.isLoadingNotifications.set(true);
    this.notificationService.getNotifications().subscribe({
      next: (items) => {
        this.notifications.set(items);
        this.isLoadingNotifications.set(false);
      },
      error: () => {
        this.isLoadingNotifications.set(false);
      },
    });

    this.notificationService.getUnreadCount().subscribe({
      next: (count) => {
        this.unreadCount.set(count);
      },
      error: () => {},
    });
  }

  markAllAsRead(): void {
    this.activeRowMenuId.set(null);
    this.notifications.update((items) =>
      items.map((item) => ({ ...item, isRead: true })),
    );
    this.unreadCount.set(0);
    this.notificationService.markAllAsRead().subscribe();
  }

  clearAllNotifications(): void {
    this.activeRowMenuId.set(null);
    this.notifications.set([]);
    this.unreadCount.set(0);
    this.notificationService.clearAll().subscribe();
  }

  markNotificationAsRead(item: NotificationItem, event?: MouseEvent): void {
    if (event) event.stopPropagation();
    this.activeRowMenuId.set(null);
    const id = item._id || item.id;
    if (!id) return;

    this.notifications.update((items) =>
      items.map((n) => ((n._id || n.id) === id ? { ...n, isRead: true } : n)),
    );
    this.unreadCount.update((c) => Math.max(0, c - 1));
    this.notificationService.markAsRead(id).subscribe();
  }

  deleteNotification(item: NotificationItem, event?: MouseEvent): void {
    if (event) event.stopPropagation();
    this.activeRowMenuId.set(null);
    const id = item._id || item.id;
    if (!id) return;

    const wasUnread = !item.isRead;
    this.notifications.update((items) =>
      items.filter((n) => (n._id || n.id) !== id),
    );
    if (wasUnread) {
      this.unreadCount.update((c) => Math.max(0, c - 1));
    }
    this.notificationService.deleteNotification(id).subscribe();
  }

  // Enter without picking a suggestion → go to the products listing with the query.
  // (If Enter picked a suggestion, onSelect already reset searchQuery to "".)
  onSearchSubmit(): void {
    const value = this.searchQuery();
    const query = typeof value === "string" ? value.trim() : "";
    if (query) {
      this.closeAllOverlays();
      this.clear();
      this.router.navigate(["/products"], { queryParams: { q: query } });
    }
  }
}
