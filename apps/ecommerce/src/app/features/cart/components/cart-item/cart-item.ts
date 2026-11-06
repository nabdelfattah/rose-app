import {
  Component,
  ChangeDetectionStrategy,
  computed,
  input,
  output,
} from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  LucideMinus,
  LucidePlus,
  LucideTrash2,
} from '@lucide/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { CartItem } from '../../models/cart';
import { Rating } from '../../../../shared/components/rating/rating';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [
    CurrencyPipe,
    DecimalPipe,
    RouterLink,
    TranslatePipe,
    LucideMinus,
    LucidePlus,
    LucideTrash2,
    Rating,
  ],
  templateUrl: './cart-item.html',
  styleUrl: './cart-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartItemComponent {
  readonly item = input.required<CartItem>();
  readonly disabled = input<boolean>(false);

  readonly quantityChange = output<number>();
  readonly remove = output<void>();

  readonly product = computed(() => this.item().product ?? null);

  readonly title = computed(() => {
    return this.product()?.title ?? this.item().title ?? 'Product';
  });

  readonly cover = computed(() => {
    return this.product()?.cover ?? this.item().cover ?? '';
  });

  readonly productId = computed(() => {
    return this.product()?.id ?? this.item().productId;
  });

  readonly rating = computed(() => {
    return Number(this.product()?.rating ?? this.item().rating ?? 0);
  });

  readonly ratingsCount = computed(() => {
    return Number(this.product()?.ratings ?? this.item().ratings ?? 0);
  });

  readonly unitPrice = computed(() => {
    const raw = this.product()?.price ?? this.item().price ?? 0;
    const num = Number(raw);
    return Number.isFinite(num) ? num : 0;
  });

  readonly totalPrice = computed(() => {
    return this.unitPrice() * (Number(this.item().quantity) || 1);
  });

  onDecrement(): void {
    const current = Number(this.item().quantity) || 1;
    if (current > 1 && !this.disabled()) {
      this.quantityChange.emit(current - 1);
    }
  }

  onIncrement(): void {
    const current = Number(this.item().quantity) || 1;
    if (!this.disabled()) {
      this.quantityChange.emit(current + 1);
    }
  }

  onRemove(): void {
    if (!this.disabled()) {
      this.remove.emit();
    }
  }
}

