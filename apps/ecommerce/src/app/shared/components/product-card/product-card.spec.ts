import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { ProductCardComponent } from "./product-card";
import { Product } from "../../../features/products/model/product";
import { selectWishlistProducts } from "../../../features/wishlist/store/wishlist.selector";
import { CartActions } from "../../../features/cart/store/cart.actions";

const product = {
  id: "p1",
  title: "Product 1",
  price: "100",
  stock: 5,
  rating: 4,
  cover: "cover.jpg",
  discountType: null,
  discountValue: null,
  createdAt: "2026-01-01T00:00:00.000Z",
} as unknown as Product;

describe("ProductCardComponent", () => {
  let fixture: ComponentFixture<ProductCardComponent>;
  let component: ProductCardComponent;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
      providers: [
        provideRouter([]),
        provideMockStore({
          selectors: [{ selector: selectWishlistProducts, value: [] }],
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    vi.spyOn(store, "dispatch");

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("product", product);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should dispatch addItemToCart with quantity 1", () => {
    component.onAddToCart();

    expect(store.dispatch).toHaveBeenCalledWith(
      CartActions.addItemToCart({ productId: "p1", quantity: 1 }),
    );
  });
});
