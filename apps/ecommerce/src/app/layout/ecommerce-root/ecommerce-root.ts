import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Toast } from "@openng/optimus-ui/toast";
import { NgxSpinnerComponent } from "ngx-spinner";

// Root of every ecommerce page. lives on the parent route (not in App) so the toast shares the route's MessageServic.
@Component({
  selector: "app-ecommerce-root",
  imports: [RouterOutlet, Toast, NgxSpinnerComponent],
  template: `
    <p-toast position="top-right" />
    <router-outlet />
    <ngx-spinner type="ball-scale-multiple"></ngx-spinner>
  `,
})
export class EcommerceRoot {}
