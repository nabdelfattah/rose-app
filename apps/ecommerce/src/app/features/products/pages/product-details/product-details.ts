import { ProductDetailsInfo } from "../../components/product-details-info/product-details-info";
import { LanguageService } from "@rose-app/ui";
import { ProductService } from "../../service/product.service";
import { Product } from "../../model/product";
import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
} from "@angular/core";
import {
  selectAllProducts,
  selectSelectedProduct,
} from "../../store/products.selectors";
import { RelatedProducts } from "../../components/related-products/related-products";
import { SectionTitleComponent, Avatar, Input, Button } from "@rose-app/ui";
import { ActivatedRoute } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { ProductsActions } from "../../store/products.actions";
import { Rating } from "../../../../shared/components/rating/rating";
import { DatePipe, DecimalPipe } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ReviewsService } from "../../service/reviews.service";
import { selectToken } from "../../../auth/store/user.selector";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Store } from "@ngrx/store";

type ReviewField = "rating" | "headline" | "content";

@Component({
  selector: "app-product-details",
  imports: [
    ProductDetailsInfo,
    RelatedProducts,
    SectionTitleComponent,
    TranslatePipe,
    ReactiveFormsModule,
    DatePipe,
    DecimalPipe,
    Rating,
    Avatar,
    Input,
    Button,
  ],
  templateUrl: "./product-details.html",
  styleUrl: "./product-details.css",
})
export class ProductDetails {
  private readonly productService = inject(ProductService, { optional: true });
  private readonly languageService = inject(LanguageService, {
    optional: true,
  });
  // private readonly currentProduct = signal<Product | null>(null);

  /** Resolved product – prefers the freshly fetched single-product response. */
  // readonly product = computed<Product | null>(() => {
  //   const fetched = this.currentProduct();
  //   if (fetched && fetched.id === this.productId) return fetched;
  //   return (
  //     this.products().find((p) => p.id === this.productId) ?? fetched ?? null
  //   );
  // });

  // constructor() {
  //   // Re-fetch whenever the app language changes so API returns the correct locale.
  //   effect(() => {
  //     const lang = this.languageService?.currentLang() ?? "en"; // reactive signal dependency
  //     this.loadProduct(this.productId, lang);
  //   });

  //   // Watch route param changes (e.g. navigating between products).
  //   this.activatedRoute.paramMap
  //     ?.pipe(takeUntilDestroyed(this.destroyRef))
  //     ?.subscribe((params) => {
  //       const id = params.get("id");
  //       if (id && id !== this.productId) {
  //         this.productId = id;
  //         this.loadProduct(id, this.languageService?.currentLang() ?? "en");
  //       }
  //     });
  // }

  // private loadProduct(
  //   id: string | null,
  //   lang = this.languageService?.currentLang() ?? "en",
  // ): void {
  //   if (!id || !this.productService) return;
  //   this.productService
  //     .getProductById(id, lang)
  //     .pipe(takeUntilDestroyed(this.destroyRef))
  //     .subscribe({
  //       next: (res) => {
  //         const prod = res.payload?.product;
  //         if (prod) {
  //           this.currentProduct.set(prod);
  //         }
  //       },
  //     });
  // }
  private store = inject(Store);
  private activatedRoute = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly reviewService = inject(ReviewsService);
  products = this.store.selectSignal(selectAllProducts);
  productId = this.activatedRoute.snapshot.paramMap.get("id");
  readonly selectedProduct = this.store.selectSignal(selectSelectedProduct);

  private destroyRef = inject(DestroyRef);

  relatedProducts = computed(() =>
    this.products().filter((p) => p.id !== this.productId),
  );

  protected readonly form = this.fb.nonNullable.group({
    // decimal not allowed from the backend
    rating: [
      0,
      [Validators.min(1), Validators.max(5), Validators.pattern(/^\d+$/)],
    ],
    headline: [
      "",
      [
        Validators.required,
        Validators.pattern(/\S/),
        Validators.maxLength(100),
      ],
    ],
    content: [
      "",
      [
        Validators.required,
        Validators.pattern(/\S/),
        Validators.minLength(10),
        Validators.maxLength(1000),
      ],
    ],
  });

  protected readonly isLoggedIn = this.store.selectSignal(selectToken);

  ngOnInit() {
    this.store.dispatch(
      ProductsActions.loadSelectedProduct({ id: this.productId! }),
    );
  }

  submitHandler() {
    if (this.form.valid && this.isLoggedIn()) {
      this.reviewService
        .addReview({
          ...this.form.getRawValue(),
          productId: this.productId!,
        })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.form.reset();
            // refetch the product's data to update the reviews
            this.store.dispatch(
              ProductsActions.loadSelectedProduct({ id: this.productId! }),
            );
          },
          error: () => {},
        });
    } else {
      this.form.markAllAsTouched();
      return;
    }
  }
  protected hasError(field: ReviewField): boolean {
    const control = this.form.controls[field];
    return control.invalid && control.touched;
  }
}
