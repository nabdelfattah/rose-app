export interface ProductRes {
  status: boolean;
  code: number;
  payload: Payload;
}

export interface ProductDetailRes {
  status: boolean;
  code: number;
  payload: { product: Product };
}

export interface Payload {
  data: Product[];
  metadata: Metadata;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  rating: number;
  ratings: number;
  stock: number;
  price: string;
  discountType?: string | null;
  discountValue?: string | null;
  cover: string;
  gallery: string;
  categoryId: string;
  subCategoryId?: string;
  immutable: boolean;
  deletedAt: any;
  createdAt: string;
  updatedAt: string;
  category: Category;
  subCategory?: SubCategory;
  occasions: Occasion[];
  reviews?: Review[];
  _count: Count;
}

export interface Category {
  id: string;
  title: string;
}

export interface SubCategory {
  id: string;
  title: string;
}

export interface Occasion {
  id: string;
  productId: string;
  occasionId: string;
  createdAt: string;
  occasion: Occasion2;
}

export interface Occasion2 {
  id: string;
  title: string;
  description: string;
  image?: string | null;
  immutable: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface Review {
  id: string;
  userId: string;
  productId: string;
  headline: string;
  content: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  user: User;
}

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
}

export interface Count {
  reviews: number;
  cartItems: number;
  wishlistItems: number;
  orderItems: number;
}

export interface Metadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
