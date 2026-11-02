import { Component, computed, inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { selectAllProducts, selectError, selectLoading, selectProductsMetadata } from "./store/products.selectors";
import { ProductsActions } from "./store/products.actions";
import { ProductCardComponent } from "@rose-app/ui";
import { Paginator } from "@rose-app/ui";

@Component({
  selector: "app-products",
  imports: [ProductCardComponent, Paginator],
  templateUrl: "./products.html",
  styleUrl: "./products.css",
})
export class Products {
  private readonly store = inject(Store);
  readonly products = this.store.selectSignal(selectAllProducts);
  readonly isLoading = this.store.selectSignal(selectLoading);
  readonly error = this.store.selectSignal(selectError);
  readonly metadata = this.store.selectSignal(selectProductsMetadata);
  readonly page = computed(() => this.metadata()?.page ?? 1);
  readonly totalPages = computed(() => this.metadata()?.totalPages ?? 1);
  readonly showPagination = computed(() => this.totalPages() > 1);
  
  constructor() {
    this.loadPage(1);
  }

  loadPage(page: number): void {
    this.store.dispatch(
      ProductsActions.loadProductsPage({
        page,
        limit: 12,
      }),
    );
  }

  onPageChange(page: number): void {
    this.loadPage(page);
  }
}
