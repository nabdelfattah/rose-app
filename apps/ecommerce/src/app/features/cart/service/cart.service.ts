import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_URL } from '../../../core/constants/apiUrl';
import {
  AddToCartRequest,
  CartResponse,
  CouponResponse,
  UpdateQuantityRequest,
} from '../models/cart';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly cartUrl = `${BASE_URL}/cart`;
  private readonly couponsUrl = `${BASE_URL}/coupons`;

  getCart(): Observable<CartResponse> {
    return this.http.get<CartResponse>(this.cartUrl);
  }

  addToCart(request: AddToCartRequest): Observable<CartResponse> {
    return this.http.post<CartResponse>(this.cartUrl, request);
  }

  updateQuantity(itemId: string, request: UpdateQuantityRequest): Observable<CartResponse> {
    return this.http.patch<CartResponse>(`${this.cartUrl}/${itemId}`, request);
  }

  removeItem(itemId: string): Observable<CartResponse> {
    return this.http.delete<CartResponse>(`${this.cartUrl}/${itemId}`);
  }

  clearCart(): Observable<CartResponse> {
    return this.http.delete<CartResponse>(this.cartUrl);
  }

  searchCoupons(code: string): Observable<CouponResponse> {
    return this.http.get<CouponResponse>(
      `${this.couponsUrl}?search=${encodeURIComponent(code)}`
    );
  }
}

