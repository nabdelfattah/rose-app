export interface Testimonial {
  id: string;
  name: string;
  email: string;
  content: string;
  rating: number;
  image: string | null;
  isApproved: boolean;
  immutable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TestimonialMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TestimonialRes {
  status: boolean;
  code: number;
  payload: {
    data: Testimonial[];
    metadata: TestimonialMetadata;
  };
}