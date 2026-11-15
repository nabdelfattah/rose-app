import { createAction, props } from "@ngrx/store";
import { CreateOrderRequest, CreateOrderResponse } from "../models/orders";

export const createOrder = createAction(
  "[Orders] Create Order",
  props<{ payload: CreateOrderRequest }>(),
);

export const createOrderSuccess = createAction(
  "[Orders] Create Order Success",
  props<{
    response: CreateOrderResponse;
    paymentMethod: CreateOrderRequest["paymentMethod"];
  }>(),
);

export const createOrderFailure = createAction(
  "[Orders] Create Order Failure",
  props<{ error: string }>(),
);

export const cashOrderCartCleared = createAction(
  "[Orders] Cash Order Cart Cleared",
);
