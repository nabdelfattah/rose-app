import { createReducer, on } from '@ngrx/store';
import { Product, ProductRes, Metadata } from './../model/product';
import { ProductsActions } from './products.actions';
import { ProductsState } from '../model/products-state';


export const initialProductsState: ProductsState = {
  products: [],
  metadata: null,
  isLoading: false,
  error: null,
};

export const productsReducer = createReducer(
  initialProductsState,

  on(ProductsActions.loadProducts, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(
    ProductsActions.loadProductsSuccess,
    (state, { response }) => ({
      ...state,
      products: response.payload.data,
      metadata: response.payload.metadata,
      isLoading: false,
      error: null,
    })
  ),

  on(
    ProductsActions.loadProductsFailure,
    (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })
  )
);
