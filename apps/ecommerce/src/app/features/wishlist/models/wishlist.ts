import { Product } from "../../products/model/product";

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
  product: Product;
}

export interface WishlistGetResponse {
  status: boolean;
  code: number;
  payload: {
    wishlistItems: WishlistItem[];
  };
}
export interface WishlistPostResponse {
  status: boolean;
  code: number;
  payload: {
    wishlistItem: WishlistItem;
  };
}

export interface WishlistRes {
  status: boolean;
  code: number;
  message: string;
}

export interface WishlistError {
  status: boolean;
  code: number;
  message: string;
}
