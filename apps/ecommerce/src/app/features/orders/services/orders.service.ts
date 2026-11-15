import { HttpClient } from "@angular/common/http";
import { inject, Service } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
import { GetOrdersResponse } from "../models/orders";

@Service()
export class OrdersService {
  private readonly httpClient = inject(HttpClient);

  getOrders(): Observable<GetOrdersResponse> {
    return this.httpClient.get<GetOrdersResponse>(
      `${environment.baseUrl}orders`,
    );
  }
}
