import { Product } from '../../products/model/product';

export interface CartItem {
  id: string;
  cartId?: string;
  productId: string;
  quantity: number;
  price?: number | string;
  product?: Product;
  // Fallbacks in case product fields are returned at item level
  title?: string;
  cover?: string;
  rating?: number;
  ratings?: number;
  stock?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartPayload {
  id?: string;
  userId?: string;
  cartItems?: CartItem[];
  items?: CartItem[];
  data?: CartItem[];
  subtotal?: number;
  total?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartResponse {
  status: boolean;
  code: number;
  message?: string;
  payload?: CartPayload | CartItem[];
}

export interface AddToCartRequest {
  productId: string;
  quantity?: number;
}

export interface UpdateQuantityRequest {
  quantity: number;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'PERCENT' | 'FIXED';
  value: number | string;
  minPurchase?: number | string | null;
  maxDiscount?: number | string | null;
  usageLimit?: number | null;
  usedCount?: number;
  validFrom?: string;
  validUntil?: string;
  isActive?: boolean;
  immutable?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CouponResponse {
  status: boolean;
  code: number;
  message?: string;
  payload: {
    data: Coupon[];
    metadata?: {
      page?: number;
      limit?: number;
      total?: number;
      totalPages?: number;
    };
  };
}

export function extractCartItems(payload?: CartPayload | CartItem[] | null): CartItem[] {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  return payload.cartItems ?? payload.items ?? payload.data ?? [];
}

