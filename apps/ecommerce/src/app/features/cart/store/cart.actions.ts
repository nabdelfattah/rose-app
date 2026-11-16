import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { CartResponse, Coupon } from "../models/cart";

export const CartActions = createActionGroup({
  source: "Cart",
  events: {
    "Load Cart": emptyProps(),
    "Load Cart Success": props<{ response: CartResponse }>(),
    "Load Cart Failure": props<{ error: string }>(),

    "Add Item To Cart": props<{ productId: string; quantity: number }>(),
    "Add Item To Cart Success": props<{ response: CartResponse }>(),
    "Add Item To Cart Failure": props<{ error: string }>(),

    "Update Quantity": props<{ itemId: string; quantity: number }>(),
    "Update Quantity Success": props<{
      itemId: string;
      quantity: number;
      response?: CartResponse;
    }>(),
    "Update Quantity Failure": props<{ error: string }>(),

    "Remove Item": props<{ itemId: string }>(),
    "Remove Item Success": props<{ itemId: string; response?: CartResponse }>(),
    "Remove Item Failure": props<{ error: string }>(),

    "Clear Cart": props<{ source?: "manual" | "order"; orderId?: string }>(),
    "Clear Cart Success": props<{
      response?: CartResponse;
      source?: "manual" | "order";
      orderId?: string;
    }>(),                               // source => to separate between cash order and clear cart button
    "Clear Cart Failure": props<{
      error: string;
      source?: "manual" | "order";
      orderId?: string;
    }>(),

    "Apply Coupon": props<{ code: string }>(),
    "Apply Coupon Success": props<{ coupon: Coupon }>(),
    "Apply Coupon Failure": props<{ error: string }>(),
    "Remove Coupon": emptyProps(),
  },
});
