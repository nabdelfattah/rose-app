import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import {
  TranslateLoader,
  TranslationObject,
  provideTranslateService,
} from "@ngx-translate/core";
import { Observable, of } from "rxjs";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { Cart } from "./cart";
import { CartActions } from "./store/cart.actions";
import { Session } from "../../core/services/session";
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

import { AddressActions } from "../../shared/components/address/store/address.actions";
import {
  selectAddresses,
  selectSelectedAddress,
} from "../../shared/components/address/store/address.selector";
import { Address } from "../../shared/components/address/model/address.model";

import { createOrder } from "../orders/store/orders.actions";
import { selectOrdersLoading } from "../orders/store/orders.selectors";

class MockTranslateLoader implements TranslateLoader {
  getTranslation(): Observable<TranslationObject> {
    return of({
      cart: {
        title: "Cart",
        items: "Items",
        item: "Item",
        "clear-cart": "Clear Cart",
        "continue-shopping": "Continue Shopping",
      },
    });
  }
}

describe("Cart", () => {
  let component: Cart;
  let fixture: ComponentFixture<Cart>;
  let store: MockStore;
  let sessionMock: { hasToken: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    sessionMock = {
      hasToken: vi.fn().mockReturnValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [Cart],
      providers: [
        provideRouter([]),
        provideMockStore({
          selectors: [
            { selector: selectCartItems, value: [] },
            { selector: selectCartItemsCount, value: 0 },
            { selector: selectCartSubtotal, value: 0 },
            { selector: selectCartDiscount, value: 0 },
            { selector: selectCartTotal, value: 0 },
            { selector: selectAppliedCoupon, value: null },
            { selector: selectCouponError, value: null },
            { selector: selectIsCouponLoading, value: false },
            { selector: selectIsCartLoading, value: false },
            { selector: selectIsCartMutating, value: false },
            { selector: selectCartError, value: null },
            { selector: selectAddresses, value: [] },
            { selector: selectSelectedAddress, value: null },
            { selector: selectOrdersLoading, value: false },
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
    vi.spyOn(store, "dispatch");

    fixture = TestBed.createComponent(Cart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should dispatch loadCart on init when user is authenticated", () => {
    expect(store.dispatch).toHaveBeenCalledWith(CartActions.loadCart());
  });

  it("should dispatch updateQuantity on onQuantityChange", () => {
    component.onQuantityChange("item-1", 4);
    expect(store.dispatch).toHaveBeenCalledWith(
      CartActions.updateQuantity({ itemId: "item-1", quantity: 4 }),
    );
  });

  it("should dispatch removeItem on onRemoveItem", () => {
    component.onRemoveItem("item-1");
    expect(store.dispatch).toHaveBeenCalledWith(
      CartActions.removeItem({ itemId: "item-1" }),
    );
  });

  it("should dispatch clearCart on onClearCart", () => {
    component.onClearCart();
    expect(store.dispatch).toHaveBeenCalledWith(
      CartActions.clearCart({ source: "manual" }),
    );
  });

  it("should dispatch applyCoupon on onApplyCoupon", () => {
    component.onApplyCoupon("SAVE20");
    expect(store.dispatch).toHaveBeenCalledWith(
      CartActions.applyCoupon({ code: "SAVE20" }),
    );
  });

  it("should dispatch removeCoupon on onRemoveCoupon", () => {
    component.onRemoveCoupon();
    expect(store.dispatch).toHaveBeenCalledWith(CartActions.removeCoupon());
  });

  // Payment
  it("should initialize checkout when goToCheckoutStep is called", () => {
    component.goToCheckoutStep();

    expect(component.isCheckout()).toBe(true);
  });

  it("should move to payment step when an address is selected", () => {
    const address = { id: "address-1" } as Address;

    store.overrideSelector(selectSelectedAddress, address);
    store.refreshState();

    component.nextStep();

    expect(component.currentStep()).toBe(2);
  });

  it("should not move to payment step when no address is selected", () => {
    component.nextStep();
    expect(component.currentStep()).toBe(1);
  });

  it("should return to address step when prevStep is called", () => {
    component.currentStep.set(2);
    component.prevStep();
    expect(component.currentStep()).toBe(1);
  });

  // Address
  it("should dispatch selectAddress and update selectedAddressId", () => {
    component.selectAddress("address-1");

    expect(store.dispatch).toHaveBeenCalledWith(
      AddressActions.selectAddress({ id: "address-1" }),
    );

    expect(component.selectedAddressId()).toBe("address-1");
  });

  it("should open add address modal", () => {
    component.addressModalVisibile.set(true);
    component.openAddAddressModal();
    expect(component.addressModalVisibile()).toBe(false);
    expect(component.addAddressModalVisible()).toBe(true);
  });

  it("should open edit address modal with selected address", () => {
    const address = { id: "address-1" } as Address;
    component.addressModalVisibile.set(true);
    component.onEdit(address);
    expect(component.selectedEditAddress()).toEqual(address);
    expect(component.addressModalVisibile()).toBe(false);
    expect(component.addAddressModalVisible()).toBe(true);
  });

  it("should update address modal visibility", () => {
    component.onAddressModalChange(true);
    expect(component.addressModalVisibile()).toBe(true);
  });

  // Payment Method
  it("should initialize with cash on delivery as default payment method", () => {
    expect(component.paymentMethod()).toBe("CASH_ON_DELIVERY");
    expect(component.isCashSelected()).toBe(true);
    expect(component.isCreditSelected()).toBe(false);
  });

  it("should select credit card payment method", () => {
    component.selectCredit();
    expect(component.paymentMethod()).toBe("CREDIT_CARD");
    expect(component.isCreditSelected()).toBe(true);
    expect(component.isCashSelected()).toBe(false);
  });

  it("should select cash on delivery payment method", () => {
    component.selectCredit();
    component.selectCash();
    expect(component.paymentMethod()).toBe("CASH_ON_DELIVERY");
    expect(component.isCashSelected()).toBe(true);
    expect(component.isCreditSelected()).toBe(false);
  });

  // Place Order Method
  it("should dispatch createOrder with correct payload", () => {
    const address = { id: "address-1" } as Address;
    store.overrideSelector(selectSelectedAddress, address);
    store.refreshState();
    component.selectCredit();
    component.placeOrder();
    expect(store.dispatch).toHaveBeenCalledWith(
      createOrder({
        payload: {
          addressId: "address-1",
          paymentMethod: "CREDIT_CARD",
          couponCode: "",
          notes: "",
        },
      }),
    );
  });

});
