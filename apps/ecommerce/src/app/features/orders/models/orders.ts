export interface CreateOrderRequest {
  addressId: string;
  paymentMethod: 'CASH_ON_DELIVERY' | 'CREDIT_CARD';
  couponCode?: string;
  notes?: string;
}

export interface Order {
  id: string;
  status: string;
  paymentStatus: string;
}

export interface Checkout {
  checkoutUrl: string;
  sessionId: string;
  expiresAt: string;
  reused: boolean;
}

export interface CreateOrderResponse {
  status: boolean;
  code: number;
  payload: {
    order: Order;
    checkout: Checkout;
  };
}