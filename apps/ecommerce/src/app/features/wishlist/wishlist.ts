import { clearWishlist } from "./store/wishlist.effects";
import { Component, computed, inject, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { wishlistActions } from "./store/wishlist.actions";
import { selectWishlistProducts } from "./store/wishlist.selector";
import { LucideFolderHeart, LucideBrushCleaning } from "@lucide/angular";
import { Button } from "@rose-app/ui";
import { WishlistItemComponent } from "./components/WishlistItem.component";

@Component({
  selector: "app-wishlist",
  imports: [
    LucideFolderHeart,
    LucideBrushCleaning,
    Button,
    WishlistItemComponent,
  ],
  templateUrl: "./wishlist.html",
  styleUrl: "./wishlist.css",
})
export class Wishlist implements OnInit {
  private readonly store = inject(Store);
  wishlistitems = this.store.selectSignal(selectWishlistProducts);
  itemsCount = computed(() => this.wishlistitems.length);

  ngOnInit() {
    this.store.dispatch(wishlistActions.pageOpen());
  }

  clearWishlist() {
    this.store.dispatch(wishlistActions.deleteBulk());
  }
}
