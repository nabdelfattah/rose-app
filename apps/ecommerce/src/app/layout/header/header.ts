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
  LucideChevronDown,
  LucideClipboardList,
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
  LucideUser,
  LucideStar,
} from "@lucide/angular";

import { Popover } from "@openng/optimus-ui/popover";

import { LanguageService, ThemeService } from "@rose-app/ui";
import { Session } from "../../core/services/session";
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
import { AddressModal } from "../../shared/components/address/addresses-list/address-modal";
import { NewAddress } from "../../shared/components/address/new-address/new-address";
import { Address } from "../../shared/components/address/model/address.model";
import { selectSelectedAddress } from "../../shared/components/address/store/address.selector";
import { AddressActions } from "../../shared/components/address/store/address.actions";
import { Notifications } from "../../features/notification/notifications";
import { selectUnreadNotificationsCount } from "../../features/notification/store/notifications.selector";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [
    Notifications,
    TranslatePipe,
    AutoComplete,
    CommonModule,
    RouterLink,
    RouterLinkActive,
    FormsModule,
    Popover,
    LucideStar,
    LucideBell,
    LucideChevronDown,
    LucideClipboardList,
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
    LucideUser,
    AddressModal,
    NewAddress,
  ],
  templateUrl: "./header.html",
  styleUrl: "./header.css",
})
export class Header implements OnInit {
  @ViewChild("userPopover") userPopover?: Popover;
  @ViewChild("loginPopover") loginPopover?: Popover;
  @ViewChild(Notifications) notificationsPanel?: Notifications;

  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);
  private readonly session = inject(Session);
  private readonly router = inject(Router);
  readonly languageService = inject(LanguageService);
  readonly themeService = inject(ThemeService);

  readonly searchResults = this.store.selectSignal(selectSearchResults);

  readonly notificationsCount = this.store.selectSignal(
    selectUnreadNotificationsCount,
  );

  // my addresses modal
  addressModalVisibile = signal<boolean>(false);

  // Add New Address modal
  addAddressModalVisible = signal(false);

  // Edit Address
  selectedEditAddress = signal<Address | null>(null);

  // Selected Address
  selectedAddress = this.store.selectSignal(selectSelectedAddress);

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

  // Login Form State
  readonly loginUsername = signal("");
  readonly loginPassword = signal("");
  readonly showPassword = signal(false);
  readonly isSubmittingLogin = signal(false);
  readonly loginError = signal<string | null>(null);
  readonly activeAuthTab = signal<"login" | "register">("login");

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
      .subscribe(() => this.closeAllOverlays());
  }

  ngOnInit(): void {
    this.store.dispatch(AddressActions.loadAddresses());
  }

  // Overlay Management (Ensures only one overlay is open at a time)
  closeAllPopovers(): void {
    this.userPopover?.hide();
    this.loginPopover?.hide();
    this.notificationsPanel?.hide();
  }

  closeAllOverlays(): void {
    this.closeAllPopovers();
    this.closeMobileMenu();
  }

  toggleUserPopover(event: Event): void {
    this.loginPopover?.hide();
    this.notificationsPanel?.hide();
    this.isMobileDrawerOpen.set(false);
    this.userPopover?.toggle(event);
  }

  toggleLoginPopover(event: Event): void {
    this.userPopover?.hide();
    this.notificationsPanel?.hide();
    this.isMobileDrawerOpen.set(false);
    this.loginPopover?.toggle(event);
  }

  toggleNotificationsPopover(event: Event): void {
    this.userPopover?.hide();
    this.loginPopover?.hide();
    this.isMobileDrawerOpen.set(false);
    this.notificationsPanel?.toggle(event);
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

  // Show Addresses Modal

  onAddressModalChange(visible: boolean) {
    this.addressModalVisibile.set(visible);
  }

  openAddAddressModal() {
    this.addressModalVisibile.set(false);
    this.addAddressModalVisible.set(true);
  }

  onEdit(address: Address) {
    this.selectedEditAddress.set(address);
    this.addressModalVisibile.set(false);
    this.addAddressModalVisible.set(true);
  }
}
