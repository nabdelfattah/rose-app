import { createFeatureSelector, createSelector } from "@ngrx/store";
import { OrdersState } from "../models/order.state";

export const selectOrdersState = createFeatureSelector<OrdersState>("orders");

export const selectOrder = createSelector(
  selectOrdersState,
  (state) => state.order,
);

export const selectCheckout = createSelector(
  selectOrdersState,
  (state) => state.checkout,
);

export const selectOrdersLoading = createSelector(
  selectOrdersState,
  (state) => state.loading,
);

export const selectOrdersError = createSelector(
  selectOrdersState,
  (state) => state.error,
);
