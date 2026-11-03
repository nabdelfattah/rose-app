import { createReducer, on } from "@ngrx/store";
import { wishlistActions } from "./wishlist.actions";
import { WishlistItem } from "../models/wishlist";

export interface WishListState {
  products: WishlistItem[];
  error: string | null;
}
export const wishlistInitialState: WishListState = {
  products: [],
  error: null,
};

export const wishlistReducer = createReducer(
  wishlistInitialState,

  // GET
  on(wishlistActions.pageOpen, (state) => ({
    ...state,
    error: null,
  })),
  on(wishlistActions.productsLoadSuccess, (state, { products }) => ({
    products,
    error: null,
  })),
  on(wishlistActions.productsLoadFail, (state, { error }) => ({
    ...state,
    error,
  })),

  // POST
  on(wishlistActions.addItem, (state) => ({ ...state, error: null })),
  on(wishlistActions.addItemSuccess, (state, { product }) => ({
    products: [...state.products, product],
    error: null,
  })),
  on(wishlistActions.addItemFail, (state, { error }) => ({
    ...state,
    error,
  })),

  // DELETE
  on(wishlistActions.deleteItem, (state) => ({
    ...state,
    error: null,
  })),
  on(wishlistActions.deleteItemSuccess, (state, { id }) => ({
    products: state.products.filter((obj) => obj.id != id),
    error: null,
  })),
  on(wishlistActions.deleteItemFail, (state, { error }) => ({
    ...state,
    error,
  })),

  // BULK DELETE
  on(wishlistActions.deleteBulk, (state) => ({
    ...state,
    error: null,
  })),
  on(wishlistActions.deleteBulkSuccess, (state) => ({
    products: [],
    error: null,
  })),
  on(wishlistActions.deleteBulkFail, (state, { error }) => ({
    ...state,
    error,
  })),
);
