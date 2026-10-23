import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductsState } from '../model/products-state';

export const selectProductsState =
  createFeatureSelector<ProductsState>('products');

export const selectAllProducts = createSelector(
  selectProductsState,
  (state) => state.products
);

export const selectLoading = createSelector(
  selectProductsState,
  (state) => state.isLoading
);

export const selectError = createSelector(
  selectProductsState,
  (state) => state.error
);
