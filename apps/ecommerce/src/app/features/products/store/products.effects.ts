import { inject } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap } from "rxjs";
import { ProductService } from "../service/product.service";
import { ProductsActions } from "./products.actions";

export const loadProducts = createEffect(
  (actions$ = inject(Actions), productService = inject(ProductService)) =>
    actions$.pipe(
      ofType(ProductsActions.loadProducts),

      switchMap(() =>
        productService.getProducts().pipe(
          map((response) => ProductsActions.loadProductsSuccess({ response })),

          catchError((error: HttpErrorResponse) =>
            of(
              ProductsActions.loadProductsFailure({
                error: error.message || "Failed to load products",
              }),
            ),
          ),
        ),
      ),
    ),
  { functional: true },
);

//////////////////////////////////////////////////////////////////////
// for best selling products
//////////////////////////////////////////////////////////////////////
export const loadBestSellingProducts = createEffect(
  (actions$ = inject(Actions), productService = inject(ProductService)) =>
    actions$.pipe(
      ofType(ProductsActions.loadBestProducts),

      switchMap(() =>
        productService.getBestSelling().pipe(
          map((response) =>
            ProductsActions.loadBestProductsSuccess({ response }),
          ),

          catchError((error: HttpErrorResponse) =>
            of(
              ProductsActions.loadBestProductsFailure({
                error: error.message || "Failed to load products",
              }),
            ),
          ),
        ),
      ),
    ),
  { functional: true },
);

//////////////////////////////////////////////////////////////////////
// for best selling products
//////////////////////////////////////////////////////////////////////
export const loadSelectedProduct = createEffect(
  (actions$ = inject(Actions), productService = inject(ProductService)) =>
    actions$.pipe(
      ofType(ProductsActions.loadSelectedProduct),

      switchMap(({ id }) =>
        productService.getProductById(id).pipe(
          map((response) =>
            ProductsActions.loadSelectedProductSuccess({ response }),
          ),

          catchError((error: HttpErrorResponse) =>
            of(
              ProductsActions.loadSelectedProductFailure({
                error: error.message || "Failed to load the product",
              }),
            ),
          ),
        ),
      ),
    ),
  { functional: true },
);
