import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslateLoader, TranslationObject, provideTranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Cart } from './cart';
import { CartActions } from './store/cart.actions';
import { Session } from '../../core/services/session';
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
} from './store/cart.selectors';

class MockTranslateLoader implements TranslateLoader {
  getTranslation(): Observable<TranslationObject> {
    return of({
      cart: {
        title: 'Cart',
        items: 'Items',
        item: 'Item',
        'clear-cart': 'Clear Cart',
        'continue-shopping': 'Continue Shopping',
      },
    });
  }
}

describe('Cart', () => {
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
          ],
        }),
        provideTranslateService({
          loader: { provide: TranslateLoader, useClass: MockTranslateLoader },
          fallbackLang: 'en',
        }),
        { provide: Session, useValue: sessionMock },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    vi.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(Cart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadCart on init when user is authenticated', () => {
    expect(store.dispatch).toHaveBeenCalledWith(CartActions.loadCart());
  });

  it('should dispatch updateQuantity on onQuantityChange', () => {
    component.onQuantityChange('item-1', 4);
    expect(store.dispatch).toHaveBeenCalledWith(
      CartActions.updateQuantity({ itemId: 'item-1', quantity: 4 })
    );
  });

  it('should dispatch removeItem on onRemoveItem', () => {
    component.onRemoveItem('item-1');
    expect(store.dispatch).toHaveBeenCalledWith(
      CartActions.removeItem({ itemId: 'item-1' })
    );
  });

  it('should dispatch clearCart on onClearCart', () => {
    component.onClearCart();
    expect(store.dispatch).toHaveBeenCalledWith(CartActions.clearCart());
  });

  it('should dispatch applyCoupon on onApplyCoupon', () => {
    component.onApplyCoupon('SAVE20');
    expect(store.dispatch).toHaveBeenCalledWith(
      CartActions.applyCoupon({ code: 'SAVE20' })
    );
  });

  it('should dispatch removeCoupon on onRemoveCoupon', () => {
    component.onRemoveCoupon();
    expect(store.dispatch).toHaveBeenCalledWith(CartActions.removeCoupon());
  });
});
