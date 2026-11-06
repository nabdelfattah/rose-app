import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Router, provideRouter } from "@angular/router";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import {
  TranslateLoader,
  TranslationObject,
  provideTranslateService,
} from "@ngx-translate/core";
import { Observable, of } from "rxjs";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { WishlistItemComponent } from "./WishlistItem.component";
import { WishlistItem } from "../models/wishlist";
import { wishlistActions } from "../store/wishlist.actions";
import { CartActions } from "../../cart/store/cart.actions";

class MockTranslateLoader implements TranslateLoader {
  getTranslation(): Observable<TranslationObject> {
    return of({
      wishlist: {
        "in-stock": "In Stock",
        "out-of-stock": "Out of Stock",
        ratings: "{{count}} ratings",
        "add-to-cart": "Add to Cart",
        "explore-similar": "Explore Similar Products",
      },
    });
  }
}

describe("WishlistItemComponent", () => {
  let component: WishlistItemComponent;
  let fixture: ComponentFixture<WishlistItemComponent>;
  let store: MockStore;
  let router: Router;

  const mockItem: WishlistItem = {
    id: "w1",
    userId: "u1",
    productId: "prod-1",
    createdAt: "2026-11-01",
    product: {
      id: "prod-1",
      title: "Red Rose Bouquet",
      description: "Fresh red roses",
      price: "100",
      discountType: "PERCENT",
      discountValue: "20",
      cover: "https://example.com/rose.jpg",
      rating: 4.8,
      ratings: 24,
      stock: 10,
      gallery: "",
      categoryId: "cat-1",
      immutable: false,
      deletedAt: null,
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
      category: { id: "cat-1", title: "Flowers" },
      occasions: [],
      _count: { reviews: 24, cartItems: 5, wishlistItems: 12, orderItems: 2 },
    },
  };

  // generate new product item from existing mock one
  const withProduct = (
    changes: Partial<WishlistItem["product"]>,
  ): WishlistItem => ({
    ...mockItem,
    product: { ...mockItem.product, ...changes },
  });

  const text = () => fixture.nativeElement.textContent as string;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishlistItemComponent],
      providers: [
        provideRouter([]),
        provideMockStore(),
        provideTranslateService({
          loader: { provide: TranslateLoader, useClass: MockTranslateLoader },
          fallbackLang: "en",
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    vi.spyOn(store, "dispatch"); // يراقب ال dispatch

    fixture = TestBed.createComponent(WishlistItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("item", mockItem);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should render the product title and the translated ratings count", () => {
    expect(text()).toContain("Red Rose Bouquet");
    expect(text()).toContain("24 ratings");
  });

  describe("discountedPrice", () => {
    it("should apply a percent discount", () => {
      expect(component.discountedPrice()).toBe(80);
    });

    it("should be null when there is no discount value", () => {
      fixture.componentRef.setInput(
        "item",
        withProduct({ discountValue: null }),
      );
      expect(component.discountedPrice()).toBeNull();
    });
  });

  it("should show In Stock and Add to Cart when the product is in stock", () => {
    expect(text()).toContain("In Stock");
    expect(text()).toContain("Add to Cart");
    expect(text()).not.toContain("Explore Similar Products");
  });

  it("should show Out of Stock and Explore Similar Products when stock is 0", () => {
    fixture.componentRef.setInput("item", withProduct({ stock: 0 }));
    fixture.detectChanges();

    expect(text()).toContain("Out of Stock");
    expect(text()).toContain("Explore Similar Products");
    expect(text()).not.toContain("Add to Cart");
  });

  it("should dispatch addItemToCart with the product id on addToCart", () => {
    component.addToCart();
    expect(store.dispatch).toHaveBeenCalledWith(
      CartActions.addItemToCart({ productId: "prod-1", quantity: 1 }),
    );
  });
});
