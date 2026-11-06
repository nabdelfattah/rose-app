import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateLoader, TranslationObject, provideTranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { describe, it, expect, beforeEach } from 'vitest';
import { CartSummaryComponent } from './cart-summary';
import { Coupon } from '../../models/cart';

class MockTranslateLoader implements TranslateLoader {
  getTranslation(): Observable<TranslationObject> {
    return of({
      cart: {
        summary: 'Summary',
        'coupon-code': 'Coupon Code',
        'apply-coupon': 'Apply',
        subtotal: 'Subtotal',
        total: 'Total',
        checkout: 'Checkout',
      },
    });
  }
}

describe('CartSummaryComponent', () => {
  let component: CartSummaryComponent;
  let fixture: ComponentFixture<CartSummaryComponent>;

  const mockCoupon: Coupon = {
    id: 'c-1',
    code: 'SAVE20',
    type: 'PERCENT',
    value: 20,
    isActive: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartSummaryComponent],
      providers: [
        provideRouter([]),
        provideTranslateService({
          loader: { provide: TranslateLoader, useClass: MockTranslateLoader },
          fallbackLang: 'en',
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartSummaryComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('subtotal', 100);
    fixture.componentRef.setInput('discount', 20);
    fixture.componentRef.setInput('total', 80);
    fixture.componentRef.setInput('appliedCoupon', null);
    fixture.componentRef.setInput('couponError', null);
    fixture.componentRef.setInput('isCouponLoading', false);
    fixture.componentRef.setInput('isCheckoutDisabled', false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit applyCoupon when onApply is called with valid code', () => {
    let appliedCode = '';
    component.applyCoupon.subscribe((code) => {
      appliedCode = code;
    });

    component.couponCodeInput.set('SAVE20');
    component.onApply();
    expect(appliedCode).toBe('SAVE20');
  });

  it('should emit removeCoupon and clear input on onRemove', () => {
    fixture.componentRef.setInput('appliedCoupon', mockCoupon);
    fixture.detectChanges();

    let removed = false;
    component.removeCoupon.subscribe(() => {
      removed = true;
    });

    component.couponCodeInput.set('SAVE20');
    component.onRemove();
    expect(removed).toBe(true);
    expect(component.couponCodeInput()).toBe('');
  });
});
