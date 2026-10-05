import { Component } from "@angular/core";
import { LucideShoppingCart } from "@lucide/angular";
import { ButtonModule } from "@openng/optimus-ui/button";
@Component({
  selector: "app-home",
  imports: [LucideShoppingCart, ButtonModule],
  templateUrl: "./home.html",
  styleUrl: "./home.css",
})
export class Home {}
