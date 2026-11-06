import { createReducer, on } from "@ngrx/store";
import { ProductsActions } from "./products.actions";
import { ProductsState } from "../model/products-state";
import { Product } from "../model/product";

export const initialProductsState: ProductsState = {
  products: [],
  metadata: null,
  isLoading: false,
  error: null,
  allProducts: [],
  categories: {
    items: [],
    isLoading: false,
    error: null,
  },
  occasions: {
    items: [],
    isLoading: false,
    error: null,
  },
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
  // Home Page
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

  // Load All Products To Filter in Product Page
  on(ProductsActions.loadAllProductsSuccess, (state, { response }) => ({
    ...state,
    allProducts: response.payload.data,
  })),

  on(ProductsActions.loadAllProductsSuccess, (state, { response }) => ({
    ...state,
    allProducts: response.payload.data,
  })),

  on(ProductsActions.loadAllProductsFailure, (state) => ({
    ...state,
  })),

  // Categories
  on(ProductsActions.loadCategories, (state) => ({
    ...state,
    categories: {
      ...state.categories,
      isLoading: true,
      error: null,
    },
  })),

  on(ProductsActions.loadCategoriesSuccess, (state, { response }) => ({
    ...state,
    categories: {
      items: response.payload.data,
      isLoading: false,
      error: null,
    },
  })),

  on(ProductsActions.loadCategoriesFailure, (state, { error }) => ({
    ...state,
    categories: {
      ...state.categories,
      isLoading: false,
      error,
    },
  })),

  // Occasions

  on(ProductsActions.loadOccasions, (state) => ({
    ...state,
    occasions: {
      ...state.occasions,
      isLoading: true,
      error: null,
    },
  })),

  on(ProductsActions.loadOccasionsSuccess, (state, { response }) => ({
    ...state,
    occasions: {
      items: response.payload.data,
      isLoading: false,
      error: null,
    },
  })),

  on(ProductsActions.loadOccasionsFailure, (state, { error }) => ({
    ...state,
    occasions: {
      ...state.occasions,
      error,
    },
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
