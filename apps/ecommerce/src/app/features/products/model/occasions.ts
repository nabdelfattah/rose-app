export interface OccasionRes {
  status: boolean;
  code: number;
  payload: {
    data: OccasionItem[];
    metadata: Metadata;
  };
}

export interface OccasionItem {
  id: string;
  title: string;
  description: string;
  image: string | null;
  immutable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Metadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}