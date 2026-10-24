import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ProductsState } from "../model/products-state";

export const selectProductsState =
  createFeatureSelector<ProductsState>("products");

export const selectAllProducts = createSelector(
  selectProductsState,
  (state) => state.products,
);

export const selectLoading = createSelector(
  selectProductsState,
  (state) => state.isLoading,
);

export const selectError = createSelector(
  selectProductsState,
  (state) => state.error,
);

//////////////////////////////////////////////////////////////////////
// for best selling products
//////////////////////////////////////////////////////////////////////
export const selectBestProducts = createSelector(
  selectProductsState,
  (state) => state.bestSelling.items,
);
export const selectBestProductsLoading = createSelector(
  selectProductsState,
  (state) => state.bestSelling.isLoading,
);
export const selectBestProductsError = createSelector(
  selectProductsState,
  (state) => state.bestSelling.error,
);
