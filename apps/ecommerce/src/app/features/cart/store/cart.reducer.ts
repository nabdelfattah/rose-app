import { createReducer, on } from '@ngrx/store';
import { CartItem, Coupon, extractCartItems } from '../models/cart';
import { CartActions } from './cart.actions';

export interface CartState {
  items: CartItem[];
  appliedCoupon: Coupon | null;
  couponError: string | null;
  isCouponLoading: boolean;
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;
}

export const initialCartState: CartState = {
  items: [],
  appliedCoupon: null,
  couponError: null,
  isCouponLoading: false,
  isLoading: false,
  isMutating: false,
  error: null,
};

export const cartReducer = createReducer(
  initialCartState,

  // Add Item To Cart
  on(CartActions.addItemToCart, (state) => ({
    ...state,
    isMutating: true,
    error: null,
  })),
  on(CartActions.addItemToCartSuccess, (state) => ({
    // State is refreshed by the subsequent loadCart dispatched from the effect.
    // Here we only clear the mutating flag.
    ...state,
    isMutating: false,
    error: null,
  })),
  on(CartActions.addItemToCartFailure, (state, { error }) => ({
    ...state,
    isMutating: false,
    error,
  })),

  // Load Cart
  on(CartActions.loadCart, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(CartActions.loadCartSuccess, (state, { response }) => {
    const items = extractCartItems(response.payload);
    return {
      ...state,
      items,
      isLoading: false,
      error: null,
    };
  }),
  on(CartActions.loadCartFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Update Quantity
  on(CartActions.updateQuantity, (state) => ({
    ...state,
    isMutating: true,
  })),
  on(CartActions.updateQuantitySuccess, (state, { itemId, quantity, response }) => {
    let items = state.items;
    if (response?.payload) {
      const extracted = extractCartItems(response.payload);
      if (extracted.length > 0) {
        items = extracted;
      } else {
        items = state.items.map((it) =>
          it.id === itemId ? { ...it, quantity } : it
        );
      }
    } else {
      items = state.items.map((it) =>
        it.id === itemId ? { ...it, quantity } : it
      );
    }

    return {
      ...state,
      items,
      isMutating: false,
    };
  }),
  on(CartActions.updateQuantityFailure, (state, { error }) => ({
    ...state,
    isMutating: false,
    error,
  })),

  // Remove Item
  on(CartActions.removeItem, (state) => ({
    ...state,
    isMutating: true,
  })),
  on(CartActions.removeItemSuccess, (state, { itemId, response }) => {
    let items = state.items.filter((it) => it.id !== itemId);
    if (response?.payload) {
      const extracted = extractCartItems(response.payload);
      if (extracted) {
        items = extracted;
      }
    }

    return {
      ...state,
      items,
      isMutating: false,
    };
  }),
  on(CartActions.removeItemFailure, (state, { error }) => ({
    ...state,
    isMutating: false,
    error,
  })),

  // Clear Cart
  on(CartActions.clearCart, (state) => ({
    ...state,
    isMutating: true,
  })),
  on(CartActions.clearCartSuccess, (state) => ({
    ...state,
    items: [],
    appliedCoupon: null,
    couponError: null,
    isMutating: false,
  })),
  on(CartActions.clearCartFailure, (state, { error }) => ({
    ...state,
    isMutating: false,
    error,
  })),

  // Coupon
  on(CartActions.applyCoupon, (state) => ({
    ...state,
    isCouponLoading: true,
    couponError: null,
  })),
  on(CartActions.applyCouponSuccess, (state, { coupon }) => ({
    ...state,
    appliedCoupon: coupon,
    isCouponLoading: false,
    couponError: null,
  })),
  on(CartActions.applyCouponFailure, (state, { error }) => ({
    ...state,
    appliedCoupon: null,
    isCouponLoading: false,
    couponError: error,
  })),
  on(CartActions.removeCoupon, (state) => ({
    ...state,
    appliedCoupon: null,
    couponError: null,
  }))
);

