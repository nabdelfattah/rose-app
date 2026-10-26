import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BASE_URL } from "../../../core/constants/apiUrl";
import { ProductRes, SingleProductRes } from "../model/product";
import { Language } from "@rose-app/ui";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = `${BASE_URL}/products`;

  getProducts(): Observable<ProductRes> {
    return this.httpClient.get<ProductRes>(this.apiUrl);
  }

  getProductById(
    id: string,
    lang: Language = 'en',
  ): Observable<SingleProductRes | ProductRes> {
    const headers = new HttpHeaders({ 'Accept-Language': lang });
    return this.httpClient.get<SingleProductRes | ProductRes>(
      `${this.apiUrl}/${id}`,
      { headers },
    );
  }

  // for best selling section in the home page (Nada)
  getBestSelling(): Observable<ProductRes> {
    return this.httpClient.get<ProductRes>(
      `${this.apiUrl}/?page=1&limit=6&sortBy=rating`,
    );
  }
}
