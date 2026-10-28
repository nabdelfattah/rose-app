import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { ProductDetailRes, ProductRes } from "../model/product";

export const ProductsActions = createActionGroup({
  source: "Products",
  events: {
    "Load Products": emptyProps(),

    "Load Products Success": props<{
      response: ProductRes;
    }>(),

    "Load Products Failure": props<{
      error: string;
    }>(),

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
