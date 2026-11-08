import { createFeatureSelector, createSelector } from "@ngrx/store";
import { WishListState } from "./wishlist.reducer";

export const selectWishlistState =
  createFeatureSelector<WishListState>("wishlist");

export const selectWishlistProducts = createSelector(
  selectWishlistState,
  (state) => state.products,
);

export const selectWishlistError = createSelector(
  selectWishlistState,
  (state) => state.error,
);
