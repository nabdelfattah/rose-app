import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CartResponse, Coupon } from '../models/cart';

export const CartActions = createActionGroup({
  source: 'Cart',
  events: {
    'Load Cart': emptyProps(),
    'Load Cart Success': props<{ response: CartResponse }>(),
    'Load Cart Failure': props<{ error: string }>(),

    'Update Quantity': props<{ itemId: string; quantity: number }>(),
    'Update Quantity Success': props<{
      itemId: string;
      quantity: number;
      response?: CartResponse;
    }>(),
    'Update Quantity Failure': props<{ error: string }>(),

    'Remove Item': props<{ itemId: string }>(),
    'Remove Item Success': props<{ itemId: string; response?: CartResponse }>(),
    'Remove Item Failure': props<{ error: string }>(),

    'Clear Cart': emptyProps(),
    'Clear Cart Success': props<{ response?: CartResponse }>(),
    'Clear Cart Failure': props<{ error: string }>(),

    'Apply Coupon': props<{ code: string }>(),
    'Apply Coupon Success': props<{ coupon: Coupon }>(),
    'Apply Coupon Failure': props<{ error: string }>(),
    'Remove Coupon': emptyProps(),
  },
});

