import { Product } from "./product";
import { Metadata } from "./product";

export interface ProductsState {
  products: Product[];
  metadata: Metadata | null;
  isLoading: boolean;
  error: string | null;
}