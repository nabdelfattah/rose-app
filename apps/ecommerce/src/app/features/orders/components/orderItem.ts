import { Component, input } from "@angular/core";
import { Order } from "../models/orders";

@Component({
  selector: "app-order-item",
  imports: [],
  templateUrl: "./orderItem.html",
})
export class OrderItem {
  item = input<Order>({} as Order);
}
