import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  LucideArrowLeft,
  LucideLogIn,
  LucideShoppingCart,
  LucideTrash2,
} from '@lucide/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { Button } from '@rose-app/ui';
import { Session } from '../../core/services/session';
import { CartItemComponent } from './components/cart-item/cart-item';
import { CartSummaryComponent } from './components/cart-summary/cart-summary';
import { ProductsYouMayLike } from './components/products-you-may-like/products-you-may-like';
import { CartActions } from './store/cart.actions';
import {
  selectAppliedCoupon,
  selectCartDiscount,
  selectCartError,
  selectCartItems,
  selectCartItemsCount,
  selectCartSubtotal,
  selectCartTotal,
  selectCouponError,
  selectIsCartLoading,
  selectIsCartMutating,
  selectIsCouponLoading,
} from './store/cart.selectors';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    RouterLink,
    TranslatePipe,
    Button,
    CartItemComponent,
    CartSummaryComponent,
    ProductsYouMayLike,
    LucideArrowLeft,
    LucideLogIn,
    LucideShoppingCart,
    LucideTrash2,
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cart implements OnInit {
  private readonly store = inject(Store);
  private readonly session = inject(Session);

  readonly items = this.store.selectSignal(selectCartItems);
  readonly itemsCount = this.store.selectSignal(selectCartItemsCount);
  readonly subtotal = this.store.selectSignal(selectCartSubtotal);
  readonly discount = this.store.selectSignal(selectCartDiscount);
  readonly total = this.store.selectSignal(selectCartTotal);
  readonly appliedCoupon = this.store.selectSignal(selectAppliedCoupon);
  readonly couponError = this.store.selectSignal(selectCouponError);
  readonly isCouponLoading = this.store.selectSignal(selectIsCouponLoading);
  readonly isLoading = this.store.selectSignal(selectIsCartLoading);
  readonly isMutating = this.store.selectSignal(selectIsCartMutating);
  readonly error = this.store.selectSignal(selectCartError);

  readonly isAuthenticated = computed(() => this.session.hasToken());

  ngOnInit(): void {
    if (this.isAuthenticated()) {
      this.store.dispatch(CartActions.loadCart());
    }
  }

  onQuantityChange(itemId: string, quantity: number): void {
    if (quantity >= 1) {
      this.store.dispatch(CartActions.updateQuantity({ itemId, quantity }));
    }
  }

  onRemoveItem(itemId: string): void {
    this.store.dispatch(CartActions.removeItem({ itemId }));
  }

  onClearCart(): void {
    this.store.dispatch(CartActions.clearCart());
  }

  onApplyCoupon(code: string): void {
    this.store.dispatch(CartActions.applyCoupon({ code }));
  }

  onRemoveCoupon(): void {
    this.store.dispatch(CartActions.removeCoupon());
  }
}
