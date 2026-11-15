import { Component, DestroyRef, inject, signal } from "@angular/core";
import { OrderItem } from "./components/orderItem";
import { Order } from "./models/orders";
import { OrdersService } from "./services/orders.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
@Component({
  selector: "app-orders",
  imports: [OrderItem],
  templateUrl: "./orders.html",
})
export class Orders {
  private readonly ordersService = inject(OrdersService);
  private destroyRef = inject(DestroyRef);

  orders = signal<Order[]>([]);

  ngOnInit() {
    this.ordersService
      .getOrders()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.orders.set(res.payload.data);
        },
        error: () => {},
      });
  }
}
