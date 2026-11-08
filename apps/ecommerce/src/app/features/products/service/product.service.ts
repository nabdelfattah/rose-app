import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BASE_URL } from "../../../core/constants/apiUrl";
import { ProductDetailRes, ProductRes } from "../model/product";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = `${BASE_URL}/products`;

  getProducts(): Observable<ProductRes> {
    return this.httpClient.get<ProductRes>(this.apiUrl);
  }

  getPaginatedProducts(page: number, limit: number): Observable<ProductRes> {
    const params = new HttpParams().set("page", page).set("limit", limit);

    return this.httpClient.get<ProductRes>(this.apiUrl, { params });
  }

  getProductById(id: string): Observable<ProductDetailRes> {
    return this.httpClient.get<ProductDetailRes>(`${this.apiUrl}/${id}`);
  }

  // for best selling section in the home page (Nada)
  getBestSelling(): Observable<ProductRes> {
    return this.httpClient.get<ProductRes>(
      `${this.apiUrl}/?page=1&limit=6&sortBy=rating`,
    );
  }

  // for search
  searchProducts(query: string) {
    return this.httpClient.get<ProductRes>(`${environment.baseUrl}products`, {
      params: { search: query },
    });
  }

  getRecommendedProducts(limit = 10): Observable<ProductRes> {
    const params = new HttpParams()
      .set("page", 1)
      .set("limit", limit)
      .set("sortBy", "mostPopular");

    return this.httpClient.get<ProductRes>(this.apiUrl, { params });
  }
}
