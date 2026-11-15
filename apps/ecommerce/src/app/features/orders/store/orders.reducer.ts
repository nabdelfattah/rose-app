import { OrdersState } from "../models/order.state";
import { createReducer, on } from "@ngrx/store";
import * as OrdersActions from "./orders.actions";

const initialState: OrdersState = {
  order: null,
  checkout: null,
  loading: false,
  error: null,
};

export const ordersReducer = createReducer(
  initialState,

  on(OrdersActions.createOrder, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(OrdersActions.createOrderSuccess, (state, { response }) => ({
    ...state,
    order: response.payload.order,
    checkout: response.payload.checkout,
    loading: false,
    error: null,
  })),

  on(OrdersActions.createOrderFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
