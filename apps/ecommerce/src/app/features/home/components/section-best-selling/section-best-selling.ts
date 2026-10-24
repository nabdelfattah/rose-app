import {
  LucideChevronLeft,
  LucideChevronRight,
  LucideMoveRight,
} from "@lucide/angular";
import { Component, inject, OnInit } from "@angular/core";
import { Button, ProductCardComponent, SubTitleComponent } from "@rose-app/ui";
import { Store } from "@ngrx/store";
import { ProductsActions } from "../../../products/store/products.actions";
import {
  selectBestProducts,
  selectBestProductsError,
  selectBestProductsLoading,
} from "../../../products/store/products.selectors";
import { CarouselModule } from "@openng/optimus-ui/carousel";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: "app-section-best-selling",
  imports: [
    Button,
    SubTitleComponent,
    LucideMoveRight,
    ProductCardComponent,
    CarouselModule,
    LucideChevronLeft,
    LucideChevronRight,
    TranslatePipe,
  ],
  templateUrl: "./section-best-selling.html",
  styleUrl: "./section-best-selling.css",
})
export class SectionBestSelling implements OnInit {
  private readonly store = inject(Store);
  readonly bestProducts = this.store.selectSignal(selectBestProducts);
  readonly isLoading = this.store.selectSignal(selectBestProductsLoading);
  readonly error = this.store.selectSignal(selectBestProductsError);
  readonly responsiveOptions = [
    {
      breakpoint: "1023px", // below Tailwind's lg
      numVisible: 2,
      numScroll: 2,
    },
    {
      breakpoint: "575px", // small phones
      numVisible: 1,
      numScroll: 1,
    },
  ];

  ngOnInit() {
    this.store.dispatch(ProductsActions.loadBestProducts());
    this.responsiveOptions;
  }
}
