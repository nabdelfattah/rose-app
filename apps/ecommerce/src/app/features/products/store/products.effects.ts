import { inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { ProductService } from '../service/product.service';
import { ProductsActions } from './products.actions';

export const loadProducts = createEffect(
  (
    actions$ = inject(Actions),
    productService = inject(ProductService),
  ) =>
    actions$.pipe(
      ofType(ProductsActions.loadProducts),

      switchMap(() =>
        productService.getProducts().pipe(
          map((response) =>
            ProductsActions.loadProductsSuccess({ response }),
          ),

          catchError((error: HttpErrorResponse) =>
            of(
              ProductsActions.loadProductsFailure({
                error: error.message || 'Failed to load products',
              }),
            ),
          ),
        ),
      ),
    ),
  { functional: true },
);
