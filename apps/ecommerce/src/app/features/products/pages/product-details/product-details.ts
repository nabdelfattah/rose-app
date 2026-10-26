import { Component, computed, inject } from "@angular/core";
import { Store } from "@ngrx/store";
import {
  selectAllProducts,
  selectSelectedProduct,
} from "../../store/products.selectors";
import { RelatedProducts } from "../../components/related-products/related-products";
import { SectionTitleComponent } from "@rose-app/ui";
import { ActivatedRoute } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { ProductsActions } from "../../store/products.actions";

@Component({
  selector: "app-product-details",
  imports: [RelatedProducts, SectionTitleComponent, TranslatePipe],
  templateUrl: "./product-details.html",
  styleUrl: "./product-details.css",
})
export class ProductDetails {
  private store = inject(Store);
  private activatedRoute = inject(ActivatedRoute);
  products = this.store.selectSignal(selectAllProducts);
  productId = this.activatedRoute.snapshot.paramMap.get("id");
  readonly selectedProduct = this.store.selectSignal(selectSelectedProduct);

  relatedProducts = computed(() =>
    this.products().filter((p) => p.id !== this.productId),
  );

  ngOnInit() {
    this.store.dispatch(
      ProductsActions.loadSelectedProduct({ id: this.productId! }),
    );
  }
}
