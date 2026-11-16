import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import {
  TranslateLoader,
  TranslationObject,
  provideTranslateService,
} from "@ngx-translate/core";
import { Observable, of } from "rxjs";
import { describe, it, expect, beforeEach } from "vitest";

import { OrderItem } from "./orderItem";
import { Order } from "../models/orders";

class MockTranslateLoader implements TranslateLoader {
  getTranslation(): Observable<TranslationObject> {
    return of({
      orders: {
        order: "Order",
        cash: "Cash",
        "credit-card": "Credit Card",
        "delivery-status": "Delivery Status",
        "show-all": "Show All",
        "show-less": "Show Less",
        status: { label: "Status" },
      },
    });
  }
}

const makeOrderItem = (n: number) => ({
  id: `item-${n}`,
  orderId: "order-1",
  productId: `product-${n}`,
  quantity: 2,
  price: "1800",
  createdAt: "2025-07-14T10:05:00.000Z",
  product: {
    id: `product-${n}`,
    title: `Product ${n}`,
    cover: `/cover-${n}.jpg`,
  },
});

type OrderOverrides = Partial<Order>;

const makeOrder = (overrides: OrderOverrides = {}): Order =>
  ({
    id: "3f2a9c1e-0000-4b7d-9e11-abcdef123456",
    status: "PENDING",
    paymentMethod: "CASH_ON_DELIVERY",
    paymentStatus: "PROCESSING",
    total: "1820",
    trackingNumber: null,
    createdAt: "2025-07-14T10:05:00.000Z",
    orderItems: [makeOrderItem(1), makeOrderItem(2)],
    ...overrides,
  }) as unknown as Order;

describe("OrderItem", () => {
  let component: OrderItem;
  let fixture: ComponentFixture<OrderItem>;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderItem],
      providers: [
        provideRouter([]),
        provideTranslateService({
          loader: { provide: TranslateLoader, useClass: MockTranslateLoader },
          fallbackLang: "en",
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderItem);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
  });

  const render = async (overrides: OrderOverrides = {}) => {
    fixture.componentRef.setInput("item", makeOrder(overrides));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  // Titles of the fully visible product cards (faded cards excluded).
  const productTitles = () =>
    Array.from(
      el.querySelectorAll("li:not([aria-hidden]) > div > a[title]"),
    ).map((a) => a.getAttribute("title"));
  const fadedCards = () => el.querySelectorAll('li[aria-hidden="true"]');
  const toggleButton = () =>
    el.querySelector<HTMLButtonElement>("button[aria-expanded]");

  it("should create", async () => {
    await render();
    expect(component).toBeTruthy();
  });

  describe("order items", () => {
    it("should render every item and no toggle when there are 2 or fewer", async () => {
      await render({
        orderItems: [makeOrderItem(1), makeOrderItem(2)] as Order["orderItems"],
      });

      expect(productTitles()).toEqual(["Product 1", "Product 2"]);
      expect(fadedCards().length).toBe(0);
      expect(toggleButton()).toBeNull();
    });

    describe("with more than 2 items", () => {
      beforeEach(async () => {
        await render({
          orderItems: [1, 2, 3, 4, 5].map(makeOrderItem) as Order["orderItems"],
        });
      });

      it("should show the first 2 items and fade the next 2", () => {
        expect(productTitles()).toEqual(["Product 1", "Product 2"]);
        expect(fadedCards().length).toBe(2);
        expect(toggleButton()?.textContent).toContain("Show All");
        expect(toggleButton()?.getAttribute("aria-expanded")).toBe("false");
      });

      it("should show every item after clicking Show All", async () => {
        toggleButton()!.click();
        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.expanded()).toBe(true);
        expect(productTitles()).toEqual([
          "Product 1",
          "Product 2",
          "Product 3",
          "Product 4",
          "Product 5",
        ]);
        expect(fadedCards().length).toBe(0); // all are visible
        expect(toggleButton()?.textContent).toContain("Show Less");
        expect(toggleButton()?.getAttribute("aria-expanded")).toBe("true");
      });

      it("should collapse again after clicking Show Less", async () => {
        toggleButton()!.click(); // expand
        fixture.detectChanges();
        toggleButton()!.click(); // collapse
        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.expanded()).toBe(false); // should be collapsed
        expect(productTitles()).toEqual(["Product 1", "Product 2"]); // 3, 4, 5 not included
      });
    });
  });
});
