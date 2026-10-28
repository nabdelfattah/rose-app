import { HttpClient } from "@angular/common/http";
import { inject, Service } from "@angular/core";
import { Observable } from "rxjs";
import { Review } from "../model/product";
import { BASE_URL } from "../../../core/constants/apiUrl";

export interface CreateReviewRequest {
  productId: string;
  headline: string;
  content: string;
  rating: number;
}

@Service()
export class ReviewsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${BASE_URL}`;

  addReview(review: CreateReviewRequest): Observable<Review> {
    console.log(review);
    return this.http.post<Review>(`${this.baseUrl}/reviews`, review);
  }
}
