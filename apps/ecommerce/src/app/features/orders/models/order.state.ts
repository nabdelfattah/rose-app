import { Checkout } from "../../checkout/checkout";
import { Order } from "./orders";

export interface OrdersState {
  order: Order | null;
  checkout: Checkout | null;
  loading: boolean;
  error: string | null;
}
