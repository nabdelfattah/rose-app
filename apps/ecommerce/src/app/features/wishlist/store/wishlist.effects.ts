import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { WishlistService } from "../services/wishlist.service";
import { wishlistActions } from "./wishlist.actions";
import { catchError, map, of, switchMap, tap } from "rxjs";
import { Store } from "@ngrx/store";
import { selectWishlistProducts } from "./wishlist.selector";
import { concatLatestFrom } from "@ngrx/operators";

// GET
export const loadWishlistProducts = createEffect(
  (actions$ = inject(Actions), wishlistService = inject(WishlistService)) => {
    return actions$.pipe(
      ofType(wishlistActions.pageOpen),
      switchMap(() => {
        return wishlistService.getWishlistProducts().pipe(
          map((res) =>
            wishlistActions.productsLoadSuccess({
              products: res.payload.wishlistItems,
            }),
          ),
          catchError((err) =>
            of(wishlistActions.productsLoadFail({ error: err })),
          ),
        );
      }),
    );
  },
  { functional: true },
);

// POST
export const addWishlistProduct = createEffect(
  (actions$ = inject(Actions), wishlistService = inject(WishlistService)) => {
    return actions$.pipe(
      ofType(wishlistActions.addItem),
      switchMap(({ id }) => {
        return wishlistService.addWishlist(id).pipe(
          map((res) =>
            wishlistActions.addItemSuccess({
              product: res.payload.wishlistItem,
            }),
          ),
          catchError((err) => of(wishlistActions.addItemFail({ error: err }))),
        );
      }),
    );
  },
  { functional: true },
);

// DELETE
export const removeWishlistProduct = createEffect(
  (actions$ = inject(Actions), wishlistService = inject(WishlistService)) => {
    return actions$.pipe(
      ofType(wishlistActions.deleteItem),
      switchMap(({ id }) => {
        return wishlistService.deleteWishlistItem(id).pipe(
          map(() => wishlistActions.deleteItemSuccess({ id })),
          catchError((err) =>
            of(wishlistActions.deleteItemFail({ error: err })),
          ),
        );
      }),
    );
  },
  { functional: true },
);

// BULK DELETE
export const clearWishlist = createEffect(
  (actions$ = inject(Actions), wishlistService = inject(WishlistService)) => {
    return actions$.pipe(
      ofType(wishlistActions.deleteBulk),
      switchMap(() => {
        return wishlistService.clearWishlist().pipe(
          map(() => wishlistActions.deleteBulkSuccess()),
          catchError((err) =>
            of(wishlistActions.deleteBulkFail({ error: err })),
          ),
        );
      }),
    );
  },
  { functional: true },
);

// one effect handle local storage instead of repeating the steps in 4 places
const WISHLIST_KEY = "roseWishlist";
export const saveWishlistToStorage = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(
        wishlistActions.productsLoadSuccess,
        wishlistActions.addItemSuccess,
        wishlistActions.deleteItemSuccess,
        wishlistActions.deleteBulkSuccess,
      ),
      // get the latest value in the store and concat it with the action in an array
      // [action, products]
      concatLatestFrom(() => store.select(selectWishlistProducts)),
      tap(([, products]) => {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(products));
      }),
    );
  },
  { functional: true, dispatch: false },
);
