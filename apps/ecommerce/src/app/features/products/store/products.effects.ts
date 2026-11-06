import { inject } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, debounceTime, map, of, switchMap } from "rxjs";
import { ProductService } from "../service/product.service";
import { ProductsActions } from "./products.actions";
import { CategoryService } from "../service/categories/categories.service";
import { CategoryRes } from "../model/categories";
import { OccasionsService } from "../service/ocasions/occasions.service";
import { OccasionRes } from "../model/occasions";
import { error } from "console";

// Home Page
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

// Product Page
export const loadProductsPage = createEffect(
  (actions$ = inject(Actions), productService = inject(ProductService)) =>
    actions$.pipe(
      ofType(ProductsActions.loadProductsPage),

      switchMap(({ page, limit }) =>
        productService.getPaginatedProducts(page, limit).pipe(
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

// Get All Products To Filter
export const loadAllProducts = createEffect(
  (actions$ = inject(Actions), productService = inject(ProductService)) =>
    actions$.pipe(
      ofType(ProductsActions.loadAllProducts),
      switchMap(() =>
        productService.getPaginatedProducts(1, 100).pipe(
          map((response) =>
            ProductsActions.loadAllProductsSuccess({ response }),
          ),
          catchError((error: HttpErrorResponse) =>
            of(
              ProductsActions.loadAllProductsFailure({
                error: error.message || "Failed to load all products",
              }),
            ),
          ),
        ),
      ),
    ),
  { functional: true },
);

// Categories Effect
export const loadCategories = createEffect(
  (actions$ = inject(Actions), categoryService = inject(CategoryService)) =>
    actions$.pipe(
      ofType(ProductsActions.loadCategories),
      switchMap(() =>
        categoryService.getCategories().pipe(
          map((response: CategoryRes) =>
            ProductsActions.loadCategoriesSuccess({ response }),
          ),
          catchError((error: HttpErrorResponse) =>
            of(
              ProductsActions.loadCategoriesFailure({
                error: error.message || "Failed to load categories",
              }),
            ),
          ),
        ),
      ),
    ),
  { functional: true },
);

// Occasions Effect
export const loadOccasions = createEffect(
  (actions$ = inject(Actions), occasionsService = inject(OccasionsService)) =>
    actions$.pipe(
      ofType(ProductsActions.loadOccasions),
      switchMap(() =>
        occasionsService.getOccasions().pipe(
          map((response: OccasionRes) =>
            ProductsActions.loadOccasionsSuccess({ response }),
          ),
          catchError((error: HttpErrorResponse) =>
            of(
              ProductsActions.loadOccasionsFailure({
                error: error.message || "Failed to load Occasions",
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

//////////////////////////////////////////////////////////////////////
// for search
//////////////////////////////////////////////////////////////////////
export const searchProducts = createEffect(
  (actions$ = inject(Actions), productsService = inject(ProductService)) =>
    actions$.pipe(
      ofType(ProductsActions.searchProducts),
      debounceTime(400),
      map(({ query }) => query.trim()),
      switchMap((query) =>
        !query
          ? of(ProductsActions.clearSearch())
          : productsService.searchProducts(query).pipe(
              map((response) =>
                ProductsActions.searchProductsSuccess({ response }),
              ),
              catchError((error) =>
                of(
                  ProductsActions.searchProductsFailure({
                    error: error.message,
                  }),
                ),
              ),
            ),
      ),
    ),
  { functional: true },
);
