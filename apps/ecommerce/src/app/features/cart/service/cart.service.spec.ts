import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { CartService } from './cart.service';
import { BASE_URL } from '../../../core/constants/apiUrl';
import { CartResponse, CouponResponse } from '../models/cart';

describe('CartService', () => {
  let service: CartService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CartService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(CartService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch cart from GET /api/cart', () => {
    const mockResponse: CartResponse = {
      status: true,
      code: 200,
      payload: {
        id: 'cart-1',
        cartItems: [],
      },
    };

    service.getCart().subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpTesting.expectOne(`${BASE_URL}/cart`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should update cart item quantity via PATCH /api/cart/{id}', () => {
    const mockResponse: CartResponse = {
      status: true,
      code: 200,
    };

    service.updateQuantity('item-123', { quantity: 3 }).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpTesting.expectOne(`${BASE_URL}/cart/item-123`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ quantity: 3 });
    req.flush(mockResponse);
  });

  it('should remove item via DELETE /api/cart/{id}', () => {
    const mockResponse: CartResponse = {
      status: true,
      code: 200,
    };

    service.removeItem('item-123').subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpTesting.expectOne(`${BASE_URL}/cart/item-123`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });

  it('should clear cart via DELETE /api/cart', () => {
    const mockResponse: CartResponse = {
      status: true,
      code: 200,
    };

    service.clearCart().subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpTesting.expectOne(`${BASE_URL}/cart`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });

  it('should search coupons via GET /api/coupons?search={code}', () => {
    const mockResponse: CouponResponse = {
      status: true,
      code: 200,
      payload: {
        data: [],
      },
    };

    service.searchCoupons('SAVE20').subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpTesting.expectOne(`${BASE_URL}/coupons?search=SAVE20`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
