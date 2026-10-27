import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { selectAllProducts } from '../../store/products.selectors';
import { RelatedProducts } from '../../components/related-products/related-products';
import { ProductDetailsInfo } from '../../components/product-details-info/product-details-info';
import { SectionTitleComponent, LanguageService } from '@rose-app/ui';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ProductService } from '../../service/product.service';
import { Product } from '../../model/product';

@Component({
  selector: 'app-product-details',
  imports: [
    ProductDetailsInfo,
    RelatedProducts,
    SectionTitleComponent,
    TranslatePipe,
  ],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails {
  private readonly store = inject(Store);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productService = inject(ProductService, { optional: true });
  private readonly languageService = inject(LanguageService, { optional: true });
  private readonly destroyRef = inject(DestroyRef);

  private readonly products = this.store.selectSignal(selectAllProducts);
  private productId: string | null =
    this.activatedRoute.snapshot?.paramMap?.get('id') ?? null;
  private readonly currentProduct = signal<Product | null>(null);

  /** Resolved product – prefers the freshly fetched single-product response. */
  readonly product = computed<Product | null>(() => {
    const fetched = this.currentProduct();
    if (fetched && fetched.id === this.productId) return fetched;
    return this.products().find((p) => p.id === this.productId) ?? fetched ?? null;
  });

  readonly relatedProducts = computed(() =>
    this.products().filter((p) => p.id !== this.productId),
  );

  constructor() {
    // Re-fetch whenever the app language changes so API returns the correct locale.
    effect(() => {
      const lang = this.languageService?.currentLang() ?? 'en'; // reactive signal dependency
      this.loadProduct(this.productId, lang);
    });

    // Watch route param changes (e.g. navigating between products).
    this.activatedRoute.paramMap
      ?.pipe(takeUntilDestroyed(this.destroyRef))
      ?.subscribe((params) => {
        const id = params.get('id');
        if (id && id !== this.productId) {
          this.productId = id;
          this.loadProduct(id, this.languageService?.currentLang() ?? 'en');
        }
      });
  }

  private loadProduct(
    id: string | null,
    lang = this.languageService?.currentLang() ?? 'en',
  ): void {
    if (!id || !this.productService) return;
    this.productService
      .getProductById(id, lang)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          const prod = res.payload?.product;
          if (prod) {
            this.currentProduct.set(prod);
          }
        },
      });
  }
}
