import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  computed,
} from "@angular/core";
import { CurrencyPipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { LucideTag, LucideX } from "@lucide/angular";
import { TranslatePipe } from "@ngx-translate/core";
import { Button } from "@rose-app/ui";
import { Coupon } from "../../models/cart";

@Component({
  selector: "app-cart-summary",
  standalone: true,
  imports: [
    CurrencyPipe,
    FormsModule,
    TranslatePipe,
    Button,
    LucideTag,
    LucideX,
  ],
  templateUrl: "./cart-summary.html",
  styleUrl: "./cart-summary.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartSummaryComponent {
  readonly subtotal = input.required<number>();
  readonly discount = input.required<number>();
  readonly total = input.required<number>();
  readonly appliedCoupon = input<Coupon | null>(null);
  readonly couponError = input<string | null>(null);
  readonly isCouponLoading = input<boolean>(false);
  readonly isCheckoutDisabled = input<boolean>(false);
  readonly isCheckoutStep = input<boolean>(false);
  readonly isCash = input<boolean>(false);
  readonly fees = computed(()=> this.isCash() ? 55 : 0);
  readonly displayTotal = computed(() => this.total() + this.fees());

  readonly applyCoupon = output<string>();
  readonly removeCoupon = output<void>();
  readonly checkoutStep = output<boolean>();

  readonly couponCodeInput = signal<string>("");

  onApply(): void {
    const code = this.couponCodeInput().trim();
    if (code && !this.isCouponLoading()) {
      this.applyCoupon.emit(code);
    }
  }

  onRemove(): void {
    this.couponCodeInput.set("");
    this.removeCoupon.emit();
  }
}
