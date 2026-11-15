export interface GetOrdersResponse {
  status: boolean;
  code: number;
  payload: {
    data: Order[];
    metadata: MetaData;
  };
}

export interface Order {
  id: string;
  userId: string;
  addressId: string;
  couponId: string;
  status: "PENDING";
  paymentMethod: "CREDIT_CARD" | "CASH_ON_DELIVERY";
  paymentStatus: "PROCESSING";
  stripePaymentIntentId: string | null;
  stripeCheckoutSessionId: string;
  subtotal: string;
  discount: string;
  shipping: string;
  total: string;
  trackingNumber: number | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  address: Address;
  coupon: Coupon;
  orderItems: OrderItem[];
}

interface MetaData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: 2;
  price: string;
  createdAt: string;
  product: {
    id: string;
    title: string;
    cover: string;
  };
}

interface User {
  id: string;
  username: string;
  email: string;
}

interface Coupon {
  id: string;
  code: string;
  type: string;
  value: string;
  minPurchase: string;
  maxDiscount: string;
  usageLimit: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  immutable: false;
  createdAt: string;
  updatedAt: string;
}

interface Address {
  id: string;
  userId: string;
  title: string;
  isPrimary: boolean;
  city: string;
  street: string;
  phone: string;
  latitude: string;
  longitude: string;
  createdAt: string;
  updatedAt: string;
}
