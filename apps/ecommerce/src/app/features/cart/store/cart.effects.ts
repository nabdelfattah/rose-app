import { inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { MessageService } from '@openng/optimus-ui/api';
import { CartService } from '../service/cart.service';
import { CartActions } from './cart.actions';
import { userActions } from '../../auth/store/user.actions';

export const addItemToCart = createEffect(
  (actions$ = inject(Actions), cartService = inject(CartService)) =>
    actions$.pipe(
      ofType(CartActions.addItemToCart),
      switchMap(({ productId, quantity }) =>
        cartService.addToCart({ productId, quantity }).pipe(
          // POST succeeds → fire addItemToCartSuccess carrying the raw response (for the message),
          // then immediately re-fetch the full cart so state is authoritative.
          switchMap((response) => [
            CartActions.addItemToCartSuccess({ response }),
            CartActions.loadCart(),
          ]),
          catchError((error: HttpErrorResponse) =>
            of(
              CartActions.addItemToCartFailure({
                error: error.error?.message || error.message || 'Failed to add item to cart',
              })
            )
          )
        )
      )
    ),
  { functional: true }
);

/** Show success toast after adding an item. Uses the API message when available. */
export const addItemToCartSuccessToast = createEffect(
  (actions$ = inject(Actions), messageService = inject(MessageService)) =>
    actions$.pipe(
      ofType(CartActions.addItemToCartSuccess),
      tap(({ response }) => {
        const detail = response?.message || 'cart.added-success';
        messageService.add({ severity: 'success', detail });
      })
    ),
  { functional: true, dispatch: false }
);

/** Show error toast when add-to-cart fails. */
export const addItemToCartFailureToast = createEffect(
  (actions$ = inject(Actions), messageService = inject(MessageService)) =>
    actions$.pipe(
      ofType(CartActions.addItemToCartFailure),
      tap(({ error }) => {
        messageService.add({ severity: 'error', detail: error || 'cart.add-failed' });
      })
    ),
  { functional: true, dispatch: false }
);

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

/** Reload the cart after the user logs in so the Navbar badge is correct immediately. */
export const loadCartOnLogin = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(userActions.loginSuccessfully),
      map(() => CartActions.loadCart())
    ),
  { functional: true }
);

