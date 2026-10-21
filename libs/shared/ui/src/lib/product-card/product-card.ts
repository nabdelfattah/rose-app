import { Component, computed, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { LucideHeartPlus, LucideStar, LucideShoppingCart, LucideEye } from '@lucide/angular';
import { Product } from './../../../../../../apps/ecommerce/src/app/features/products/model/product';

type BadgeType = 'new' | 'hot' | 'out-of-stock';

interface ProductBadge {
  label: string;
  type: BadgeType;
}

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [DecimalPipe, LucideHeartPlus, LucideStar, LucideShoppingCart, LucideEye],
  templateUrl: './product-card.html',
})
export class ProductCardComponent {

  product = input.required<Product>();

   stars = [1, 2, 3, 4, 5];
   readonly isOutOfStock = computed(() => Number(this.product().stock) <= 0);

   badges = computed<ProductBadge[]>(() => {
    const product = this.product();
    const badges: ProductBadge[] = [];

    const createdAt = new Date(product.createdAt);
    const now = new Date();

    const isValidDate = Number.isFinite(createdAt.getTime());

    const isNew =
      isValidDate &&
      createdAt.getFullYear() === now.getFullYear() &&
      createdAt.getMonth() === now.getMonth() &&
      createdAt <= now;

    if (isNew) {
      badges.push({
        label: 'NEW',
        type: 'new',
      });
    }

    if (product.stock <= 0) {
      badges.push({
        label: 'OUT OF STOCK',
        type: 'out-of-stock',
      });
    }

    if (product.rating >= 4.5 && product.ratings >= 10) {
      badges.push({
        label: 'HOT',
        type: 'hot',
      });
    }

    return badges;
  });

   originalPrice = computed(() => {
  const price = Number(this.product().price);

  return Number.isFinite(price) && price >= 0
    ? price
    : null;
});

 discountedPrice = computed(() => {
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

   normalizedRating = computed(() => {
    const rating = Number(this.product().rating);
    if (!Number.isFinite(rating)) {
      return 0;
    }
    return Math.min(5, Math.max(0, rating));
  });

   price = computed(() => {
    const price = Number(this.product().price);

    return Number.isFinite(price) && price >= 0
      ? price
      : null;
  });
}