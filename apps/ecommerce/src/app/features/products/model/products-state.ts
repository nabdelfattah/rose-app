import { Category, Occasion, Product } from "./product";
import { Metadata } from "./product";
import { OccasionItem } from "../model/occasions";

export interface ProductsState {
  products: Product[];
  metadata: Metadata | null;
  isLoading: boolean;
  error: string | null;
  allProducts: Product[];
  search: {
    query: string;
    items: Product[];
    error: string | null;
  };
  categories: {
    items: Category[];
    isLoading: boolean;
    error: string | null;
  };
  occasions: {
    items: OccasionItem[];
    isLoading: boolean;
    error: string | null;
  };
  bestSelling: {
    items: Product[];
    isLoading: boolean;
    error: string | null;
  };
  selectedProduct: {
    id: string | null;
    item: Product | null;
    isLoading: boolean;
    error: string | null;
  };
}
