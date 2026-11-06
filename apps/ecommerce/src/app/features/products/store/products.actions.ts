import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { ProductDetailRes, ProductRes } from "../model/product";
import { CategoryRes } from "../model/categories";
import { OccasionRes } from "../model/occasions";

export const ProductsActions = createActionGroup({
  source: "Products",
  events: {
    // Home Page
    "Load Products": emptyProps(),
    // Products Per Page
    "Load Products Page": props<{
      page: number;
      limit: number;
    }>(),

    "Load Products Success": props<{
      response: ProductRes;
    }>(),

    "Load Products Failure": props<{
      error: string;
    }>(),

    // All Products To Filter
    "Load All Products": emptyProps(),
    "Load All Products Success": props<{ response: ProductRes }>(),
    "Load All Products Failure": props<{ error: string }>(),
    // Categories
    "Load Categories": emptyProps(),

    "Load Categories Success": props<{ response: CategoryRes }>(),

    "Load Categories Failure": props<{ error: string }>(),

    // Occasions

    "Load Occasions": emptyProps(),

    "Load Occasions Success": props<{ response: OccasionRes }>(),

    "Load Occasions Failure": props<{ error: string }>(),
    //////////////////////////////////////////////////////////////////////
    // for best selling products
    //////////////////////////////////////////////////////////////////////
    "Load Best Products": emptyProps(),

    "Load Best Products Success": props<{
      response: ProductRes;
    }>(),

    "Load Best Products Failure": props<{
      error: string;
    }>(),

    //////////////////////////////////////////////////////////////////////
    // Product Details
    //////////////////////////////////////////////////////////////////////
    "Load Selected Product": props<{ id: string }>(),

    "Load Selected Product Success": props<{
      response: ProductDetailRes;
    }>(),

    "Load Selected Product Failure": props<{
      error: string;
    }>(),
  },
});
