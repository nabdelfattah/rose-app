import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BASE_URL } from '../../../core/constants/apiUrl';
import { ProductRes } from '../model/product';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = `${BASE_URL}/products`;

  getProducts():Observable<ProductRes> {
    return this.httpClient.get<ProductRes>(this.apiUrl);
  }

  getProductById(id: string):Observable<ProductRes> {
    return this.httpClient.get<ProductRes>(`${this.apiUrl}/${id}`);
  }
}