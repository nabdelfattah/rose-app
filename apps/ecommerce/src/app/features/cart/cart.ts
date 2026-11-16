import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  computed,
  inject,
  signal,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { Store } from "@ngrx/store";
import {
  LucideArrowLeft,
  LucideLogIn,
  LucideMoveRight,
  LucidePhone,
  LucideShoppingCart,
  LucideTrash2,
} from "@lucide/angular";
import { TranslatePipe } from "@ngx-translate/core";
import { Button } from "@rose-app/ui";
import { Session } from "../../core/services/session";
import { CartItemComponent } from "./components/cart-item/cart-item";
import { CartSummaryComponent } from "./components/cart-summary/cart-summary";
import { ProductsYouMayLike } from "./components/products-you-may-like/products-you-may-like";
import { CartActions } from "./store/cart.actions";
import {
  selectAppliedCoupon,
  selectCartDiscount,
  selectCartError,
  selectCartItems,
  selectCartItemsCount,
  selectCartSubtotal,
  selectCartTotal,
  selectCouponError,
  selectIsCartLoading,
  selectIsCartMutating,
  selectIsCouponLoading,
} from "./store/cart.selectors";
import { PaymentStepper } from "../../shared/components/payment-stepper/payment-stepper";
import {
  selectAddresses,
  selectSelectedAddress,
} from "../../shared/components/address/store/address.selector";
import { AddressActions } from "../../shared/components/address/store/address.actions";
import { Address } from "../../shared/components/address/model/address.model";
import { AddressModal } from "../../shared/components/address/addresses-list/address-modal";
import { NewAddress } from "../../shared/components/address/new-address/new-address";
import { CreateOrderRequest } from "../orders/models/orders";
import { createOrder } from "../orders/store/orders.actions";
import { selectOrdersLoading } from "../orders/store/orders.selectors";

@Component({
  selector: "app-cart",
  standalone: true,
  imports: [
    RouterLink,
    TranslatePipe,
    Button,
    CartItemComponent,
    CartSummaryComponent,
    ProductsYouMayLike,
    PaymentStepper,
    AddressModal,
    NewAddress,
    LucideArrowLeft,
    LucideLogIn,
    LucideShoppingCart,
    LucideTrash2,
    LucidePhone,
    LucideMoveRight,
    LucideArrowLeft,
  ],
  templateUrl: "./cart.html",
  styleUrl: "./cart.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cart implements OnInit {
  private readonly store = inject(Store);
  private readonly session = inject(Session);

  readonly items = this.store.selectSignal(selectCartItems);
  readonly itemsCount = this.store.selectSignal(selectCartItemsCount);
  readonly subtotal = this.store.selectSignal(selectCartSubtotal);
  readonly discount = this.store.selectSignal(selectCartDiscount);
  readonly total = this.store.selectSignal(selectCartTotal);
  readonly appliedCoupon = this.store.selectSignal(selectAppliedCoupon);
  readonly couponError = this.store.selectSignal(selectCouponError);
  readonly isCouponLoading = this.store.selectSignal(selectIsCouponLoading);
  readonly isLoading = this.store.selectSignal(selectIsCartLoading);
  readonly isMutating = this.store.selectSignal(selectIsCartMutating);
  readonly error = this.store.selectSignal(selectCartError);

  // payment
  currentStep = signal<number>(1);
  isCheckout = signal<boolean>(false);
  paymentMethod = signal<"CASH_ON_DELIVERY" | "CREDIT_CARD">(
    "CASH_ON_DELIVERY",
  );
  isCashSelected = computed(() => this.paymentMethod() === "CASH_ON_DELIVERY");
  isCreditSelected = computed(() => this.paymentMethod() === "CREDIT_CARD");
  readonly addresses = this.store.selectSignal(selectAddresses);
  readonly selectedAddress = this.store.selectSignal(selectSelectedAddress);
  readonly selectedAddressId = signal<string>("");
  readonly selectOrderLoading = this.store.selectSignal(selectOrdersLoading);
  // Address Modal
  addressModalVisibile = signal<boolean>(false);
  addAddressModalVisible = signal(false);
  selectedEditAddress = signal<Address | null>(null);

  readonly isAuthenticated = computed(() => this.session.hasToken());

  ngOnInit(): void {
    if (this.isAuthenticated()) {
      this.store.dispatch(CartActions.loadCart());
    }
  }

  onQuantityChange(itemId: string, quantity: number): void {
    if (quantity >= 1) {
      this.store.dispatch(CartActions.updateQuantity({ itemId, quantity }));
    }
  }

  onRemoveItem(itemId: string): void {
    this.store.dispatch(CartActions.removeItem({ itemId }));
  }

  onClearCart(): void {
    this.store.dispatch(CartActions.clearCart({ source: "manual" }));
  }

  onApplyCoupon(code: string): void {
    this.store.dispatch(CartActions.applyCoupon({ code }));
  }

  onRemoveCoupon(): void {
    this.store.dispatch(CartActions.removeCoupon());
  }

  //Payment Steps
  goToCheckoutStep() {
    this.isCheckout.set(true);
  }

  selectAddress(id: string) {
    this.store.dispatch(AddressActions.selectAddress({ id }));
    this.selectedAddressId.set(id);
  }

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

  nextStep() {
    if (this.selectedAddress()) {
      this.currentStep.set(2);
    }
  }

  prevStep() {
    this.currentStep.set(1);
  }

  selectCredit() {
    this.paymentMethod.set("CREDIT_CARD");
  }
  selectCash() {
    this.paymentMethod.set("CASH_ON_DELIVERY");
  }

  placeOrder() {
    if (!this.selectedAddress() || !this.paymentMethod()) return;

    const payload: CreateOrderRequest = {
      addressId: this.selectedAddress().id,
      paymentMethod: this.paymentMethod(),
      couponCode: this.appliedCoupon()?.code ?? '',
      notes: "",
    };
    this.store.dispatch(createOrder({ payload }));
  }
}
