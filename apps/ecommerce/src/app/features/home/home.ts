import { Component, computed, inject, OnInit, signal } from "@angular/core";
import {
  LucideArrowRight,
  LucideCheck,
  LucideMoveRight,
} from "@lucide/angular";
import { ButtonModule } from "@openng/optimus-ui/button";
import { SectionTitleComponent } from "../../../../../../libs/shared/ui/src/lib/section-title/section-title";
import { Store } from "@ngrx/store";
import {
  selectAllProducts,
  selectLoading,
  selectError,
} from "../products/store/products.selectors";
import { ProductsActions } from "../products/store/products.actions";
import { SectionFeatures } from "./components/section-features/section-features";
import { SectionBestSelling } from "./components/section-best-selling/section-best-selling";
import { TrustedCompanies } from "./components/trusted-companies/trusted-companies";
import { Button, ProductCardComponent, SubTitleComponent } from "@rose-app/ui";
import { Router, RouterLink } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { PromotionalBanners } from "./components/promotional-banners/promotional-banners";

@Component({
  selector: "app-home",
  imports: [
    PromotionalBanners,
    Button,
    SubTitleComponent,
    RouterLink,
    TranslatePipe,
    SectionFeatures,
    SectionBestSelling,
    TrustedCompanies,
    LucideMoveRight,
    LucideArrowRight,
    LucideCheck,
    ButtonModule,
    SectionTitleComponent,
    ProductCardComponent,
  ],
  templateUrl: "./home.html",
  styleUrl: "./home.css",
})
export class Home implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  readonly products = this.store.selectSignal(selectAllProducts);
  readonly isLoading = this.store.selectSignal(selectLoading);
  readonly error = this.store.selectSignal(selectError);

  tabs = ["All", "Wedding", "Anniversary", "Birthday", "Engagement"];
  selected = signal("All");

  filtered = computed(() => {
    const s = this.selected();
    return s === "All"
      ? this.products()
      : this.products().filter((p) =>
          p.occasions.some((o) => o.occasion.title.includes(s)),
        );
  });

  viewMore() {
    this.router.navigate(["/products"]);
  }

  ngOnInit(): void {
    this.store.dispatch(ProductsActions.loadProducts());
  }
}
