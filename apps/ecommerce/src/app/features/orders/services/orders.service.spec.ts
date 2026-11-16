import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { OrdersService } from "./orders.service";
import { environment } from "../../../../environments/environment";
import {
  CreateOrderRequest,
  CreateOrderResponse,
  GetOrdersResponse,
  Order,
} from "../models/orders";

const BASE = `${environment.baseUrl}orders`;

const mockGetOrdersRes: GetOrdersResponse = {
  status: true,
  code: 200,
  payload: {
    data: [{ id: "order-1", total: "1820" } as Order],
    metadata: { page: 1, limit: 10, total: 1, totalPages: 1 },
  },
};

describe("OrdersService", () => {
  let service: OrdersService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OrdersService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(OrdersService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // fail the test if there is a pending request
    httpTesting.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("getOrders() should GET /orders", () => {
    let result: GetOrdersResponse | undefined;
    service.getOrders().subscribe((res) => (result = res));

    const req = httpTesting.expectOne(BASE);
    expect(req.request.method).toBe("GET");
    req.flush(mockGetOrdersRes);

    expect(result).toEqual(mockGetOrdersRes);
  });

  it("createOrder() should POST /orders with the payload", () => {
    const payload: CreateOrderRequest = {
      addressId: "address-1",
      paymentMethod: "CASH_ON_DELIVERY",
      couponCode: "ROSE10",
      notes: "Leave at the door",
    };
    const mockRes = {
      status: true,
      code: 201,
      payload: { order: { id: "order-1" }, checkout: {} },
    } as unknown as CreateOrderResponse;

    let result: CreateOrderResponse | undefined;
    service.createOrder(payload).subscribe((res) => (result = res));

    const req = httpTesting.expectOne(BASE);
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual(payload);
    req.flush(mockRes);

    expect(result).toEqual(mockRes);
  });
});
