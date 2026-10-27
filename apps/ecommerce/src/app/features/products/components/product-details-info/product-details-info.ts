import {
  Component,
  ChangeDetectionStrategy,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { LucideHeart, LucideShoppingCart, LucideStar } from '@lucide/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { Product } from '../../model/product';

@Component({
  selector: 'app-product-details-info',
  standalone: true,
  imports: [
    DecimalPipe,
    TranslatePipe,
    LucideStar,
    LucideHeart,
    LucideShoppingCart,
  ],
  templateUrl: './product-details-info.html',
  styleUrl: './product-details-info.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailsInfo {
  readonly product = input.required<Product>();

  readonly addToCart = output<Product>();
  readonly addToWishlist = output<Product>();

  readonly selectedImageIndex = signal<number>(0);
  readonly isWishlisted = signal<boolean>(false);

  readonly images = computed<string[]>(() => {
    const prod = this.product();
    if (!prod) return [];
    const list: string[] = [];

    if (prod.cover && typeof prod.cover === 'string' && prod.cover.trim()) {
      list.push(prod.cover.trim());
    }

    if (prod.gallery) {
      if (Array.isArray(prod.gallery)) {
        list.push(...(prod.gallery as string[]).map((g) => (typeof g === 'string' ? g.trim() : '')));
      } else if (typeof prod.gallery === 'string') {
        const trimmed = prod.gallery.trim();
        if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
          try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) {
              list.push(...parsed.map((g) => (typeof g === 'string' ? g.trim() : '')));
            }
          } catch {
            list.push(trimmed);
          }
        } else if (trimmed.includes(',')) {
          list.push(...trimmed.split(',').map((g) => g.trim()));
        } else if (trimmed) {
          list.push(trimmed);
        }
      }
    }

    const valid = list.filter((url) => typeof url === 'string' && url.length > 0);
    return Array.from(new Set(valid));
  });

  readonly selectedImage = computed<string>(() => {
    const imgs = this.images();
    const idx = this.selectedImageIndex();
    return imgs[idx] || imgs[0] || this.product()?.cover || '';
  });

  readonly isOutOfStock = computed(() => Number(this.product().stock) <= 0);

  readonly originalPrice = computed<number | null>(() => {
    const price = Number(this.product().price);
    return Number.isFinite(price) && price >= 0 ? price : null;
  });

  readonly discountedPrice = computed<number | null>(() => {
    const product = this.product();
    const price = Number(product.price);
    const discount = Number(product.discountValue);
    if (
      product.discountType !== 'PERCENT' ||
      !Number.isFinite(price) ||
      !Number.isFinite(discount) ||
      price < 0 ||
      discount <= 0 ||
      discount > 100
    ) {
      return null;
    }
    return price * (1 - discount / 100);
  });

  readonly currentPrice = computed<number | null>(() => {
    return this.discountedPrice() ?? this.originalPrice();
  });

  readonly ratingStars = computed(() => {
    const rating = Math.min(5, Math.max(0, Number(this.product().rating) || 0));
    return [1, 2, 3, 4, 5].map((star) => ({
      index: star,
      filled: star <= Math.round(rating),
    }));
  });

  selectImage(index: number): void {
    if (index >= 0 && index < this.images().length) {
      this.selectedImageIndex.set(index);
    }
  }

  onAddToCart(): void {
    if (!this.isOutOfStock()) {
      this.addToCart.emit(this.product());
    }
  }

  onToggleWishlist(): void {
    this.isWishlisted.update((w) => !w);
    this.addToWishlist.emit(this.product());
  }
}
