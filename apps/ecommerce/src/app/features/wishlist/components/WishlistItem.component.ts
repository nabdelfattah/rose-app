import { Product } from "./../../products/model/product";
import { Component, computed, inject, input } from "@angular/core";
import { WishlistItem } from "../models/wishlist";
import { Button } from "@rose-app/ui";
import { LucideTrash, LucideShoppingCart, LucideStar } from "@lucide/angular";
import { CartActions } from "../../cart/store/cart.actions";
import { item } from "@openng/optimus-ui-themes/aura/breadcrumb";
import { Store } from "@ngrx/store";
import { Router } from "@angular/router";
import { wishlistActions } from "../store/wishlist.actions";
import { DecimalPipe } from "@angular/common";

@Component({
  selector: "app-wishlist-item",
  imports: [Button, LucideTrash, LucideShoppingCart, LucideStar, DecimalPipe],
  templateUrl: "./WishlistItem.component.html",
})
export class WishlistItemComponent {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  item = input.required<WishlistItem>();

  discountedPrice = computed(() => {
    const product = this.item().product;
    const price = Number(product.price);
    const discount = Number(product.discountValue);

    if (
      product.discountType !== "PERCENT" ||
      !Number.isFinite(price) ||
      !Number.isFinite(discount) ||
      price < 0 ||
      discount <= 0 ||
      discount > 100
    ) {
      return null;
    }

    return price * (1 - discount / 100);
  });

  removeItem(id: string) {
    this.store.dispatch(wishlistActions.deleteItem({ id }));
  }

  addToCart() {
    this.store.dispatch(
      CartActions.addItemToCart({
        productId: this.item().product.id,
        quantity: 1,
      }),
    );
  }

  exploreSimilarProducts() {
    console.log(this.item().product.category);
    this.router.navigate(["/products"], {
      queryParams: { category: this.item().product.category.id },
    });
  }
}
