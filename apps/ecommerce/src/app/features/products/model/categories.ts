export interface CategoryRes {
  status: boolean;
  code: number;
  payload: {
    data: Category[];
    metadata: Metadata;
  };
}

export interface Category {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  immutable: boolean;
  createdAt: string;
  updatedAt: string;
  subCategories: SubCategory[];
  _count: {
    products: number;
  };
}

export interface SubCategory {
  id: string;
  title: string;
}

export interface Metadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}