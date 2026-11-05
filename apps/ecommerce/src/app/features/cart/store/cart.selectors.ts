import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState } from './cart.reducer';

export const selectCartState = createFeatureSelector<CartState>('cart');

export const selectCartItems = createSelector(
  selectCartState,
  (state) => state?.items ?? []
);

export const selectCartItemsCount = createSelector(
  selectCartItems,
  (items) => items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0)
);

export const selectCartSubtotal = createSelector(
  selectCartItems,
  (items) => {
    return items.reduce((sum, item) => {
      const price = Number(item.product?.price ?? item.price ?? 0);
      const qty = Number(item.quantity) || 1;
      return sum + (Number.isFinite(price) ? price * qty : 0);
    }, 0);
  }
);

export const selectAppliedCoupon = createSelector(
  selectCartState,
  (state) => state?.appliedCoupon ?? null
);

export const selectCouponError = createSelector(
  selectCartState,
  (state) => state?.couponError ?? null
);

export const selectIsCouponLoading = createSelector(
  selectCartState,
  (state) => state?.isCouponLoading ?? false
);

export const selectCartDiscount = createSelector(
  selectCartSubtotal,
  selectAppliedCoupon,
  (subtotal, coupon) => {
    if (!coupon || !coupon.isActive) return 0;

    const minPurchase = Number(coupon.minPurchase);
    if (Number.isFinite(minPurchase) && minPurchase > 0 && subtotal < minPurchase) {
      return 0;
    }

    const value = Number(coupon.value);
    if (!Number.isFinite(value) || value <= 0) return 0;

    let discount = 0;
    if (coupon.type === 'PERCENT') {
      discount = (subtotal * value) / 100;
      const maxDiscount = Number(coupon.maxDiscount);
      if (Number.isFinite(maxDiscount) && maxDiscount > 0) {
        discount = Math.min(discount, maxDiscount);
      }
    } else if (coupon.type === 'FIXED') {
      discount = Math.min(subtotal, value);
    }

    return Math.max(0, discount);
  }
);

export const selectCartTotal = createSelector(
  selectCartSubtotal,
  selectCartDiscount,
  (subtotal, discount) => Math.max(0, subtotal - discount)
);

export const selectIsCartLoading = createSelector(
  selectCartState,
  (state) => state?.isLoading ?? false
);

export const selectIsCartMutating = createSelector(
  selectCartState,
  (state) => state?.isMutating ?? false
);

export const selectCartError = createSelector(
  selectCartState,
  (state) => state?.error ?? null
);

