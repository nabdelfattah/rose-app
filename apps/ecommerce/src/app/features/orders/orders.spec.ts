import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import {
  TranslateLoader,
  TranslationObject,
  provideTranslateService,
} from "@ngx-translate/core";
import { Observable, Subject, of, throwError } from "rxjs";
import { describe, it, expect, beforeEach, vi } from "vitest";

import { Orders } from "./orders";
import { OrdersService } from "./services/orders.service";
import { GetOrdersResponse, Order } from "./models/orders";

class MockTranslateLoader implements TranslateLoader {
  getTranslation(): Observable<TranslationObject> {
    return of({ orders: { title: "Orders", order: "Order" } });
  }
}

const makeOrder = (id: string): Order =>
  ({
    id,
    status: "PENDING",
    paymentMethod: "CASH_ON_DELIVERY",
    paymentStatus: "PROCESSING",
    total: "1820",
    trackingNumber: null,
    createdAt: "2025-07-14T10:05:00.000Z",
    orderItems: [],
  }) as unknown as Order;

const makeResponse = (orders: Order[]): GetOrdersResponse => ({
  status: true,
  code: 200,
  payload: {
    data: orders,
    metadata: { page: 1, limit: 10, total: orders.length, totalPages: 1 },
  },
});

describe("Orders", () => {
  let component: Orders;
  let fixture: ComponentFixture<Orders>;
  let ordersServiceMock: { getOrders: ReturnType<typeof vi.fn> };

  const setup = async (getOrders$: Observable<GetOrdersResponse>) => {
    ordersServiceMock = { getOrders: vi.fn().mockReturnValue(getOrders$) };

    await TestBed.configureTestingModule({
      imports: [Orders],
      providers: [
        provideRouter([]),
        provideTranslateService({
          loader: { provide: TranslateLoader, useClass: MockTranslateLoader },
          fallbackLang: "en",
        }),
        { provide: OrdersService, useValue: ordersServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Orders);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  };

  const renderedItems = () =>
    fixture.nativeElement.querySelectorAll("app-order-item");

  describe("on success", () => {
    beforeEach(async () => {
      await setup(of(makeResponse([makeOrder("a"), makeOrder("b")])));
    });

    it("should create", () => {
      expect(component).toBeTruthy();
    });

    it("should load orders once on init", () => {
      expect(ordersServiceMock.getOrders).toHaveBeenCalledTimes(1);
      expect(component.orders().map((o) => o.id)).toEqual(["a", "b"]);
    });

    it("should render one order item per order", () => {
      expect(renderedItems().length).toBe(2);
    });

    it("should render the translated title", () => {
      expect(
        fixture.nativeElement.querySelector("header").textContent,
      ).toContain("Orders");
    });
  });

  it("should render nothing when the user has no orders", async () => {
    await setup(of(makeResponse([])));

    expect(component.orders()).toEqual([]);
    expect(renderedItems().length).toBe(0);
  });

  it("should keep the list empty when the request fails", async () => {
    await setup(throwError(() => new Error("network")));

    expect(component.orders()).toEqual([]);
    expect(renderedItems().length).toBe(0);
  });
});
