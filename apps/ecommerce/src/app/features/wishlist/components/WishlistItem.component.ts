import { Component, computed, input } from "@angular/core";
import { WishlistItem } from "../models/wishlist";
import { Button } from "@rose-app/ui";
import { LucideTrash, LucideShoppingCart, LucideStar } from "@lucide/angular";

@Component({
  selector: "app-wishlist-item",
  imports: [Button, LucideTrash, LucideShoppingCart, LucideStar],
  templateUrl: "./WishlistItem.component.html",
  styleUrl: "./WishlistItem.component.css",
})
export class WishlistItemComponent {
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
}
