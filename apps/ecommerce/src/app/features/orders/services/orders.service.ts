import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BASE_URL } from "../../../core/constants/apiUrl";
import { CreateOrderRequest, CreateOrderResponse } from "../models/orders";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${BASE_URL}/orders`;

  createOrder(payload: CreateOrderRequest): Observable<CreateOrderResponse> {
    return this.http.post<CreateOrderResponse>(
      this.apiUrl,
      payload
    );
  }
}