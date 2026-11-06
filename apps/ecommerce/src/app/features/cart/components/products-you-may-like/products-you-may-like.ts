import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { CarouselModule } from '@openng/optimus-ui/carousel';
import { TranslatePipe } from '@ngx-translate/core';
import { ProductCardComponent, SectionTitleComponent } from '@rose-app/ui';
import { ProductService } from '../../../products/service/product.service';
import { Product } from '../../../products/model/product';
import { CartActions } from '../../store/cart.actions';
import { selectCartItems } from '../../store/cart.selectors';

@Component({
  selector: 'app-products-you-may-like',
  standalone: true,
  imports: [
    CarouselModule,
    ProductCardComponent,
    SectionTitleComponent,
    TranslatePipe,
  ],
  templateUrl: './products-you-may-like.html',
  styleUrl: './products-you-may-like.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsYouMayLike implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly store = inject(Store);

  readonly rawProducts = signal<Product[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  readonly cartItems = this.store.selectSignal(selectCartItems);

  readonly cartProductIds = computed(() => {
    return new Set(
      this.cartItems()
        .map((item) => item.productId || item.product?.id)
        .filter((id): id is string => !!id)
    );
  });

  readonly filteredProducts = computed(() => {
    const inCart = this.cartProductIds();
    return this.rawProducts().filter((p) => !inCart.has(p.id));
  });

  readonly responsiveOptions = [
    {
      breakpoint: '1280px',
      numVisible: 4,
      numScroll: 1,
    },
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: '575px',
      numVisible: 1,
      numScroll: 1,
    },
  ];

  ngOnInit(): void {
    this.loadRecommendedProducts();
  }

  loadRecommendedProducts(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.productService.getRecommendedProducts(10).subscribe({
      next: (res) => {
        const items = res.payload?.data ?? [];
        this.rawProducts.set(items);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message || 'Failed to load recommendations');
        this.isLoading.set(false);
      },
    });
  }

  onAddToCart(product: Product): void {
    this.store.dispatch(
      CartActions.addItemToCart({ productId: product.id, quantity: 1 })
    );
  }
}

