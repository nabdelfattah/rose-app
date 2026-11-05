import { inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { CartService } from '../service/cart.service';
import { CartActions } from './cart.actions';

export const loadCart = createEffect(
  (actions$ = inject(Actions), cartService = inject(CartService)) =>
    actions$.pipe(
      ofType(CartActions.loadCart),
      switchMap(() =>
        cartService.getCart().pipe(
          map((response) => CartActions.loadCartSuccess({ response })),
          catchError((error: HttpErrorResponse) =>
            of(
              CartActions.loadCartFailure({
                error: error.error?.message || error.message || 'Failed to load cart',
              })
            )
          )
        )
      )
    ),
  { functional: true }
);

export const updateQuantity = createEffect(
  (actions$ = inject(Actions), cartService = inject(CartService)) =>
    actions$.pipe(
      ofType(CartActions.updateQuantity),
      switchMap(({ itemId, quantity }) =>
        cartService.updateQuantity(itemId, { quantity }).pipe(
          map((response) =>
            CartActions.updateQuantitySuccess({ itemId, quantity, response })
          ),
          catchError((error: HttpErrorResponse) =>
            of(
              CartActions.updateQuantityFailure({
                error: error.error?.message || error.message || 'Failed to update quantity',
              })
            )
          )
        )
      )
    ),
  { functional: true }
);

export const removeItem = createEffect(
  (actions$ = inject(Actions), cartService = inject(CartService)) =>
    actions$.pipe(
      ofType(CartActions.removeItem),
      switchMap(({ itemId }) =>
        cartService.removeItem(itemId).pipe(
          map((response) => CartActions.removeItemSuccess({ itemId, response })),
          catchError((error: HttpErrorResponse) =>
            of(
              CartActions.removeItemFailure({
                error: error.error?.message || error.message || 'Failed to remove item',
              })
            )
          )
        )
      )
    ),
  { functional: true }
);

export const clearCart = createEffect(
  (actions$ = inject(Actions), cartService = inject(CartService)) =>
    actions$.pipe(
      ofType(CartActions.clearCart),
      switchMap(() =>
        cartService.clearCart().pipe(
          map((response) => CartActions.clearCartSuccess({ response })),
          catchError((error: HttpErrorResponse) =>
            of(
              CartActions.clearCartFailure({
                error: error.error?.message || error.message || 'Failed to clear cart',
              })
            )
          )
        )
      )
    ),
  { functional: true }
);

export const applyCoupon = createEffect(
  (actions$ = inject(Actions), cartService = inject(CartService)) =>
    actions$.pipe(
      ofType(CartActions.applyCoupon),
      switchMap(({ code }) => {
        const cleanCode = code.trim().toUpperCase();
        if (!cleanCode) {
          return of(CartActions.applyCouponFailure({ error: 'cart.coupon-invalid' }));
        }

        return cartService.searchCoupons(cleanCode).pipe(
          map((res) => {
            const list = res.payload?.data ?? [];
            const coupon = list.find(
              (c) => c.code.trim().toUpperCase() === cleanCode
            );

            if (!coupon || !coupon.isActive) {
              return CartActions.applyCouponFailure({ error: 'cart.coupon-invalid' });
            }

            const now = new Date();
            if (coupon.validFrom && new Date(coupon.validFrom) > now) {
              return CartActions.applyCouponFailure({ error: 'cart.coupon-invalid' });
            }
            if (coupon.validUntil && new Date(coupon.validUntil) < now) {
              return CartActions.applyCouponFailure({ error: 'cart.coupon-invalid' });
            }

            if (
              typeof coupon.usageLimit === 'number' &&
              typeof coupon.usedCount === 'number' &&
              coupon.usageLimit > 0 &&
              coupon.usedCount >= coupon.usageLimit
            ) {
              return CartActions.applyCouponFailure({
                error: 'cart.coupon-limit-reached',
              });
            }

            return CartActions.applyCouponSuccess({ coupon });
          }),
          catchError((error: HttpErrorResponse) =>
            of(
              CartActions.applyCouponFailure({
                error: error.error?.message || 'cart.coupon-invalid',
              })
            )
          )
        );
      })
    ),
  { functional: true }
);

