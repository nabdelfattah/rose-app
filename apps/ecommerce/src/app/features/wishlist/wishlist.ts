import { Component, computed, inject, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { wishlistActions } from "./store/wishlist.actions";
import { selectWishlistProducts } from "./store/wishlist.selector";
import {
  LucideFolderHeart,
  LucideBrushCleaning,
  LucideX,
} from "@lucide/angular";
import { Button } from "@rose-app/ui";
import { WishlistItemComponent } from "./components/WishlistItem.component";
import { ConfirmationService } from "@openng/optimus-ui/api";
import { ConfirmDialog } from "@openng/optimus-ui/confirmdialog";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: "app-wishlist",
  imports: [
    TranslatePipe,
    ConfirmDialog,
    LucideFolderHeart,
    LucideBrushCleaning,
    LucideX,
    Button,
    WishlistItemComponent,
  ],
  templateUrl: "./wishlist.html",
  styleUrl: "./wishlist.css",
})
export class Wishlist implements OnInit {
  private readonly store = inject(Store);
  private readonly confirmationService = inject(ConfirmationService);
  wishlistitems = this.store.selectSignal(selectWishlistProducts);
  itemsCount = computed(() => this.wishlistitems().length);

  ngOnInit() {
    this.store.dispatch(wishlistActions.pageOpen());
  }

  clearWishlist() {
    this.confirmationService.confirm({
      key: "clearWishlist",
      // a translation key, the dialog template translates it so it follows language changes
      message: "wishlist.clear-confirm",
      accept: () => this.store.dispatch(wishlistActions.deleteBulk()),
    });
  }
}
