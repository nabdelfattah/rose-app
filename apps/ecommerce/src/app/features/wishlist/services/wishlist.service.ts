import { HttpClient } from "@angular/common/http";
import { inject, Service } from "@angular/core";
import { Observable } from "rxjs";
import {
  WishlistGetResponse,
  WishlistPostResponse,
  WishlistRes,
} from "../models/wishlist";
import { environment } from "../../../../environments/environment";

@Service()
export class WishlistService {
  private readonly httpClient = inject(HttpClient);

  getWishlistProducts(): Observable<WishlistGetResponse> {
    return this.httpClient.get<WishlistGetResponse>(
      `${environment.baseUrl}/wishlist`,
    );
  }

  addWishlist(productId: string): Observable<WishlistPostResponse> {
    return this.httpClient.post<WishlistPostResponse>(
      `${environment.baseUrl}/wishlist`,
      { productId },
    );
  }

  deleteWishlistItem(id: string): Observable<WishlistRes> {
    return this.httpClient.delete<WishlistRes>(
      `${environment.baseUrl}/wishlist/${id}`,
    );
  }

  clearWishlist(): Observable<WishlistRes> {
    return this.httpClient.delete<WishlistRes>(
      `${environment.baseUrl}/wishlist`,
    );
  }
}
