import { Checkout } from "../../checkout/checkout";
import { OrderMainData } from "./orders";

export interface OrdersState {
  order: OrderMainData | null;
  checkout: Checkout | null;
  loading: boolean;
  error: string | null;
}
