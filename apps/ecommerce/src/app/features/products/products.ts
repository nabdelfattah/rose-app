import { TranslatePipe } from "@ngx-translate/core";
import { Component, computed, inject, signal } from "@angular/core";
import { Store } from "@ngrx/store";
import {
  selectAllCategories,
  selectAllOccasions,
  selectAllProducts,
  selectAllProductsForFiltering,
  selectError,
  selectLoading,
  selectProductsMetadata,
} from "./store/products.selectors";
import { ProductsActions } from "./store/products.actions";
import { Button, ProductCardComponent } from "@rose-app/ui";
import { Paginator } from "@rose-app/ui";
import {
  LucideX,
  LucideDock,
  LucideStar,
  LucideRotateCcw,
  LucideFlower2,
  LucideRose,
  LucideGift,
  LucidePlantPot,
  LucideDynamicIcon,
} from "@lucide/angular";
import { Product } from "./model/product";

@Component({
  selector: "app-products",
  imports: [
    ProductCardComponent,
    Paginator,
    TranslatePipe,
    LucideX,
    LucideDock,
    LucideStar,
    LucideRotateCcw,
    Button,
    TranslatePipe,
    LucideDynamicIcon,
  ],
  templateUrl: "./products.html",
  styleUrl: "./products.css",
})
export class Products {
  private readonly store = inject(Store);
  readonly products = this.store.selectSignal(selectAllProducts);
  readonly allProducts = this.store.selectSignal(selectAllProductsForFiltering);
  readonly categories = this.store.selectSignal(selectAllCategories);
  readonly occasions = this.store.selectSignal(selectAllOccasions);
  readonly isLoading = this.store.selectSignal(selectLoading);
  readonly error = this.store.selectSignal(selectError);
  readonly metadata = this.store.selectSignal(selectProductsMetadata);
  readonly page = computed(() => this.metadata()?.page ?? 1);
  readonly totalPages = computed(() => this.metadata()?.totalPages ?? 1);
  readonly showPagination = computed(() => this.totalPages() > 1);
  // Filters
  readonly selectedCategories = signal<string[]>([]);
  readonly selectedOccasions = signal<string[]>([]);
  readonly selectedRating = signal<number | null>(null);
  readonly stars = [1, 2, 3, 4, 5];
  readonly minPrice = signal<number | null>(null);
  readonly maxPrice = signal<number | null>(null);
  readonly filteredPage = signal(1);
  readonly filteredLimit = 12;

  // Calculate The Number Of Pages Of Filtered Products
  readonly filteredTotalPages = computed(() =>
    Math.ceil(this.filteredProducts().length / this.filteredLimit),
  );

  // Filtered Products
  readonly filteredProducts = computed(() => {
    const products = this.allProducts();
    const selectedCategories = this.selectedCategories();
    const selectedOccasions = this.selectedOccasions();
    const selectedRating = this.selectedRating();
    const minPrice = this.minPrice();
    const maxPrice = this.maxPrice();

    return products.filter((product) => {
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.categoryId);

      const matchesOccasion =
        selectedOccasions.length === 0 ||
        product.occasions.some((item) =>
          selectedOccasions.includes(item.occasionId),
        );

      const matchesRating =
        selectedRating === null || product.rating >= selectedRating;

      const price = this.getPriceAfterDiscount(product);
      const matchesPrice =
        (minPrice === null || price >= minPrice) &&
        (maxPrice === null || price <= maxPrice);

      return (
        matchesCategory && matchesOccasion && matchesRating && matchesPrice
      );
    });
  });

  // Paginated Filtered Products
  readonly paginatedFilteredProducts = computed(() => {
    const startIndex = (this.filteredPage() - 1) * this.filteredLimit;
    return this.filteredProducts().slice(
      startIndex,
      startIndex + this.filteredLimit,
    );
  });

  // Compute If There Are Filters
  readonly hasActiveFilters = computed(
    () =>
      this.selectedCategories().length > 0 ||
      this.selectedOccasions().length > 0 ||
      this.selectedRating() !== null ||
      this.minPrice() !== null ||
      this.maxPrice() !== null,
  );

  constructor() {
    this.loadPage(1);
    this.store.dispatch(ProductsActions.loadCategories());
    this.store.dispatch(ProductsActions.loadOccasions());
    this.store.dispatch(ProductsActions.loadAllProducts());
  }

  // Products Pagination
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

  // Filtered Page Pagination
  onFilteredPageChange(page: number): void {
    this.filteredPage.set(page);
  }

  // Select Category
  toggleCategory(categoryId: string): void {
    this.selectedCategories.update((selected) =>
      selected.includes(categoryId)
        ? selected.filter((id) => id !== categoryId)
        : [...selected, categoryId],
    );
  }

  // Select Occasion
  toggleOccasion(occasionId: string) {
    this.selectedOccasions.update((selected) =>
      selected.includes(occasionId)
        ? selected.filter((id) => id !== occasionId)
        : [...selected, occasionId],
    );
  }

  // Select Rating
  selectRating(rating: number) {
    this.selectedRating.update((current) =>
      current === rating ? null : rating,
    );
  }

  // Get Final Price After Discount
  getPriceAfterDiscount(product: Product) {
    const price = Number(product.price);

    if (product.discountType === "PERCENT" && product.discountValue) {
      return price - (price * Number(product.discountValue)) / 100;
    }

    return price;
  }

  // Set Categories Icons Based on Category Title
  setCategoryIcon(title: string) {
    if (title.toLowerCase().includes("flower")) return LucideFlower2;
    if (
      title.toLowerCase().includes("rose") ||
      title.toLowerCase().includes("bouquets")
    )
      return LucideRose;
    if (title.toLowerCase().includes("gift")) return LucideGift;
    if (
      title.toLowerCase().includes("decor") ||
      title.toLowerCase().includes("plant")
    )
      return LucidePlantPot;
    return LucideDock;
  }

  // Select Minimum Price
  onMinPriceChange(value: string): void {
    this.minPrice.set(value === "" ? null : Number(value));
  }

  // Select Maximum Price
  onMaxPriceChange(value: string): void {
    this.maxPrice.set(value === "" ? null : Number(value));
  }

  // Reset Categories Filter
  resetCategories(): void {
    this.selectedCategories.set([]);
  }

  // Reset Occasions Filter
  resetOccasions(): void {
    this.selectedOccasions.set([]);
  }

  // Reset Rating Filter
  resetRating(): void {
    this.selectedRating.set(null);
  }

  // Reset Price Filter
  resetPrice(): void {
    this.minPrice.set(null);
    this.maxPrice.set(null);
  }

  // Reset All Filters
  resetAll(): void {
    this.resetCategories();
    this.resetOccasions();
    this.resetRating();
    this.resetPrice();
  }
}
