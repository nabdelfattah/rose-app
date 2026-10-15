import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Toast } from "@openng/optimus-ui/toast";

// Root of every ecommerce page. lives on the parent route (not in App) so the toast shares the route's MessageServic.
@Component({
  selector: "app-ecommerce-root",
  imports: [RouterOutlet, Toast],
  template: `
    <p-toast position="top-right" />
    <router-outlet />
  `,
})
export class EcommerceRoot {}
