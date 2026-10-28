import { createReducer, on } from "@ngrx/store";
import { ProductsActions } from "./products.actions";
import { ProductsState } from "../model/products-state";
import { Product } from "../model/product";

export const initialProductsState: ProductsState = {
  products: [],
  metadata: null,
  isLoading: false,
  error: null,
  bestSelling: {
    items: [],
    isLoading: false,
    error: null,
  },
  selectedProduct: {
    id: null,
    item: {} as Product,
    isLoading: false,
    error: null,
  },
};

export const productsReducer = createReducer(
  initialProductsState,

  on(ProductsActions.loadProducts, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(ProductsActions.loadProductsSuccess, (state, { response }) => ({
    ...state,
    products: response.payload.data,
    metadata: response.payload.metadata,
    isLoading: false,
    error: null,
  })),

  on(ProductsActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  //////////////////////////////////////////////////////////////////////
  // for best selling products
  //////////////////////////////////////////////////////////////////////
  on(ProductsActions.loadBestProducts, (state) => ({
    ...state,
    bestSelling: {
      items: state.bestSelling.items,
      isLoading: true,
      error: null,
    },
  })),

  on(ProductsActions.loadBestProductsSuccess, (state, { response }) => ({
    ...state,
    bestSelling: {
      items: response.payload.data,
      isLoading: false,
      error: null,
    },
  })),

  on(ProductsActions.loadBestProductsFailure, (state, { error }) => ({
    ...state,
    bestSelling: {
      items: state.bestSelling.items,
      isLoading: false,
      error,
    },
  })),

  //////////////////////////////////////////////////////////////////////
  // for product details
  //////////////////////////////////////////////////////////////////////
  on(ProductsActions.loadSelectedProduct, (state, { id }) => ({
    ...state,
    selectedProduct: {
      id: id,
      item: null,
      isLoading: true,
      error: null,
    },
  })),

  on(ProductsActions.loadSelectedProductSuccess, (state, { response }) => ({
    ...state,
    selectedProduct: {
      id: state.selectedProduct.id,
      item: response.payload.product,
      isLoading: false,
      error: null,
    },
  })),

  on(ProductsActions.loadSelectedProductFailure, (state, { error }) => ({
    ...state,
    selectedProduct: {
      id: state.selectedProduct.id,
      item: state.selectedProduct.item,
      isLoading: false,
      error,
    },
  })),
);
