import { Component, computed, DestroyRef, inject, signal } from "@angular/core";
import { select, Store } from "@ngrx/store";
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

type ReviewField = "rating" | "headline" | "content";

@Component({
  selector: "app-product-details",
  imports: [
    ReactiveFormsModule,
    DatePipe,
    DecimalPipe,
    RelatedProducts,
    SectionTitleComponent,
    TranslatePipe,
    Rating,
    Avatar,
    Input,
    Button,
  ],
  templateUrl: "./product-details.html",
  styleUrl: "./product-details.css",
})
export class ProductDetails {
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
