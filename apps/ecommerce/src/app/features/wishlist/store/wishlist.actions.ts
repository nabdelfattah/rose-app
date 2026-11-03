import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { WishlistItem } from "../models/wishlist";

export const wishlistActions = createActionGroup({
  source: "wishlist",
  events: {
    // GET
    // Component => Effect
    "Page Open": emptyProps(),
    // Effect => reducer (the API result)
    "Products Load Success": props<{ products: WishlistItem[] }>(),
    // Effect => reducer (the API error)
    "Products Load Fail": props<{ error: string }>(),

    // POST
    "Add Item": props<{ id: string }>(),
    "Add Item Success": props<{ product: WishlistItem }>(),
    "Add Item Fail": props<{ error: string }>(),

    // DELETE
    "Delete Item": props<{ id: string }>(),
    "Delete Item Success": props<{ id: string }>(),
    "Delete Item Fail": props<{ error: string }>(),

    // BULK DELETE
    "Delete Bulk": emptyProps(),
    "Delete Bulk Success": emptyProps(),
    "Delete Bulk Fail": props<{ error: string }>(),
  },
});
