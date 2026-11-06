import { Component, inject, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Toast } from "@openng/optimus-ui/toast";
import { NgxSpinnerComponent } from "ngx-spinner";
import { Store } from "@ngrx/store";
import { Session } from "../../core/services/session";
import { CartActions } from "../../features/cart/store/cart.actions";

// Root of every ecommerce page. lives on the parent route (not in App) so the toast shares the route's MessageService.
@Component({
  selector: "app-ecommerce-root",
  imports: [RouterOutlet, Toast, NgxSpinnerComponent],
  template: `
    <p-toast position="top-right" />
    <router-outlet />
    <ngx-spinner type="ball-scale-multiple"></ngx-spinner>
  `,
})
export class EcommerceRoot implements OnInit {
  private readonly store = inject(Store);
  private readonly session = inject(Session);

  ngOnInit(): void {
    // Load cart once on app boot so the Navbar badge reflects real state
    // for authenticated users without requiring a visit to /cart first.
    if (this.session.hasToken()) {
      this.store.dispatch(CartActions.loadCart());
    }
  }
}
